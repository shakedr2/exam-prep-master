import type { Question, TopicId } from "@/data/questions";

interface TheoryExample {
  code: string;
  output: string;
}

interface TheoryData {
  theoryIntro: string;
  approachTip: string;
  example?: TheoryExample;
}

// Default theory content by topic
const topicTheory: Record<TopicId, TheoryData> = {
  tracing: {
    theoryIntro: "בשאלות מעקב קוד, צריך לעקוב אחרי ערכי המשתנים שורה-שורה.\nrange(n) מייצר רצף מ-0 עד n-1.\nstr(x) ממיר מספר למחרוזת, int(x) ממיר מחרוזת למספר.",
    approachTip: "בנה טבלת מעקב: עמודה לכל משתנה, שורה לכל איטרציה. רשום את הערכים בכל שלב ותגלה את התשובה.",
    example: {
      code: `x = 0\nfor i in range(3):\n    x += i\nprint(x)`,
      output: "3\n# כי 0+0+1+2 = 3",
    },
  },
  conditions: {
    theoryIntro: "שרשרת if/elif/else בודקת תנאים לפי הסדר.\nPython נכנסת רק לבלוק הראשון שהתנאי שלו True ומדלגת על השאר.\nביטוי טרנרי: x if condition else y.",
    approachTip: "בדוק כל תנאי מלמעלה למטה. ברגע שמצאת תנאי שמתקיים — זו התשובה. אל תשכח לבדוק ערכי קצה (0, שליליים).",
    example: {
      code: `x = 15\nif x > 20:\n    print("גדול")\nelif x > 10:\n    print("בינוני")\nelse:\n    print("קטן")`,
      output: 'בינוני\n# כי 15 > 10 אבל לא > 20',
    },
  },
  loops: {
    theoryIntro: "לולאת for רצה מספר קבוע של פעמים. לולאת while רצה כל עוד תנאי מתקיים.\nrange(start, stop, step) — stop לא כלול!\nend=\"\" ב-print מונע ירידת שורה.",
    approachTip: "רשום את ערכי המשתנה בכל איטרציה. בלולאות מקוננות — עבור על הלולאה החיצונית ובתוכה את הפנימית.",
    example: {
      code: `for i in range(1, 4):\n    print("*" * i)`,
      output: "*\n**\n***",
    },
  },
  lists: {
    theoryIntro: "רשימות הן אוספים מסודרים. אינדקס מתחיל מ-0.\nlst.append(x) מוסיף לסוף. lst[i] ניגש לאיבר.\nslicing: lst[start:end] — end לא כלול. lst[::-1] הופך.",
    approachTip: "עקוב אחרי מצב הרשימה אחרי כל פעולה. שים לב: b = a מפנה לאותה רשימה, b = a[:] יוצר עותק!",
    example: {
      code: `lst = [1, 2, 3]\nlst.append(4)\nprint(lst[1:3])`,
      output: "[2, 3]\n# lst = [1,2,3,4], אינדקס 1 עד 2",
    },
  },
  math: {
    theoryIntro: "% (מודולו) מחזיר שארית: 7%3=1. // חלוקה שלמה: 7//3=2.\n** חזקה: 2**3=8.\nלחילוץ ספרות: n%10 = ספרה אחרונה, n//10 = הסרת ספרה אחרונה.",
    approachTip: "פרק את הבעיה לצעדים קטנים. בשאלות ספרות — עבוד עם %10 ו-//10 בלולאה.",
    example: {
      code: `n = 123\nwhile n > 0:\n    print(n % 10, end=" ")\n    n //= 10`,
      output: "3 2 1\n# מוציא ספרות מהסוף להתחלה",
    },
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
export function getTheoryForQuestion(q: Question): TheoryData {
  const specific = (q as any).theoryIntro;
  const base = topicTheory[q.topic];

  if (specific) {
    return {
      theoryIntro: (q as any).theoryIntro,
      approachTip: (q as any).approachTip || base.approachTip,
      example: base.example,
    };
  }

  return {
    theoryIntro: base.theoryIntro,
    approachTip: base.approachTip + (typeTips[q.type] || ""),
    example: base.example,
  };
}
