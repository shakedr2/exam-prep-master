import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userId: string;
  email: string;
  displayName: string;
}

function buildEmailHtml(displayName: string, dashboardUrl: string): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ברוך הבא ל-ExamPrep</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background-color: #f4f4f5;
      color: #18181b;
      direction: rtl;
      text-align: right;
    }
    .wrapper {
      max-width: 560px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e4e4e7;
    }
    .header {
      background-color: #18181b;
      padding: 32px 40px;
      text-align: center;
    }
    .header .logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      background: #ffffff;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .header .logo span {
      font-size: 28px;
    }
    .header h1 {
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
    .body {
      padding: 36px 40px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #18181b;
    }
    .intro {
      font-size: 15px;
      line-height: 1.7;
      color: #52525b;
      margin-bottom: 28px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #18181b;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .steps {
      list-style: none;
      margin-bottom: 32px;
    }
    .steps li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 14px;
      font-size: 14px;
      line-height: 1.6;
      color: #3f3f46;
    }
    .steps li .step-num {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #18181b;
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1px;
    }
    .cta-wrap {
      text-align: center;
      margin-bottom: 32px;
    }
    .cta-btn {
      display: inline-block;
      background-color: #18181b;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      padding: 14px 36px;
      border-radius: 8px;
      letter-spacing: -0.2px;
    }
    .tagline {
      font-size: 13px;
      color: #a1a1aa;
      line-height: 1.6;
      margin-bottom: 0;
    }
    .footer {
      border-top: 1px solid #e4e4e7;
      padding: 20px 40px;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: #a1a1aa;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo"><span>📚</span></div>
      <h1>ExamPrep — הכנה למבחן Python</h1>
    </div>
    <div class="body">
      <p class="greeting">שלום ${displayName} 👋</p>
      <p class="intro">
        ברוך הבא ל-ExamPrep — כלי ההכנה למבחן בקורס <strong>מבוא לתכנות בפייתון</strong>
        של האוניברסיטה הפתוחה.<br />
        אנחנו כאן כדי לעזור לך להגיע למבחן בביטחון מלא.
      </p>

      <p class="section-title">איך מתחילים?</p>
      <ul class="steps">
        <li>
          <span class="step-num">1</span>
          <span>בחר נושא מהדשבורד — יש 8 נושאים שמכסים את כל החומר לבחינה</span>
        </li>
        <li>
          <span class="step-num">2</span>
          <span>ענה על שאלות תרגול: רב-ברירה, מעקב ביצוע, כתיבת פונקציה והשלמת קוד</span>
        </li>
        <li>
          <span class="step-num">3</span>
          <span>קרא את ההסברים — כל שאלה מגיעה עם הסבר מפורט בעברית על התשובה הנכונה</span>
        </li>
        <li>
          <span class="step-num">4</span>
          <span>נסה מצב מבחן — 6 שאלות, 3 שעות, בדיוק כמו הבחינה האמיתית</span>
        </li>
      </ul>

      <div class="cta-wrap">
        <a href="${dashboardUrl}" class="cta-btn">המשך ללמידה ←</a>
      </div>

      <p class="tagline">
        כל שאלה מבוססת על תבניות אמיתיות ממבחנים קודמים.
        ככל שתתרגל יותר — כך תגיע מוכן יותר ביום המבחן.
      </p>
    </div>
    <div class="footer">
      <p>
        קיבלת מייל זה כי נרשמת ל-ExamPrep.<br />
        אם לא נרשמת, ניתן להתעלם ממייל זה.
      </p>
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const APP_URL = Deno.env.get("APP_URL") ?? "https://exam-prep-master.vercel.app";

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase service role credentials are not configured");
    }

    const body: WelcomeEmailRequest = await req.json();
    const { userId, email, displayName } = body;

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: "userId and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Use service role client so we can read/write user_profiles regardless of RLS.
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

    const dashboardUrl = `${APP_URL}/dashboard`;
    const name = displayName || email.split("@")[0];
    const html = buildEmailHtml(name, dashboardUrl);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ExamPrep <noreply@examprep.app>",
        to: [email],
        subject: "ברוך הבא ל-ExamPrep 🎓",
        html,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      throw new Error(`Resend API error ${resendRes.status}: ${errorText}`);
    }

    // Mark welcome email as sent — upsert so a missing profile row is created.
    const { error: updateError } = await adminClient
      .from("user_profiles")
      .upsert(
        { id: userId, welcome_email_sent: true },
        { onConflict: "id" },
      );

    if (updateError) {
      console.error("Failed to update welcome_email_sent:", updateError.message);
      // Non-fatal: the email was already sent; log and continue.
    }

    return new Response(
      JSON.stringify({ sent: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("send-welcome-email error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
