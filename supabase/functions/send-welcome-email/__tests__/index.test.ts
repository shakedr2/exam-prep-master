import { afterEach, describe, expect, it, vi } from "vitest";
import {
  handleWelcomeEmailRequest,
  parseBearerToken,
  pickDisplayName,
  validateEnv,
  type AuthWebhookPayload,
  type HandlerDeps,
} from "../handler";
import {
  buildWelcomeEmailHtml,
  buildWelcomeEmailText,
  WELCOME_EMAIL_SUBJECT,
} from "../template";

const SECRET = "test-webhook-secret";
const FIXED_NOW = "2026-04-19T12:00:00.000Z";

function makePayload(overrides: Partial<AuthWebhookPayload["record"]> = {}) {
  return {
    type: "INSERT" as const,
    table: "users" as const,
    record: {
      id: "00000000-0000-0000-0000-000000000001",
      email: "new-user@example.com",
      raw_user_meta_data: { full_name: "Dana Cohen" },
      ...overrides,
    },
  };
}

function makeRequest(
  payload: unknown,
  auth: string | null = `Bearer ${SECRET}`,
): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = auth;
  return new Request("https://edge.local/send-welcome-email", {
    method: "POST",
    headers,
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

function makeDeps(overrides: Partial<HandlerDeps> = {}): HandlerDeps {
  const defaults: HandlerDeps = {
    resend: {
      send: vi.fn(async () => ({
        data: { id: "resend_msg_123" },
        error: null,
      })),
    },
    events: {
      insert: vi.fn(async () => ({ error: null })),
    },
    env: {
      RESEND_FROM: "Logic Flow <onboarding@resend.dev>",
      APP_URL: "https://logicflow.dev",
      WEBHOOK_SECRET: SECRET,
      UNSUBSCRIBE_EMAIL: "unsubscribe@logicflow.dev",
    },
    now: () => FIXED_NOW,
    captureException: vi.fn(),
  };
  return {
    ...defaults,
    ...overrides,
    env: { ...defaults.env, ...(overrides.env ?? {}) },
  };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("pure helpers", () => {
  it("parses a Bearer token (case-insensitive, trimmed)", () => {
    expect(parseBearerToken("Bearer abc")).toBe("abc");
    expect(parseBearerToken("bearer   xyz  ")).toBe("xyz");
    expect(parseBearerToken("Basic abc")).toBeNull();
    expect(parseBearerToken(null)).toBeNull();
  });

  it("picks display name from metadata, falls back to email local-part", () => {
    expect(
      pickDisplayName({
        id: "u",
        email: "j@x.com",
        raw_user_meta_data: { full_name: "Jo" },
      }),
    ).toBe("Jo");
    expect(
      pickDisplayName({ id: "u", email: "alice@x.com", raw_user_meta_data: null }),
    ).toBe("alice");
  });

  it("flags missing env vars", () => {
    expect(validateEnv({})).toEqual(
      expect.arrayContaining(["RESEND_FROM", "APP_URL", "WEBHOOK_SECRET"]),
    );
    expect(
      validateEnv({
        RESEND_FROM: "x",
        APP_URL: "y",
        WEBHOOK_SECRET: "z",
      }),
    ).toEqual([]);
  });

  it("builds Hebrew RTL HTML with CTA and escapes the display name", () => {
    const html = buildWelcomeEmailHtml({
      displayName: '<script>alert("x")</script>',
      appUrl: "https://logicflow.dev",
      unsubscribeMailto: "unsub@logicflow.dev",
    });
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("ברוכים הבאים");
    expect(html).toContain('href="https://logicflow.dev"');
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
  });

  it("builds a plain-text fallback that includes the CTA URL", () => {
    const text = buildWelcomeEmailText({
      displayName: "Dana",
      appUrl: "https://logicflow.dev",
      unsubscribeMailto: "unsub@logicflow.dev",
    });
    expect(text).toContain("Dana");
    expect(text).toContain("https://logicflow.dev");
    expect(text).toContain("unsub@logicflow.dev");
  });
});

describe("handleWelcomeEmailRequest", () => {
  it("sends the email and records a 'sent' row on a valid payload", async () => {
    const deps = makeDeps();
    const res = await handleWelcomeEmailRequest(makeRequest(makePayload()), deps);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ sent: true, providerId: "resend_msg_123" });

    expect(deps.resend.send).toHaveBeenCalledTimes(1);
    const sendCall = (deps.resend.send as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(sendCall.from).toBe("Logic Flow <onboarding@resend.dev>");
    expect(sendCall.to).toEqual(["new-user@example.com"]);
    expect(sendCall.subject).toBe(WELCOME_EMAIL_SUBJECT);
    expect(sendCall.html).toContain("Dana Cohen");
    expect(sendCall.text).toContain("Dana Cohen");

    expect(deps.events.insert).toHaveBeenCalledTimes(1);
    expect(deps.events.insert).toHaveBeenCalledWith({
      user_id: "00000000-0000-0000-0000-000000000001",
      email: "new-user@example.com",
      kind: "welcome",
      status: "sent",
      provider_id: "resend_msg_123",
      error: null,
      created_at: FIXED_NOW,
    });
  });

  it("returns 401 when Authorization header is missing", async () => {
    const deps = makeDeps();
    const res = await handleWelcomeEmailRequest(
      makeRequest(makePayload(), null),
      deps,
    );
    expect(res.status).toBe(401);
    expect(deps.resend.send).not.toHaveBeenCalled();
    expect(deps.events.insert).not.toHaveBeenCalled();
  });

  it("returns 401 when the Bearer secret is wrong", async () => {
    const deps = makeDeps();
    const res = await handleWelcomeEmailRequest(
      makeRequest(makePayload(), "Bearer wrong"),
      deps,
    );
    expect(res.status).toBe(401);
    expect(deps.resend.send).not.toHaveBeenCalled();
  });

  it("returns 400 for an unrecognized webhook payload", async () => {
    const deps = makeDeps();
    const res = await handleWelcomeEmailRequest(
      makeRequest({ type: "UPDATE", table: "users", record: { id: "x" } }),
      deps,
    );
    expect(res.status).toBe(400);
    expect(deps.resend.send).not.toHaveBeenCalled();
  });

  it("records a 'failed' row and returns 500 on Resend error", async () => {
    const deps = makeDeps({
      resend: {
        send: vi.fn(async () => ({
          data: null,
          error: { message: "Resend 5xx: smtp down", name: "application_error" },
        })),
      },
    });
    const res = await handleWelcomeEmailRequest(makeRequest(makePayload()), deps);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("Resend 5xx");

    expect(deps.events.insert).toHaveBeenCalledTimes(1);
    const row = (deps.events.insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(row.status).toBe("failed");
    expect(row.error).toContain("Resend 5xx");
    expect(row.provider_id).toBeNull();

    expect(deps.captureException).toHaveBeenCalled();
  });

  it("returns 500 with a clear message when required env is missing", async () => {
    const deps = makeDeps({
      env: {
        RESEND_FROM: "",
        APP_URL: "",
        WEBHOOK_SECRET: "",
      },
    });
    const res = await handleWelcomeEmailRequest(makeRequest(makePayload()), deps);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("Missing required env");
    expect(body.error).toContain("RESEND_FROM");
    expect(body.error).toContain("APP_URL");
    expect(body.error).toContain("WEBHOOK_SECRET");
    expect(deps.resend.send).not.toHaveBeenCalled();
    expect(deps.events.insert).not.toHaveBeenCalled();
  });

  it("returns 207 when the email sent but the audit insert failed", async () => {
    const deps = makeDeps({
      events: {
        insert: vi.fn(async () => ({ error: { message: "RLS denied" } })),
      },
    });
    const res = await handleWelcomeEmailRequest(makeRequest(makePayload()), deps);
    expect(res.status).toBe(207);
    const body = await res.json();
    expect(body.sent).toBe(true);
    expect(body.auditError).toBe("RLS denied");
    expect(deps.captureException).toHaveBeenCalled();
  });
});
