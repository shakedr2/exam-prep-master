export type QuestionType = "quiz" | "tracing" | "coding" | "fill-blank";
export type TopicId = "tracing" | "conditions" | "loops" | "lists" | "math";
export type Difficulty = "easy" | "medium" | "hard";

export interface WarmupQuestion {
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TraceStep {
  headers: string[];
  rows: string[][];
}

export interface QuizQuestion {
  id: string;
  type: "quiz";
  topic: TopicId;
  difficulty: Difficulty;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  examSource?: string;
  warmupQuestions?: WarmupQuestion[];
}

export interface TracingQuestion {
  id: string;
  type: "tracing";
  topic: TopicId;
  difficulty: Difficulty;
  question: string;
  code: string;
  correctAnswer: string;
  explanation: string;
  traceTable?: TraceStep;
  examSource?: string;
  warmupQuestions?: WarmupQuestion[];
}

export interface CodingQuestion {
  id: string;
  type: "coding";
  topic: TopicId;
  difficulty: Difficulty;
  title: string;
  description: string;
  sampleInput?: string;
  sampleOutput?: string;
  solution: string;
  solutionExplanation: string;
  examSource?: string;
  warmupQuestions?: WarmupQuestion[];
}

export interface FillBlankQuestion {
  id: string;
  type: "fill-blank";
  topic: TopicId;
  difficulty: Difficulty;
  title: string;
  description: string;
  code: string;
  blanks: { answer: string; hint: string }[];
  solutionExplanation: string;
  examSource?: string;
  warmupQuestions?: WarmupQuestion[];
}

export type Question = QuizQuestion | TracingQuestion | CodingQuestion | FillBlankQuestion;

export interface Topic {
  id: TopicId;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const topics: Topic[] = [
  { id: "tracing", name: "מעקב קוד", icon: "🔍", description: "שאלות mystery - מה יודפס?", color: "from-purple-500 to-indigo-600" },
  { id: "conditions", name: "תנאים ולוגיקה", icon: "🔀", description: "if/else, חישובי הנחות, תנאים מורכבים", color: "from-cyan-500 to-teal-600" },
  { id: "loops", name: "לולאות ודפוסים", icon: "🔄", description: "הדפסת פירמידות, עיבוד מחרוזות", color: "from-orange-500 to-red-600" },
  { id: "lists", name: "רשימות ופונקציות", icon: "📋", description: "divisible, largerThan, mindiff", color: "from-green-500 to-emerald-600" },
  { id: "math", name: "מספרים ומתמטיקה", icon: "🔢", description: "ראשוניים, ספרות ייחודיות, סדרת Pell", color: "from-yellow-500 to-amber-600" },
];

export const questions: Question[] = [
  // === TRACING ===
  {
    id: "t1",
    type: "tracing",
    topic: "tracing",
    difficulty: "easy",
    question: "מה תדפיס הפונקציה הבאה עבור הקריאה mystery(3)?",
    code: `def mystery(n):
    result = ""
    for i in range(n):
        result += str(i * 2) + " "
    print(result)

mystery(3)`,
    correctAnswer: "0 2 4 ",
    explanation: "הלולאה רצה מ-0 עד 2. כל i מוכפל ב-2: 0*2=0, 1*2=2, 2*2=4. מודפס עם רווח אחרי כל מספר.",
    examSource: "מבחן 1",
    traceTable: {
      headers: ["i", "i * 2", "result"],
      rows: [
        ["0", "0", '"0 "'],
        ["1", "2", '"0 2 "'],
        ["2", "4", '"0 2 4 "'],
      ]
    },
    warmupQuestions: [
      {
        question: "מה הערך של range(3)?",
        options: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "3"],
        correctIndex: 0,
        explanation: "range(3) מייצר את הרצף 0, 1, 2 — שלושה מספרים החל מ-0."
      }
    ],
  },
  {
    id: "t2",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה תדפיס הפונקציה הבאה עבור הקריאה mystery(4, 2)?",
    code: `def mystery(a, b):
    while a > 0:
        if a % b == 0:
            print(a, end=" ")
        a -= 1

mystery(4, 2)`,
    correctAnswer: "4 2 ",
    explanation: "a מתחיל ב-4 ויורד ב-1. כשa מתחלק ב-b (=2) הוא מודפס. 4%2==0 ✓, 3%2!=0, 2%2==0 ✓, 1%2!=0.",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה הערך של 6 % 2?",
        options: ["0", "2", "3", "1"],
        correctIndex: 0,
        explanation: "6 מתחלק ב-2 בדיוק, לכן השארית (%) היא 0."
      },
      {
        question: "כמה פעמים תרוץ הלולאה while a > 0 אם a מתחיל ב-4 ויורד ב-1 כל פעם?",
        options: ["3", "4", "5", "אינסוף"],
        correctIndex: 1,
        explanation: "a = 4,3,2,1 ואז a=0 והלולאה נעצרת. 4 איטרציות."
      }
    ],
  },
  {
    id: "t3",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה תדפיס הפונקציה הבאה עבור mystery(\"hello\")?",
    code: `def mystery(s):
    result = ""
    for i in range(len(s)):
        if i % 2 == 0:
            result += s[i].upper()
        else:
            result += s[i]
    print(result)

mystery("hello")`,
    correctAnswer: "HeLlO",
    explanation: "אינדקסים זוגיים (0,2,4) הופכים לאותיות גדולות: H, L, O. אינדקסים אי-זוגיים (1,3) נשארים: e, l.",
    traceTable: {
      headers: ["i", "s[i]", "i % 2", "פעולה", "result"],
      rows: [
        ["0", "h", "0 (זוגי)", "upper→H", '"H"'],
        ["1", "e", "1 (אי-זוגי)", "שומר", '"He"'],
        ["2", "l", "0 (זוגי)", "upper→L", '"HeL"'],
        ["3", "l", "1 (אי-זוגי)", "שומר", '"HeLl"'],
        ["4", "o", "0 (זוגי)", "upper→O", '"HeLlO"'],
      ]
    },
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה הערך של \"hello\"[2]?",
        options: ["e", "l", "h", "o"],
        correctIndex: 1,
        explanation: "אינדקסים מתחילים מ-0: h=0, e=1, l=2. לכן \"hello\"[2] = 'l'."
      },
      {
        question: "מה עושה הפונקציה .upper() על התו 'a'?",
        options: ["'A'", "'a'", "שגיאה", "1"],
        correctIndex: 0,
        explanation: ".upper() הופכת אות קטנה לגדולה. 'a'.upper() = 'A'."
      }
    ],
  },
  {
    id: "t4",
    type: "tracing",
    topic: "tracing",
    difficulty: "hard",
    question: "מה תדפיס הפונקציה הבאה עבור mystery([3,1,4,1,5])?",
    code: `def mystery(lst):
    count = 0
    for i in range(len(lst)-1):
        if lst[i] > lst[i+1]:
            count += 1
    print(count)

mystery([3,1,4,1,5])`,
    correctAnswer: "2",
    explanation: "סופרים כמה פעמים איבר גדול מהאיבר הבא: 3>1 ✓, 1>4 ✗, 4>1 ✓, 1>5 ✗. סה\"כ 2.",
    traceTable: {
      headers: ["i", "lst[i]", "lst[i+1]", "lst[i]>lst[i+1]", "count"],
      rows: [
        ["0", "3", "1", "True ✓", "1"],
        ["1", "1", "4", "False", "1"],
        ["2", "4", "1", "True ✓", "2"],
        ["3", "1", "5", "False", "2"],
      ]
    },
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "עבור רשימה בגודל 5, מה הערך של range(len(lst)-1)?",
        options: ["range(4) → 0,1,2,3", "range(5) → 0,1,2,3,4", "range(4) → 1,2,3,4", "range(3) → 0,1,2"],
        correctIndex: 0,
        explanation: "len([3,1,4,1,5]) = 5. range(5-1) = range(4) = 0,1,2,3."
      },
      {
        question: "אם lst = [3,1,4,1,5], מה הערך של lst[2] > lst[3]?",
        options: ["True (כי 4 > 1)", "False (כי 4 < 1)", "True (כי 1 > 5)", "שגיאה"],
        correctIndex: 0,
        explanation: "lst[2] = 4, lst[3] = 1. 4 > 1 → True."
      }
    ],
  },
  {
    id: "t5",
    type: "tracing",
    topic: "tracing",
    difficulty: "hard",
    question: "מה תדפיס הפונקציה הבאה עבור mystery(5)?",
    code: `def mystery(n):
    a, b = 0, 1
    for i in range(n):
        a, b = b, a + b
    print(a)

mystery(5)`,
    correctAnswer: "5",
    explanation: "זוהי סדרת פיבונאצ'י. הערכים: (0,1)→(1,1)→(1,2)→(2,3)→(3,5)→(5,8). אחרי 5 איטרציות a=5.",
    examSource: "מבחן 6",
    warmupQuestions: [
      {
        question: "מה עושה השורה a, b = b, a + b כאשר a=2 ו-b=3?",
        options: ["a=3, b=5", "a=5, b=3", "a=3, b=6", "a=2, b=5"],
        correctIndex: 0,
        explanation: "Python מחשבת את הצד הימני קודם: b=3, a+b=5. ואז a=3, b=5."
      },
      {
        question: "בסדרת פיבונאצ'י: F(0)=0, F(1)=1. מה הערך של F(3)?",
        options: ["2", "3", "1", "5"],
        correctIndex: 0,
        explanation: "F(2) = F(1)+F(0) = 1+0 = 1. F(3) = F(2)+F(1) = 1+1 = 2."
      },
      {
        question: "כמה פעמים תרוץ הלולאה for i in range(5)?",
        options: ["4", "5", "6", "3"],
        correctIndex: 1,
        explanation: "range(5) מייצר את 0,1,2,3,4 — סה\"כ 5 איטרציות."
      }
    ],
  },

  // === CONDITIONS ===
  {
    id: "c1",
    type: "quiz",
    topic: "conditions",
    difficulty: "easy",
    question: "לקוח קנה ב-150 ש\"ח. מה תהיה ההנחה לפי הפונקציה הבאה?",
    code: `def discount(price):
    if price > 200:
        return price * 0.2
    elif price > 100:
        return price * 0.1
    else:
        return 0`,
    options: ["0", "15", "30", "20"],
    correctIndex: 1,
    explanation: "150 > 100 אבל לא > 200, לכן נכנסים ל-elif ומקבלים 150 * 0.1 = 15 ש\"ח הנחה.",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "בשרשרת if/elif, האם Python ממשיכה לבדוק תנאים אחרי שמצאה תנאי שמתקיים?",
        options: ["לא, עוצרת בתנאי הראשון שמתקיים", "כן, בודקת את כולם", "תלוי בערך", "שגיאה"],
        correctIndex: 0,
        explanation: "בשרשרת if/elif, Python נכנסת לבלוק הראשון שהתנאי שלו True ומדלגת על כל השאר."
      },
      {
        question: "האם 150 > 200?",
        options: ["False", "True", "150", "שגיאה"],
        correctIndex: 0,
        explanation: "150 לא גדול מ-200, לכן התנאי הראשון (price > 200) לא מתקיים ועוברים ל-elif."
      }
    ],
  },
  {
    id: "c2",
    type: "quiz",
    topic: "conditions",
    difficulty: "medium",
    question: "מה יחזיר הביטוי הבא?",
    code: `x = 5
y = 10
result = "big" if x * y > 40 and x < y else "small"
print(result)`,
    options: ["big", "small", "True", "שגיאה"],
    correctIndex: 0,
    explanation: "x*y = 50 > 40 ✓ וגם x(5) < y(10) ✓. שני התנאים מתקיימים, לכן התוצאה היא \"big\".",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה הערך של True and True?",
        options: ["True", "False", "None", "שגיאה"],
        correctIndex: 0,
        explanation: "and מחזיר True רק אם שני הצדדים True."
      },
      {
        question: 'מה הערך של "yes" if 3 > 2 else "no"?',
        options: ['"yes"', '"no"', "True", "3"],
        correctIndex: 0,
        explanation: "3 > 2 הוא True, לכן הביטוי הטרנרי מחזיר את הערך הראשון: \"yes\"."
      }
    ],
  },
  {
    id: "c3",
    type: "quiz",
    topic: "conditions",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def check(n):
    if n > 0:
        if n % 2 == 0:
            return "חיובי זוגי"
        else:
            return "חיובי אי-זוגי"
    return "לא חיובי"

print(check(-3))`,
    options: ["חיובי זוגי", "חיובי אי-זוגי", "לא חיובי", "None"],
    correctIndex: 2,
    explanation: "-3 לא עובר את התנאי n > 0, לכן מגיעים ישירות ל-return \"לא חיובי\".",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה הערך של -3 > 0?",
        options: ["False", "True", "שגיאה", "-3"],
        correctIndex: 0,
        explanation: "-3 הוא שלילי, לכן -3 > 0 הוא False."
      },
      {
        question: "כשתנאי if חיצוני הוא False, מה קורה לבלוק ה-if/else הפנימי?",
        options: ["הכל מדולג", "נכנסים ל-else הפנימי", "שגיאה", "מחזירים None"],
        correctIndex: 0,
        explanation: "כשה-if החיצוני False, כל הבלוק שבתוכו מדולג — כולל ה-else הפנימי."
      }
    ],
  },
  {
    id: "c4",
    type: "quiz",
    topic: "conditions",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def grade(score):
    if score >= 90:
        g = "A"
    elif score >= 80:
        g = "B"  
    elif score >= 70:
        g = "C"
    else:
        g = "F"
    
    if g != "F":
        return g + " - עובר"
    return g + " - נכשל"

print(grade(85))`,
    options: ["A - עובר", "B - עובר", "C - עובר", "F - נכשל"],
    correctIndex: 1,
    explanation: "85 >= 80 (ולא >= 90), לכן g = \"B\". B != \"F\" לכן מחזירים \"B - עובר\".",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: "בשרשרת if/elif, אם התנאי הראשון לא מתקיים, מה קורה?",
        options: ["בודקים את ה-elif הבא", "נכנסים ל-else", "הקוד נעצר", "שגיאה"],
        correctIndex: 0,
        explanation: "Python בודקת כל תנאי לפי הסדר. אם if לא מתקיים, עוברים ל-elif."
      },
      {
        question: "מה הערך של \"B\" != \"F\"?",
        options: ["True", "False", '"B"', "שגיאה"],
        correctIndex: 0,
        explanation: "!= בודק אי-שוויון. \"B\" שונה מ-\"F\" → True."
      }
    ],
  },

  // === LOOPS ===
  {
    id: "l1",
    type: "tracing",
    topic: "loops",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `for i in range(1, 4):
    print("*" * i)`,
    correctAnswer: "*\n**\n***",
    explanation: "הלולאה רצה מ-1 עד 3. בכל שורה מודפסים i כוכביות: 1, 2, 3.",
    examSource: "מבחן 1",
    traceTable: {
      headers: ["i", '"*" * i', "פלט"],
      rows: [
        ["1", '"*"', "*"],
        ["2", '"**"', "**"],
        ["3", '"***"', "***"],
      ]
    },
    warmupQuestions: [
      {
        question: 'מה הערך של "*" * 3?',
        options: ['"***"', '"*3"', '"* * *"', "שגיאה"],
        correctIndex: 0,
        explanation: 'כפל מחרוזת חוזר על התו. "*" * 3 = "***".'
      }
    ],
  },
  {
    id: "l2",
    type: "tracing",
    topic: "loops",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `for i in range(3):
    for j in range(i + 1):
        print(j, end="")
    print()`,
    correctAnswer: "0\n01\n012",
    explanation: "שורה 1: i=0, j רץ 0..0 → \"0\". שורה 2: i=1, j רץ 0..1 → \"01\". שורה 3: i=2, j רץ 0..2 → \"012\".",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "כש-i=0, מה הערך של range(i + 1)?",
        options: ["range(1) → רק 0", "range(0) → ריק", "range(2) → 0,1", "שגיאה"],
        correctIndex: 0,
        explanation: "range(0+1) = range(1) = [0]. הלולאה הפנימית רצה פעם אחת."
      },
      {
        question: "מה עושה end=\"\" בתוך print?",
        options: ["לא עובר שורה אחרי ההדפסה", "מדפיס רווח", "מסיים את התוכנית", "שגיאה"],
        correctIndex: 0,
        explanation: "end=\"\" אומר ל-print לא לרדת שורה, כך שההדפסות הבאות ממשיכות באותה שורה."
      }
    ],
  },
  {
    id: "l3",
    type: "quiz",
    topic: "loops",
    difficulty: "medium",
    question: "כמה פעמים תתבצע ההדפסה בקוד הבא?",
    code: `count = 0
for i in range(5):
    for j in range(i):
        count += 1
print(count)`,
    options: ["5", "10", "15", "25"],
    correctIndex: 1,
    explanation: "i=0: 0 פעמים, i=1: 1, i=2: 2, i=3: 3, i=4: 4. סה\"כ 0+1+2+3+4 = 10.",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה הערך של range(0)?",
        options: ["ריק (0 איטרציות)", "range(0) → רק 0", "שגיאה", "range(1)"],
        correctIndex: 0,
        explanation: "range(0) ריק — הלולאה הפנימית לא רצה כלל כש-i=0."
      },
      {
        question: "כש-i=3, כמה פעמים תרוץ for j in range(i)?",
        options: ["3 פעמים (j=0,1,2)", "4 פעמים", "2 פעמים", "i פעמים (לא ידוע)"],
        correctIndex: 0,
        explanation: "range(3) = 0,1,2 → הלולאה הפנימית רצה 3 פעמים."
      }
    ],
  },
  {
    id: "l4",
    type: "coding",
    topic: "loops",
    difficulty: "medium",
    title: "הדפסת פירמידת מספרים",
    description: "כתבו פונקציה pyramid(n) שמדפיסה פירמידת מספרים בגובה n. לדוגמה, עבור n=4:\n\n   1\n  12\n 123\n1234",
    sampleInput: "pyramid(4)",
    sampleOutput: "   1\n  12\n 123\n1234",
    solution: `def pyramid(n):
    for i in range(1, n + 1):
        spaces = " " * (n - i)
        nums = ""
        for j in range(1, i + 1):
            nums += str(j)
        print(spaces + nums)`,
    solutionExplanation: "עבור כל שורה i: מדפיסים (n-i) רווחים ואז את המספרים 1 עד i. בשורה 1: 3 רווחים + \"1\". בשורה 4: 0 רווחים + \"1234\".",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: 'מה הערך של " " * 3?',
        options: ['"   " (שלושה רווחים)', '" "', '"3"', "שגיאה"],
        correctIndex: 0,
        explanation: "כפל מחרוזת חוזר על התו. \" \" * 3 יוצר מחרוזת של 3 רווחים."
      },
      {
        question: "בפירמידה בגובה 4, כמה רווחים צריך בשורה הראשונה?",
        options: ["3 (כי n-i = 4-1)", "4", "0", "1"],
        correctIndex: 0,
        explanation: "בשורה i=1 (הראשונה), צריך n-i = 4-1 = 3 רווחים לפני המספרים."
      }
    ],
  },

  // === LISTS ===
  {
    id: "li1",
    type: "quiz",
    topic: "lists",
    difficulty: "easy",
    question: "מה תחזיר הפונקציה divisible([10,15,20,25,30], 10)?",
    code: `def divisible(lst, n):
    result = []
    for x in lst:
        if x % n == 0:
            result.append(x)
    return result`,
    options: ["[10, 20, 30]", "[15, 25]", "[10, 30]", "[10, 15, 20, 25, 30]"],
    correctIndex: 0,
    explanation: "הפונקציה מחזירה רשימה של כל האיברים שמתחלקים ב-n (=10). 10%10=0 ✓, 15%10≠0, 20%10=0 ✓, 25%10≠0, 30%10=0 ✓.",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה עושה result.append(x)?",
        options: ["מוסיף את x לסוף הרשימה", "מוחק את x מהרשימה", "מחליף את האיבר האחרון", "שגיאה"],
        correctIndex: 0,
        explanation: "append מוסיף איבר חדש לסוף הרשימה."
      }
    ],
  },
  {
    id: "li2",
    type: "quiz",
    topic: "lists",
    difficulty: "medium",
    question: "מה תחזיר הפונקציה largerThan([3,7,1,9,4], 5)?",
    code: `def largerThan(lst, n):
    count = 0
    for x in lst:
        if x > n:
            count += 1
    return count`,
    options: ["2", "3", "4", "1"],
    correctIndex: 0,
    explanation: "סופרים איברים גדולים מ-5: 3>5 ✗, 7>5 ✓, 1>5 ✗, 9>5 ✓, 4>5 ✗. סה\"כ 2.",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה עושה count += 1?",
        options: ["מגדיל את count ב-1", "מאפס את count", "מכפיל את count", "מחזיר count"],
        correctIndex: 0,
        explanation: "count += 1 זהה ל-count = count + 1, מגדיל את המונה ב-1."
      }
    ],
  },
  {
    id: "li3",
    type: "coding",
    topic: "lists",
    difficulty: "hard",
    title: "מציאת ההפרש המינימלי (minDiff)",
    description: "כתבו פונקציה minDiff(lst) שמקבלת רשימת מספרים ומחזירה את ההפרש המינימלי בין שני איברים כלשהם ברשימה.",
    sampleInput: "minDiff([4, 9, 1, 7, 3])",
    sampleOutput: "1",
    solution: `def minDiff(lst):
    lst_sorted = sorted(lst)
    min_d = lst_sorted[1] - lst_sorted[0]
    for i in range(1, len(lst_sorted) - 1):
        diff = lst_sorted[i+1] - lst_sorted[i]
        if diff < min_d:
            min_d = diff
    return min_d`,
    solutionExplanation: "ממיינים את הרשימה [1,3,4,7,9]. ההפרשים בין שכנים: 3-1=2, 4-3=1, 7-4=3, 9-7=2. המינימום הוא 1.",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: "מה עושה sorted([4,9,1,7,3])?",
        options: ["[1,3,4,7,9]", "[9,7,4,3,1]", "[4,9,1,7,3]", "שגיאה"],
        correctIndex: 0,
        explanation: "sorted() מחזירה רשימה חדשה ממוינת בסדר עולה."
      },
      {
        question: "למה כדאי למיין את הרשימה לפני חיפוש הפרש מינימלי?",
        options: ["ההפרש המינימלי תמיד בין שכנים ברשימה ממוינת", "כי Python דורש מיון", "כדי שהלולאה תרוץ מהר יותר", "אין צורך במיון"],
        correctIndex: 0,
        explanation: "ברשימה ממוינת, ההפרש המינימלי חייב להיות בין שני איברים עוקבים. זה חוסך השוואות."
      }
    ],
  },
  {
    id: "li4",
    type: "tracing",
    topic: "lists",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    result = []
    for i in range(len(lst)):
        if lst[i] not in result:
            result.append(lst[i])
    return result

print(mystery([1,2,3,2,1,4]))`,
    correctAnswer: "[1, 2, 3, 4]",
    explanation: "הפונקציה בונה רשימה ללא כפילויות. כל איבר נוסף רק אם הוא לא כבר ברשימה. 1 ✓, 2 ✓, 3 ✓, 2 כבר קיים, 1 כבר קיים, 4 ✓.",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: "מה עושה x not in [1, 2, 3] כש-x=2?",
        options: ["False (כי 2 נמצא ברשימה)", "True", "שגיאה", "2"],
        correctIndex: 0,
        explanation: "not in בודק אם הערך לא נמצא. 2 כן נמצא ב-[1,2,3], לכן התוצאה False."
      },
      {
        question: "מה עושה result.append(4) אם result = [1, 2]?",
        options: ["result הופך ל-[1, 2, 4]", "result הופך ל-[4, 1, 2]", "שגיאה", "מחזיר [1, 2, 4]"],
        correctIndex: 0,
        explanation: "append מוסיף את הערך לסוף הרשימה."
      }
    ],
  },

  // === MATH ===
  {
    id: "m1",
    type: "quiz",
    topic: "math",
    difficulty: "medium",
    question: "מה תחזיר הפונקציה is_prime(17)?",
    code: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True`,
    options: ["True", "False", "17", "None"],
    correctIndex: 0,
    explanation: "17 >= 2 ✓. בודקים חלוקה מ-2 עד 16: 17 לא מתחלק באף אחד מהם. לכן 17 ראשוני ומחזירים True.",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה זה מספר ראשוני?",
        options: ["מספר שמתחלק רק ב-1 ובעצמו", "מספר זוגי", "מספר גדול מ-10", "מספר שלילי"],
        correctIndex: 0,
        explanation: "מספר ראשוני מתחלק בדיוק בשני מספרים: 1 והמספר עצמו."
      },
      {
        question: "האם 6 הוא מספר ראשוני?",
        options: ["לא, כי 6 = 2×3", "כן, כי 6 > 1", "כן, כי 6 זוגי", "לא, כי 6 < 10"],
        correctIndex: 0,
        explanation: "6 מתחלק ב-2 וב-3 (מלבד 1 ו-6), לכן הוא לא ראשוני."
      }
    ],
  },
  {
    id: "m2",
    type: "coding",
    topic: "math",
    difficulty: "hard",
    title: "ספרות ייחודיות",
    description: "כתבו פונקציה unique_digits(n) שמקבלת מספר שלם חיובי ומחזירה True אם כל הספרות במספר שונות זו מזו, ו-False אחרת.",
    sampleInput: "unique_digits(1234)",
    sampleOutput: "True",
    solution: `def unique_digits(n):
    digits = str(n)
    return len(digits) == len(set(digits))`,
    solutionExplanation: "ממירים למחרוזת ובודקים אם אורך המחרוזת שווה לאורך ה-set שלה. אם יש ספרות חוזרות, ה-set יהיה קצר יותר.",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: "מה עושה set(\"hello\")?",
        options: ['{"h","e","l","o"} - 4 תווים', '{"h","e","l","l","o"} - 5 תווים', "שגיאה", '"hello"'],
        correctIndex: 0,
        explanation: "set מסיר כפילויות. 'l' מופיע פעמיים אבל ב-set נשמר פעם אחת בלבד."
      },
      {
        question: "מה הערך של len(\"1234\")?",
        options: ["4", "1234", "3", "10"],
        correctIndex: 0,
        explanation: "len מחזיר את אורך המחרוזת. \"1234\" מכילה 4 תווים."
      }
    ],
  },
  {
    id: "m3",
    type: "coding",
    topic: "math",
    difficulty: "hard",
    title: "סדרת Pell",
    description: "כתבו פונקציה pell(n) שמחזירה את האיבר ה-n בסדרת Pell.\n\nסדרת Pell מוגדרת:\nP(0) = 0\nP(1) = 1\nP(n) = 2 * P(n-1) + P(n-2)",
    sampleInput: "pell(5)",
    sampleOutput: "29",
    solution: `def pell(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    a, b = 0, 1
    for i in range(2, n + 1):
        a, b = b, 2 * b + a
    return b`,
    solutionExplanation: "P(0)=0, P(1)=1, P(2)=2*1+0=2, P(3)=2*2+1=5, P(4)=2*5+2=12, P(5)=2*12+5=29.",
    examSource: "מבחן 6",
    warmupQuestions: [
      {
        question: "בסדרת Pell: P(0)=0, P(1)=1, P(n)=2*P(n-1)+P(n-2). מה הערך של P(2)?",
        options: ["2", "1", "3", "0"],
        correctIndex: 0,
        explanation: "P(2) = 2*P(1) + P(0) = 2*1 + 0 = 2."
      },
      {
        question: "חשבו: P(3) = 2*P(2) + P(1) = ?",
        options: ["5", "4", "3", "6"],
        correctIndex: 0,
        explanation: "P(3) = 2*2 + 1 = 5."
      },
      {
        question: "איך שומרים שני ערכים קודמים בלולאה?",
        options: ["a, b = b, 2*b+a", "a = b; b = 2*b+a", "temp = a; a = b; b = temp", "a += b"],
        correctIndex: 0,
        explanation: "בPython, a, b = b, 2*b+a מעדכנת את שניהם בו-זמנית בלי צורך במשתנה זמני."
      }
    ],
  },
  {
    id: "m4",
    type: "tracing",
    topic: "math",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def sum_digits(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total

print(sum_digits(456))`,
    correctAnswer: "15",
    explanation: "456%10=6, total=6, n=45. 45%10=5, total=11, n=4. 4%10=4, total=15, n=0. סה\"כ: 4+5+6=15.",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה הערך של 456 % 10?",
        options: ["6", "45", "4", "456"],
        correctIndex: 0,
        explanation: "% 10 מחזיר את הספרה האחרונה. 456 % 10 = 6."
      },
      {
        question: "מה הערך של 456 // 10?",
        options: ["45", "46", "4", "6"],
        correctIndex: 0,
        explanation: "// 10 מסיר את הספרה האחרונה. 456 // 10 = 45."
      }
    ],
  },

  // More quiz variations
  {
    id: "c5",
    type: "quiz",
    topic: "conditions",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `x = 7
if x > 10:
    print("גדול")
elif x > 5:
    print("בינוני")
else:
    print("קטן")`,
    options: ["גדול", "בינוני", "קטן", "שגיאה"],
    correctIndex: 1,
    explanation: "x=7: 7 > 10? לא. 7 > 5? כן! מדפיסים \"בינוני\".",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה הערך של 7 > 10?",
        options: ["False", "True", "7", "שגיאה"],
        correctIndex: 0,
        explanation: "7 לא גדול מ-10, לכן 7 > 10 הוא False."
      }
    ],
  },
  {
    id: "l5",
    type: "coding",
    topic: "loops",
    difficulty: "easy",
    title: "ספירת תווים",
    description: "כתבו פונקציה count_char(s, c) שמקבלת מחרוזת s ותו c ומחזירה כמה פעמים התו מופיע במחרוזת.",
    sampleInput: 'count_char("banana", "a")',
    sampleOutput: "3",
    solution: `def count_char(s, c):
    count = 0
    for char in s:
        if char == c:
            count += 1
    return count`,
    solutionExplanation: "עוברים על כל תו במחרוזת. כל פעם שהתו שווה ל-c, מגדילים את המונה. ב-\"banana\" יש 3 פעמים 'a'.",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה עושה for char in s?",
        options: ["עובר על כל תו במחרוזת s", "סופר תווים", "מוחק תווים", "שגיאה"],
        correctIndex: 0,
        explanation: "for char in s עובר על כל תו במחרוזת, אחד אחרי השני."
      }
    ],
  },
  {
    id: "t6",
    type: "tracing",
    topic: "tracing",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `x = 10
y = 3
print(x // y, x % y)`,
    correctAnswer: "3 1",
    explanation: "חלוקה שלמה: 10//3 = 3. שארית: 10%3 = 1. מודפס: \"3 1\".",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה ההבדל בין / לבין //?",
        options: ["/ עשרוני, // שלם", "אין הבדל", "// עשרוני, / שלם", "שגיאה"],
        correctIndex: 0,
        explanation: "/ מחזיר תוצאה עשרונית (3.33), // מחזיר רק את החלק השלם (3)."
      }
    ],
  },
  {
    id: "li5",
    type: "quiz",
    topic: "lists",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `lst = [1, 2, 3, 4, 5]
print(lst[1:4])`,
    options: ["[1, 2, 3]", "[2, 3, 4]", "[2, 3, 4, 5]", "[1, 2, 3, 4]"],
    correctIndex: 1,
    explanation: "lst[1:4] מחזיר את האיברים מאינדקס 1 (כולל) עד 4 (לא כולל): [2, 3, 4].",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: "מה אומר lst[1:4] — האם 4 כלול?",
        options: ["לא, מאינדקס 1 עד 3 (לא כולל 4)", "כן, מאינדקס 1 עד 4 כולל", "מאינדקס 0 עד 4", "שגיאה"],
        correctIndex: 0,
        explanation: "ב-slicing, הגבול העליון לא כלול. lst[1:4] מחזיר אינדקסים 1, 2, 3."
      },
      {
        question: "ברשימה [1,2,3,4,5], מה האיבר באינדקס 1?",
        options: ["2", "1", "3", "0"],
        correctIndex: 0,
        explanation: "אינדקסים מתחילים מ-0. אינדקס 0=1, אינדקס 1=2."
      }
    ],
  },
  {
    id: "m5",
    type: "quiz",
    topic: "math",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `print(2 ** 3 + 1)`,
    options: ["7", "9", "8", "6"],
    correctIndex: 1,
    explanation: "2**3 = 8. 8+1 = 9.",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה עושה ** ב-Python?",
        options: ["חזקה (2**3 = 8)", "כפל (2*3 = 6)", "חלוקה", "שגיאה"],
        correctIndex: 0,
        explanation: "** הוא אופרטור חזקה. 2**3 = 2³ = 2×2×2 = 8."
      },
      {
        question: "מה קודם: ** או +?",
        options: ["** קודם (חזקה לפני חיבור)", "+ קודם", "שווים", "תלוי בסוגריים"],
        correctIndex: 0,
        explanation: "סדר הפעולות: חזקה (**) לפני חיבור (+). לכן 2**3+1 = 8+1 = 9."
      }
    ],
  },

  // ==========================================
  // ADDITIONAL QUESTIONS - Batch 2
  // ==========================================

  // === MORE TRACING ===
  {
    id: "t7",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(s):
    result = ""
    for c in s:
        if c.isdigit():
            result += c
    return result

print(mystery("a1b2c3"))`,
    correctAnswer: "123",
    explanation: "עוברים על כל תו במחרוזת. רק ספרות (isdigit) מתווספות: '1', '2', '3' → \"123\".",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: "מה עושה הפונקציה .isdigit() על התו '3'?",
        options: ["True", "False", "3", "שגיאה"],
        correctIndex: 0,
        explanation: "'3'.isdigit() מחזיר True כי '3' הוא תו ספרה."
      },
      {
        question: "אם עוברים על \"a1b2\" ושומרים רק ספרות, מה יצטבר ב-result?",
        options: ['"12"', '"ab"', '"a1b2"', '""'],
        correctIndex: 0,
        explanation: "מסננים רק תווים שהם ספרות: '1' ו-'2' → \"12\"."
      }
    ],
  },
  {
    id: "t8",
    type: "tracing",
    topic: "tracing",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    result = lst[0]
    for i in range(1, len(lst)):
        if lst[i] < result:
            result = lst[i]
    return result

print(mystery([5, 3, 8, 1, 9]))`,
    correctAnswer: "1",
    explanation: "הפונקציה מוצאת את המינימום ברשימה. מתחילים מ-5, אז 3<5→3, 8>3, 1<3→1, 9>1. המינימום הוא 1.",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: "אם result = 5 ו-lst[i] = 3, מה יקרה בתנאי lst[i] < result?",
        options: ["result יתעדכן ל-3 (כי 3 < 5)", "result נשאר 5", "שגיאה", "result = 0"],
        correctIndex: 0,
        explanation: "3 < 5 → True, לכן result מתעדכן לערך הקטן יותר: 3."
      },
      {
        question: "למה מאתחלים result = lst[0] ולא result = 0?",
        options: ["כי הרשימה יכולה להכיל רק מספרים שליליים", "כי 0 תמיד הכי קטן", "כי lst[0] הוא המקסימום", "אין סיבה"],
        correctIndex: 0,
        explanation: "אם כל המספרים שליליים (למשל [-5,-3,-1]), אתחול ל-0 יתן תוצאה שגויה."
      }
    ],
  },
  {
    id: "t9",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    s = str(n)
    return s == s[::-1]

print(mystery(12321))`,
    correctAnswer: "True",
    explanation: "ממירים ל-\"12321\". הפיכה: \"12321\". שווים → True. זוהי בדיקת פלינדרום.",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה הערך של str(12321)?",
        options: ['"12321" (מחרוזת)', "12321 (מספר)", "שגיאה", "[1,2,3,2,1]"],
        correctIndex: 0,
        explanation: "str() ממיר מספר למחרוזת. str(12321) = \"12321\"."
      },
      {
        question: 'מה הערך של "abc"[::-1]?',
        options: ['"cba"', '"abc"', '"bca"', "שגיאה"],
        correctIndex: 0,
        explanation: "[::-1] הופך את המחרוזת. \"abc\"[::-1] = \"cba\"."
      }
    ],
  },
  {
    id: "t10",
    type: "tracing",
    topic: "tracing",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `x = [1, 2, 3]
y = x
y.append(4)
print(x)`,
    correctAnswer: "[1, 2, 3, 4]",
    explanation: "y = x לא יוצר עותק, אלא הפניה לאותה רשימה. לכן שינוי ב-y משפיע גם על x.",
    examSource: "מבחן 6",
  },
  {
    id: "t11",
    type: "tracing",
    topic: "tracing",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(a, b):
    if b == 0:
        return a
    return mystery(b, a % b)

print(mystery(12, 8))`,
    correctAnswer: "4",
    explanation: "זהו אלגוריתם GCD (מחלק משותף מקסימלי). mystery(12,8)→mystery(8,4)→mystery(4,0)→4.",
    examSource: "מבחן 7",
    warmupQuestions: [
      {
        question: "מה הערך של 12 % 8?",
        options: ["4", "1", "0", "8"],
        correctIndex: 0,
        explanation: "12 = 1*8 + 4, לכן השארית היא 4."
      },
      {
        question: "מה קורה כשפונקציה קוראת לעצמה?",
        options: ["רקורסיה - הפונקציה רצה שוב עם פרמטרים חדשים", "שגיאה", "הפונקציה נעצרת", "לולאה אינסופית תמיד"],
        correctIndex: 0,
        explanation: "זו רקורסיה. הפונקציה קוראת לעצמה עם ערכים חדשים עד שמגיעה לתנאי עצירה."
      },
      {
        question: "ברקורסיה mystery(b, a%b), מה תנאי העצירה?",
        options: ["b == 0", "a == 0", "a == b", "a > b"],
        correctIndex: 0,
        explanation: "כש-b מגיע ל-0, הפונקציה מחזירה a (זה הבסיס של הרקורסיה)."
      }
    ],
  },
  {
    id: "t12",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `s = "Python"
print(s[1:4])
print(s[::-1])`,
    correctAnswer: "yth\nnohtyP",
    explanation: "s[1:4] = \"yth\" (אינדקסים 1,2,3). s[::-1] = \"nohtyP\" (היפוך המחרוזת).",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: 'מה הערך של "Python"[1]?',
        options: ['"y"', '"P"', '"t"', '"Py"'],
        correctIndex: 0,
        explanation: "אינדקסים מתחילים מ-0: P=0, y=1. לכן \"Python\"[1] = 'y'."
      },
      {
        question: "מה עושה s[1:4] על מחרוזת?",
        options: ["מחזיר תווים מאינדקס 1 עד 3 (לא כולל 4)", "מחזיר תווים מאינדקס 1 עד 4", "מחזיר 4 תווים", "שגיאה"],
        correctIndex: 0,
        explanation: "slicing מחזיר תווים מהתחלה (כולל) עד סוף (לא כולל). s[1:4] = תווים 1,2,3."
      }
    ],
  },

  // === MORE CONDITIONS ===
  {
    id: "c6",
    type: "quiz",
    topic: "conditions",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def classify(n):
    if n > 0 and n % 2 == 0:
        return "חיובי זוגי"
    elif n > 0:
        return "חיובי אי-זוגי"
    elif n < 0:
        return "שלילי"
    return "אפס"

print(classify(0))`,
    options: ["חיובי זוגי", "שלילי", "אפס", "None"],
    correctIndex: 2,
    explanation: "0 לא עובר אף תנאי (לא > 0, לא < 0), לכן מגיעים ל-return \"אפס\".",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: "מה הערך של 0 > 0?",
        options: ["False", "True", "0", "שגיאה"],
        correctIndex: 0,
        explanation: "0 לא גדול מ-0, לכן התוצאה False."
      },
      {
        question: "מה הערך של 0 < 0?",
        options: ["False", "True", "0", "שגיאה"],
        correctIndex: 0,
        explanation: "0 לא קטן מ-0, לכן גם תנאי זה False."
      }
    ],
  },
  {
    id: "c7",
    type: "quiz",
    topic: "conditions",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def tax(income):
    if income <= 5000:
        return income * 0.1
    elif income <= 10000:
        return 500 + (income - 5000) * 0.2
    else:
        return 1500 + (income - 10000) * 0.3

print(tax(8000))`,
    options: ["800", "1100", "1600", "2400"],
    correctIndex: 1,
    explanation: "8000 נופל בטווח 5001-10000. מס = 500 + (8000-5000)*0.2 = 500 + 600 = 1100.",
    examSource: "מבחן 6",
    warmupQuestions: [
      {
        question: "אם ההכנסה היא 3000, באיזה טווח היא נופלת?",
        options: ["עד 5000", "5001-10000", "מעל 10000", "אף אחד"],
        correctIndex: 0,
        explanation: "3000 <= 5000, לכן נכנסים לתנאי הראשון."
      },
      {
        question: "מה הערך של 500 + (8000-5000) * 0.2?",
        options: ["1100", "1600", "800", "1500"],
        correctIndex: 0,
        explanation: "(8000-5000) = 3000. 3000 * 0.2 = 600. 500 + 600 = 1100."
      }
    ],
  },
  {
    id: "c8",
    type: "tracing",
    topic: "conditions",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `a = 10
b = 20
c = 15
print(max(a, b, c) - min(a, b, c))`,
    correctAnswer: "10",
    explanation: "max(10,20,15) = 20. min(10,20,15) = 10. 20 - 10 = 10.",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה עושה max(10, 20, 15)?",
        options: ["20", "10", "15", "45"],
        correctIndex: 0,
        explanation: "max מחזיר את הערך הגדול ביותר מבין הנתונים. 20 הוא הגדול."
      },
      {
        question: "מה עושה min(10, 20, 15)?",
        options: ["10", "15", "20", "0"],
        correctIndex: 0,
        explanation: "min מחזיר את הערך הקטן ביותר. 10 הוא הקטן."
      }
    ],
  },
  {
    id: "c9",
    type: "quiz",
    topic: "conditions",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `x = 15
y = 4
print(x // y, x % y, x / y)`,
    options: ["3 3 3.75", "3 3 3.0", "4 3 3.75", "3 3 3"],
    correctIndex: 0,
    explanation: "15//4 = 3 (חלוקה שלמה). 15%4 = 3 (שארית). 15/4 = 3.75 (חלוקה רגילה).",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה ההבדל בין / לבין //?",
        options: ["/ מחזיר עשרוני, // מחזיר שלם", "/ מחזיר שלם, // מחזיר עשרוני", "אין הבדל", "// זה חלוקה ואז כפל"],
        correctIndex: 0,
        explanation: "/ = חלוקה רגילה (15/4=3.75). // = חלוקה שלמה (15//4=3)."
      }
    ],
  },
  {
    id: "c10",
    type: "coding",
    topic: "conditions",
    difficulty: "medium",
    title: "חישוב הנחה לפי גיל",
    description: "כתבו פונקציה age_discount(age, price) שמחזירה את המחיר אחרי הנחה:\n- ילדים (עד 12): 50% הנחה\n- מבוגרים (60+): 30% הנחה\n- כל השאר: ללא הנחה",
    sampleInput: "age_discount(10, 100)",
    sampleOutput: "50.0",
    solution: `def age_discount(age, price):
    if age <= 12:
        return price * 0.5
    elif age >= 60:
        return price * 0.7
    return price`,
    solutionExplanation: "בודקים את הגיל: עד 12 → מחיר * 0.5 (חצי מחיר). מעל 60 → מחיר * 0.7 (30% הנחה). אחרת → מחיר מלא.",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: "ילד בן 10 — באיזה קטגוריה הוא נופל (עד 12, 60+, או אחר)?",
        options: ["עד 12 (ילד)", "60+ (מבוגר)", "אחר (ללא הנחה)", "לא ידוע"],
        correctIndex: 0,
        explanation: "10 <= 12, לכן הוא בקטגוריית ילדים ומקבל 50% הנחה."
      },
      {
        question: "אם price = 100 והנחה היא 50%, מה הערך של price * 0.5?",
        options: ["50.0", "100", "150", "0.5"],
        correctIndex: 0,
        explanation: "100 * 0.5 = 50.0. זה המחיר אחרי 50% הנחה."
      }
    ],
  },

  // === MORE LOOPS ===
  {
    id: "l6",
    type: "tracing",
    topic: "loops",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(mystery(5))`,
    correctAnswer: "120",
    explanation: "זהו חישוב עצרת (factorial). 1*1=1, 1*2=2, 2*3=6, 6*4=24, 24*5=120.",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה הערך של 1 * 2 * 3?",
        options: ["6", "5", "9", "3"],
        correctIndex: 0,
        explanation: "1 × 2 = 2, 2 × 3 = 6. זהו 3! (עצרת של 3)."
      },
      {
        question: "מה עושה result *= i כשresult=6 ו-i=4?",
        options: ["result = 24", "result = 10", "result = 4", "result = 6"],
        correctIndex: 0,
        explanation: "result *= i זהה ל-result = result * i = 6 * 4 = 24."
      },
      {
        question: "מה הערך של range(1, 6)?",
        options: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "1, 2, 3, 4, 5, 6", "0, 1, 2, 3, 4"],
        correctIndex: 0,
        explanation: "range(1, 6) מתחיל מ-1 ונגמר לפני 6: 1,2,3,4,5."
      }
    ],
  },
  {
    id: "l7",
    type: "coding",
    topic: "loops",
    difficulty: "medium",
    title: "הדפסת פירמידה הפוכה",
    description: "כתבו פונקציה reverse_pyramid(n) שמדפיסה פירמידה הפוכה של כוכביות.\nלדוגמה, עבור n=4:\n****\n***\n**\n*",
    sampleInput: "reverse_pyramid(4)",
    sampleOutput: "****\n***\n**\n*",
    solution: `def reverse_pyramid(n):
    for i in range(n, 0, -1):
        print("*" * i)`,
    solutionExplanation: "לולאה מ-n עד 1 (יורד). בכל שורה מדפיסים i כוכביות. 4, 3, 2, 1.",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה עושה range(n, 0, -1)?",
        options: ["יורד מ-n עד 1", "עולה מ-0 עד n", "יורד מ-n עד 0 (כולל)", "שגיאה"],
        correctIndex: 0,
        explanation: "range(n, 0, -1) מייצר n, n-1, ..., 1. נעצר לפני 0."
      }
    ],
  },
  {
    id: "l8",
    type: "quiz",
    topic: "loops",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `s = "hello"
count = 0
for c in s:
    if c in "aeiou":
        count += 1
print(count)`,
    options: ["1", "2", "3", "5"],
    correctIndex: 1,
    explanation: "סופרים תנועות ב-\"hello\": 'h'-לא, 'e'-כן, 'l'-לא, 'l'-לא, 'o'-כן. סה\"כ 2.",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: 'מה עושה c in "aeiou" כש-c = "e"?',
        options: ["True (כי e היא תנועה)", "False", '"e"', "שגיאה"],
        correctIndex: 0,
        explanation: "in בודק אם התו קיים במחרוזת. 'e' נמצא ב-\"aeiou\" → True."
      },
      {
        question: 'כמה תנועות יש במילה "hello"?',
        options: ["2 (e ו-o)", "1", "3", "0"],
        correctIndex: 0,
        explanation: "התנועות ב-\"hello\" הן 'e' (אינדקס 1) ו-'o' (אינדקס 4) — סה\"כ 2."
      }
    ],
  },
  {
    id: "l9",
    type: "tracing",
    topic: "loops",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(s):
    result = ""
    for i in range(len(s) - 1, -1, -1):
        result += s[i]
    return result

print(mystery("abc"))`,
    correctAnswer: "cba",
    explanation: "הלולאה רצה מהאינדקס האחרון (2) עד 0. s[2]='c', s[1]='b', s[0]='a' → \"cba\".",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: "עבור s = \"abc\", מה הערך של len(s) - 1?",
        options: ["2", "3", "1", "0"],
        correctIndex: 0,
        explanation: "len(\"abc\") = 3. 3 - 1 = 2, שהוא האינדקס האחרון."
      },
      {
        question: "מה הערך של range(2, -1, -1)?",
        options: ["2, 1, 0", "2, 1", "2, 1, 0, -1", "0, 1, 2"],
        correctIndex: 0,
        explanation: "range(2, -1, -1) יורד מ-2 ונעצר לפני -1: 2, 1, 0."
      }
    ],
  },
  {
    id: "l10",
    type: "coding",
    topic: "loops",
    difficulty: "hard",
    title: "משולש פסקל",
    description: "כתבו פונקציה pascal(n) שמדפיסה את n השורות הראשונות של משולש פסקל.\nכל מספר הוא סכום שני המספרים מעליו.\n\nלדוגמה, עבור n=4:\n1\n1 1\n1 2 1\n1 3 3 1",
    sampleInput: "pascal(4)",
    sampleOutput: "1\n1 1\n1 2 1\n1 3 3 1",
    solution: `def pascal(n):
    row = [1]
    for i in range(n):
        print(" ".join(str(x) for x in row))
        new_row = [1]
        for j in range(len(row) - 1):
            new_row.append(row[j] + row[j + 1])
        new_row.append(1)
        row = new_row`,
    solutionExplanation: "מתחילים מ-[1]. בכל איטרציה בונים שורה חדשה: מוסיפים 1, ואז סכום של כל זוג שכנים, ועוד 1.",
    examSource: "מבחן 7",
    warmupQuestions: [
      {
        question: "בשורה [1, 2, 1] של משולש פסקל, איך מחשבים את המספר 2?",
        options: ["1 + 1 (סכום שני שכנים מהשורה הקודמת)", "2 * 1", "1 + 0 + 1", "מספר השורה"],
        correctIndex: 0,
        explanation: "כל מספר במשולש פסקל הוא סכום שני המספרים מעליו בשורה הקודמת."
      },
      {
        question: "אם row = [1, 3, 3, 1], מה הערך של row[1] + row[2]?",
        options: ["6", "4", "3", "7"],
        correctIndex: 0,
        explanation: "row[1] = 3, row[2] = 3. 3 + 3 = 6. זה יהיה ערך בשורה הבאה."
      },
      {
        question: "למה כל שורה במשולש פסקל מתחילה ונגמרת ב-1?",
        options: ["כי אין שני שכנים מעל הקצוות", "כי 1 הוא ראשוני", "כי זה חוק מתמטי שרירותי", "כי הרשימה ריקה"],
        correctIndex: 0,
        explanation: "בקצוות אין שני שכנים לחבר, לכן שמים 1 כברירת מחדל."
      }
    ],
  },
  {
    id: "l11",
    type: "quiz",
    topic: "loops",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `result = ""
for i in range(5):
    if i % 2 == 0:
        result += str(i)
print(result)`,
    options: ["024", "0123", "1234", "13"],
    correctIndex: 0,
    explanation: "i רץ מ-0 עד 4. רק זוגיים מתווספים: 0, 2, 4 → \"024\".",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה הערך של 0 % 2?",
        options: ["0 (זוגי)", "1 (אי-זוגי)", "2", "שגיאה"],
        correctIndex: 0,
        explanation: "0 % 2 = 0, לכן 0 הוא מספר זוגי."
      },
      {
        question: "מה עושה str(4)?",
        options: ['"4" (מחרוזת)', "4 (מספר)", "שגיאה", "None"],
        correctIndex: 0,
        explanation: "str() ממיר מספר למחרוזת. str(4) = \"4\"."
      }
    ],
  },

  // === MORE LISTS ===
  {
    id: "li6",
    type: "quiz",
    topic: "lists",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `lst = [1, 2, 3, 4, 5]
new_lst = [x ** 2 for x in lst if x % 2 != 0]
print(new_lst)`,
    options: ["[1, 4, 9, 16, 25]", "[1, 9, 25]", "[4, 16]", "[1, 3, 5]"],
    correctIndex: 1,
    explanation: "List comprehension: רק אי-זוגיים (1,3,5) בריבוע: 1²=1, 3²=9, 5²=25 → [1, 9, 25].",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: "מה הערך של 3 ** 2?",
        options: ["9", "6", "8", "3"],
        correctIndex: 0,
        explanation: "** הוא אופרטור חזקה. 3 ** 2 = 3² = 9."
      },
      {
        question: "מה עושה [x for x in [1,2,3] if x > 1]?",
        options: ["[2, 3]", "[1, 2, 3]", "[1]", "שגיאה"],
        correctIndex: 0,
        explanation: "list comprehension עם תנאי: רק איברים שעומדים בתנאי x > 1 נכללים."
      }
    ],
  },
  {
    id: "li7",
    type: "coding",
    topic: "lists",
    difficulty: "medium",
    title: "מיזוג רשימות ממוינות",
    description: "כתבו פונקציה merge_sorted(lst1, lst2) שמקבלת שתי רשימות ממוינות ומחזירה רשימה ממוינת אחת שמכילה את כל האיברים משתיהן.",
    sampleInput: "merge_sorted([1, 3, 5], [2, 4, 6])",
    sampleOutput: "[1, 2, 3, 4, 5, 6]",
    solution: `def merge_sorted(lst1, lst2):
    result = []
    i, j = 0, 0
    while i < len(lst1) and j < len(lst2):
        if lst1[i] <= lst2[j]:
            result.append(lst1[i])
            i += 1
        else:
            result.append(lst2[j])
            j += 1
    result += lst1[i:]
    result += lst2[j:]
    return result`,
    solutionExplanation: "שני מצביעים - אחד לכל רשימה. בכל שלב מוסיפים את הקטן מבין השניים. בסוף מוסיפים את השאריות.",
    examSource: "מבחן 6",
    warmupQuestions: [
      {
        question: "אם lst1 = [1, 3] ו-lst2 = [2, 4], מי הקטן: lst1[0] או lst2[0]?",
        options: ["lst1[0] = 1 (הקטן)", "lst2[0] = 2 (הקטן)", "שניהם שווים", "לא ניתן לדעת"],
        correctIndex: 0,
        explanation: "1 < 2, לכן lst1[0] קטן יותר ויוכנס ראשון לתוצאה."
      },
      {
        question: "מה עושה lst1[i:] כש-i=2 ו-lst1 = [1, 3, 5]?",
        options: ["[5]", "[3, 5]", "[1, 3]", "[]"],
        correctIndex: 0,
        explanation: "lst1[2:] מחזיר את כל האיברים מאינדקס 2 ואילך: [5]."
      }
    ],
  },
  {
    id: "li8",
    type: "tracing",
    topic: "lists",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `lst = [3, 1, 4, 1, 5]
lst.sort()
print(lst)`,
    correctAnswer: "[1, 1, 3, 4, 5]",
    explanation: "sort() ממיין את הרשימה במקום בסדר עולה: [1, 1, 3, 4, 5].",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה ההבדל בין sort() ל-sorted()?",
        options: ["sort() משנה במקום, sorted() מחזירה רשימה חדשה", "אין הבדל", "sorted() משנה במקום", "sort() מחזירה רשימה חדשה"],
        correctIndex: 0,
        explanation: "sort() ממיינת את הרשימה המקורית (במקום). sorted() מחזירה עותק ממוין בלי לשנות את המקור."
      },
      {
        question: "מה הסדר של [3,1,4,1,5] אחרי מיון עולה?",
        options: ["[1, 1, 3, 4, 5]", "[5, 4, 3, 1, 1]", "[1, 3, 4, 5]", "[3, 1, 4, 1, 5]"],
        correctIndex: 0,
        explanation: "מיון עולה מסדר מקטן לגדול. שימו לב ש-1 מופיע פעמיים."
      }
    ],
  },
  {
    id: "li9",
    type: "quiz",
    topic: "lists",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    return [lst[i] for i in range(len(lst)) if lst[i] != lst[i-1] or i == 0]

print(mystery([1, 1, 2, 2, 3, 1, 1]))`,
    options: ["[1, 2, 3]", "[1, 2, 3, 1]", "[1, 1, 2, 2, 3, 1, 1]", "[2, 3, 1]"],
    correctIndex: 1,
    explanation: "הפונקציה מסירה כפילויות עוקבות בלבד. i=0→1(תמיד), 1==1 דלג, 2≠1→2, 2==2 דלג, 3≠2→3, 1≠3→1, 1==1 דלג → [1,2,3,1].",
    examSource: "מבחן 7",
    warmupQuestions: [
      {
        question: "ברשימה [1,1,2,2,3], מה הערך של lst[-1] כשנמצאים באינדקס i=0?",
        options: ["3 (האיבר האחרון ברשימה)", "1", "0", "שגיאה"],
        correctIndex: 0,
        explanation: "lst[-1] מחזיר את האיבר האחרון. עבור [1,1,2,2,3] זה 3."
      },
      {
        question: 'מה ההבדל בין "הסרת כפילויות" לבין "הסרת כפילויות עוקבות"?',
        options: ["עוקבות: רק כשאותו ערך חוזר ברצף", "אין הבדל", "כפילויות: רק ברצף", "עוקבות: מסיר הכל"],
        correctIndex: 0,
        explanation: "הסרת כפילויות עוקבות שומרת על ערכים שחוזרים במקומות שונים, כמו [1,2,1] → [1,2,1]."
      }
    ],
  },
  {
    id: "li10",
    type: "coding",
    topic: "lists",
    difficulty: "medium",
    title: "מציאת האיבר השני בגודלו",
    description: "כתבו פונקציה second_max(lst) שמקבלת רשימת מספרים ומחזירה את המספר השני בגודלו (לא בהכרח שונה מהמקסימום).",
    sampleInput: "second_max([5, 3, 8, 1, 9, 7])",
    sampleOutput: "8",
    solution: `def second_max(lst):
    sorted_lst = sorted(lst, reverse=True)
    return sorted_lst[1]`,
    solutionExplanation: "ממיינים בסדר יורד ומחזירים את האיבר השני. [9,8,7,5,3,1] → 8.",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה עושה sorted([5,3,8], reverse=True)?",
        options: ["[8, 5, 3]", "[3, 5, 8]", "[5, 3, 8]", "שגיאה"],
        correctIndex: 0,
        explanation: "sorted עם reverse=True ממיין בסדר יורד: 8, 5, 3."
      },
      {
        question: "ברשימה ממוינת בסדר יורד, באיזה אינדקס נמצא האיבר השני בגודלו?",
        options: ["אינדקס 1", "אינדקס 0", "אינדקס 2", "האחרון"],
        correctIndex: 0,
        explanation: "אינדקס 0 = הגדול ביותר, אינדקס 1 = השני בגודלו."
      }
    ],
  },
  {
    id: "li11",
    type: "tracing",
    topic: "lists",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `a = [1, 2, 3]
b = a[:]
b.append(4)
print(a, b)`,
    correctAnswer: "[1, 2, 3] [1, 2, 3, 4]",
    explanation: "a[:] יוצר עותק חדש של הרשימה. לכן שינוי ב-b לא משפיע על a. שונה מ-b = a!",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: "מה ההבדל בין b = a לבין b = a[:] כשa הוא רשימה?",
        options: ["a[:] יוצר עותק חדש, a רק מפנה", "אין הבדל", "a[:] מוחק את a", "a מייצר עותק, a[:] מפנה"],
        correctIndex: 0,
        explanation: "b = a → שניהם מצביעים לאותה רשימה. b = a[:] → b הוא עותק עצמאי."
      }
    ],
  },

  // === MORE MATH ===
  {
    id: "m6",
    type: "coding",
    topic: "math",
    difficulty: "medium",
    title: "בדיקת מספר משוכלל",
    description: "כתבו פונקציה is_perfect(n) שבודקת אם n הוא מספר משוכלל. מספר משוכלל הוא מספר שסכום מחלקיו (לא כולל עצמו) שווה לו.\n\nלדוגמה: 6 = 1+2+3, 28 = 1+2+4+7+14",
    sampleInput: "is_perfect(6)",
    sampleOutput: "True",
    solution: `def is_perfect(n):
    if n < 2:
        return False
    total = 0
    for i in range(1, n):
        if n % i == 0:
            total += i
    return total == n`,
    solutionExplanation: "מחשבים סכום כל המחלקים מ-1 עד n-1. עבור 6: 1+2+3=6=n → True.",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: "מה זה מחלק של מספר?",
        options: ["מספר שמחלק אותו ללא שארית", "מספר גדול ממנו", "מספר ראשוני", "מספר זוגי"],
        correctIndex: 0,
        explanation: "מחלק של n הוא מספר i כך ש-n % i == 0. למשל, 3 הוא מחלק של 6."
      },
      {
        question: "מהם כל המחלקים של 6 (לא כולל 6 עצמו)?",
        options: ["1, 2, 3", "2, 3", "1, 6", "1, 2, 3, 6"],
        correctIndex: 0,
        explanation: "6 % 1 = 0, 6 % 2 = 0, 6 % 3 = 0. המחלקים (בלי 6) הם 1, 2, 3."
      }
    ],
  },
  {
    id: "m7",
    type: "tracing",
    topic: "math",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    count = 0
    while n > 0:
        count += 1
        n //= 10
    return count

print(mystery(9876))`,
    correctAnswer: "4",
    explanation: "סופרים ספרות: 9876→987→98→9→0. כל פעם מחלקים ב-10 וסופרים. 4 ספרות.",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה הערך של 9876 // 10?",
        options: ["987", "988", "9876", "98"],
        correctIndex: 0,
        explanation: "// 10 מסיר את הספרה האחרונה. 9876 // 10 = 987."
      },
      {
        question: "כמה פעמים אפשר לחלק 100 ב-10 עד שמגיעים ל-0?",
        options: ["3 פעמים (100→10→1→0)", "2 פעמים", "4 פעמים", "אינסוף"],
        correctIndex: 0,
        explanation: "100//10=10, 10//10=1, 1//10=0. סה\"כ 3 חלוקות = 3 ספרות."
      }
    ],
  },
  {
    id: "m8",
    type: "quiz",
    topic: "math",
    difficulty: "hard",
    question: "מה תחזיר הפונקציה עבור הקריאה collatz(6)?",
    code: `def collatz(n):
    count = 0
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        count += 1
    return count`,
    options: ["6", "8", "9", "7"],
    correctIndex: 1,
    explanation: "6→3→10→5→16→8→4→2→1. סה\"כ 8 צעדים. זוהי השערת קולאץ.",
    examSource: "מבחן 7",
    warmupQuestions: [
      {
        question: "אם n = 6 ו-n % 2 == 0, מה נעשה לפי הכלל?",
        options: ["n = 6 // 2 = 3", "n = 3 * 6 + 1 = 19", "n = 6 - 1 = 5", "עוצרים"],
        correctIndex: 0,
        explanation: "6 זוגי (6%2==0), לכן n = 6 // 2 = 3."
      },
      {
        question: "אם n = 3 ו-n % 2 != 0, מה נעשה?",
        options: ["n = 3 * 3 + 1 = 10", "n = 3 // 2 = 1", "n = 3 - 1 = 2", "עוצרים"],
        correctIndex: 0,
        explanation: "3 אי-זוגי, לכן n = 3 * 3 + 1 = 10."
      },
      {
        question: "מתי הלולאה while n != 1 נעצרת?",
        options: ["כש-n מגיע ל-1", "כש-n מגיע ל-0", "אחרי 10 איטרציות", "כש-n זוגי"],
        correctIndex: 0,
        explanation: "הלולאה נעצרת כש-n == 1. זה תנאי העצירה."
      }
    ],
  },
  {
    id: "m9",
    type: "coding",
    topic: "math",
    difficulty: "easy",
    title: "חישוב חזקה",
    description: "כתבו פונקציה power(base, exp) שמחשבת base בחזקת exp בלי להשתמש באופרטור **.",
    sampleInput: "power(2, 5)",
    sampleOutput: "32",
    solution: `def power(base, exp):
    result = 1
    for i in range(exp):
        result *= base
    return result`,
    solutionExplanation: "מכפילים את base בעצמו exp פעמים. 2*2=4, 4*2=8, 8*2=16, 16*2=32.",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה עושה result *= base כש-result=4 ו-base=2?",
        options: ["result = 8 (כי 4×2)", "result = 6", "result = 2", "שגיאה"],
        correctIndex: 0,
        explanation: "result *= base זהה ל-result = result * base = 4 * 2 = 8."
      },
      {
        question: "למה מאתחלים result = 1 ולא result = 0?",
        options: ["כי כפל ב-0 תמיד נותן 0", "כי 1 הוא בסיס", "אין סיבה", "כי 0 גורם שגיאה"],
        correctIndex: 0,
        explanation: "1 הוא 'איבר ניטרלי' בכפל. אם נתחיל מ-0, כל כפל ייתן 0."
      }
    ],
  },
  {
    id: "m10",
    type: "tracing",
    topic: "math",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    if n <= 1:
        return n
    return mystery(n-1) + mystery(n-2)

print(mystery(7))`,
    correctAnswer: "13",
    explanation: "זוהי סדרת פיבונאצ'י רקורסיבית. F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13.",
    examSource: "מבחן 6",
    warmupQuestions: [
      {
        question: "מה הערך של mystery(0) אם mystery(n) מחזיר n כש-n <= 1?",
        options: ["0", "1", "שגיאה", "None"],
        correctIndex: 0,
        explanation: "n=0 <= 1, לכן מחזירים n = 0. זה תנאי הבסיס."
      },
      {
        question: "מה הערך של mystery(2) = mystery(1) + mystery(0)?",
        options: ["1 (כי 1 + 0)", "2", "0", "3"],
        correctIndex: 0,
        explanation: "mystery(1) = 1, mystery(0) = 0. 1 + 0 = 1."
      },
      {
        question: "מה הערך של mystery(4) = mystery(3) + mystery(2)?",
        options: ["3 (כי 2 + 1)", "4", "5", "2"],
        correctIndex: 0,
        explanation: "mystery(3)=2, mystery(2)=1. 2+1=3. סדרת פיבונאצ'י: 0,1,1,2,3,5,8,13..."
      }
    ],
  },
  {
    id: "m11",
    type: "quiz",
    topic: "math",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def reverse_num(n):
    result = 0
    while n > 0:
        result = result * 10 + n % 10
        n //= 10
    return result

print(reverse_num(1234))`,
    options: ["4321", "1234", "1", "432"],
    correctIndex: 0,
    explanation: "בכל שלב: result*10 + ספרה אחרונה. 0*10+4=4, 4*10+3=43, 43*10+2=432, 432*10+1=4321.",
    examSource: "מבחן 3",
    warmupQuestions: [
      {
        question: "מה הערך של 1234 % 10?",
        options: ["4", "123", "1", "1234"],
        correctIndex: 0,
        explanation: "% 10 מחזיר את הספרה האחרונה. 1234 % 10 = 4."
      },
      {
        question: "אם result = 4 ונרצה להוסיף 3 כספרה חדשה, מה הנוסחה?",
        options: ["result * 10 + 3 = 43", "result + 3 = 7", "result + 30 = 34", "3 * 10 + result = 34"],
        correctIndex: 0,
        explanation: "כפל ב-10 מזיז את הספרות שמאלה, ואז מוסיפים את הספרה החדשה: 4*10+3=43."
      }
    ],
  },

  // === EXTRA MIXED QUESTIONS ===
  {
    id: "t13",
    type: "tracing",
    topic: "tracing",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `a, b = 3, 5
a, b = b, a
print(a, b)`,
    correctAnswer: "5 3",
    explanation: "swap ב-Python: a,b = b,a מחליף בין הערכים. a הופך ל-5 ו-b הופך ל-3.",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה עושה a, b = b, a ב-Python?",
        options: ["מחליף בין הערכים של a ו-b", "מציב a בשניהם", "שגיאה", "מוחק את שניהם"],
        correctIndex: 0,
        explanation: "Python מחשבת את הצד הימני קודם (b, a) ואז מציבה — כך a ו-b מתחלפים."
      },
      {
        question: "אם a=3 ו-b=5, מה יהיו הערכים אחרי a, b = b, a?",
        options: ["a=5, b=3", "a=3, b=5", "a=5, b=5", "a=3, b=3"],
        correctIndex: 0,
        explanation: "a מקבל את הערך של b (5), ו-b מקבל את הערך הישן של a (3)."
      }
    ],
  },
  {
    id: "l12",
    type: "tracing",
    topic: "loops",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `total = 0
for i in range(1, 6):
    total += i
print(total)`,
    correctAnswer: "15",
    explanation: "סכום 1+2+3+4+5 = 15.",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה הערך של range(1, 6)?",
        options: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "1, 2, 3, 4, 5, 6", "0, 1, 2, 3, 4"],
        correctIndex: 0,
        explanation: "range(1, 6) מתחיל מ-1 ונגמר לפני 6: 1,2,3,4,5."
      },
      {
        question: "מה עושה total += i כש-total=3 ו-i=4?",
        options: ["total = 7", "total = 4", "total = 12", "total = 3"],
        correctIndex: 0,
        explanation: "total += i זהה ל-total = total + i = 3 + 4 = 7."
      }
    ],
  },
  {
    id: "li12",
    type: "quiz",
    topic: "lists",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `lst = ["a", "b", "c"]
print(len(lst), lst[-1])`,
    options: ["3 c", "3 b", "2 c", "3 a"],
    correctIndex: 0,
    explanation: "len(lst) = 3 (שלושה איברים). lst[-1] = \"c\" (האיבר האחרון).",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה עושה lst[-1]?",
        options: ["מחזיר את האיבר האחרון ברשימה", "מחזיר -1", "שגיאה", "מוחק את האחרון"],
        correctIndex: 0,
        explanation: "אינדקס שלילי סופר מהסוף. lst[-1] = האיבר האחרון."
      },
      {
        question: 'מה הערך של len(["a", "b", "c"])?',
        options: ["3", "2", "abc", "1"],
        correctIndex: 0,
        explanation: "len מחזיר את מספר האיברים ברשימה. 3 איברים → 3."
      }
    ],
  },
  {
    id: "c11",
    type: "tracing",
    topic: "conditions",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `x = True
y = False
print(x and y, x or y, not x)`,
    correctAnswer: "False True False",
    explanation: "True and False = False. True or False = True. not True = False.",
    examSource: "מבחן 2",
    warmupQuestions: [
      {
        question: "מה עושה and?",
        options: ["מחזיר True רק אם שני הצדדים True", "מחזיר True אם צד אחד True", "הופך True ל-False", "שגיאה"],
        correctIndex: 0,
        explanation: "and דורש ששני הצדדים יהיו True. True and False = False."
      },
      {
        question: "מה עושה not True?",
        options: ["False", "True", "None", "שגיאה"],
        correctIndex: 0,
        explanation: "not הופך את הערך הלוגי. not True = False."
      }
    ],
  },
  {
    id: "m12",
    type: "coding",
    topic: "math",
    difficulty: "medium",
    title: "סכום ספרות",
    description: "כתבו פונקציה digit_sum(n) שמקבלת מספר שלם חיובי ומחזירה את סכום ספרותיו. ממשו בלי להמיר למחרוזת.",
    sampleInput: "digit_sum(1234)",
    sampleOutput: "10",
    solution: `def digit_sum(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total`,
    solutionExplanation: "בכל שלב: מוציאים ספרה אחרונה (n%10) ומוסיפים לסכום. 4+3+2+1 = 10.",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: "מה הערך של 1234 % 10?",
        options: ["4 (הספרה האחרונה)", "123", "1", "0"],
        correctIndex: 0,
        explanation: "% 10 מחלץ את הספרה האחרונה. 1234 % 10 = 4."
      },
      {
        question: "אחרי n //= 10 כש-n=1234, מה הערך החדש של n?",
        options: ["123", "1234", "12", "4"],
        correctIndex: 0,
        explanation: "n //= 10 מסיר את הספרה האחרונה. 1234 // 10 = 123."
      }
    ],
  },
  {
    id: "t14",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `d = {"a": 1, "b": 2, "c": 3}
for key in d:
    print(key, d[key])`,
    correctAnswer: "a 1\nb 2\nc 3",
    explanation: "עוברים על מפתחות המילון ומדפיסים כל מפתח עם הערך שלו.",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: 'איך ניגשים לערך של מפתח "b" במילון d = {"a": 1, "b": 2}?',
        options: ['d["b"] → 2', "d[1] → 2", 'd.get[b]', "d[b]"],
        correctIndex: 0,
        explanation: 'ניגשים לערך במילון באמצעות המפתח: d["b"] = 2.'
      },
      {
        question: "כשעוברים על מילון עם for key in d, מה מקבלים?",
        options: ["את המפתחות", "את הערכים", "זוגות (מפתח, ערך)", "את האינדקסים"],
        correctIndex: 0,
        explanation: "for key in d עובר על המפתחות בלבד. כדי לקבל ערכים משתמשים ב-d[key]."
      }
    ],
  },
  {
    id: "li13",
    type: "coding",
    topic: "lists",
    difficulty: "easy",
    title: "סכום איברים ברשימה",
    description: "כתבו פונקציה my_sum(lst) שמקבלת רשימת מספרים ומחזירה את סכומם, בלי להשתמש ב-sum().",
    sampleInput: "my_sum([1, 2, 3, 4, 5])",
    sampleOutput: "15",
    solution: `def my_sum(lst):
    total = 0
    for x in lst:
        total += x
    return total`,
    solutionExplanation: "עוברים על כל איבר ברשימה ומצטברים. 0+1+2+3+4+5 = 15.",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה עושה total += x כש-total=6 ו-x=4?",
        options: ["total = 10", "total = 4", "total = 6", "total = 24"],
        correctIndex: 0,
        explanation: "total += x מוסיף את x ל-total. 6 + 4 = 10."
      },
      {
        question: "מה הערך ההתחלתי של total כדי לחשב סכום?",
        options: ["0", "1", "הערך הראשון ברשימה", "None"],
        correctIndex: 0,
        explanation: "סכום מתחיל מ-0 כי 0 הוא איבר ניטרלי בחיבור (לא משפיע)."
      }
    ],
  },

  // ==========================================
  // EXAM QUESTIONS - Batch 3 (24 שאלות מבחן מדויקות)
  // ==========================================

  // --- TRACING EXAM ---
  {
    id: "t15",
    type: "tracing",
    topic: "tracing",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    for i in range(len(lst) // 2):
        lst[i], lst[len(lst)-1-i] = lst[len(lst)-1-i], lst[i]
    return lst

print(mystery([1, 2, 3, 4, 5]))`,
    correctAnswer: "[5, 4, 3, 2, 1]",
    explanation: "הפונקציה הופכת רשימה. מחליפה i=0↔4: [5,2,3,4,1], i=1↔3: [5,4,3,2,1]. len//2=2 איטרציות.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של len([1,2,3,4,5]) // 2?",
        options: ["2", "3", "2.5", "5"],
        correctIndex: 0,
        explanation: "len = 5. 5 // 2 = 2 (חלוקה שלמה). הלולאה תרוץ פעמיים (i=0, i=1)."
      },
      {
        question: "ברשימה בגודל 5, מה הערך של len(lst)-1-i כש-i=0?",
        options: ["4 (האינדקס האחרון)", "5", "3", "0"],
        correctIndex: 0,
        explanation: "5-1-0 = 4. זה האינדקס של האיבר האחרון ברשימה."
      },
      {
        question: "מה עושה a, b = b, a?",
        options: ["מחליף בין a ל-b", "מעתיק a ל-b", "מוחק את שניהם", "שגיאה"],
        correctIndex: 0,
        explanation: "Python מאפשרת החלפת ערכים בשורה אחת: a מקבל את b ולהיפך."
      }
    ],
  },
  {
    id: "t16",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(s):
    count = {}
    for c in s:
        if c in count:
            count[c] += 1
        else:
            count[c] = 1
    return count

print(mystery("abba"))`,
    correctAnswer: "{'a': 2, 'b': 2}",
    explanation: "בונים מילון ספירה: a→1, b→1, b→2, a→2. התוצאה: {'a': 2, 'b': 2}.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מה עושה count[c] = 1?",
        options: ["יוצר מפתח חדש c עם ערך 1", "משנה את c ל-1", "שגיאה אם c לא קיים", "מוחק את c"],
        correctIndex: 0,
        explanation: "אם המפתח לא קיים, שורה זו יוצרת אותו עם ערך התחלתי 1."
      },
      {
        question: "מה הערך של 'b' in {'a': 1, 'b': 2}?",
        options: ["True", "False", "2", "שגיאה"],
        correctIndex: 0,
        explanation: "in בודק אם המפתח קיים במילון. 'b' קיים → True."
      }
    ],
  },
  {
    id: "t17",
    type: "tracing",
    topic: "tracing",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    if n < 10:
        return n
    return n % 10 + mystery(n // 10)

print(mystery(4567))`,
    correctAnswer: "22",
    explanation: "רקורסיה לסכום ספרות: mystery(4567) = 7 + mystery(456) = 7 + 6 + mystery(45) = 7+6+5+mystery(4) = 7+6+5+4 = 22.",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של 4567 % 10?",
        options: ["7", "456", "4", "67"],
        correctIndex: 0,
        explanation: "% 10 מחלץ את הספרה האחרונה: 4567 % 10 = 7."
      },
      {
        question: "מה הערך של 4567 // 10?",
        options: ["456", "457", "7", "4567"],
        correctIndex: 0,
        explanation: "// 10 מסיר את הספרה האחרונה: 4567 // 10 = 456."
      },
      {
        question: "מתי הרקורסיה נעצרת בפונקציה הזו?",
        options: ["כש-n < 10 (ספרה בודדת)", "כש-n == 0", "כש-n == 1", "אף פעם"],
        correctIndex: 0,
        explanation: "תנאי העצירה: n < 10, כלומר כשנשארה ספרה אחת בלבד."
      }
    ],
  },
  {
    id: "t18",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(s):
    result = ""
    for i in range(len(s)):
        if s[i] != s[len(s)-1-i]:
            result += s[i]
    return result

print(mystery("abcba"))`,
    correctAnswer: "",
    explanation: "בודקים כל תו מול המראה שלו: a==a, b==b, c==c, b==b, a==a. אף תו לא שונה מהמראה → מחרוזת ריקה.",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: 'עבור s = "abcba", מה הערך של s[0] ו-s[4]?',
        options: ['שניהם "a"', '"a" ו-"b"', '"b" ו-"a"', '"a" ו-"c"'],
        correctIndex: 0,
        explanation: 's[0] = "a" ו-s[4] = "a". הם שווים כי המחרוזת היא פלינדרום.'
      },
      {
        question: "מה מחזירה הפונקציה כשהמחרוזת היא פלינדרום (סימטרית)?",
        options: ['מחרוזת ריקה ""', "את המחרוזת עצמה", "True", "None"],
        correctIndex: 0,
        explanation: 'בפלינדרום כל תו שווה למראה שלו, לכן אף תו לא מתווסף → "".'
      }
    ],
  },
  {
    id: "t19",
    type: "tracing",
    topic: "tracing",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    n = len(lst)
    for i in range(n):
        for j in range(0, n-i-1):
            if lst[j] > lst[j+1]:
                lst[j], lst[j+1] = lst[j+1], lst[j]
    return lst

print(mystery([64, 25, 12, 22, 11]))`,
    correctAnswer: "[11, 12, 22, 25, 64]",
    explanation: "זהו Bubble Sort. בכל סיבוב האיבר הגדול ביותר 'צף' למקומו. אחרי כל הסיבובים הרשימה ממוינת.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "ב-Bubble Sort, מה קורה כש-lst[j] > lst[j+1]?",
        options: ["מחליפים ביניהם", "מוחקים את lst[j]", "ממשיכים בלי שינוי", "שגיאה"],
        correctIndex: 0,
        explanation: "אם האיבר הנוכחי גדול מהבא, מחליפים ביניהם כדי 'להציף' את הגדול ימינה."
      },
      {
        question: "למה הלולאה הפנימית רצה עד n-i-1?",
        options: ["כי אחרי כל סיבוב האיבר הגדול כבר במקומו", "כדי למנוע שגיאת אינדקס בלבד", "כי i תמיד 0", "אין סיבה מיוחדת"],
        correctIndex: 0,
        explanation: "אחרי סיבוב i, ה-i איברים האחרונים כבר ממוינים ולא צריך לבדוק אותם."
      },
      {
        question: "אחרי סיבוב ראשון (i=0) על [64,25,12,22,11], מה האיבר האחרון?",
        options: ["64 (הגדול ביותר צף לסוף)", "11", "25", "22"],
        correctIndex: 0,
        explanation: "בסיבוב הראשון, 64 מוחלף עם כל אחד שקטן ממנו עד שמגיע לסוף."
      }
    ],
  },
  {
    id: "t20",
    type: "tracing",
    topic: "tracing",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    even = []
    odd = []
    for x in lst:
        if x % 2 == 0:
            even.append(x)
        else:
            odd.append(x)
    return even + odd

print(mystery([3, 8, 1, 4, 7, 2]))`,
    correctAnswer: "[8, 4, 2, 3, 1, 7]",
    explanation: "מפרידים לזוגיים [8,4,2] ואי-זוגיים [3,1,7], ואז מחברים: [8,4,2,3,1,7].",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "מה עושה even + odd כש-even=[8,4] ו-odd=[3,1]?",
        options: ["[8, 4, 3, 1]", "[3, 1, 8, 4]", "[11, 5]", "שגיאה"],
        correctIndex: 0,
        explanation: "חיבור רשימות (concatenation) שם את הראשונה לפני השנייה."
      },
      {
        question: "מה הערך של 8 % 2?",
        options: ["0 (זוגי)", "1 (אי-זוגי)", "4", "8"],
        correctIndex: 0,
        explanation: "8 מתחלק ב-2 בדיוק, לכן 8 % 2 = 0 — מספר זוגי."
      }
    ],
  },

  // --- CONDITIONS EXAM ---
  {
    id: "c12",
    type: "quiz",
    topic: "conditions",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def classify_triangle(a, b, c):
    if a + b <= c or a + c <= b or b + c <= a:
        return "לא משולש"
    if a == b == c:
        return "שווה צלעות"
    if a == b or b == c or a == c:
        return "שווה שוקיים"
    return "שונה צלעות"

print(classify_triangle(5, 5, 8))`,
    options: ["שווה צלעות", "שווה שוקיים", "שונה צלעות", "לא משולש"],
    correctIndex: 1,
    explanation: "5+5>8, 5+8>5, 5+8>5 → משולש. a≠b≠c? לא (5==5). a==b? כן → שווה שוקיים.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מתי שלושה צלעות לא יכולים ליצור משולש?",
        options: ["כשצלע אחת גדולה או שווה לסכום השתיים", "כשכולם שווים", "כשיש צלע שלילית", "תמיד אפשר"],
        correctIndex: 0,
        explanation: "אי-שוויון המשולש: סכום כל שתי צלעות חייב להיות גדול מהשלישית."
      },
      {
        question: "מה הערך של 5 == 5 == 8?",
        options: ["False (כי 5 != 8)", "True", "שגיאה", "5"],
        correctIndex: 0,
        explanation: "Python בודק 5==5 (True) ואז 5==8 (False). True and False = False."
      }
    ],
  },
  {
    id: "c13",
    type: "tracing",
    topic: "conditions",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(a, b, c):
    if a > b:
        a, b = b, a
    if b > c:
        b, c = c, b
    if a > b:
        a, b = b, a
    return a, b, c

print(mystery(3, 1, 2))`,
    correctAnswer: "(1, 2, 3)",
    explanation: "מיון 3 מספרים: 3>1→swap→(1,3,2). 3>2→swap→(1,2,3). 1>2? לא. תוצאה: (1,2,3).",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "אם a=3 ו-b=1, מה קורה אחרי a, b = b, a?",
        options: ["a=1, b=3", "a=3, b=1", "a=1, b=1", "שגיאה"],
        correctIndex: 0,
        explanation: "ההחלפה שמה את b (=1) ב-a ואת a (=3) ב-b."
      },
      {
        question: "כמה החלפות מספיקות כדי למיין 3 מספרים?",
        options: ["לכל היותר 3", "בדיוק 3", "1 בלבד", "תלוי בסדר"],
        correctIndex: 0,
        explanation: "עם 3 השוואות-והחלפות (a↔b, b↔c, a↔b שוב) ניתן למיין 3 מספרים."
      }
    ],
  },
  {
    id: "c14",
    type: "quiz",
    topic: "conditions",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def leap_year(year):
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    if year % 4 == 0:
        return True
    return False

print(leap_year(1900))`,
    options: ["True", "False", "None", "שגיאה"],
    correctIndex: 1,
    explanation: "1900 % 400 != 0. 1900 % 100 == 0 → False. שנה שמתחלקת ב-100 אבל לא ב-400 אינה מעוברת.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של 1900 % 400?",
        options: ["300", "0", "100", "1900"],
        correctIndex: 0,
        explanation: "1900 / 400 = 4 שארית 300. לכן 1900 % 400 = 300."
      },
      {
        question: "מה הערך של 1900 % 100?",
        options: ["0", "19", "100", "1"],
        correctIndex: 0,
        explanation: "1900 מתחלק ב-100 בדיוק (19*100), לכן 1900 % 100 = 0."
      }
    ],
  },

  // --- LOOPS EXAM ---
  {
    id: "l13",
    type: "tracing",
    topic: "loops",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    for i in range(1, n+1):
        line = ""
        for j in range(1, n+1):
            line += str(i * j) + "\\t"
        print(line.strip())

mystery(3)`,
    correctAnswer: "1\t2\t3\n2\t4\t6\n3\t6\t9",
    explanation: "זוהי לוח הכפל. שורה i מכילה i*1, i*2, ..., i*n. עבור n=3: 1,2,3 | 2,4,6 | 3,6,9.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "בלוח הכפל, מה הערך בשורה 2, עמודה 3?",
        options: ["6 (כי 2×3)", "5", "23", "8"],
        correctIndex: 0,
        explanation: "בלוח הכפל, הערך בשורה i עמודה j הוא i × j. 2 × 3 = 6."
      },
      {
        question: 'מה עושה "\\t" במחרוזת?',
        options: ["טאב (רווח גדול בין ערכים)", "ירידת שורה", "מוחק תו", "שגיאה"],
        correctIndex: 0,
        explanation: '"\\t" הוא תו טאב שמשמש ליצירת ריווח אחיד בין עמודות.'
      }
    ],
  },
  {
    id: "l14",
    type: "coding",
    topic: "loops",
    difficulty: "hard",
    title: "מספר ארמסטרונג",
    description: "כתבו פונקציה is_armstrong(n) שבודקת אם n הוא מספר ארמסטרונג.\nמספר ארמסטרונג הוא מספר שסכום ספרותיו בחזקת מספר הספרות שווה למספר עצמו.\n\nלדוגמה: 153 = 1³ + 5³ + 3³ = 1+125+27 = 153",
    sampleInput: "is_armstrong(153)",
    sampleOutput: "True",
    solution: `def is_armstrong(n):
    digits = str(n)
    power = len(digits)
    total = 0
    for d in digits:
        total += int(d) ** power
    return total == n`,
    solutionExplanation: "153 → 3 ספרות. 1³+5³+3³ = 1+125+27 = 153 = n → True.",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "כמה ספרות יש למספר 153?",
        options: ["3", "4", "2", "153"],
        correctIndex: 0,
        explanation: 'len(str(153)) = len("153") = 3 ספרות.'
      },
      {
        question: "מה הערך של 5 ** 3?",
        options: ["125", "15", "8", "243"],
        correctIndex: 0,
        explanation: "5 ** 3 = 5³ = 5 × 5 × 5 = 125."
      },
      {
        question: 'מה עושה int("5")?',
        options: ["ממיר את התו למספר 5", "שגיאה", "מחזיר 0", 'מחזיר "5"'],
        correctIndex: 0,
        explanation: 'int() ממיר מחרוזת למספר שלם. int("5") = 5.'
      }
    ],
  },
  {
    id: "l15",
    type: "quiz",
    topic: "loops",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(s):
    words = s.split()
    result = ""
    for w in words:
        result += w[0]
    return result

print(mystery("Hello World Python"))`,
    options: ["HWP", "Hello", "HWp", "hwp"],
    correctIndex: 0,
    explanation: 'מפרקים למילים ["Hello","World","Python"], לוקחים אות ראשונה מכל אחת: H+W+P = "HWP".',
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: 'מה עושה "Hello World".split()?',
        options: ['["Hello", "World"]', '"Hello World"', '["H","e","l","l","o"," ","W","o","r","l","d"]', "שגיאה"],
        correctIndex: 0,
        explanation: "split() מפרק מחרוזת למילים לפי רווחים."
      },
      {
        question: 'מה הערך של "Hello"[0]?',
        options: ['"H"', '"e"', '"Hello"', "0"],
        correctIndex: 0,
        explanation: "[0] מחזיר את התו הראשון. \"Hello\"[0] = 'H'."
      }
    ],
  },
  {
    id: "l16",
    type: "tracing",
    topic: "loops",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    result = []
    while n > 0:
        result.append(n % 2)
        n //= 2
    result.reverse()
    return result

print(mystery(13))`,
    correctAnswer: "[1, 1, 0, 1]",
    explanation: "המרה לבינארי: 13%2=1, 6%2=0, 3%2=1, 1%2=1. הפיכה: [1,1,0,1]. 13 בבינארי = 1101.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של 13 % 2?",
        options: ["1 (אי-זוגי)", "0 (זוגי)", "6", "13"],
        correctIndex: 0,
        explanation: "13 הוא אי-זוגי, לכן 13 % 2 = 1."
      },
      {
        question: "מה עושה .reverse() על רשימה [1, 0, 1, 1]?",
        options: ["הופכת ל-[1, 1, 0, 1]", "ממיינת", "מחזירה רשימה חדשה", "מוחקת"],
        correctIndex: 0,
        explanation: ".reverse() הופכת את הרשימה במקום: [1,0,1,1] → [1,1,0,1]."
      }
    ],
  },

  // --- LISTS EXAM ---
  {
    id: "li14",
    type: "tracing",
    topic: "lists",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    result = []
    for i in range(len(lst)):
        total = 0
        for j in range(i + 1):
            total += lst[j]
        result.append(total)
    return result

print(mystery([1, 2, 3, 4]))`,
    correctAnswer: "[1, 3, 6, 10]",
    explanation: "סכום מצטבר: [1], [1+2], [1+2+3], [1+2+3+4] = [1, 3, 6, 10].",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "כש-i=2, מה הערך של range(i + 1)?",
        options: ["range(3) → 0,1,2", "range(2) → 0,1", "range(3) → 1,2,3", "range(2) → 0,1,2"],
        correctIndex: 0,
        explanation: "range(2+1) = range(3) = 0,1,2. הלולאה הפנימית סוכמת 3 איברים."
      },
      {
        question: "מה הסכום של lst[0] + lst[1] + lst[2] כש-lst = [1,2,3,4]?",
        options: ["6", "3", "10", "7"],
        correctIndex: 0,
        explanation: "1 + 2 + 3 = 6. זה הסכום המצטבר עד אינדקס 2."
      }
    ],
  },
  {
    id: "li15",
    type: "quiz",
    topic: "lists",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    return list(zip(lst, lst[1:]))

print(mystery([1, 2, 3, 4]))`,
    options: ["[(1,2), (2,3), (3,4)]", "[(1,2), (3,4)]", "[(1,1), (2,2), (3,3)]", "[(2,3), (3,4), (4,5)]"],
    correctIndex: 0,
    explanation: "zip([1,2,3,4], [2,3,4]) יוצר זוגות עוקבים: (1,2), (2,3), (3,4).",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של [1,2,3,4][1:]?",
        options: ["[2, 3, 4]", "[1, 2, 3]", "[1]", "[2, 3, 4, 5]"],
        correctIndex: 0,
        explanation: "[1:] מחזיר את כל האיברים מאינדקס 1 ואילך: [2, 3, 4]."
      },
      {
        question: "מה עושה zip([1,2], [3,4])?",
        options: ["יוצר זוגות: (1,3), (2,4)", "מחבר: [1,2,3,4]", "כופל: [3,8]", "שגיאה"],
        correctIndex: 0,
        explanation: "zip מתאים איברים לפי מיקום: האיבר הראשון מכל רשימה ביחד, וכן הלאה."
      }
    ],
  },
  {
    id: "li16",
    type: "coding",
    topic: "lists",
    difficulty: "hard",
    title: "מיון הכנסה (Insertion Sort)",
    description: "כתבו פונקציה insertion_sort(lst) שממיינת רשימה באמצעות אלגוריתם מיון הכנסה.\n\nהאלגוריתם: עוברים על כל איבר ומכניסים אותו למיקום הנכון בחלק הממוין.",
    sampleInput: "insertion_sort([5, 2, 4, 6, 1, 3])",
    sampleOutput: "[1, 2, 3, 4, 5, 6]",
    solution: `def insertion_sort(lst):
    for i in range(1, len(lst)):
        key = lst[i]
        j = i - 1
        while j >= 0 and lst[j] > key:
            lst[j + 1] = lst[j]
            j -= 1
        lst[j + 1] = key
    return lst`,
    solutionExplanation: "כל איבר 'נכנס' למקומו הנכון בחלק הממוין. i=1: 2<5 → [2,5,4,6,1,3]. i=2: 4 בין 2 ל-5 → [2,4,5,6,1,3]. וכן הלאה.",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "במיון הכנסה, למה מתחילים מ-i=1 ולא מ-i=0?",
        options: ["כי איבר בודד כבר ממוין", "כי אינדקס 0 שמור", "כדי לחסוך זמן", "אין סיבה"],
        correctIndex: 0,
        explanation: "האיבר הראשון (i=0) נחשב 'ממוין' בפני עצמו. מתחילים מ-i=1 ומכניסים לחלק הממוין."
      },
      {
        question: "ברשימה [2,5,4,...], כדי להכניס 4 למקומו, מה צריך לעשות?",
        options: ["להזיז את 5 ימינה ולשים 4 במקומו", "למחוק את 5", "להחליף 2 ו-4", "לא לעשות כלום"],
        correctIndex: 0,
        explanation: "4 < 5, אז מזיזים 5 ימינה ומכניסים 4 לפניו: [2,4,5,...]."
      }
    ],
  },
  {
    id: "li17",
    type: "tracing",
    topic: "lists",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(lst):
    return [x for x in lst if lst.count(x) == 1]

print(mystery([1, 2, 3, 2, 4, 3, 5]))`,
    correctAnswer: "[1, 4, 5]",
    explanation: "מחזירה רק איברים שמופיעים פעם אחת בלבד. 1→1 פעם ✓, 2→2 פעמים ✗, 3→2 ✗, 4→1 ✓, 5→1 ✓.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של [1,2,3,2].count(2)?",
        options: ["2", "1", "3", "0"],
        correctIndex: 0,
        explanation: ".count(2) סופר כמה פעמים 2 מופיע ברשימה: פעמיים."
      },
      {
        question: "מה עושה [x for x in lst if condition]?",
        options: ["יוצר רשימה חדשה רק עם איברים שעומדים בתנאי", "מוחק איברים", "ממיין", "שגיאה"],
        correctIndex: 0,
        explanation: "list comprehension עם תנאי — סינון רשימה. רק איברים שהתנאי True עבורם נכללים."
      }
    ],
  },
  {
    id: "li18",
    type: "quiz",
    topic: "lists",
    difficulty: "easy",
    question: "מה ידפיס הקוד הבא?",
    code: `lst = [10, 20, 30, 40, 50]
print(lst[::2])`,
    options: ["[10, 30, 50]", "[20, 40]", "[10, 20, 30]", "[50, 40, 30, 20, 10]"],
    correctIndex: 0,
    explanation: "lst[::2] לוקח כל איבר שני: אינדקסים 0, 2, 4 → [10, 30, 50].",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "מה אומר הפרמטר השלישי ב-lst[::2]?",
        options: ["הצעד — דלג כל 2 איברים", "מספר האיברים", "אינדקס סיום", "שגיאה"],
        correctIndex: 0,
        explanation: "הפרמטר השלישי (step) קובע את גודל הדילוג. [::2] = כל איבר שני."
      },
      {
        question: "ברשימה [10,20,30,40,50], מה האינדקסים שנלקחים ב-[::2]?",
        options: ["0, 2, 4", "1, 3", "0, 1, 2", "2, 4"],
        correctIndex: 0,
        explanation: "מתחילים מ-0 ומדלגים ב-2: אינדקסים 0, 2, 4 → [10, 30, 50]."
      }
    ],
  },

  // --- MATH EXAM ---
  {
    id: "m13",
    type: "tracing",
    topic: "math",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    factors = []
    d = 2
    while n > 1:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1
    return factors

print(mystery(60))`,
    correctAnswer: "[2, 2, 3, 5]",
    explanation: "פירוק לגורמים ראשוניים: 60÷2=30, 30÷2=15, 15÷3=5, 5÷5=1. גורמים: [2,2,3,5].",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של 60 // 2?",
        options: ["30", "60", "2", "29"],
        correctIndex: 0,
        explanation: "60 חלקי 2 = 30. אחרי חילוק, ממשיכים לבדוק אם 30 מתחלק ב-2."
      },
      {
        question: "למה מתחילים מ-d=2 ולא מ-d=1?",
        options: ["כי 1 לא נחשב גורם ראשוני", "כי 1 גורם שגיאה", "כי 2 קטן מ-n", "אין סיבה"],
        correctIndex: 0,
        explanation: "1 אינו ראשוני וכל מספר מתחלק ב-1. לכן מתחילים מ-2, הראשוני הקטן ביותר."
      },
      {
        question: "אחרי ש-60÷2=30 ו-30÷2=15, האם 15 מתחלק ב-2?",
        options: ["לא, ממשיכים ל-d=3", "כן, 15÷2=7", "כן, 15÷2=7.5", "עוצרים"],
        correctIndex: 0,
        explanation: "15 % 2 = 1 ≠ 0, לכן 15 לא מתחלק ב-2. ממשיכים ל-d=3."
      }
    ],
  },
  {
    id: "m14",
    type: "quiz",
    topic: "math",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(mystery(48, 18))`,
    options: ["6", "2", "3", "18"],
    correctIndex: 0,
    explanation: "אלגוריתם אוקלידס: (48,18)→(18,12)→(12,6)→(6,0)→6. GCD(48,18) = 6.",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של 48 % 18?",
        options: ["12", "30", "2", "6"],
        correctIndex: 0,
        explanation: "48 = 2×18 + 12. לכן 48 % 18 = 12."
      },
      {
        question: "כשb מגיע ל-0 באלגוריתם, מה a מייצג?",
        options: ["המחלק המשותף הגדול ביותר", "המכנה", "0", "הסכום"],
        correctIndex: 0,
        explanation: "כש-b=0, a הוא ה-GCD (המחלק המשותף הגדול ביותר) של שני המספרים."
      }
    ],
  },
  {
    id: "m15",
    type: "coding",
    topic: "math",
    difficulty: "medium",
    title: "מציאת כל המחלקים",
    description: "כתבו פונקציה divisors(n) שמקבלת מספר שלם חיובי ומחזירה רשימה ממוינת של כל המחלקים שלו.",
    sampleInput: "divisors(12)",
    sampleOutput: "[1, 2, 3, 4, 6, 12]",
    solution: `def divisors(n):
    result = []
    for i in range(1, n + 1):
        if n % i == 0:
            result.append(i)
    return result`,
    solutionExplanation: "עוברים מ-1 עד n ובודקים אם n מתחלק ב-i. 12%1=0✓, 12%2=0✓, 12%3=0✓, 12%4=0✓, 12%5≠0, 12%6=0✓, ..., 12%12=0✓.",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: "מה זה מחלק של מספר?",
        options: ["מספר שמתחלק בו ללא שארית", "מספר גדול ממנו", "מספר ראשוני", "מספר קטן ממנו"],
        correctIndex: 0,
        explanation: "i הוא מחלק של n אם n % i == 0, כלומר n מתחלק ב-i בדיוק."
      },
      {
        question: "מה הערך של 12 % 4?",
        options: ["0 (מתחלק)", "3", "4", "2"],
        correctIndex: 0,
        explanation: "12 = 3×4, לכן 12 % 4 = 0. 4 הוא מחלק של 12."
      }
    ],
  },
  {
    id: "m16",
    type: "tracing",
    topic: "math",
    difficulty: "medium",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    count = 0
    while n > 0:
        count += n & 1
        n >>= 1
    return count

print(mystery(13))`,
    correctAnswer: "3",
    explanation: "סופר ביטים דלוקים (1) בייצוג בינארי. 13 = 1101₂. ביטים דלוקים: 3.",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "מה עושה n & 1?",
        options: ["בודק אם הביט האחרון הוא 1 (אי-זוגי)", "כופל ב-1", "מחלק ב-1", "שגיאה"],
        correctIndex: 0,
        explanation: "& 1 (AND בינארי) בודק את הביט האחרון: 1 אם אי-זוגי, 0 אם זוגי."
      },
      {
        question: "מה עושה n >>= 1?",
        options: ["מזיז ביטים ימינה (חלוקה ב-2)", "כופל ב-2", "מזיז שמאלה", "מוחק את n"],
        correctIndex: 0,
        explanation: ">>= 1 הזחה ימינה של ביט אחד, שקול לחלוקה שלמה ב-2."
      }
    ],
  },
  {
    id: "m17",
    type: "quiz",
    topic: "math",
    difficulty: "hard",
    question: "מה ידפיס הקוד הבא?",
    code: `def mystery(n):
    if n == 0:
        return ""
    return mystery(n // 10) + str(n % 10) + " "

print(mystery(4321).strip())`,
    options: ["4 3 2 1", "1 2 3 4", "4321", "1234"],
    correctIndex: 0,
    explanation: "רקורסיה שמפרקת מספר לספרות: mystery(432)+\"1 \", mystery(43)+\"2 1 \", mystery(4)+\"3 2 1 \", mystery(0)+\"4 3 2 1 \" = \"4 3 2 1\".",
    examSource: "מבחן א' 2024",
    warmupQuestions: [
      {
        question: 'ברקורסיה, מה מחזיר mystery(0)?',
        options: ['מחרוזת ריקה ""', "0", '"0"', "None"],
        correctIndex: 0,
        explanation: 'כש-n==0, מחזירים "" — זה תנאי העצירה של הרקורסיה.'
      },
      {
        question: "הפונקציה מחברת mystery(n//10) + str(n%10). באיזה סדר יופיעו הספרות?",
        options: ["מהספרה הראשונה לאחרונה (4,3,2,1)", "מהאחרונה לראשונה", "אקראי", "ממוין"],
        correctIndex: 0,
        explanation: "הרקורסיה מטפלת קודם בספרות השמאליות (n//10) ואז מוסיפה את הימנית. לכן הסדר שמאל→ימין."
      }
    ],
  },
  {
    id: "m18",
    type: "coding",
    topic: "math",
    difficulty: "hard",
    title: "המרה בסיסים (עשרוני לבסיס כלשהו)",
    description: "כתבו פונקציה to_base(n, base) שמקבלת מספר עשרוני n ובסיס base (2-9) ומחזירה מחרוזת שמייצגת את n בבסיס הנתון.",
    sampleInput: "to_base(42, 2)",
    sampleOutput: "101010",
    solution: `def to_base(n, base):
    if n == 0:
        return "0"
    result = ""
    while n > 0:
        result = str(n % base) + result
        n //= base
    return result`,
    solutionExplanation: "42÷2: שאריות 0,1,0,1,0,1. מלמטה למעלה: 101010. בכל שלב לוקחים n%base ומוסיפים בהתחלה.",
    examSource: "מבחן ב' 2024",
    warmupQuestions: [
      {
        question: "מה הערך של 42 % 2?",
        options: ["0 (42 זוגי)", "1", "21", "42"],
        correctIndex: 0,
        explanation: "42 הוא זוגי, לכן 42 % 2 = 0. הספרה הימנית ביותר בבינארי."
      },
      {
        question: "למה מוסיפים את הספרה בתחילת result ולא בסוף?",
        options: ["כי הספרות מחולצות מימין לשמאל", "כי Python דורש", "כדי למיין", "אין הבדל"],
        correctIndex: 0,
        explanation: "% מחלץ את הספרה הכי ימנית. כדי לבנות את המספר בסדר הנכון, מוסיפים בהתחלה."
      },
      {
        question: "מה הערך של 42 // 2?",
        options: ["21", "20", "42", "2"],
        correctIndex: 0,
        explanation: "42 // 2 = 21. אחרי חילוק ממשיכים עם 21."
      }
    ],
  },

  // ==========================================
  // FILL-IN-THE-BLANK QUESTIONS (השלמת קוד)
  // ==========================================
  {
    id: "fb1",
    type: "fill-blank",
    topic: "math",
    difficulty: "easy",
    title: "השלם: בדיקת מספר ראשוני",
    description: "השלם את החלקים החסרים בפונקציה שבודקת אם מספר הוא ראשוני.",
    code: `def is_prime(n):
    if n < ___:
        return False
    for i in range(2, ___):
        if n % i == ___:
            return False
    return ___`,
    blanks: [
      { answer: "2", hint: "מספרים קטנים מ-? אינם ראשוניים" },
      { answer: "n", hint: "בודקים חלוקה עד..." },
      { answer: "0", hint: "מתחלק ללא שארית" },
      { answer: "True", hint: "אם לא מצאנו מחלק..." },
    ],
    solutionExplanation: "מספר ראשוני >= 2. בודקים חלוקה ב-2 עד n-1. אם n%i==0 → לא ראשוני. אם עברנו את כל הלולאה → ראשוני.",
    examSource: "מבחן 1",
    warmupQuestions: [
      {
        question: "מה זה מספר ראשוני?",
        options: ["מספר שמתחלק רק ב-1 ובעצמו", "מספר זוגי", "מספר חיובי", "מספר גדול"],
        correctIndex: 0,
        explanation: "מספר ראשוני מתחלק בדיוק ב-1 ובעצמו בלבד."
      }
    ],
  },
  {
    id: "fb2",
    type: "fill-blank",
    topic: "lists",
    difficulty: "medium",
    title: "השלם: מציאת מינימום ברשימה",
    description: "השלם את הפונקציה שמוצאת את האיבר הקטן ביותר ברשימה.",
    code: `def find_min(lst):
    result = ___
    for i in range(1, ___):
        if lst[i] ___ result:
            result = ___
    return result`,
    blanks: [
      { answer: "lst[0]", hint: "מאתחלים עם האיבר הראשון" },
      { answer: "len(lst)", hint: "עד סוף הרשימה" },
      { answer: "<", hint: "מחפשים ערך קטן יותר" },
      { answer: "lst[i]", hint: "מעדכנים לערך החדש" },
    ],
    solutionExplanation: "מתחילים מהאיבר הראשון. עוברים על השאר ומעדכנים אם מוצאים ערך קטן יותר.",
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: "למה מאתחלים result = lst[0] ולא result = 0?",
        options: ["כי הרשימה יכולה להכיל רק שליליים", "כי 0 תמיד הכי קטן", "אין סיבה", "כי lst[0] הוא האחרון"],
        correctIndex: 0,
        explanation: "אם כל המספרים שליליים, אתחול ל-0 ייתן תוצאה שגויה."
      }
    ],
  },
  {
    id: "fb3",
    type: "fill-blank",
    topic: "loops",
    difficulty: "medium",
    title: "השלם: היפוך מחרוזת",
    description: "השלם את הפונקציה שמחזירה מחרוזת הפוכה.",
    code: `def reverse_string(s):
    result = ___
    for i in range(len(s) - 1, ___, ___):
        result += ___
    return result`,
    blanks: [
      { answer: '""', hint: "מחרוזת ריקה בהתחלה" },
      { answer: "-1", hint: "נעצרים לפני אינדקס..." },
      { answer: "-1", hint: "צעד הלולאה (כיוון)" },
      { answer: "s[i]", hint: "מוסיפים את התו הנוכחי" },
    ],
    solutionExplanation: 'מתחילים ממחרוזת ריקה. הלולאה רצה מהאינדקס האחרון עד 0, צעד -1. בכל שלב מוסיפים s[i].',
    examSource: "מבחן 5",
    warmupQuestions: [
      {
        question: 'מה האינדקס האחרון של המחרוזת "abc"?',
        options: ["2 (כי len-1 = 3-1)", "3", "1", "0"],
        correctIndex: 0,
        explanation: 'len("abc") = 3, אז האינדקס האחרון הוא 3-1 = 2.'
      },
      {
        question: "מה עושה range(2, -1, -1)?",
        options: ["יורד: 2, 1, 0", "עולה: -1, 0, 1, 2", "ריק", "2, 1, 0, -1"],
        correctIndex: 0,
        explanation: "range(2, -1, -1) יורד מ-2 ונעצר לפני -1: מייצר 2, 1, 0."
      }
    ],
  },
  {
    id: "fb4",
    type: "fill-blank",
    topic: "math",
    difficulty: "medium",
    title: "השלם: סכום ספרות",
    description: "השלם את הפונקציה שמחשבת סכום ספרות של מספר.",
    code: `def digit_sum(n):
    total = ___
    while n ___ 0:
        total += n ___ 10
        n ___= 10
    return total`,
    blanks: [
      { answer: "0", hint: "ערך התחלתי של הסכום" },
      { answer: ">", hint: "ממשיכים כל עוד יש ספרות" },
      { answer: "%", hint: "מחלצים ספרה אחרונה" },
      { answer: "//", hint: "מסירים ספרה אחרונה" },
    ],
    solutionExplanation: "מתחילים מ-0. כל עוד n>0: מוסיפים את הספרה האחרונה (n%10), מסירים אותה (n//=10).",
    examSource: "מבחן 4",
    warmupQuestions: [
      {
        question: "מה עושה n % 10?",
        options: ["מחזיר את הספרה האחרונה", "מחלק ב-10", "מכפיל ב-10", "מחזיר 10"],
        correctIndex: 0,
        explanation: "% 10 נותן את השארית מחלוקה ב-10, שהיא הספרה האחרונה."
      }
    ],
  },
  {
    id: "fb5",
    type: "fill-blank",
    topic: "tracing",
    difficulty: "hard",
    title: "השלם: סדרת פיבונאצ'י",
    description: "השלם את הפונקציה שמחשבת את האיבר ה-n בסדרת פיבונאצ'י.",
    code: `def fib(n):
    a, b = ___, ___
    for i in range(___):
        a, b = ___, a + b
    return a`,
    blanks: [
      { answer: "0", hint: "F(0) = ?" },
      { answer: "1", hint: "F(1) = ?" },
      { answer: "n", hint: "כמה איטרציות?" },
      { answer: "b", hint: "a מקבל את הערך של..." },
    ],
    solutionExplanation: "F(0)=0, F(1)=1. בכל איטרציה: a מקבל את b, ו-b מקבל את a+b. אחרי n איטרציות, a = F(n).",
    examSource: "מבחן 6",
    warmupQuestions: [
      {
        question: "בסדרת פיבונאצ'י, מה F(0) ו-F(1)?",
        options: ["F(0)=0, F(1)=1", "F(0)=1, F(1)=1", "F(0)=1, F(1)=2", "F(0)=0, F(1)=0"],
        correctIndex: 0,
        explanation: "ערכי הבסיס של פיבונאצ'י: F(0)=0 ו-F(1)=1."
      },
      {
        question: "מה עושה a, b = b, a + b?",
        options: ["מעדכן a ו-b בו-זמנית", "רק a מתעדכן", "שגיאה", "רק b מתעדכן"],
        correctIndex: 0,
        explanation: "Python מחשבת את הצד הימני קודם ואז מציבה — שני המשתנים מתעדכנים בו-זמנית."
      }
    ],
  },
];

