import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const checks: Record<
    string,
    { status: "ok" | "error"; latencyMs?: number; message?: string }
  > = {};

  // Use the anon key — the topics table is publicly readable and the service
  // role key is not needed (or safe) for a publicly-accessible health probe.
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const client = createClient(supabaseUrl, supabaseAnonKey);

    const dbStart = Date.now();
    const { error } = await client.from("topics").select("id").limit(1);
    checks.database = error
      ? { status: "error", message: error.message }
      : { status: "ok", latencyMs: Date.now() - dbStart };
  } catch (e) {
    checks.database = {
      status: "error",
      message: e instanceof Error ? e.message : "unknown",
    };
  }

  const allOk = Object.values(checks).every((c) => c.status === "ok");

  return new Response(
    JSON.stringify({
      status: allOk ? "ok" : "degraded",
      version: Deno.env.get("APP_VERSION") ?? "unknown",
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      checks,
    }),
    {
      status: allOk ? 200 : 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});

