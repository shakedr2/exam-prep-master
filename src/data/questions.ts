export type QuestionType = "quiz" | "tracing" | "coding";
export type TopicId = "tracing" | "conditions" | "loops" | "lists" | "math";
export type Difficulty = "easy" | "medium" | "hard";

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
