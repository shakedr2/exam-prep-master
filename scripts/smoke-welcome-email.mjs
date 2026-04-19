#!/usr/bin/env node
// Smoke test helper for the send-welcome-email Edge Function.
//
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... [EMAIL=...] node scripts/smoke-welcome-email.mjs
//
// 1. Creates a throwaway auth user via the admin API (service-role key).
// 2. Polls public.email_events for a row of kind='welcome' for that user.
// 3. Prints a link to the Resend dashboard for manual verification.
// 4. Deletes the test user (auth.admin.deleteUser).
//
// This script mutates the target Supabase project. Point it at staging.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = process.env.EMAIL ?? `test+smoke-${Date.now()}@logicflow.dev`;
const POLL_TIMEOUT_MS = Number(process.env.POLL_TIMEOUT_MS ?? 30_000);
const POLL_INTERVAL_MS = 2_000;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "[smoke] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (staging!).",
  );
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

async function main() {
  console.log(`[smoke] creating test user: ${EMAIL}`);
  const createRes = await supabase.auth.admin.createUser({
    email: EMAIL,
    email_confirm: true,
    user_metadata: { full_name: "Smoke Tester" },
  });
  if (createRes.error || !createRes.data.user) {
    throw new Error(
      `admin.createUser failed: ${createRes.error?.message ?? "no user returned"}`,
    );
  }
  const userId = createRes.data.user.id;
  console.log(`[smoke] user created: id=${userId}`);

  let finalStatus = null;
  let finalRow = null;
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const { data, error } = await supabase
      .from("email_events")
      .select("status, provider_id, error, created_at")
      .eq("user_id", userId)
      .eq("kind", "welcome")
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) {
      console.warn(`[smoke] poll error: ${error.message}`);
    } else if (data && data.length > 0) {
      finalRow = data[0];
      finalStatus = finalRow.status;
      if (finalStatus === "sent" || finalStatus === "failed") break;
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  if (!finalRow) {
    console.error(
      "[smoke] FAIL: no email_events row appeared within",
      POLL_TIMEOUT_MS,
      "ms",
    );
  } else if (finalStatus === "sent") {
    console.log(
      `[smoke] OK: status=sent provider_id=${finalRow.provider_id} at ${finalRow.created_at}`,
    );
    console.log(
      "[smoke] Resend dashboard: https://resend.com/emails" +
        (finalRow.provider_id ? `/${finalRow.provider_id}` : ""),
    );
  } else {
    console.error(
      `[smoke] FAIL: status=${finalStatus} error=${finalRow.error ?? "(null)"}`,
    );
  }

  console.log(`[smoke] cleaning up user: ${userId}`);
  const delRes = await supabase.auth.admin.deleteUser(userId);
  if (delRes.error) {
    console.warn(`[smoke] cleanup: ${delRes.error.message}`);
  } else {
    console.log("[smoke] cleanup OK");
  }

  if (finalStatus !== "sent") process.exit(1);
}

main().catch((err) => {
  console.error("[smoke] fatal:", err);
  process.exit(1);
});
