import type { Question, TopicId } from "@/data/questions";

// Default theory content by topic
const topicTheory: Record<TopicId, { theoryIntro: string; approachTip: string }> = {
  tracing: {
    theoryIntro: "בשאלות מעקב קוד, צריך לעקוב אחרי ערכי המשתנים שורה-שורה.\nrange(n) מייצר רצף מ-0 עד n-1.\nstr(x) ממיר מספר למחרוזת, int(x) ממיר מחרוזת למספר.",
    approachTip: "בנה טבלת מעקב: עמודה לכל משתנה, שורה לכל איטרציה. רשום את הערכים בכל שלב ותגלה את התשובה.",
  },
  conditions: {
    theoryIntro: "שרשרת if/elif/else בודקת תנאים לפי הסדר.\nPython נכנסת רק לבלוק הראשון שהתנאי שלו True ומדלגת על השאר.\nביטוי טרנרי: x if condition else y.",
    approachTip: "בדוק כל תנאי מלמעלה למטה. ברגע שמצאת תנאי שמתקיים — זו התשובה. אל תשכח לבדוק ערכי קצה (0, שליליים).",
  },
  loops: {
    theoryIntro: "לולאת for רצה מספר קבוע של פעמים. לולאת while רצה כל עוד תנאי מתקיים.\nrange(start, stop, step) — stop לא כלול!\nend=\"\" ב-print מונע ירידת שורה.",
    approachTip: "רשום את ערכי המשתנה בכל איטרציה. בלולאות מקוננות — עבור על הלולאה החיצונית ובתוכה את הפנימית.",
  },
  lists: {
    theoryIntro: "רשימות הן אוספים מסודרים. אינדקס מתחיל מ-0.\nlst.append(x) מוסיף לסוף. lst[i] ניגש לאיבר.\nslicing: lst[start:end] — end לא כלול. lst[::-1] הופך.",
    approachTip: "עקוב אחרי מצב הרשימה אחרי כל פעולה. שים לב: b = a מפנה לאותה רשימה, b = a[:] יוצר עותק!",
  },
  math: {
    theoryIntro: "% (מודולו) מחזיר שארית: 7%3=1. // חלוקה שלמה: 7//3=2.\n** חזקה: 2**3=8.\nלחילוץ ספרות: n%10 = ספרה אחרונה, n//10 = הסרת ספרה אחרונה.",
    approachTip: "פרק את הבעיה לצעדים קטנים. בשאלות ספרות — עבוד עם %10 ו-//10 בלולאה.",
  },
};

// Type-specific tips
const typeTips: Record<string, string> = {
  tracing: "\n🔍 טיפ למעקב: בנה טבלה עם כל המשתנים. עבור שורה-שורה.",
  quiz: "\n🔘 טיפ לרב-ברירה: פסול תשובות שלא ייתכנו לפני שבוחר.",
  coding: "\n✍️ טיפ לכתיבה: חשוב קודם על האלגוריתם, ורק אז כתוב קוד.",
  "fill-blank": "\n✏️ טיפ להשלמה: קרא את הקוד השלם, הבן מה הוא עושה, ואז מלא את החסר.",
};

/**
 * Returns theory content for a question.
 * Uses question-specific content if available, otherwise falls back to topic defaults.
 */
export function getTheoryForQuestion(q: Question): { theoryIntro: string; approachTip: string } | null {
  const specific = (q as any).theoryIntro;
  if (specific) {
    return {
      theoryIntro: (q as any).theoryIntro,
      approachTip: (q as any).approachTip || topicTheory[q.topic].approachTip,
    };
  }

  // Fall back to topic-level theory
  const base = topicTheory[q.topic];
  return {
    theoryIntro: base.theoryIntro,
    approachTip: base.approachTip + (typeTips[q.type] || ""),
  };
}
