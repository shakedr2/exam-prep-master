// Pure-TS handler for the welcome-email edge function.
//
// All runtime-specific concerns (Deno env, Resend SDK, Supabase client) are
// injected via the `HandlerDeps` interface so this file is testable in Node
// under Vitest without requiring a Deno runtime.

import {
  buildWelcomeEmailHtml,
  buildWelcomeEmailText,
  WELCOME_EMAIL_SUBJECT,
} from "./template.ts";

export interface WebhookUserRecord {
  id: string;
  email: string;
  raw_user_meta_data?: {
    full_name?: string;
    name?: string;
    display_name?: string;
  } | null;
}

export interface AuthWebhookPayload {
  type: "INSERT";
  table: "users";
  record: WebhookUserRecord;
}

export interface ResendSender {
  send: (input: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    text: string;
  }) => Promise<{
    data: { id: string } | null;
    error: { message: string; name?: string } | null;
  }>;
}

export interface EmailEventRow {
  user_id: string;
  email: string;
  kind: "welcome" | "welcome_client_fallback";
  status: "queued" | "sent" | "failed";
  provider_id: string | null;
  error: string | null;
  created_at: string;
}

export interface EmailEventWriter {
  insert: (row: EmailEventRow) => Promise<{ error: { message: string } | null }>;
}

export interface HandlerEnv {
  RESEND_FROM: string;
  APP_URL: string;
  WEBHOOK_SECRET: string;
  UNSUBSCRIBE_EMAIL?: string;
}

export interface HandlerDeps {
  resend: ResendSender;
  events: EmailEventWriter;
  env: HandlerEnv;
  now: () => string;
  captureException?: (err: unknown, context?: Record<string, unknown>) => void;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

export function parseBearerToken(header: string | null): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : null;
}

export function isAuthWebhookPayload(
  value: unknown,
): value is AuthWebhookPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.type !== "INSERT") return false;
  if (v.table !== "users") return false;
  const record = v.record as Record<string, unknown> | undefined;
  if (!record || typeof record !== "object") return false;
  return typeof record.id === "string" && typeof record.email === "string";
}

export function pickDisplayName(record: WebhookUserRecord): string {
  const meta = record.raw_user_meta_data ?? {};
  const name = meta.full_name ?? meta.name ?? meta.display_name;
  if (name && name.trim().length > 0) return name.trim();
  const local = record.email.split("@")[0];
  return local.length > 0 ? local : "there";
}

/**
 * Validate env and return a descriptive error for missing values. Returned as
 * a string array so callers can 500 with a clear message instead of silently
 * sending from a half-configured environment.
 */
export function validateEnv(env: Partial<HandlerEnv>): string[] {
  const missing: string[] = [];
  if (!env.RESEND_FROM) missing.push("RESEND_FROM");
  if (!env.APP_URL) missing.push("APP_URL");
  if (!env.WEBHOOK_SECRET) missing.push("WEBHOOK_SECRET");
  return missing;
}

export async function handleWelcomeEmailRequest(
  req: Request,
  deps: HandlerDeps,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const missingEnv = validateEnv(deps.env);
  if (missingEnv.length > 0) {
    const message = `Missing required env: ${missingEnv.join(", ")}`;
    deps.captureException?.(new Error(message), { stage: "env" });
    return json(500, { error: message });
  }

  const provided = parseBearerToken(req.headers.get("Authorization"));
  if (!provided || provided !== deps.env.WEBHOOK_SECRET) {
    return json(401, { error: "Unauthorized" });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  if (!isAuthWebhookPayload(payload)) {
    return json(400, { error: "Unrecognized webhook payload" });
  }

  const { record } = payload;
  const displayName = pickDisplayName(record);
  const unsubscribeMailto =
    deps.env.UNSUBSCRIBE_EMAIL ?? "unsubscribe@logicflow.dev";
  const html = buildWelcomeEmailHtml({
    displayName,
    appUrl: deps.env.APP_URL,
    unsubscribeMailto,
  });
  const text = buildWelcomeEmailText({
    displayName,
    appUrl: deps.env.APP_URL,
    unsubscribeMailto,
  });

  const sendResult = await deps.resend.send({
    from: deps.env.RESEND_FROM,
    to: [record.email],
    subject: WELCOME_EMAIL_SUBJECT,
    html,
    text,
  });

  if (sendResult.error) {
    const errorMsg = sendResult.error.message || "resend error";
    deps.captureException?.(sendResult.error, {
      stage: "resend",
      userId: record.id,
    });
    await deps.events.insert({
      user_id: record.id,
      email: record.email,
      kind: "welcome",
      status: "failed",
      provider_id: null,
      error: errorMsg,
      created_at: deps.now(),
    });
    return json(500, { error: errorMsg });
  }

  const providerId = sendResult.data?.id ?? null;
  const insertResult = await deps.events.insert({
    user_id: record.id,
    email: record.email,
    kind: "welcome",
    status: "sent",
    provider_id: providerId,
    error: null,
    created_at: deps.now(),
  });

  if (insertResult.error) {
    // The email went out but the audit row did not. Surface to Sentry but
    // return 2xx so Supabase doesn't retry the send and cause duplicates.
    deps.captureException?.(insertResult.error, {
      stage: "email_events_insert",
      userId: record.id,
      providerId,
    });
    return json(207, {
      sent: true,
      providerId,
      auditError: insertResult.error.message,
    });
  }

  return json(200, { sent: true, providerId });
}
