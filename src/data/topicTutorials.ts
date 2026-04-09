export interface PrepQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SymbolExplainer {
  symbol: string;
  meaning: string;
}

export interface TopicTutorial {
  topicId: string;
  title: string;
  introduction: string;
  concepts: {
    title: string;
    explanation: string;
    codeExample: string;
    expectedOutput: string;
  }[];
  commonMistakes: string[];
  quickTip: string;
  prepQuestions?: PrepQuestion[];
  /**
   * `pattern_family` keys (as defined in `src/lib/patternFamilyLabels.ts`)
   * that this tutorial covers. Used by the progress page to link weak
   * pattern cards back to a relevant tutorial.
   */
  patternFamilies?: string[];
  /** Short symbol/syntax explainers aimed at 9th graders. */
  symbolExplainers?: SymbolExplainer[];
}

export const topicTutorials: TopicTutorial[] = [
  {
    topicId: "11111111-0001-0000-0000-000000000000",
    title: "משתנים, טיפוסים וקלט/פלט",
    introduction:
      "מעקב קוד זה כמו להיות בלש 🕵️ — אתם עוקבים אחרי הקוד שורה אחר שורה, רושמים מה קורה לכל משתנה, ומגלים מה הפלט. " +
      "זה אחד הנושאים הכי חשובים במבחן! ברגע שתשלטו בזה, שאלות mystery לא יפחידו אתכם יותר. " +
      "הסוד הוא לבנות טבלת מעקב — כמו טבלה שבה כל שורה היא צעד אחד בריצת הקוד.",
    concepts: [
      {
        title: "טבלת מעקב — הכלי החשוב ביותר",
        explanation:
          "דמיינו שאתם מנהלים יומן — בכל שורה רושמים את הערכים של כל המשתנים אחרי כל פעולה. " +
          "ככה אף פעם לא תלכו לאיבוד בתוך לולאות מורכבות.",
        codeExample: `def mystery(n):
    result = ""
    for i in range(n):
        result += str(i * 2) + " "
    print(result)

mystery(3)`,
        expectedOutput: "0 2 4 ",
      },
      {
        title: "השמה מרובה (a, b = b, a+b)",
        explanation:
          "בפייתון אפשר לעדכן שני משתנים בו-זמנית! הצד הימני מחושב קודם עם הערכים הישנים, " +
          "ורק אחר כך הערכים החדשים מושמים. זה נפוץ מאוד בשאלות פיבונאצ'י ודומות.",
        codeExample: `a, b = 0, 1
for i in range(5):
    a, b = b, a + b
    print(f"a={a}, b={b}")`,
        expectedOutput: "a=1, b=1\na=1, b=2\na=2, b=3\na=3, b=5\na=5, b=8",
      },
      {
        title: "מעקב אחרי מחרוזות ורשימות",
        explanation:
          "כשעוקבים אחרי קוד שמשנה מחרוזת או רשימה, חשוב לרשום את המצב המלא של המחרוזת/רשימה אחרי כל שינוי. " +
          "שימו לב לאינדקסים — הם מתחילים מ-0!",
        codeExample: `def mystery(s):
    result = ""
    for i in range(len(s)):
        if i % 2 == 0:
            result += s[i].upper()
        else:
            result += s[i]
    print(result)

mystery("hello")`,
        expectedOutput: "HeLlO",
      },
    ],
    commonMistakes: [
      "שכחת שאינדקסים מתחילים מ-0 ולא מ-1",
      "טעות בהשמה מרובה — חישוב הצד הימני עם ערכים חדשים במקום ישנים",
      "שכחת end=\" \" ב-print — מה מפריד בין הפלטים?",
      "בלבול בין range(n) (0 עד n-1) ל-range(1, n) (1 עד n-1)",
      "אי-שימוש בטבלת מעקב ומעבר ישר לניחוש",
    ],
    quickTip:
      "תמיד בנו טבלת מעקב! רשמו עמודה לכל משתנה ושורה לכל איטרציה. זה ההבדל בין ניחוש לתשובה נכונה.",
    patternFamilies: [
      "type_conversion",
      "input_conversion",
      "multiple_assignment",
      "print_sep",
      "print_end",
      "type_check",
    ],
    prepQuestions: [
      {
        question: "מה תדפיס הפונקציה mystery(3) אם היא מבצעת: result = \"\", ולאחר לולאה result += str(i*2)+\" \" עבור i ב-range(3)?",
        options: ["0 2 4 ", "1 3 5 ", "2 4 6 ", "0 1 2 "],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0003-0000-0000-000000000000",
    title: "תנאים ולוגיקה",
    introduction:
      "תנאים הם כמו רמזור 🚦 — בהתאם למצב, התוכנית בוחרת לאן ללכת. " +
      "עם if, elif ו-else אתם יכולים ליצור ענפים שונים בקוד. " +
      "נושא זה חוזר כמעט בכל שאלה במבחן, אז חשוב להבין אותו לעומק. " +
      "נלמד גם אופרטורים לוגיים (and, or, not) שמאפשרים לבנות תנאים מורכבים.",
    concepts: [
      {
        title: "מבנה if-elif-else",
        explanation:
          "פייתון בודקת את התנאים מלמעלה למטה. ברגע שתנאי מתקיים — היא מבצעת את הבלוק שלו ומדלגת על כל השאר. " +
          "תחשבו על זה כמו שרשרת שאלות: האם X? אם כן — עשה A. אם לא, האם Y? אם כן — עשה B. אחרת — עשה C.",
        codeExample: `def discount(price):
    if price > 200:
        return price * 0.2
    elif price > 100:
        return price * 0.1
    else:
        return 0

print(discount(150))`,
        expectedOutput: "15.0",
      },
      {
        title: "אופרטורים לוגיים: and, or, not",
        explanation:
          "and — שני התנאים חייבים להתקיים. or — מספיק שאחד מתקיים. not — הופך True ל-False ולהפך. " +
          "שימו לב: and קודם ל-or בסדר הקדימויות!",
        codeExample: `age = 20
has_id = True
is_vip = False

if age >= 18 and has_id:
    print("כניסה מאושרת")

if is_vip or age >= 18:
    print("יש הנחה")`,
        expectedOutput: "כניסה מאושרת\nיש הנחה",
      },
      {
        title: "תנאים מקוננים",
        explanation:
          "אפשר לשים if בתוך if. זה שימושי כשצריך לבדוק כמה דברים בשלבים. " +
          "טיפ: לפעמים אפשר לפשט תנאים מקוננים עם and.",
        codeExample: `x = 15
if x > 0:
    if x % 2 == 0:
        print("חיובי וזוגי")
    else:
        print("חיובי ואי-זוגי")
else:
    print("לא חיובי")`,
        expectedOutput: "חיובי ואי-זוגי",
      },
    ],
    commonMistakes: [
      "שימוש ב-= (השמה) במקום == (השוואה) בתנאי",
      "שכחת נקודתיים (:) בסוף שורת if/elif/else",
      "בלבול בסדר הקדימויות: and מתבצע לפני or",
      "שכחה ש-elif לא חייב להופיע — אפשר if...else בלבד",
    ],
    quickTip:
      "כשמתבלבלים בתנאים מורכבים — שרטטו תרשים זרימה קצר על דף. זה עוזר לראות את כל המסלולים.",
    patternFamilies: [
      "comparison_operators",
      "logical_operators",
      "nested_conditions",
      "elif_chain",
      "short_circuit",
    ],
    prepQuestions: [
      {
        question: "מה יודפס עבור x = 15?\nif x > 10:\n    if x % 2 == 0:\n        print('A')\n    else:\n        print('B')\nelse:\n    print('C')",
        options: ["A", "B", "C", "שגיאה"],
        correctAnswer: 1,
      },
    ],
  },
  {
    topicId: "11111111-0004-0000-0000-000000000000",
    title: "לולאות ודפוסים",
    introduction:
      "לולאות הן כמו מכונת כביסה 🔄 — הן חוזרות על פעולה שוב ושוב עד שמתקיים תנאי מסוים. " +
      "for משמשת כשידוע מספר החזרות, while כשצריך גמישות. " +
      "במבחן, לולאות מופיעות כמעט בכל שאלה — הדפסת פירמידות, עיבוד מחרוזות, חיפוש ברשימות. " +
      "השליטה בלולאות מקוננות וב-break/continue היא המפתח להצלחה!",
    concepts: [
      {
        title: "לולאת for עם range",
        explanation:
          "range(start, stop, step) מייצר רצף מספרים. stop לא כלול! " +
          "range(5) = 0,1,2,3,4. range(1,6) = 1,2,3,4,5. range(0,10,2) = 0,2,4,6,8.",
        codeExample: `for i in range(1, 6):
    print("*" * i)`,
        expectedOutput: "*\n**\n***\n****\n*****",
      },
      {
        title: "לולאת while",
        explanation:
          "ממשיכה כל עוד התנאי True. חשוב לוודא שהמשתנה משתנה בתוך הלולאה — " +
          "אחרת תיתקעו בלולאה אינסופית! while שימושית כשלא ידוע מראש כמה פעמים צריך לחזור.",
        codeExample: `n = 123
digit_sum = 0
while n > 0:
    digit_sum += n % 10
    n //= 10
print(digit_sum)`,
        expectedOutput: "6",
      },
      {
        title: "לולאות מקוננות ו-break/continue",
        explanation:
          "לולאה בתוך לולאה — הפנימית רצה מלאה בכל איטרציה של החיצונית. " +
          "break יוצא מהלולאה הקרובה ביותר. continue מדלג לאיטרציה הבאה.",
        codeExample: `for i in range(3):
    for j in range(3):
        if i == j:
            continue
        print(f"({i},{j})", end=" ")
    print()`,
        expectedOutput: "(0,1) (0,2) \n(1,0) (1,2) \n(2,0) (2,1) ",
      },
    ],
    commonMistakes: [
      "שכחה ש-range(5) מתחיל מ-0 ולא כולל 5",
      "לולאה אינסופית — שכחת לעדכן את המשתנה ב-while",
      "בלבול בין break (יציאה מהלולאה) ל-continue (דילוג לאיטרציה הבאה)",
      "שכחה ש-break יוצא רק מהלולאה הפנימית בלולאות מקוננות",
    ],
    quickTip:
      "לולאות מקוננות? חשבו על שעון — המחוג הקטן (חיצוני) זז לאט, הגדול (פנימי) רץ סיבוב שלם על כל צעד של הקטן.",
    patternFamilies: [
      "range_loop",
      "range_step",
      "while_counter",
      "while_break",
      "continue_statement",
      "nested_loops",
    ],
  },
  {
    topicId: "11111111-0007-0000-0000-000000000000",
    title: "רשימות ופונקציות",
    introduction:
      "רשימה בפייתון היא כמו עגלת קניות 🛒 — אפשר להוסיף פריטים, להסיר, לסדר אותם ולעבור עליהם. " +
      "רשימות הן mutable (ניתנות לשינוי), מה שהופך אותן לכלי חזק ושימושי. " +
      "בנושא זה נלמד גם פונקציות — איך לכתוב קוד מסודר שאפשר לקרוא לו שוב ושוב. " +
      "שילוב של רשימות ופונקציות הוא הבסיס לרוב שאלות המבחן!",
    concepts: [
      {
        title: "פעולות בסיסיות על רשימות",
        explanation:
          "append() מוסיף לסוף, pop() מסיר מהסוף (או לפי אינדקס), sort() ממיין במקום. " +
          "אינדוקס מתחיל מ-0, אינדקס שלילי סופר מהסוף.",
        codeExample: `lst = [3, 1, 4, 1, 5]
lst.append(9)
lst.sort()
print(lst)
print(lst[-1])`,
        expectedOutput: "[1, 1, 3, 4, 5, 9]\n9",
      },
      {
        title: "חיתוך (Slicing) ו-List Comprehension",
        explanation:
          "חיתוך: lst[start:stop:step]. List comprehension: דרך קומפקטית ליצור רשימה חדשה. " +
          "שתי הטכניקות חוסכות הרבה שורות קוד!",
        codeExample: `nums = [1, 2, 3, 4, 5, 6]
evens = [x for x in nums if x % 2 == 0]
print(evens)
print(nums[1:4])`,
        expectedOutput: "[2, 4, 6]\n[2, 3, 4]",
      },
      {
        title: "כתיבת פונקציות עם רשימות",
        explanation:
          "פונקציות מקבלות רשימה כפרמטר ויכולות לשנות אותה (mutable!). " +
          "כתיבת פונקציה טובה: שם ברור, תיעוד קצר, return של התוצאה.",
        codeExample: `def larger_than(lst, threshold):
    return [x for x in lst if x > threshold]

result = larger_than([10, 5, 20, 3, 15], 8)
print(result)`,
        expectedOutput: "[10, 20, 15]",
      },
    ],
    commonMistakes: [
      "sort() ממיין במקום ומחזיר None — אל תכתבו lst = lst.sort()",
      "בלבול בין append (מוסיף איבר בודד) ל-extend (מוסיף רשימה)",
      "שכחת return בפונקציה — הפונקציה מחזירה None",
      "שינוי רשימה בתוך לולאה שרצה עליה — עלול לגרום לבאגים",
    ],
    quickTip:
      "שאלה שכיחה במבחן: כתוב פונקציה שמקבלת רשימה ומחזירה רשימה חדשה. תמיד חשבו — האם לשנות את המקור או ליצור חדש?",
    patternFamilies: [
      "list_append_pop",
      "list_comprehension",
      "list_methods",
      "list_sort_vs_sorted",
      "list_extend_vs_append",
      "list_slicing",
    ],
    prepQuestions: [
      {
        question: "מה יודפס?\nlst = [3, 1, 4, 1, 5]\nlst.sort()\nprint(lst[-1])",
        options: ["5", "3", "None", "שגיאה"],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0005-0000-0000-000000000000",
    title: "פונקציות",
    introduction:
      "פונקציה היא כמו מתכון 📋 — מגדירים אותה פעם אחת ומשתמשים בה כמה פעמים שצריך. " +
      "פונקציות הן אחד הנושאים המרכזיים במבחן: תצטרכו לכתוב פונקציות, לקרוא להן ולהבין כיצד ערכים עוברים דרכן. " +
      "הכרת מושגי פרמטרים, ערכי ברירת מחדל, סקופ ורקורסיה יעניקו לכם יתרון משמעותי!",
    concepts: [
      {
        title: "הגדרת פונקציה עם פרמטרים ו-return",
        explanation:
          "מגדירים פונקציה עם def, מציינים פרמטרים בסוגריים ומחזירים ערך עם return. " +
          "חשוב: אם אין return מפורש, הפונקציה מחזירה None. " +
          "שמות פרמטרים הם שמות מקומיים בלבד — לא קשורים לשמות המשתנים בקריאה.",
        codeExample: `def calc_area(base, height):
    area = (base * height) / 2
    return area

triangle = calc_area(6, 4)
print(triangle)
print(calc_area(10, 3))`,
        expectedOutput: "12.0\n15.0",
      },
      {
        title: "ברירות מחדל וסקופ",
        explanation:
          "פרמטר עם ערך ברירת מחדל הופך לאופציונלי בקריאה. " +
          "משתנה שמוגדר בתוך פונקציה הוא מקומי (local) — לא נגיש מחוצה לה. " +
          "כדי לגשת למשתנה גלובלי מתוך פונקציה ולשנותו, משתמשים ב-global.",
        codeExample: `def greet(name, greeting="שלום"):
    message = f"{greeting}, {name}!"
    return message

print(greet("דנה"))
print(greet("יוסי", "היי"))`,
        expectedOutput: "שלום, דנה!\nהיי, יוסי!",
      },
      {
        title: "רקורסיה",
        explanation:
          "פונקציה רקורסיבית קוראת לעצמה. חייב להיות תנאי עצירה (base case) — " +
          "אחרת הפונקציה תרוץ לאינסוף! " +
          "כל קריאה עובדת על בעיה קטנה יותר עד שמגיעים לתנאי הבסיס.",
        codeExample: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
print(factorial(0))`,
        expectedOutput: "120\n1",
      },
    ],
    commonMistakes: [
      "שכחת return — הפונקציה מחזירה None ואז קורים חישובים לא צפויים",
      "בלבול בין פרמטר (בהגדרה) לארגומנט (בקריאה)",
      "שימוש במשתנה מקומי מחוץ לפונקציה — שגיאת NameError",
      "רקורסיה ללא תנאי עצירה — קריסה עם RecursionError",
      "שינוי פרמטר מסוג list בתוך פונקציה משפיע על המקור — היזהרו!",
    ],
    quickTip:
      "בשאלת כתיבת פונקציה במבחן: קראו את הדרישות, כתבו את החתימה (שם + פרמטרים), ודאו שיש return, ובדקו על דוגמת הקלט שנתנו.",
    patternFamilies: [
      "return_value_usage",
      "return_none",
      "default_parameters",
      "local_scope",
      "global_keyword",
      "recursion",
    ],
    prepQuestions: [
      {
        question: "מה תחזיר הפונקציה greet('עמי') אם מוגדרת: def greet(name, greeting='שלום'): return f'{greeting}, {name}!'",
        options: ["שלום, עמי!", "עמי, שלום!", "None", "שגיאה"],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0006-0000-0000-000000000000",
    title: "מחרוזות",
    introduction:
      "מחרוזת בפייתון היא שרשרת תווים 🔤 — כל תו נמצא במיקום מוגדר ואפשר לגשת אליו לפי אינדקס. " +
      "מחרוזות הן immutable — לא ניתנות לשינוי במקום, אלא יוצרים מחרוזת חדשה. " +
      "עיבוד מחרוזות הוא אחת הפעולות השכיחות ביותר במבחן: ספירת תווים, היפוך, חיתוך ועוד. " +
      "הכירו את המתודות הנפוצות והחיתוכים (slicing) — הם חוזרים שוב ושוב!",
    concepts: [
      {
        title: "אינדקסים, חיתוך ו-in",
        explanation:
          "s[i] מחזיר תו בודד (מ-0). s[start:stop:step] מחזיר תת-מחרוזת. " +
          "אינדקס שלילי סופר מהסוף: s[-1] הוא התו האחרון. " +
          "האופרטור in בודק אם תת-מחרוזת נמצאת בתוך המחרוזת.",
        codeExample: `s = "Python"
print(s[0])
print(s[-1])
print(s[1:4])
print(s[::-1])
print("tho" in s)`,
        expectedOutput: "P\nn\nyth\nnohtyP\nTrue",
      },
      {
        title: "מתודות מחרוזת שימושיות",
        explanation:
          "upper()/lower() — המרת רישיות. find() — מציאת מיקום תת-מחרוזת (-1 אם לא נמצאת). " +
          "replace() — החלפת כל המופעים. split() — פיצול לרשימה. join() — חיבור רשימה למחרוזת.",
        codeExample: `sentence = "שלום עולם"
words = sentence.split()
print(words)
print("-".join(words))
print(sentence.replace("עולם", "פייתון"))
print("HELLO".lower())`,
        expectedOutput: "['שלום', 'עולם']\nשלום-עולם\nשלום פייתון\nhello",
      },
      {
        title: "עיבוד מחרוזות בלולאה",
        explanation:
          "ניתן לעבור תו אחרי תו עם for. כך ספירת תווים, בדיקת תנאים על כל תו ובנייה של מחרוזת חדשה. " +
          "len(s) מחזיר את אורך המחרוזת.",
        codeExample: `def count_vowels(s):
    vowels = "aeiouAEIOU"
    count = 0
    for ch in s:
        if ch in vowels:
            count += 1
    return count

print(count_vowels("Hello World"))
print(len("Python"))`,
        expectedOutput: "3\n6",
      },
    ],
    commonMistakes: [
      "ניסיון לשנות תו ישירות: s[0] = 'A' — שגיאה! מחרוזות הן immutable",
      "בלבול בין find() (מחזיר אינדקס או -1) ל-index() (זורק שגיאה אם לא נמצא)",
      "שכחה ש-split() ללא ארגומנט מפצל לפי רווחים ומסיר רווחים כפולים",
      "חיתוך מחוץ לגבולות לא זורק שגיאה — פייתון פשוט מחזירה עד הסוף",
      "שכחת שאינדקסים מתחילים מ-0 ולא מ-1",
    ],
    quickTip:
      "לבנות מחרוזת חדשה בלולאה: התחילו עם result = \"\" ואז result += בכל איטרציה. זהו הדפוס הנפוץ ביותר בשאלות מחרוזות במבחן!",
    prepQuestions: [
      {
        question: "מה יחזיר הביטוי: 'Python'[::-1]?",
        options: ["nohtyP", "Python", "P", "שגיאה"],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0008-0000-0000-000000000000",
    title: "טאפלים, קבוצות ומילונים",
    introduction:
      "שלושת המבנים האלה משלימים את ארגז הכלים של פייתון 📦. " +
      "טאפל — כמו רשימה שאי-אפשר לשנות (קואורדינטות, תאריכים). " +
      "קבוצה — אוסף ללא כפילויות, מעולה לפעולות קבוצה. " +
      "מילון — מיפוי מפתח לערך, כמו מילון אמיתי 📖. " +
      "נושא זה חוזר בשאלות על עיבוד נתונים, ספירה וחיפוש יעיל.",
    concepts: [
      {
        title: "טאפלים — אוספים בלתי-משתנים",
        explanation:
          "טאפל נוצר בסוגריים עגולים () או בפסיקים בלבד. " +
          "ניתן לגשת לאיברים לפי אינדקס ולפרוק (unpack) לתוך משתנים — אך לא לשנות! " +
          "פרוק (tuple unpacking) שימושי מאוד להחלפת ערכים ולהחזרת כמה ערכים מפונקציה.",
        codeExample: `point = (3, 7)
x, y = point
print(x, y)

def min_max(lst):
    return min(lst), max(lst)

lo, hi = min_max([4, 1, 9, 2])
print(lo, hi)`,
        expectedOutput: "3 7\n1 9",
      },
      {
        title: "קבוצות — ייחודיות ופעולות קבוצה",
        explanation:
          "קבוצה נוצרת עם {} או set(). אין כפילויות ואין סדר. " +
          "| — איחוד, & — חיתוך, - — הפרש, <= — תת-קבוצה. " +
          "add() מוסיף איבר בודד, update() מוסיף כמה.",
        codeExample: `a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)
print(a & b)
print(a - b)`,
        expectedOutput: "{1, 2, 3, 4, 5, 6}\n{3, 4}\n{1, 2}",
      },
      {
        title: "מילונים — מפתח וערך",
        explanation:
          "מילון נוצר עם {} עם זוגות key:value. " +
          "גישה לפי מפתח: d[key] — זורק KeyError אם לא קיים. d.get(key, default) בטוח יותר. " +
          "d.keys(), d.values(), d.items() לאיטרציה. " +
          "שימושי לספירת מופעים: d[key] = d.get(key, 0) + 1.",
        codeExample: `grades = {"דנה": 95, "יוסי": 80, "רן": 90}
grades["לילי"] = 88
for name, grade in grades.items():
    print(f"{name}: {grade}")
print(max(grades, key=grades.get))`,
        expectedOutput: "דנה: 95\nיוסי: 80\nרן: 90\nלילי: 88\nדנה",
      },
    ],
    commonMistakes: [
      "ניסיון לשנות טאפל: t[0] = 5 — שגיאת TypeError",
      "גישה לאיבר בקבוצה לפי אינדקס: s[0] — שגיאה! לקבוצות אין סדר",
      "גישה למפתח לא קיים במילון ישירות — קבלו KeyError; השתמשו ב-.get()",
      "בלבול בין {} ריק (מילון) ל-set() ריק (קבוצה) — {} הוא מילון!",
      "שינוי מילון תוך כדי איטרציה עליו — גורם ל-RuntimeError",
    ],
    quickTip:
      "ספירת מופעים: השתמשו במילון עם d.get(key, 0) + 1 — זהו דפוס מאוד נפוץ בשאלות עיבוד מחרוזות ורשימות!",
    patternFamilies: [
      "tuple_immutability",
      "set_operations",
      "set_duplicates",
      "dict_access",
      "dict_iteration",
      "dict_get_default",
    ],
    prepQuestions: [
      {
        question: "מה יחזיר: {1,2,3} & {2,3,4}?",
        options: ["{2, 3}", "{1, 2, 3, 4}", "{1, 4}", "שגיאה"],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0002-0000-0000-000000000000",
    title: "מספרים ומתמטיקה",
    introduction:
      "נושא זה עוסק בחישובים מתמטיים — כמו מחשבון עם כפתורים מיוחדים 🔢. " +
      "חילוק שלם, שארית (מודולו), חזקות, ועבודה עם ספרות של מספרים. " +
      "שאלות על ראשוניים, ספרות ייחודיות וסדרות מתמטיות חוזרות במבחנים. " +
      "הסוד הוא להכיר את האופרטורים // ו-% ולדעת לפרק מספר לספרותיו.",
    concepts: [
      {
        title: "חילוק שלם (%  //) — פירוק ספרות",
        explanation:
          "n % 10 נותן את הספרה האחרונה. n // 10 מסיר את הספרה האחרונה. " +
          "עם לולאה אפשר לפרק כל מספר לספרותיו!",
        codeExample: `n = 4567
while n > 0:
    digit = n % 10
    print(digit, end=" ")
    n //= 10`,
        expectedOutput: "7 6 5 4 ",
      },
      {
        title: "בדיקת ראשוניות",
        explanation:
          "מספר ראשוני מתחלק רק ב-1 ובעצמו. מספיק לבדוק מחלקים עד שורש המספר — " +
          "אם אין מחלק עד שם, המספר ראשוני.",
        codeExample: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

print(is_prime(17))
print(is_prime(15))`,
        expectedOutput: "True\nFalse",
      },
      {
        title: "סדרות מתמטיות",
        explanation:
          "סדרות כמו פיבונאצ'י ו-Pell בנויות מנוסחת נסיגה — כל איבר מחושב מהקודמים. " +
          "השתמשו בהשמה מרובה (a, b = b, a+b) לחישוב יעיל.",
        codeExample: `# סדרת פיבונאצ'י — 10 איברים ראשונים
a, b = 0, 1
for _ in range(10):
    print(a, end=" ")
    a, b = b, a + b`,
        expectedOutput: "0 1 1 2 3 5 8 13 21 34 ",
      },
    ],
    commonMistakes: [
      "בלבול בין / (חילוק עשרוני) ל-// (חילוק שלם)",
      "שכחה ש-n % 10 עובד רק על מספרים חיוביים כמצופה",
      "בדיקת ראשוניות עד n במקום עד שורש n — לא יעיל ויכול לגרום לטעויות",
      "שכחה לטפל במקרי קצה: 0, 1 הם לא ראשוניים",
    ],
    quickTip:
      "לפרק מספר לספרותיו: loop עם % 10 (קבל ספרה) ו-// 10 (הסר ספרה). זה דפוס שחוזר בהרבה שאלות!",
    prepQuestions: [
      {
        question: "מה יחזיר: 17 % 5?",
        options: ["3", "2", "1", "0"],
        correctAnswer: 1,
      },
    ],
  },
  // === PR 1A placeholder tutorials for the 5 new syllabus topics. Full content lands in PR 3. ===
  {
    topicId: "variables_io",
    title: "משתנים וקלט/פלט",
    introduction: "הנושא הראשון בקורס: יצירת משתנים, טיפוסי נתונים בסיסיים, קריאת קלט מהמשתמש והדפסת פלט.",
    concepts: [
      {
        title: "משתנים וטיפוסים",
        explanation: "ב-Python יש int, float, str, bool. אפשר לבדוק טיפוס עם type().",
        codeExample: "x = 5\ny = 3.14\nname = \"דנה\"\nprint(type(x), type(y), type(name))",
        expectedOutput: "<class 'int'> <class 'float'> <class 'str'>",
      },
    ],
    commonMistakes: ["שכחה ש-input() תמיד מחזיר מחרוזת — צריך להמיר עם int() או float()"],
    quickTip: "המר קלט מספרי מיד עם int(input(...)) או float(input(...)).",
    patternFamilies: ["type_conversion", "input_conversion", "print_sep", "print_end"],
    symbolExplainers: [
      { symbol: "=", meaning: "השמה — שומר ערך במשתנה" },
      { symbol: "print()", meaning: "מדפיס טקסט למסך" },
      { symbol: "input()", meaning: "קולט קלט מהמשתמש (תמיד מחרוזת)" },
      { symbol: "type()", meaning: "מחזיר את סוג המשתנה" },
      { symbol: "int(), float(), str()", meaning: "המרת טיפוס — הופך ערך לסוג אחר" },
    ],
  },
  {
    topicId: "arithmetic",
    title: "חשבון ואופרטורים",
    introduction: "פעולות חשבון בסיסיות, חלוקה שלמה, מודולו, חזקות ופונקציות מהמודול math.",
    concepts: [
      {
        title: "אופרטורים מספריים",
        explanation: "+, -, *, / (חלוקה), // (חלוקה שלמה), % (שארית), ** (חזקה).",
        codeExample: "print(7 / 2, 7 // 2, 7 % 2, 2 ** 3)",
        expectedOutput: "3.5 3 1 8",
      },
    ],
    commonMistakes: ["בלבול בין / ל-//", "שכחה לייבא את math לפני שימוש ב-math.sqrt"],
    quickTip: "שימוש ב-% הוא הדרך המהירה לבדוק התחלקות: x % 2 == 0 → זוגי.",
    patternFamilies: ["integer_division_modulo", "float_division", "modulo", "power_operator", "math_functions"],
    symbolExplainers: [
      { symbol: "/", meaning: "חילוק רגיל — תמיד מחזיר float" },
      { symbol: "//", meaning: "חילוק שלם — מחזיר רק את החלק השלם" },
      { symbol: "%", meaning: "מודולו (שארית) — השארית מחלוקה" },
      { symbol: "**", meaning: "חזקה — למשל 2**3 = 8" },
      { symbol: "abs()", meaning: "ערך מוחלט — תמיד חיובי" },
    ],
  },
  {
    topicId: "functions",
    title: "פונקציות",
    introduction: "פונקציות מאפשרות לארוז קוד שניתן לקרוא לו שוב ושוב, עם פרמטרים וערך מוחזר.",
    concepts: [
      {
        title: "def, פרמטרים ו-return",
        explanation: "פונקציה מוגדרת עם def, מקבלת פרמטרים ויכולה להחזיר ערך עם return.",
        codeExample: "def add(a, b):\n    return a + b\n\nprint(add(3, 4))",
        expectedOutput: "7",
      },
    ],
    commonMistakes: ["שכחה ל-return — הפונקציה תחזיר None", "בלבול בין משתנה לוקלי לגלובלי"],
    quickTip: "כל פונקציה צריכה לעשות דבר אחד ברור — אם היא עושה שניים, פצל אותה.",
    patternFamilies: ["return_value_usage", "return_none", "default_parameters", "local_scope", "global_keyword", "recursion"],
    symbolExplainers: [
      { symbol: "def", meaning: "מגדיר פונקציה חדשה" },
      { symbol: "return", meaning: "מחזיר ערך מהפונקציה לקוד שקרא לה" },
      { symbol: "פרמטר", meaning: "משתנה שהפונקציה מקבלת בסוגריים" },
      { symbol: "global", meaning: "מאפשר לפונקציה לשנות משתנה גלובלי" },
    ],
  },
  {
    topicId: "strings",
    title: "מחרוזות",
    introduction: "מחרוזות הן רצף של תווים. ניתן לגשת לתווים לפי אינדקס, לחתוך, ולהשתמש בשיטות רבות.",
    concepts: [
      {
        title: "indexing ו-slicing",
        explanation: "s[0] = תו ראשון, s[-1] = תו אחרון, s[1:4] = חיתוך מאינדקס 1 עד 3.",
        codeExample: "s = \"python\"\nprint(s[0], s[-1], s[1:4])",
        expectedOutput: "p n yth",
      },
    ],
    commonMistakes: ["שכחה שמחרוזות immutable — אי אפשר לשנות תו במקום"],
    quickTip: "להמיר מחרוזת לרשימת תווים: list(s). להמיר חזרה: \"\".join(lst).",
    patternFamilies: ["string_slicing", "string_indexing", "string_methods", "string_find", "split_join", "for_string_loop"],
    symbolExplainers: [
      { symbol: "s[0]", meaning: "התו הראשון במחרוזת (אינדקס מתחיל מ-0)" },
      { symbol: "s[-1]", meaning: "התו האחרון במחרוזת" },
      { symbol: "s[1:4]", meaning: "חיתוך — תווים מאינדקס 1 עד 3" },
      { symbol: ".upper() / .lower()", meaning: "הופך לאותיות גדולות / קטנות" },
      { symbol: ".split() / .join()", meaning: "פיצול מחרוזת לרשימה / חיבור רשימה למחרוזת" },
    ],
  },
  {
    topicId: "tuples_sets_dicts",
    title: "טאפלים, קבוצות ומילונים",
    introduction: "שלושה אוספים נוספים: tuple (מסודר ולא משתנה), set (ייחודי וללא סדר), dict (מפתח-ערך).",
    concepts: [
      {
        title: "מילון בסיסי",
        explanation: "מילון שומר זוגות מפתח→ערך. גישה עם d[key], מעבר עם .items().",
        codeExample: "d = {\"a\": 1, \"b\": 2}\nfor k, v in d.items():\n    print(k, v)",
        expectedOutput: "a 1\nb 2",
      },
    ],
    commonMistakes: ["ניסיון לשנות tuple", "שכחה ש-set לא שומר סדר"],
    quickTip: "set מצוין למחיקת כפילויות: list(set(my_list)).",
    patternFamilies: ["tuple_immutability", "set_operations", "set_duplicates", "dict_access", "dict_iteration", "dict_get_default"],
    symbolExplainers: [
      { symbol: "(1, 2, 3)", meaning: "tuple — אוסף מסודר שלא ניתן לשנות" },
      { symbol: "{1, 2, 3}", meaning: "set — אוסף ללא כפילויות וללא סדר" },
      { symbol: '{"a": 1}', meaning: "dict — מילון של מפתח→ערך" },
      { symbol: ".items()", meaning: "מחזיר את כל זוגות מפתח-ערך במילון" },
      { symbol: ".get(key, default)", meaning: "גישה בטוחה למילון — מחזיר ברירת מחדל אם המפתח לא קיים" },
    ],
  },
];

export function getTutorialByTopicId(topicId: string): TopicTutorial | undefined {
  return topicTutorials.find((t) => t.topicId === topicId);
}
