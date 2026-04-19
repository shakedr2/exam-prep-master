import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-signature",
};

type Locale = "he" | "en";

/** DB-webhook payload (auth.users INSERT via pg_net / http_post). */
interface DbWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: {
    id: string;
    email: string;
    raw_user_meta_data?: {
      full_name?: string;
      name?: string;
      locale?: string;
    };
  } | null;
  old_record: null | Record<string, unknown>;
}

/** Auth-hook payload (Supabase Auth async hook — user.created). */
interface AuthHookPayload {
  user: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      locale?: string;
    };
  };
}

type WebhookPayload = DbWebhookPayload | AuthHookPayload;

/** Replace every {{key}} placeholder in a template string. */
function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

/** Verify HMAC-SHA256 webhook signature sent in x-supabase-signature header. */
async function verifySignature(
  body: string,
  signatureHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!signatureHeader) return false;
  const [algo, providedHex] = signatureHeader.split("=");
  if (algo !== "sha256" || !providedHex) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );
  const expectedHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison to avoid timing attacks.
  if (expectedHex.length !== providedHex.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    diff |= expectedHex.charCodeAt(i) ^ providedHex.charCodeAt(i);
  }
  return diff === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const APP_URL = Deno.env.get("APP_URL");
    const RESEND_FROM_EMAIL =
      Deno.env.get("RESEND_FROM_EMAIL") ?? "ExamPrep <noreply@examprep.app>";
    const WEBHOOK_SECRET = Deno.env.get("SEND_WELCOME_WEBHOOK_SECRET");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase service role credentials are not configured");
    }
    if (!APP_URL) {
      throw new Error("APP_URL is not configured");
    }

    const rawBody = await req.text();

    // Verify webhook signature when a secret is configured.
    if (WEBHOOK_SECRET) {
      const signature = req.headers.get("x-supabase-signature");
      const valid = await verifySignature(rawBody, signature, WEBHOOK_SECRET);
      if (!valid) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook signature" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    const payload: WebhookPayload = JSON.parse(rawBody);

    // Extract user fields from either payload format.
    let userId: string;
    let email: string;
    let meta: { full_name?: string; name?: string; locale?: string } = {};

    if ("record" in payload && payload.record) {
      // DB-webhook format (auth.users INSERT trigger).
      userId = payload.record.id;
      email = payload.record.email;
      meta = payload.record.raw_user_meta_data ?? {};
    } else if ("user" in payload) {
      // Auth-hook format (user.created async hook).
      userId = payload.user.id;
      email = payload.user.email;
      meta = payload.user.user_metadata ?? {};
    } else {
      return new Response(
        JSON.stringify({ error: "Unrecognized webhook payload format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: "userId and email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Use service role client to read/write user_profiles regardless of RLS.
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Idempotency check: skip if welcome email was already sent.
    const { data: profile, error: profileError } = await adminClient
      .from("user_profiles")
      .select("welcome_email_sent")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Failed to read user_profiles: ${profileError.message}`);
    }

    if (profile?.welcome_email_sent === true) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "welcome email already sent" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Resolve template variables.
    const userName = meta.full_name ?? meta.name ?? (email.split("@")[0] || "User");
    // Default to Hebrew — the primary supported locale. English is used only
    // when the user's locale explicitly starts with "en".
    const locale: Locale = meta.locale?.startsWith("en") ? "en" : "he";
    // firstTrackUrl points to the first Python Fundamentals topic (variables_io).
    // This slug is the canonical first entry in the SYLLABUS_ORDER and is stable.
    const firstTrackUrl = `${APP_URL}/practice/variables_io`;
    const unsubscribeUrl = `${APP_URL}/settings/email`;

    // Load the locale-specific HTML template and the shared plain-text fallback.
    const htmlTemplate = await Deno.readTextFile(
      new URL(`./templates/welcome.${locale}.html`, import.meta.url),
    );
    const textTemplate = await Deno.readTextFile(
      new URL("./templates/welcome.txt", import.meta.url),
    );

    const vars: Record<string, string> = { userName, firstTrackUrl, unsubscribeUrl };
    const html = renderTemplate(htmlTemplate, vars);
    const text = renderTemplate(textTemplate, vars);

    const subject =
      locale === "en" ? "Welcome to ExamPrep 🎓" : "ברוך הבא ל-ExamPrep 🎓";

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [email],
        subject,
        html,
        text,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      throw new Error(`Resend API error ${resendRes.status}: ${errorText}`);
    }

    // Mark welcome email as sent (upsert to handle missing profile rows).
    const { error: updateError } = await adminClient
      .from("user_profiles")
      .upsert({ id: userId, welcome_email_sent: true }, { onConflict: "id" });

    if (updateError) {
      // Email was sent but the flag update failed — return 207 so the caller
      // knows the send succeeded and can retry the flag update if needed.
      console.error("Failed to update welcome_email_sent:", updateError.message);
      return new Response(
        JSON.stringify({ sent: true, flagError: updateError.message }),
        {
          status: 207,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ sent: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("send-welcome error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
