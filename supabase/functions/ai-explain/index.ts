import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Lock down the allowed CORS origin via the ALLOWED_ORIGIN env var so the
// production domain can be set without hardcoding it here.
// Falls back to "*" only when the variable is absent (local dev).
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ExplainRequestBody {
  type: "explain";
  questionText: string;
  choices: string[];
  correctIndex: number;
  userAnswerIndex?: number;
  topic?: string;
  /** Hint ladder level: 1 = nudge, 2 = conceptual hint, 3 = worked explanation */
  hintLevel?: 1 | 2 | 3;
}

interface SimilarRequestBody {
  type: "similar";
  questionText: string;
  topic?: string;
}

type RequestBody = ExplainRequestBody | SimilarRequestBody;

interface HintResponse {
  hint: string;
  level: number;
}

interface ExplanationResponse {
  explanation: string;
  tip: string;
  level: number;
}

interface SimilarResponse {
  question: string;
}

// Gemini REST API types
interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role?: string;
  parts: GeminiPart[];
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: GeminiPart[];
    };
  }>;
}

// OpenAI fallback types
interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

function buildHintPrompt(
  questionText: string,
  choices: string[],
  correctAnswer: string,
  wrongAnswer: string | undefined,
  hintLevel: 1 | 2 | 3,
): string {
  const choicesList = choices.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const wrongAnswerContext = wrongAnswer
    ? `\nהמשתמש בחר בתשובה שגויה: "${wrongAnswer}".`
    : "";

  if (hintLevel === 1) {
    return `שאלה: "${questionText}"

אפשרויות:
${choicesList}
${wrongAnswerContext}

תן רמז קצר מאוד (משפט או שניים בלבד) שמכוון את התלמיד לכיוון הנכון.
אל תחשוף את התשובה הנכונה בשום אופן.
השתמש בשאלה סוקרטית או הצבע על מושג רלוונטי שכדאי לבדוק.
ענה בעברית.
החזר JSON בדיוק בפורמט הבא ללא טקסט נוסף:
{"hint": "רמז קצר", "level": 1}`;
  }

  if (hintLevel === 2) {
    return `שאלה: "${questionText}"

אפשרויות:
${choicesList}
${wrongAnswerContext}

תן רמז ספציפי יותר (3-5 משפטים) שמזכיר את המושג או האופרטור הרלוונטי.
אפשר לכלול דוגמת קוד קצרה להמחשה.
עדיין אל תגלה את התשובה הסופית.
ענה בעברית.
החזר JSON בדיוק בפורמט הבא ללא טקסט נוסף:
{"hint": "רמז ספציפי", "level": 2}`;
  }

  // hintLevel === 3
  const wrongAnswerExplanation = wrongAnswer
    ? `\nבחרת "${wrongAnswer}" — הסבר מדוע זו תשובה שגויה ומה הטעות הנפוצה.`
    : "";

  return `שאלה: "${questionText}"

אפשרויות:
${choicesList}

התשובה הנכונה היא: "${correctAnswer}".${wrongAnswerExplanation}

הסבר בעברית צעד אחר צעד מדוע "${correctAnswer}" היא התשובה הנכונה.
אם יש קוד בשאלה, עקוב אחרי הריצה שורה אחרי שורה.
בסוף תן טיפ קצר לזכירה.
ענה בעברית.
החזר JSON בדיוק בפורמט הבא ללא טקסט נוסף:
{"explanation": "הסבר מלא", "tip": "טיפ לזכירה", "level": 3}`;
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
): Promise<string> {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    } as GeminiContent,
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      } as GeminiContent,
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gemini API error:", res.status, errorText);
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data: GeminiResponse = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("Empty response from Gemini");
  }

  return content;
}

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
): Promise<string> {
  const messages: OpenAIMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("OpenAI API error:", res.status, errorText);
    throw new Error(`OpenAI API error: ${res.status}`);
  }

  const data: OpenAIResponse = await res.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return content;
}

