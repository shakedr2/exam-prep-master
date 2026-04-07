import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExplainRequestBody {
  type: "explain";
  questionText: string;
  choices: string[];
  correctIndex: number;
  userAnswerIndex?: number;
  topic?: string;
  /** Hint ladder level: 1 = general hint, 2 = specific hint, 3 = full explanation */
  hintLevel?: 1 | 2 | 3;
}

interface SimilarRequestBody {
  type: "similar";
  questionText: string;
  topic?: string;
}

type RequestBody = ExplainRequestBody | SimilarRequestBody;

interface OpenAIChatMessage {
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const body: RequestBody = await req.json();
    const { questionText, topic, type } = body;

    const systemPrompt =
      "אתה מורה מנוסה לתכנות Python באוניברסיטה הפתוחה. אתה עוזר לתלמידים להתכונן למבחן. ענה תמיד בעברית. כשנותנים רמזים — אל תחשוף את התשובה. כשמסבירים — הסבר בצורה מעמיקה וצעד אחר צעד.";

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

    const messages: OpenAIChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!openAIRes.ok) {
      const errorText = await openAIRes.text();
      console.error("OpenAI API error:", openAIRes.status, errorText);
      throw new Error(`OpenAI API error: ${openAIRes.status}`);
    }

    const openAIData: OpenAIResponse = await openAIRes.json();
    const content = openAIData.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsed = (() => {
      try {
        return JSON.parse(content) as Record<string, string | number>;
      } catch {
        throw new Error(`Failed to parse OpenAI response as JSON: ${content}`);
      }
    })();

    if (responseSchema === "hint") {
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
