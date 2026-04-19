// Deno entrypoint for the send-welcome-email Supabase Edge Function.
//
// Phase 4 PR2 — issue #320 (closes #319). The Supabase Auth webhook on
// auth.users INSERT invokes this function with an Authorization: Bearer
// <SUPABASE_WEBHOOK_SECRET> header and a payload of the form:
//
//   { type: "INSERT", table: "users", record: { id, email, raw_user_meta_data } }
//
// The function sends the HTML welcome email via Resend and records the
// delivery attempt (success or failure) in public.email_events.
//
// All pure logic lives in ./handler.ts so it can be unit-tested under Node
// + Vitest without needing the Deno runtime.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@3.2.0";

import { handleWelcomeEmailRequest } from "./handler.ts";

// Deno global is provided by the Supabase edge runtime.
declare const Deno: { env: { get: (k: string) => string | undefined } };

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const APP_URL = Deno.env.get("APP_URL") ?? "";
const RESEND_FROM =
  Deno.env.get("RESEND_FROM") ??
  Deno.env.get("RESEND_FROM_EMAIL") ??
  "Logic Flow <onboarding@resend.dev>";
const SUPABASE_WEBHOOK_SECRET = Deno.env.get("SUPABASE_WEBHOOK_SECRET") ?? "";
const UNSUBSCRIBE_EMAIL =
  Deno.env.get("UNSUBSCRIBE_EMAIL") ?? "unsubscribe@logicflow.dev";

const resend = new Resend(RESEND_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

serve((req: Request) =>
  handleWelcomeEmailRequest(req, {
    resend: {
      send: async (input) => {
        const result = await resend.emails.send(input);
        return {
          data: result.data ? { id: result.data.id } : null,
          error: result.error ?? null,
        };
      },
    },
    events: {
      insert: async (row) => {
        const { error } = await supabase.from("email_events").insert(row);
        return { error: error ? { message: error.message } : null };
      },
    },
    env: {
      RESEND_FROM,
      APP_URL,
      SUPABASE_WEBHOOK_SECRET,
      UNSUBSCRIBE_EMAIL,
    },
    now: () => new Date().toISOString(),
    captureException: (err, context) => {
      // Edge logs are tailed with `supabase functions logs send-welcome-email`.
      // Forward to Sentry once the Deno Sentry SDK is wired in a follow-up.
      console.error("send-welcome-email error", {
        err: err instanceof Error ? { message: err.message, stack: err.stack } : err,
        context,
      });
    },
  }),
);
