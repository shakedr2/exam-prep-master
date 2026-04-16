import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Per-user rate limit for the interactive tutor (premium feature).
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // The AI tutor is a premium / authenticated-only feature. Guest users must
    // sign in before they can consume LLM credits against it.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "unauthorized", message: "יש להתחבר כדי להשתמש במורה הפרטי" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Supabase credentials are not configured");
    }

    const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: { user: callerUser }, error: authError } = await callerClient.auth.getUser();
    if (authError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "unauthorized", message: "יש להתחבר כדי להשתמש במורה הפרטי" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { ok: rateOk, retryAfter } = checkRateLimit(`u:${callerUser.id}`);
    if (!rateOk) {
      return new Response(
        JSON.stringify({ error: "rate_limit", message: "הגעת למגבלת השימוש — נסה שוב בעוד רגע" }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
          },
        },
      );
    }

    const { messages, questionContext, systemPrompt: customSystemPrompt, topicId, topicName } =
      await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    // The default persona is the legacy Prof. Python tutor used by the
    // per-question FloatingAIButton. Topic-specific pages send their own
    // `systemPrompt` (one of the 8 Prof. X personas under
    // src/features/curriculum/prompts). We log the topicId for per-tutor
    // usage tracking.
    if (topicId) {
      console.log(`[ai-tutor] topicId=${topicId} topicName=${topicName ?? ""}`);
    }

    const defaultPrompt = `אתה מורה פרטי לתכנות Python בשם "פרופ' פייתון".
אתה עוזר לסטודנטים להתכונן למבחנים בקורס "כנות בסיסית" (Python) של ד"ר רמי רשקוביץ.

כללים חשובים מאוד:
1. לעולם אל תיתן את התשובה הסופית ישירות! תמיד נסה ללמד את התלמיד להגיע לתשובה בעצמו.
2. השתמש בשיטת סוקרטס - שאל שאלות מכוונות שעוזרות לתלמיד לחשוב.
3. תן רמזים הדרגתיים - התחל מרמזים כלליים ועבור לספציפיים רק אם התלמיד נתקע.
4. כשהתלמיד שואל "מה יודפס?" - בקש ממנו קודם לעקוב אחרי הקוד שלב אחר שלב.
5. עודד את התלמיד ותן פידבק חיובי על ניסיונות נכונים.
6. השתמש בדוגמאות פשוטות להמחשת עקרונות.
7. ענה תמיד בעברית.
8. אם התלמיד ממש נתקע אחרי כמה ניסיונות, תוכל לתת רמז יותר ישיר אבל עדיין לא את התשובה המלאה.
9. התאם את רמת ההסבר לרמת התלמיד.

זכור: המטרה שלך היא ללמד, לא לפתור! 🎓`;

    const basePrompt =
      typeof customSystemPrompt === "string" && customSystemPrompt.trim().length > 0
        ? customSystemPrompt
        : defaultPrompt;

    const systemPrompt = questionContext
      ? `${basePrompt}\n\n# Context\n${questionContext}`
      : basePrompt;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "יותר מדי בקשות, נסה שוב בעוד רגע" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "נגמרו הקרדיטים, נסה שוב מאוחר יותר" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("OpenAI API error:", response.status, t);
      return new Response(JSON.stringify({ error: "שגיאה בשירות AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-tutor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
