import { useTranslation } from "react-i18next";

const LAST_UPDATED = "16 באפריל 2026";

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background pb-24 pt-8" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t("privacy.pageTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("privacy.lastUpdated")}: {LAST_UPDATED}</p>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          ExamPrep Master (&quot;השירות&quot;, &quot;אנחנו&quot;) מחויב להגן על פרטיות המשתמשים. מסמך זה מסביר
          אילו מידע אנחנו אוספים, כיצד אנחנו משתמשים בו, ומהן זכויותיכם בהתאם לחוק הגנת הפרטיות
          (תיקון מס׳ 13, תשפ״ה–2025) ולתקנות GDPR.
        </p>

        <Section title="1. המידע שאנחנו אוספים">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>
              <strong className="text-foreground">פרטי חשבון:</strong> כתובת דוא&quot;ל ושם משתמש
              שאתם מספקים בעת ההרשמה.
            </li>
            <li>
              <strong className="text-foreground">נתוני למידה:</strong> התשובות שענית,
              ההתקדמות בכל נושא, תוצאות מבחנים ופעילות בפלטפורמה.
            </li>
            <li>
              <strong className="text-foreground">נתוני שימוש ואנליטיקה:</strong> דפים
              שביקרת, משך הגלישה ואירועים טכניים — נאספים דרך PostHog לצורך שיפור
              השירות. נתונים אלה עשויים לכלול כתובת IP מקוצרת.
            </li>
            <li>
              <strong className="text-foreground">מידע טכני:</strong> סוג הדפדפן, מערכת
              ההפעלה ורזולוציית המסך — לצורכי תאימות ותמיכה.
            </li>
          </ul>
        </Section>

        <Section title="2. כיצד אנחנו משתמשים במידע">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>לספק ולתפעל את השירות (שמירת התקדמות, הצגת שאלות רלוונטיות).</li>
            <li>לזהות את המשתמש ולאבטח את החשבון.</li>
            <li>לשפר את תוכן השאלות ואת חוויית הלמידה בהתבסס על נתוני שימוש מצטברים.</li>
            <li>לשלוח הודעות שירות חיוניות (איפוס סיסמה, עדכונים קריטיים).</li>
            <li>
              <strong className="text-foreground">אנחנו לא מוכרים מידע אישי לצדדים שלישיים
              ולא משתמשים בו לצורכי פרסום מכוון.</strong>
            </li>
          </ul>
        </Section>

        <Section title="3. עיבוד מידע על-ידי צדדים שלישיים">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>אנחנו עובדים עם ספקי שירות מהימנים הפועלים כ&quot;מעבדי מידע&quot; מטעמנו:</p>
            <div className="space-y-3">
              <Processor
                name="Supabase"
                role="ספק בסיס נתונים ואימות זהות"
                location="ארצות הברית (AWS)"
                link="https://supabase.com/privacy"
              />
              <Processor
                name="Vercel"
                role="אירוח ותשתית האפליקציה"
                location="ארצות הברית / אירופה"
                link="https://vercel.com/legal/privacy-policy"
              />
              <Processor
                name="PostHog"
                role="אנליטיקת שימוש"
                location="ארצות הברית / אירופה"
                link="https://posthog.com/privacy"
              />
            </div>
            <p>
              כל הספקים מחויבים לחוזי עיבוד נתונים (DPA) ופועלים בהתאם לתקני האבטחה
              המקובלים בתעשייה.
            </p>
          </div>
        </Section>

        <Section title="4. קובצי Cookie ומעקב">
          <div className="space-y-2 text-muted-foreground leading-relaxed">
            <p>
              אנחנו משתמשים ב-cookie טכניים חיוניים לניהול הסשן ולאימות זהות. PostHog
              עשוי להשתמש ב-cookie אנליטיים לזיהוי ביקורים חוזרים. אין אנחנו משתמשים
              ב-cookie פרסומיים.
            </p>
            <p>
              ניתן לחסום cookie דרך הגדרות הדפדפן, אולם פעולה זו עלולה לפגוע בחלק
              מתפקודי השירות (כגון שמירת הסשן).
            </p>
          </div>
        </Section>

        <Section title="5. שמירת מידע">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>נתוני חשבון ולמידה: נשמרים כל עוד החשבון פעיל.</li>
            <li>
              לאחר מחיקת חשבון: נתוני החשבון נמחקים תוך 30 יום; נתוני אנליטיקה
              מצטברים ואנונימיים עשויים להישמר.
            </li>
            <li>
              גיבויים טכניים: עשויים להכיל נתונים למשך עד 90 יום נוספים מיום המחיקה.
            </li>
          </ul>
        </Section>

        <Section title="6. זכויותיכם">
          <div className="space-y-2 text-muted-foreground leading-relaxed">
            <p>בהתאם לחוק הגנת הפרטיות הישראלי ולתקנות GDPR, יש לכם זכות ל:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-foreground">גישה:</strong> לקבל עותק של המידע
                האישי שאנחנו מחזיקים עליכם.
              </li>
              <li>
                <strong className="text-foreground">תיקון:</strong> לבקש תיקון מידע
                שגוי או חסר.
              </li>
              <li>
                <strong className="text-foreground">מחיקה:</strong> לבקש מחיקת המידע
                האישי שלכם (&quot;הזכות להישכח&quot;).
              </li>
              <li>
                <strong className="text-foreground">ניידות:</strong> לקבל את נתוניכם
                בפורמט מובנה וקריא מחשב.
              </li>
              <li>
                <strong className="text-foreground">התנגדות:</strong> להתנגד לעיבוד
                מסוים של המידע שלכם.
              </li>
            </ul>
            <p className="pt-2">
              לממש כל זכות מהזכויות לעיל, פנו אלינו בכתב לכתובת:{" "}
              <a
                href="mailto:support@examprep.co.il"
                className="text-primary underline hover:opacity-80"
              >
                support@examprep.co.il
              </a>
              . נטפל בבקשתכם תוך 30 יום.
            </p>
          </div>
        </Section>

        <Section title="7. אבטחת מידע">
          <p className="text-muted-foreground leading-relaxed">
            אנחנו מיישמים אמצעי אבטחה מקובלים בתעשייה: הצפנת נתונים במנוחה ובמעבר
            (TLS 1.2+), בקרת גישה מבוססת תפקידים, וניטור אבטחה שוטף. עם זאת, אין
            שיטה טכנולוגית המאובטחת לחלוטין; אם גיליתם פרצת אבטחה, אנא דווחו לנו
            מיידית.
          </p>
        </Section>

        <Section title="8. שינויים במדיניות הפרטיות">
          <p className="text-muted-foreground leading-relaxed">
            אנחנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו בדף זה
            ותישלח הודעה לכתובת הדוא&quot;ל הרשומה. המשך השימוש בשירות לאחר פרסום
            השינויים מהווה הסכמה למדיניות המעודכנת.
          </p>
        </Section>

        <Section title="9. יצירת קשר">
          <div className="text-muted-foreground leading-relaxed space-y-1">
            <p>לכל שאלה או פנייה בנושא פרטיות:</p>
            <p>
              <strong className="text-foreground">דוא&quot;ל:</strong>{" "}
              <a
                href="mailto:support@examprep.co.il"
                className="text-primary underline hover:opacity-80"
              >
                support@examprep.co.il
              </a>
            </p>
            <p>
              <strong className="text-foreground">הרשות להגנת הפרטיות (ישראל):</strong>{" "}
              <a
                href="https://www.gov.il/en/departments/the_privacy_protection_authority"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80"
              >
                www.gov.il/en/departments/the_privacy_protection_authority
              </a>
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">{title}</h2>
      {children}
    </section>
  );
}

function Processor({
  name,
  role,
  location,
  link,
}: {
  name: string;
  role: string;
  location: string;
  link: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-3 space-y-0.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline hover:opacity-80"
        >
          {name}
        </a>
        <span className="text-xs text-muted-foreground font-mono">{location}</span>
      </div>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  );
}

export default PrivacyPage;
