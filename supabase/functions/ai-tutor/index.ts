import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, questionContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `אתה מורה פרטי לתכנות Python בשם "פרופ' פייתון". 
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

${questionContext ? `הקשר השאלה הנוכחית:\n${questionContext}` : ""}

זכור: המטרה שלך היא ללמד, לא לפתור! 🎓`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
      console.error("AI gateway error:", response.status, t);
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
