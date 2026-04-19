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

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(
  displayName: string,
  dashboardUrl: string,
  appUrl: string,
): string {
  const name = escapeHtml(displayName);
  const privacyUrl = `${appUrl}/privacy`;
  let dashboardHost = "";
  try {
    dashboardHost = `${new URL(dashboardUrl).host}/dashboard`;
  } catch {
    dashboardHost = "/dashboard";
  }

  return `<!DOCTYPE html>
<html lang="he" dir="rtl" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>ברוך הבא ל-Logic Flow</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    body, table, td { font-family: 'Heebo', -apple-system, 'Segoe UI', sans-serif !important; }
    .mono { font-family: 'JetBrains Mono', ui-monospace, monospace !important; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px-outer { padding-left: 20px !important; padding-right: 20px !important; }
      .hero-pad { padding: 40px 24px !important; }
      .h1 { font-size: 28px !important; line-height: 1.2 !important; }
      .step-num { width: 36px !important; height: 36px !important; font-size: 16px !important; }
      .cta-btn a { display: block !important; width: auto !important; }
    }
    @media (prefers-color-scheme: dark) {
      body, .bg-page { background-color: #0a0b10 !important; }
      .container { background-color: #13141c !important; border-color: rgba(255,255,255,0.06) !important; }
      .brand-border { border-color: rgba(255,255,255,0.06) !important; }
      .text-hi { color: #f0f0f5 !important; }
      .text-mid { color: #a8a9b8 !important; }
      .text-muted-c { color: #6b6c7a !important; }
      .card-surface { background-color: #1a1c27 !important; border-color: rgba(255,255,255,0.06) !important; }
      .verify-surface { background-color: rgba(61,220,132,0.06) !important; border-color: rgba(61,220,132,0.2) !important; }
      .verify-btn { color: #3ddc84 !important; border-color: rgba(61,220,132,0.3) !important; }
      .divider { background-color: rgba(255,255,255,0.06) !important; }
      .quote-card { background-color: #13141c !important; border-color: rgba(255,255,255,0.08) !important; }
      .footer-bg { background-color: #0f1017 !important; border-top-color: rgba(255,255,255,0.06) !important; }
      .footer-link { border-left-color: rgba(255,255,255,0.1) !important; color: #6b6c7a !important; }
      .step-one { background-color: rgba(124,92,252,0.15) !important; border-color: rgba(124,92,252,0.3) !important; }
      .step-one td { color: #9b7fff !important; }
      .step-two { background-color: rgba(61,220,132,0.12) !important; border-color: rgba(61,220,132,0.3) !important; }
      .step-two td { color: #3ddc84 !important; }
      .step-three { background-color: rgba(232,179,10,0.12) !important; border-color: rgba(232,179,10,0.3) !important; }
    }
  </style>
</head>
<body class="bg-page" dir="rtl" style="margin:0;padding:0;background-color:#f7f8ff;color:#1c1f32;-webkit-font-smoothing:antialiased;">

  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f7f8ff;opacity:0;">
    החשבון שלך מוכן. שלושה צעדים מפרידים אותך מהקוד הראשון בפייתון.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background-color:#f7f8ff;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid rgba(37,42,64,0.08);border-radius:20px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td class="brand-border" style="padding:20px 32px;border-bottom:1px solid rgba(37,42,64,0.08);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="right" style="vertical-align:middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;">
                      <tr>
                        <td style="vertical-align:middle;padding-left:10px;">
                          <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path d="M49.5 10C35.5 10 36.5 16 36.5 16L36.5 22.3L50 22.3L50 24L30 24C30 24 20 22.8 20 37C20 51.2 28.8 50.7 28.8 50.7L34.2 50.7L34.2 44.1C34.2 44.1 33.9 35.3 42.8 35.3L57.2 35.3C57.2 35.3 65.5 35.4 65.5 27.3L65.5 18.8C65.5 18.8 66.8 10 49.5 10ZM42 19.5C43.4 19.5 44.5 20.6 44.5 22C44.5 23.4 43.4 24.5 42 24.5C40.6 24.5 39.5 23.4 39.5 22C39.5 20.6 40.6 19.5 42 19.5Z" fill="#4B8BBE"/>
                            <path d="M50.5 90C64.5 90 63.5 84 63.5 84L63.5 77.7L50 77.7L50 76L70 76C70 76 80 77.2 80 63C80 48.8 71.2 49.3 71.2 49.3L65.8 49.3L65.8 55.9C65.8 55.9 66.1 64.7 57.2 64.7L42.8 64.7C42.8 64.7 34.5 64.6 34.5 72.7L34.5 81.2C34.5 81.2 33.2 90 50.5 90ZM58 80.5C56.6 80.5 55.5 79.4 55.5 78C55.5 76.6 56.6 75.5 58 75.5C59.4 75.5 60.5 76.6 60.5 78C60.5 79.4 59.4 80.5 58 80.5Z" fill="#FFD43B"/>
                          </svg>
                        </td>
                        <td style="vertical-align:middle;">
                          <div class="text-hi" style="font-family:'Heebo',sans-serif;font-weight:700;font-size:16px;color:#1c1f32;letter-spacing:-0.01em;">Logic Flow</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="left" style="vertical-align:middle;">
                    <span class="mono text-muted-c" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#747b98;letter-spacing:0.04em;text-transform:uppercase;">welcome_aboard.py</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td class="hero-pad" style="padding:56px 40px 48px;background:linear-gradient(135deg,#4B8BBE 0%,#7c5cfc 55%,#22b873 100%);background-color:#7c5cfc;text-align:right;position:relative;">
              <!--[if mso]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="position:absolute;width:600px;height:280px;top:0;left:0;z-index:-1;">
                <v:fill type="gradient" color="#4B8BBE" color2="#22b873" angle="135"/>
              </v:rect>
              <![endif]-->

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="right" style="padding-bottom:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;background-color:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:9999px;">
                      <tr>
                        <td style="padding:6px 14px;">
                          <span class="mono" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#ffffff;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;">✓&nbsp;&nbsp;account_created</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="right">
                    <h1 class="h1" style="margin:0 0 16px 0;font-family:'Heebo',sans-serif;font-weight:800;font-size:38px;line-height:1.15;letter-spacing:-0.025em;color:#ffffff;">
                      היי ${name},<br>
                      ברוך הבא ל-Logic&nbsp;Flow.
                    </h1>
                    <p style="margin:0;font-family:'Heebo',sans-serif;font-size:17px;line-height:1.55;color:rgba(255,255,255,0.92);max-width:460px;">
                      החשבון שלך פעיל. שלושה צעדים מפרידים אותך מהשורת קוד הראשונה, בקצב שלך — בעברית, עם משוב מיידי.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- VERIFY BANNER -->
          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="verify-surface" style="background-color:rgba(34,184,115,0.06);border:1px solid rgba(34,184,115,0.25);border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <div class="text-hi" style="font-family:'Heebo',sans-serif;font-size:14px;font-weight:600;color:#1c1f32;margin-bottom:4px;">
                            אשר את כתובת האימייל
                          </div>
                          <div class="text-mid" style="font-family:'Heebo',sans-serif;font-size:13px;color:#4f5677;line-height:1.5;">
                            ההתקדמות שלך תישמר בענן ותהיה זמינה מכל מכשיר.
                          </div>
                        </td>
                        <td align="left" style="vertical-align:middle;white-space:nowrap;padding-right:16px;">
                          <a class="verify-btn" href="${dashboardUrl}" style="display:inline-block;font-family:'Heebo',sans-serif;font-size:13px;font-weight:600;color:#189157;padding:8px 14px;border:1px solid rgba(34,184,115,0.3);border-radius:8px;">
                            אישור&nbsp;→
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3 STEPS SECTION -->
          <tr>
            <td class="px-outer" style="padding:40px 40px 8px;">
              <div class="mono text-muted-c" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#747b98;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">
                01&nbsp;·&nbsp;הצעדים הראשונים
              </div>
              <h2 class="text-hi" style="margin:0 0 8px 0;font-family:'Heebo',sans-serif;font-weight:700;font-size:24px;line-height:1.25;letter-spacing:-0.015em;color:#1c1f32;">
                שלוש דקות מהרגע הזה לשורת הקוד הראשונה
              </h2>
              <p class="text-mid" style="margin:0 0 28px 0;font-family:'Heebo',sans-serif;font-size:15px;line-height:1.55;color:#4f5677;">
                התחל במסלול אחד, תרגל שאלה אחת, וקבל את המשוב הראשון מ-Prof. Python.
              </p>
            </td>
          </tr>

          <!-- Step 1 -->
          <tr>
            <td class="px-outer" style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-surface" style="background-color:#f7f8ff;border:1px solid rgba(37,42,64,0.08);border-radius:16px;margin-bottom:12px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="step-num" width="44" style="width:44px;vertical-align:top;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="step-one" style="background-color:rgba(109,76,220,0.1);border:1px solid rgba(109,76,220,0.25);border-radius:10px;">
                            <tr>
                              <td align="center" style="width:42px;height:42px;font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;color:#6d4cdc;">1</td>
                            </tr>
                          </table>
                        </td>
                        <td style="vertical-align:top;padding-right:16px;">
                          <div class="text-hi" style="font-family:'Heebo',sans-serif;font-size:16px;font-weight:600;color:#1c1f32;margin-bottom:4px;">
                            בחר מסלול לימוד
                          </div>
                          <div class="text-mid" style="font-family:'Heebo',sans-serif;font-size:14px;line-height:1.55;color:#4f5677;">
                            Python, OOP או DevOps — כל מסלול בנוי ממודולים עם פרקטיקה אחרי כל נושא.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Step 2 -->
          <tr>
            <td class="px-outer" style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-surface" style="background-color:#f7f8ff;border:1px solid rgba(37,42,64,0.08);border-radius:16px;margin-bottom:12px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="step-num" width="44" style="width:44px;vertical-align:top;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="step-two" style="background-color:rgba(34,184,115,0.1);border:1px solid rgba(34,184,115,0.25);border-radius:10px;">
                            <tr>
                              <td align="center" style="width:42px;height:42px;font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;color:#189157;">2</td>
                            </tr>
                          </table>
                        </td>
                        <td style="vertical-align:top;padding-right:16px;">
                          <div class="text-hi" style="font-family:'Heebo',sans-serif;font-size:16px;font-weight:600;color:#1c1f32;margin-bottom:4px;">
                            פתור שאלת תרגול אחת
                          </div>
                          <div class="text-mid" style="font-family:'Heebo',sans-serif;font-size:14px;line-height:1.55;color:#4f5677;">
                            כל שאלה כוללת הסבר מלא ואפשרות לשאול את Prof.&nbsp;Python על הפתרון.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Step 3 -->
          <tr>
            <td class="px-outer" style="padding:0 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-surface" style="background-color:#f7f8ff;border:1px solid rgba(37,42,64,0.08);border-radius:16px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="step-num" width="44" style="width:44px;vertical-align:top;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="step-three" style="background-color:rgba(232,179,10,0.14);border:1px solid rgba(232,179,10,0.35);border-radius:10px;">
                            <tr>
                              <td align="center" style="width:42px;height:42px;font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;color:#E8B30A;">3</td>
                            </tr>
                          </table>
                        </td>
                        <td style="vertical-align:top;padding-right:16px;">
                          <div class="text-hi" style="font-family:'Heebo',sans-serif;font-size:16px;font-weight:600;color:#1c1f32;margin-bottom:4px;">
                            אסוף את ה-XP הראשון שלך
                          </div>
                          <div class="text-mid" style="font-family:'Heebo',sans-serif;font-size:14px;line-height:1.55;color:#4f5677;">
                            רצף יומי, XP ומעקב התקדמות — כדי שתראה את המרחק שעשית.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PRIMARY CTA -->
          <tr>
            <td align="center" class="cta-btn" style="padding:0 40px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="border-radius:10px;background:linear-gradient(135deg,#7c5cfc 0%,#9b7fff 100%);background-color:#7c5cfc;box-shadow:0 0 24px rgba(124,92,252,0.35);">
                    <a href="${dashboardUrl}" style="display:inline-block;padding:14px 36px;font-family:'Heebo',sans-serif;font-size:16px;font-weight:600;color:#ffffff;border-radius:10px;letter-spacing:-0.005em;">
                      התחל לתרגל&nbsp;&nbsp;→
                    </a>
                  </td>
                </tr>
              </table>
              <div class="mono text-muted-c" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#6b6c7a;margin-top:12px;letter-spacing:0.04em;">
                ${escapeHtml(dashboardHost)}
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div class="divider" style="height:1px;background-color:rgba(37,42,64,0.08);line-height:1px;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- QUOTE -->
          <tr>
            <td class="px-outer" style="padding:36px 40px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="quote-card" style="background:linear-gradient(135deg,rgba(109,76,220,0.05) 0%,rgba(34,184,115,0.05) 100%);background-color:#ffffff;border:1px solid rgba(37,42,64,0.08);border-radius:16px;">
                <tr>
                  <td style="padding:28px;">
                    <div class="mono text-muted-c" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#747b98;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px;">
                      💡&nbsp;&nbsp;first_principle
                    </div>
                    <div class="text-hi" style="font-family:'Heebo',sans-serif;font-size:20px;font-weight:600;line-height:1.4;color:#1c1f32;letter-spacing:-0.01em;margin-bottom:14px;">
                      &ldquo;הדרך הטובה ביותר ללמוד לתכנת היא לכתוב קוד. עשר דקות ביום גוברות על מרתון בסוף שבוע.&rdquo;
                    </div>
                    <div class="text-mid" style="font-family:'Heebo',sans-serif;font-size:13px;color:#4f5677;">
                      — Prof.&nbsp;Python, המנטור שלך
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer-bg" style="padding:28px 40px 36px;border-top:1px solid rgba(37,42,64,0.08);background-color:#f7f8ff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <div class="text-mid" style="font-family:'Heebo',sans-serif;font-size:13px;color:#4f5677;line-height:1.6;">
                      צריכים עזרה? כתבו לנו חזרה — נענה תוך 24 שעות.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <a href="${dashboardUrl}" class="footer-link" style="font-family:'Heebo',sans-serif;font-size:12px;color:#747b98;padding-left:14px;border-left:1px solid rgba(37,42,64,0.1);">לוח בקרה</a>
                    <a href="${privacyUrl}" class="footer-link" style="font-family:'Heebo',sans-serif;font-size:12px;color:#747b98;padding:0 14px;">מדיניות פרטיות</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;border-top:1px solid rgba(37,42,64,0.06);">
                    <div class="mono text-muted-c" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#747b98;letter-spacing:0.04em;margin-top:12px;">
                      Logic&nbsp;Flow · Tel&nbsp;Aviv, IL
                    </div>
                    <div class="text-muted-c" style="font-family:'Heebo',sans-serif;font-size:11px;color:#747b98;margin-top:6px;">
                      קיבלת את האימייל הזה כי נרשמת ל-Logic&nbsp;Flow.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

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
    const APP_URL = Deno.env.get("APP_URL");
    const RESEND_FROM_EMAIL =
      Deno.env.get("RESEND_FROM_EMAIL") ?? "ExamPrep <noreply@examprep.app>";

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase service role credentials are not configured");
    }
    if (!APP_URL) {
      throw new Error("APP_URL is not configured");
    }

    // Validate the caller is an authenticated Supabase user.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify the JWT using the anon/public Supabase client to confirm the token.
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!SUPABASE_ANON_KEY) {
      throw new Error("SUPABASE_ANON_KEY is not configured");
    }
    const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: { user: callerUser }, error: authError } = await callerClient.auth.getUser();
    if (authError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body: WelcomeEmailRequest = await req.json();
    const { userId, email, displayName } = body;

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: "userId and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Ensure callers can only trigger emails for themselves.
    if (callerUser.id !== userId) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
    const name = displayName ?? email.split("@")[0];
    const html = buildEmailHtml(name, dashboardUrl, APP_URL);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [email],
        subject: "ברוך הבא ל-Logic Flow 🐍",
        html,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      throw new Error(`Resend API error ${resendRes.status}: ${errorText}`);
    }

    // Atomically mark welcome email as sent only if it hasn't been set yet.
    // This prevents duplicate sends in concurrent scenarios.
    const { error: updateError } = await adminClient
      .from("user_profiles")
      .upsert(
        { id: userId, welcome_email_sent: true },
        { onConflict: "id" },
      );

    if (updateError) {
      // The email was already sent but the flag update failed.
      // Return an error so the caller can retry marking the flag.
      console.error("Failed to update welcome_email_sent:", updateError.message);
      return new Response(
        JSON.stringify({ sent: true, flagError: updateError.message }),
        { status: 207, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
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
