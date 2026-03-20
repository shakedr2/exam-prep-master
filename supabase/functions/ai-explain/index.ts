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
      "אתה עוזר חכם לתלמידים שמתכוננים למבחן תכנות בפייתון. ענה תמיד בעברית בצורה קצרה וברורה.";

    let userPrompt: string;
    let responseSchema: string;

    if (type === "explain") {
      const { choices, correctIndex, userAnswerIndex } = body;
      const correctAnswer = choices[correctIndex];
      const wrongAnswerPart =
        userAnswerIndex !== undefined && userAnswerIndex !== correctIndex
          ? ` המשתמש בחר בתשובה שגויה: "${choices[userAnswerIndex]}".`
          : "";

      const choicesList = choices
        .map((c, i) => `${i + 1}. ${c}`)
        .join("\n");

      userPrompt = `שאלה: "${questionText}"

אפשרויות:
${choicesList}

התשובה הנכונה היא: "${correctAnswer}".${wrongAnswerPart}

הסבר בעברית מדוע זו התשובה הנכונה, ותן טיפ לזכור זאת.
החזר JSON בדיוק בפורמט הבא ללא טקסט נוסף:
{"explanation": "הסבר קצר וברור", "tip": "טיפ לזכירה"}`;

      responseSchema = "explanation+tip";
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
        return JSON.parse(content) as Record<string, string>;
      } catch {
        throw new Error(`Failed to parse OpenAI response as JSON: ${content}`);
      }
    })();

    if (responseSchema === "explanation+tip") {
      return new Response(
        JSON.stringify({
          explanation: parsed.explanation ?? "",
          tip: parsed.tip ?? "",
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
