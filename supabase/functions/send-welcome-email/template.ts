// Pure template builders for the welcome email. Kept framework-free so both
// the Deno edge runtime and the Node/Vitest test runner can import this file.

export interface WelcomeEmailInput {
  displayName: string;
  appUrl: string;
  unsubscribeMailto: string;
}

// Inline SVG logo for the Logic Flow wordmark. Intentionally small — email
// clients strip <style> heads and some block external images, so inline
// SVG + table-safe CSS is the baseline.
const LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" aria-label="Logic Flow">' +
  '<rect width="36" height="36" rx="8" fill="#0F172A"/>' +
  '<path d="M10 10h4v12h8v4H10z" fill="#38BDF8"/>' +
  '<circle cx="25" cy="12" r="3" fill="#38BDF8"/>' +
  "</svg>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildWelcomeEmailHtml(input: WelcomeEmailInput): string {
  const name = escapeHtml(input.displayName);
  const cta = escapeHtml(input.appUrl);
  const unsubscribe = escapeHtml(input.unsubscribeMailto);

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ברוכים הבאים ל-Logic Flow</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#0F172A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 16px 32px;border-bottom:1px solid #E2E8F0;" align="right" dir="rtl">
              <div style="display:inline-block;vertical-align:middle;">${LOGO_SVG}</div>
              <span style="display:inline-block;vertical-align:middle;margin-right:12px;font-size:18px;font-weight:700;color:#0F172A;letter-spacing:-0.2px;">Logic Flow</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px 32px;" dir="rtl" align="right">
              <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#0F172A;letter-spacing:-0.3px;">
                ברוכים הבאים ל-Logic Flow, ${name} 👋
              </h1>
              <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#334155;">
                שמחים שהצטרפת. Logic Flow הוא מסלול למידה טכני עם תרגול מעשי, משוב מיידי
                ומעקב התקדמות. התחלת את המסלול של פייתון — נמשיך יחד צעד-צעד עד לשליטה.
              </p>
              <p style="margin:0 0 28px 0;font-size:14px;line-height:1.6;color:#64748B;">
                מה הלאה? כנס למרכז המסלולים, בחר נושא להתחיל בו, וסיים את השיעור הראשון ב-10 דקות.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:4px 32px 32px 32px;" dir="rtl">
              <a href="${cta}"
                 style="display:inline-block;background:#0F172A;color:#FFFFFF;text-decoration:none;
                        font-size:15px;font-weight:600;padding:14px 36px;border-radius:10px;
                        letter-spacing:-0.2px;">
                התחלה ללמידה ←
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px 32px;" dir="ltr" align="left">
              <p style="margin:0 0 4px 0;font-size:13px;color:#64748B;line-height:1.6;">
                <strong style="color:#0F172A;">Welcome to Logic Flow, ${name}.</strong>
                A technical learning platform with hands-on practice, instant
                feedback, and clear progress. You're on the Python track — head
                to the hub to finish your first lesson in 10 minutes.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px 32px;border-top:1px solid #E2E8F0;" dir="rtl" align="right">
              <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
                קיבלת מייל זה כי נרשמת ל-Logic Flow. אם לא נרשמת —
                <a href="mailto:${unsubscribe}" style="color:#64748B;text-decoration:underline;">הסר מרשימת התפוצה</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildWelcomeEmailText(input: WelcomeEmailInput): string {
  return [
    `ברוכים הבאים ל-Logic Flow, ${input.displayName}!`,
    "",
    "שמחים שהצטרפת. התחלת את מסלול פייתון — המשך כאן:",
    input.appUrl,
    "",
    "---",
    `Welcome to Logic Flow, ${input.displayName}. Continue here: ${input.appUrl}`,
    "",
    `להסרה מרשימת התפוצה שלח מייל: ${input.unsubscribeMailto}`,
  ].join("\n");
}

export const WELCOME_EMAIL_SUBJECT = "ברוכים הבאים ל-Logic Flow";