export function getQuestionsByTopic(topicId: TopicId): Question[] {
  return questions.filter(q => q.topic === topicId);
}

export function getQuestionsByType(type: QuestionType): Question[] {
  return questions.filter(q => q.type === type);
}

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getBalancedExamQuestions(count: number): Question[] {
  const topicIds: TopicId[] = ["tracing", "conditions", "loops", "lists", "math"];
  const typeIds: QuestionType[] = ["quiz", "tracing", "coding", "fill-blank"];
  
  const byTopic: Record<string, Question[]> = {};
  topicIds.forEach(t => {
    byTopic[t] = [...questions.filter(q => q.topic === t)].sort(() => Math.random() - 0.5);
  });

  const selected: Question[] = [];
  const usedIds = new Set<string>();
  const usedTypes = new Set<string>();

  // Phase 1: One question per topic, trying to cover different types
  for (const t of topicIds) {
    if (selected.length >= count) break;
    // Try to pick a type we haven't used yet
    const preferredQ = byTopic[t].find(q => !usedTypes.has(q.type));
    const q = preferredQ || byTopic[t][0];
    if (q) {
      selected.push(q);
      usedIds.add(q.id);
      usedTypes.add(q.type);
      byTopic[t] = byTopic[t].filter(x => x.id !== q.id);
    }
  }

  // Phase 2: Fill remaining, prioritizing uncovered types and difficulty variety
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];
  const usedDifficulties = new Set(selected.map(q => q.difficulty));
  
  const remaining = questions.filter(q => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
  
  // Try to cover missing types first
  const missingTypes = typeIds.filter(t => !usedTypes.has(t));
  for (const type of missingTypes) {
    if (selected.length >= count) break;
    const q = remaining.find(q => q.type === type && !usedIds.has(q.id));
    if (q) {
      selected.push(q);
      usedIds.add(q.id);
      usedTypes.add(q.type);
    }
  }

  // Fill rest with difficulty variety
  while (selected.length < count && remaining.length > 0) {
    // Prefer a difficulty we haven't covered
    const missingDiff = difficulties.find(d => !usedDifficulties.has(d));
    const q = missingDiff 
      ? remaining.find(q => q.difficulty === missingDiff && !usedIds.has(q.id)) || remaining.find(q => !usedIds.has(q.id))
      : remaining.find(q => !usedIds.has(q.id));
    if (!q) break;
    selected.push(q);
    usedIds.add(q.id);
    usedDifficulties.add(q.difficulty);
  }

  return selected.sort(() => Math.random() - 0.5);
}
