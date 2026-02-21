export type QuestionType = "quiz" | "tracing" | "coding";
export type TopicId = "tracing" | "conditions" | "loops" | "lists" | "math";
export type Difficulty = "easy" | "medium" | "hard";

export interface WarmupQuestion {
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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

export type Question = QuizQuestion | TracingQuestion | CodingQuestion;

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
