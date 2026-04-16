import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LAST_UPDATED = "אפריל 2026";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pb-24 pt-4" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20 shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">תנאי שירות</h1>
            <p className="text-xs text-muted-foreground mt-0.5">עדכון אחרון: {LAST_UPDATED}</p>
          </div>
        </div>

        <Card className="border-foreground/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground font-normal">
              ברוכים הבאים ל-ExamPrep. השימוש בפלטפורמה מהווה הסכמה לתנאים הבאים. אנא קרא אותם בעיון לפני השימוש.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <Section title="1. תיאור השירות">
              <p>
                ExamPrep הוא כלי למידה דיגיטלי המיועד לסייע לסטודנטים להתכונן למבחנים אקדמיים,
                ובפרט לקורס "מבוא לתכנות בפייתון" של האוניברסיטה הפתוחה.
              </p>
              <p>
                <strong className="text-foreground">חשוב לציין:</strong> ExamPrep אינו תחליף לחומר הלימוד הרשמי, לקורסים
                האקדמיים, או לבחינות המוסד. הפלטפורמה מספקת תרגול עצמאי בלבד ואינה מייצגת
                את האוניברסיטה הפתוחה בשום צורה.
              </p>
            </Section>

            <Section title="2. תנאי חשבון">
              <p>
                כדי להשתמש בשירות במלואו נדרש רישום חשבון. המשתמש אחראי באופן בלעדי לשמירה
                על אבטחת פרטי ההתחברות שלו (שם משתמש וסיסמה).
              </p>
              <p>
                אין לשתף חשבון עם אחרים. כל חשבון מיועד לשימוש אישי בלבד.
                השימוש בחשבון מעיד על הסכמה לתנאים אלה, ועל כך שהמשתמש בגיר או בעל אישור הורים.
              </p>
            </Section>

            <Section title="3. שימוש מותר ואסור">
              <p>המשתמש מתחייב שלא לבצע את הפעולות הבאות:</p>
              <ul className="list-disc list-inside space-y-1 pr-2">
                <li>סריקה אוטומטית (scraping) של תכני האתר</li>
                <li>שימוש בפלטפורמה לצורך רמאות בבחינות מוסד אקדמי</li>
                <li>הפצה מסחרית של שאלות, תשובות, או כל תוכן אחר מהפלטפורמה</li>
                <li>ניסיון לגשת למערכות ללא הרשאה</li>
                <li>כל שימוש שנועד להזיק, להטריד, או לפגוע בפלטפורמה או במשתמשים אחרים</li>
              </ul>
              <p>
                ExamPrep שומרת לעצמה את הזכות לחסום גישה לכל חשבון החורג מתנאים אלה.
              </p>
            </Section>

            <Section title="4. קניין רוחני">
              <p>
                כל התכנים בפלטפורמה — לרבות שאלות, תשובות, הסברים, עיצוב, קוד, ולוגו — הם
                קניינה הבלעדי של ExamPrep ומוגנים בחוקי זכויות יוצרים.
              </p>
              <p>
                אין לשכפל, להפיץ, לשנות, או להשתמש בתכנים לכל מטרה מסחרית ללא אישור בכתב מראש.
                שימוש אישי ולא מסחרי לצורך לימוד עצמי מותר.
              </p>
            </Section>

            <Section title="5. הגבלת אחריות">
              <p>
                ExamPrep ניתנת "כפי שהיא" (AS IS) ללא כל אחריות לתוצאות מבחן, ציונים, או
                הצלחה אקדמית. הפלטפורמה אינה מבטיחה דיוק מוחלט של כל שאלה ותשובה.
              </p>
              <p>
                בשום מקרה לא תהיה ExamPrep אחראית לנזקים עקיפים, תוצאתיים, או מיוחדים
                הנובעים מהשימוש בשירות.
              </p>
            </Section>

            <Section title="6. השעיה וסגירת חשבון">
              <p>
                ExamPrep רשאית להשעות או לסגור חשבון של משתמש שהפר את תנאי השירות, לאחר
                שהמשתמש יקבל הודעה מוקדמת (כאשר ניתן לעשות זאת).
              </p>
              <p>
                המשתמש רשאי לסגור את חשבונו בכל עת על-ידי פנייה לתמיכה. עם סגירת חשבון, נתוני
                ההתקדמות עשויים להימחק לצמיתות.
              </p>
            </Section>

            <Section title="7. הדין החל וסמכות שיפוט">
              <p>
                תנאי שירות אלה כפופים לחוקי מדינת ישראל. כל מחלוקת תידון בבתי המשפט המוסמכים
                במחוז תל אביב-יפו, ישראל.
              </p>
            </Section>

            <Section title="8. שינויים בתנאים">
              <p>
                ExamPrep שומרת לעצמה את הזכות לעדכן תנאים אלה בכל עת. שינויים מהותיים יפורסמו
                בפלטפורמה. המשך השימוש לאחר פרסום שינויים מהווה הסכמה לתנאים המעודכנים.
              </p>
            </Section>

            <Section title="9. יצירת קשר">
              <p>
                לכל שאלה, פנייה, או דיווח על הפרה, ניתן לפנות אלינו בכתובת האימייל:
              </p>
              <p>
                <span className="font-mono text-foreground">support@examprep.co.il</span>
              </p>
              <p className="text-xs text-muted-foreground/70">
                * כתובת זו היא לצורך המחשה. יש להחליפה בכתובת התמיכה הרשמית לפני הפעלת הפלטפורמה.
              </p>
            </Section>

          </CardContent>
        </Card>

        {/* Back link */}
        <div className="text-center pb-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