/** Validate the caller's JWT via the Supabase auth API. */
async function requireAuth(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Missing env vars — fail closed
    return new Response(
      JSON.stringify({ error: "Server misconfiguration" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  return null; // auth OK
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Require a valid Supabase JWT for all non-preflight requests.
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    const body: RequestBody = await req.json();
    const { questionText, topic, type } = body;

    const systemPrompt =
      "אתה מורה מנוסה לתכנות Python באוניברסיטה הפתוחה. אתה עוזר לתלמידים להתכונן למבחן. ענה תמיד בעברית בלבד. כשנותנים רמזים ברמה 1 או 2 — אל תחשוף את התשובה הנכונה בשום אופן. כשמסבירים ברמה 3 — הסבר בצורה מעמיקה וצעד אחר צעד. שמור על טון מעודד וסבלני.";

    let userPrompt: string;
    let responseSchema: string;

    if (type === "explain") {
      const { choices, correctIndex, userAnswerIndex, hintLevel = 3 } = body;
      const correctAnswer = choices[correctIndex];
      const wrongAnswer =
        userAnswerIndex !== undefined && userAnswerIndex !== correctIndex
          ? choices[userAnswerIndex]
          : undefined;

      userPrompt = buildHintPrompt(
        questionText,
        choices,
        correctAnswer,
        wrongAnswer,
        hintLevel,
      );

      responseSchema = hintLevel < 3 ? "hint" : "explanation+tip";
    } else {
      userPrompt = `צור שאלת בחירה מרובה דומה לשאלה הבאה בנושא "${topic ?? "פייתון"}":
"${questionText}"

השאלה החדשה צריכה להיות על אותו נושא אך שונה.
החזר JSON בדיוק בפורמט הבא ללא טקסט נוסף:
{"question": "השאלה החדשה"}`;

      responseSchema = "question";
    }

    // Try Gemini first; if it throws (e.g. 429 rate limit), fall back to OpenAI.
    // Only error out if both providers are unavailable or both fail.
    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      throw new Error("Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured");
    }

    let content: string | undefined;
    let geminiError: unknown = null;
    if (GEMINI_API_KEY) {
      try {
        content = await callGemini(systemPrompt, userPrompt, GEMINI_API_KEY);
      } catch (err) {
        geminiError = err;
        console.error("Gemini call failed, attempting OpenAI fallback:", err);
      }
    }

    if (content === undefined) {
      if (!OPENAI_API_KEY) {
        throw geminiError instanceof Error
          ? geminiError
          : new Error("Gemini failed and OPENAI_API_KEY is not configured");
      }
      try {
        content = await callOpenAI(systemPrompt, userPrompt, OPENAI_API_KEY);
      } catch (openaiError) {
        console.error("OpenAI fallback also failed:", openaiError);
        throw openaiError;
      }
    }
    if (content === undefined) {
      throw new Error("No AI provider produced a response");
    }

    if (responseSchema === "hint") {
      const parsed = (() => {
        try {
          return JSON.parse(content) as HintResponse;
        } catch {
          throw new Error(`Failed to parse AI response as JSON: ${content}`);
        }
      })();
      return new Response(
        JSON.stringify({
          hint: parsed.hint ?? "",
          level: parsed.level ?? 1,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } else if (responseSchema === "explanation+tip") {
      const parsed = (() => {
        try {
          return JSON.parse(content) as ExplanationResponse;
        } catch {
          throw new Error(`Failed to parse AI response as JSON: ${content}`);
        }
      })();
      return new Response(
        JSON.stringify({
          explanation: parsed.explanation ?? "",
          tip: parsed.tip ?? "",
          level: 3,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } else {
      const parsed = (() => {
        try {
          return JSON.parse(content) as SimilarResponse;
        } catch {
          throw new Error(`Failed to parse AI response as JSON: ${content}`);
        }
      })();
      return new Response(
        JSON.stringify({ question: parsed.question ?? "" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  } catch (e) {
    console.error("ai-explain error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
