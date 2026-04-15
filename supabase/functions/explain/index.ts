import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExplainRequest {
  question_text: string;
  code_snippet?: string;
  user_answer: string;
  correct_answer: string;
}

// In-memory rate limiting: max 3 requests per question per edge function instance
const requestCounts = new Map<string, number>();

// Per-caller rate limit: sliding window of RATE_LIMIT_MAX requests per window.
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimitKey(req: Request): string {
  const auth = req.headers.get("Authorization") ?? "";
  if (auth.startsWith("Bearer ")) return `u:${auth.slice(7, 32)}`;
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anon"
  );
}

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ok: rateOk, retryAfter } = checkRateLimit(rateLimitKey(req));
    if (!rateOk) {
      return new Response(
        JSON.stringify({ error: "rate_limit", message: "יותר מדי בקשות, נסה שוב בעוד רגע" }),
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

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const body: ExplainRequest = await req.json();
    const { question_text, code_snippet, user_answer, correct_answer } = body;

    if (!question_text || !correct_answer) {
      return new Response(
        JSON.stringify({ error: "missing required fields: question_text, correct_answer" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Rate limit: hash by question text (first 100 chars)
    const questionKey = question_text.slice(0, 100);
    const count = requestCounts.get(questionKey) ?? 0;
    if (count >= 3) {
      return new Response(
        JSON.stringify({ error: "rate_limit", message: "הגעת למגבלת ההסברים לשאלה זו (3 מתוך 3)" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    requestCounts.set(questionKey, count + 1);

    const codeContext = code_snippet
      ? `\n\nקוד השאלה:\n\`\`\`python\n${code_snippet}\n\`\`\``
      : "";

    const userPrompt = `שאלה: ${question_text}${codeContext}

תשובת המשתמש: ${user_answer}
התשובה הנכונה: ${correct_answer}

הסבר בעברית צעד אחר צעד:
1. מה השאלה מבקשת
2. למה התשובה הנכונה היא "${correct_answer}"
${user_answer !== correct_answer ? `3. למה "${user_answer}" היא תשובה שגויה ומה הטעות הנפוצה` : ""}
4. טיפ לזכירה

אם יש קוד, עקוב אחרי הריצה שורה אחרי שורה והראה את ערכי המשתנים.
השתמש בפורמט markdown עם בלוקי קוד כשצריך.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
        system: "אתה מורה מנוסה לתכנות בפייתון באוניברסיטה הפתוחה. אתה עוזר לתלמידים להבין תשובות לשאלות מבחן. ענה תמיד בעברית, בצורה ברורה ומעמיקה. כשיש קוד, הסבר את הריצה צעד אחר צעד.",
      }),
    });

    if (!anthropicRes.ok) {
      const errorText = await anthropicRes.text();
      console.error("Anthropic API error:", anthropicRes.status, errorText);
      throw new Error(`Anthropic API error: ${anthropicRes.status}`);
    }

    const data = await anthropicRes.json();
    const explanation = data.content?.[0]?.text ?? "";

    return new Response(
      JSON.stringify({ explanation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("explain error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
