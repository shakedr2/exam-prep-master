import { PYTHON_OOP_TOPIC_SLUG, PYTHON_OOP_TOPIC_UUID, pythonOopTopicTutorialForLearnPage } from "./topicTutorials/python-oop";

export interface PrepQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SymbolExplainer {
  symbol: string;
  meaning: string;
}

export interface GuidedExampleStep {
  /** Hebrew narration text for this step (max ~120 words). */
  narration: string;
  /** 1-based line numbers to highlight in the code block. */
  highlightLines?: number[];
  /** New trace-table row revealed at this step. */
  traceRow?: { variable: string; value: string }[];
}

export interface GuidedExample {
  /** Short Hebrew title for the example. */
  title: string;
  code: string;
  language?: string;
  steps: GuidedExampleStep[];
}

export interface TopicTutorial {
  topicId: string;
  title: string;
  /** Real-world Hebrew analogy shown BEFORE any code (§6.1 Beginner-First). */
  realWorldAnalogy?: string;
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
  /**
   * Phase B: Step-by-step worked example walkthroughs.
   * Shown after all concept cards (Phase A) are complete.
   */
  guidedExamples?: GuidedExample[];
}

export const topicTutorials: TopicTutorial[] = [
  {
    topicId: "11111111-0001-0000-0000-000000000000",
    title: "משתנים, טיפוסים וקלט/פלט",
    realWorldAnalogy:
      "חשבו על משתנה כמו על מגירה עם תווית. " +
      "התווית היא השם של המשתנה, והתוכן של המגירה הוא הערך. " +
      "כשאתם כותבים x = 5, זה כמו להדביק תווית \"x\" על מגירה ולשים בה את המספר 5.",
    introduction:
      "בנושא הזה נלמד את אבני הבניין הבסיסיות ביותר בפייתון: " +
      "איך לשמור מידע במשתנים, אילו סוגי מידע קיימים, " +
      "איך לקבל קלט מהמשתמש ואיך להדפיס תוצאות למסך. " +
      "אלה הצעדים הראשונים שלכם בתכנות — ומכאן הכל מתחיל!",
    concepts: [
      {
        title: "מה זה משתנה?",
        explanation:
          "משתנה הוא שם שמצביע על ערך בזיכרון. " +
          "כותבים את השם, סימן =, ואז את הערך. " +
          "מרגע זה אפשר להשתמש בשם כדי לגשת לערך.",
        codeExample: `x = 5
print(x)`,
        expectedOutput: "5",
      },
      {
        title: "טיפוסים — סוגי מידע",
        explanation:
          "לכל ערך בפייתון יש טיפוס (סוג). " +
          "מספר שלם הוא int, מספר עשרוני הוא float, " +
          "טקסט הוא str (תמיד בתוך גרשיים), וערך אמת/שקר הוא bool. " +
          "אפשר לבדוק טיפוס עם type().",
        codeExample: `age = 25
price = 9.99
name = "דני"
is_student = True

print(type(age))
print(type(name))`,
        expectedOutput: "<class 'int'>\n<class 'str'>",
      },
      {
        title: "קלט מהמשתמש — input()",
        explanation:
          "הפקודה input() מציגה הודעה למשתמש וממתינה שיקליד תשובה. " +
          "התשובה תמיד חוזרת כטקסט (str), גם אם המשתמש הקליד מספר!",
        codeExample: `name = input("מה שמך? ")
print("שלום", name)`,
        expectedOutput: "מה שמך? דני\nשלום דני",
      },
      {
        title: "המרת טיפוסים",
        explanation:
          "כדי לחשב עם מספר שהתקבל מ-input(), צריך להמיר אותו. " +
          "int() ממיר לשלם, float() לעשרוני, str() לטקסט. " +
          "בלי המרה — פייתון לא יודע שזה מספר!",
        codeExample: `age_text = input("בן כמה אתה? ")
age = int(age_text)
print("בשנה הבאה תהיה בן", age + 1)`,
        expectedOutput: "בן כמה אתה? 20\nבשנה הבאה תהיה בן 21",
      },
      {
        title: "הדפסה מותאמת — sep ו-end",
        explanation:
          "print() יכול לקבל כמה ערכים ומדפיס אותם עם רווח ביניהם. " +
          "sep קובע מה יופיע בין הערכים, ו-end קובע מה יופיע בסוף (ברירת מחדל: שורה חדשה).",
        codeExample: `print("א", "ב", "ג")
print("א", "ב", "ג", sep="-")
print("שלום", end=" ")
print("עולם")`,
        expectedOutput: "א ב ג\nא-ב-ג\nשלום עולם",
      },
    ],
    commonMistakes: [
      "שכחת המרה: input() מחזיר תמיד str — אם רוצים מספר צריך int() או float()",
      "בלבול בין = (השמה) ל-== (השוואה) — כאן נשתמש רק ב-= לשמירת ערך",
      "שכחת גרשיים סביב טקסט: name = דני במקום name = \"דני\" — שגיאה!",
    ],
    quickTip:
      "אם לא בטוחים מה הטיפוס של משתנה — השתמשו ב-type() ו-print() כדי לבדוק!",
    patternFamilies: [
      "type_conversion",
      "input_conversion",
      "variable_naming",
      "print_sep",
      "print_end",
      "type_check",
    ],
    symbolExplainers: [
      { symbol: "=", meaning: "סימן השמה — שומר ערך בתוך משתנה" },
      { symbol: "print()", meaning: "מדפיס ערכים למסך" },
      { symbol: "input()", meaning: "מבקש קלט (טקסט) מהמשתמש" },
      { symbol: "int()", meaning: "ממיר ערך למספר שלם" },
      { symbol: "float()", meaning: "ממיר ערך למספר עשרוני" },
      { symbol: "str()", meaning: "ממיר ערך לטקסט" },
      { symbol: "type()", meaning: "מחזיר את הטיפוס (סוג) של ערך" },
    ],
    prepQuestions: [
      {
        question: "מה ידפיס הקוד הבא?\nx = 3\nprint(x + 2)",
        options: ["5", "32", "x + 2", "שגיאה"],
        correctAnswer: 0,
      },
      {
        question: "מה הטיפוס של הערך \"5\"?",
        options: ["str", "int", "float", "bool"],
        correctAnswer: 0,
      },
    ],
    guidedExamples: [
      {
        title: "מעקב אחרי משתנים — שלב אחרי שלב",
        code: `name = "דני"
age = 17
age = age + 1
print("שלום", name)
print("בן", age)`,
        steps: [
          {
            narration: "בשורה הראשונה יוצרים משתנה בשם name ושמים בו את הטקסט \"דני\". כשפייתון מגיעה לשורה הזו, היא פותחת מגירה, שמה עליה תווית name, ומניחה בתוכה את הערך \"דני\".",
            highlightLines: [1],
            traceRow: [{ variable: "name", value: '"דני"' }],
          },
          {
            narration: "בשורה השנייה יוצרים משתנה age עם הערך 17. עכשיו יש לנו שתי מגירות: name עם \"דני\" ו-age עם 17.",
            highlightLines: [2],
            traceRow: [{ variable: "age", value: "17" }],
          },
          {
            narration: "בשורה השלישית מחשבים age + 1 (כלומר 17 + 1 = 18) ושמים את התוצאה חזרה בתוך age. המגירה של age עודכנה — עכשיו יש בה 18 במקום 17.",
            highlightLines: [3],
            traceRow: [{ variable: "age", value: "18" }],
          },
          {
            narration: "בשורה הרביעית מדפיסים את שתי המילים \"שלום\" ו-\"דני\" (תוכן name) מופרדות ברווח. הפלט הוא: שלום דני.",
            highlightLines: [4],
          },
          {
            narration: "בשורה האחרונה מדפיסים \"בן\" ואת ערך age שהוא כעת 18. הפלט הוא: בן 18. שימו לב שלא הדפסנו 17 — כי עדכנו את age לפני ההדפסה!",
            highlightLines: [5],
          },
        ],
      },
    ],
  },
  {
    topicId: "11111111-0003-0000-0000-000000000000",
    title: "תנאים",
    realWorldAnalogy:
      "תנאים זה כמו רמזור — בהתאם לצבע, אתה יודע מה לעשות. " +
      "ירוק? עובר. אדום? עוצר. כתום? בודק ומחליט. " +
      "בתכנות, המחשב מקבל החלטות בדיוק באותו אופן.",
    introduction:
      "בנושא הזה נלמד איך לגרום לתוכנית לקבל החלטות. " +
      "עם if, elif ו-else אפשר ליצור מסלולים שונים בקוד — " +
      "מסלול אחד כשתנאי מתקיים, ומסלול אחר כשלא. " +
      "תנאים מופיעים כמעט בכל שאלה במבחן!",
    concepts: [
      {
        title: "תנאי פשוט — if",
        explanation:
          "if בודק אם תנאי מתקיים. אם כן — מבצע את הקוד שבפנים. " +
          "אם לא — מדלג. " +
          "שימו לב לנקודתיים (:) בסוף השורה ולהזחה בשורה הבאה!",
        codeExample: `age = 20
if age >= 18:
    print("אתה בגיר")`,
        expectedOutput: "אתה בגיר",
      },
      {
        title: "שני מסלולים — if-else",
        explanation:
          "else מוסיף מסלול חלופי — מה לעשות כשהתנאי לא מתקיים. " +
          "תמיד אחד משני המסלולים יתבצע, אף פעם לא שניהם.",
        codeExample: `temperature = 35
if temperature > 30:
    print("חם מאוד!")
else:
    print("מזג אוויר נעים")`,
        expectedOutput: "חם מאוד!",
      },
      {
        title: "שרשרת תנאים — if-elif-else",
        explanation:
          "elif (קיצור של else if) מאפשר לבדוק כמה תנאים בזה אחר זה. " +
          "פייתון בודקת מלמעלה למטה — ברגע שתנאי מתקיים, היא מבצעת את הבלוק שלו ומדלגת על כל השאר.",
        codeExample: `grade = 85
if grade >= 90:
    print("מצוין")
elif grade >= 80:
    print("טוב מאוד")
elif grade >= 70:
    print("טוב")
else:
    print("צריך לשפר")`,
        expectedOutput: "טוב מאוד",
      },
      {
        title: "אופרטורים לוגיים — and, or, not",
        explanation:
          "and — שני התנאים חייבים להתקיים. " +
          "or — מספיק שאחד מתקיים. " +
          "not — הופך True ל-False ולהפך. " +
          "and קודם ל-or בסדר פעולות!",
        codeExample: `age = 20
has_id = True
if age >= 18 and has_id:
    print("כניסה מאושרת")

x = 5
if not x > 10:
    print("x לא גדול מ-10")`,
        expectedOutput: "כניסה מאושרת\nx לא גדול מ-10",
      },
      {
        title: "תנאים מקוננים",
        explanation:
          "אפשר לשים if בתוך if — זה שימושי כשצריך לבדוק כמה דברים בשלבים. " +
          "כל if פנימי חייב הזחה נוספת. " +
          "לפעמים אפשר לפשט תנאי מקונן עם and.",
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
    ],
    quickTip:
      "כשמתבלבלים בתנאים מורכבים — שרטטו תרשים זרימה קצר על דף. זה עוזר לראות את כל המסלולים האפשריים.",
    patternFamilies: [
      "comparison_operators",
      "logical_operators",
      "nested_conditions",
      "elif_chain",
      "short_circuit",
    ],
    symbolExplainers: [
      { symbol: "if", meaning: "בודק אם תנאי מתקיים" },
      { symbol: "elif", meaning: "תנאי נוסף — נבדק רק אם הקודמים לא התקיימו" },
      { symbol: "else", meaning: "מה לעשות אם אף תנאי לא התקיים" },
      { symbol: "==", meaning: "בודק אם שני ערכים שווים" },
      { symbol: "!=", meaning: "בודק אם שני ערכים שונים" },
      { symbol: "and", meaning: "שני התנאים חייבים להתקיים" },
      { symbol: "or", meaning: "מספיק שתנאי אחד מתקיים" },
      { symbol: "not", meaning: "הופך True ל-False ולהפך" },
    ],
    prepQuestions: [
      {
        question: "מה ידפיס הקוד?\nx = 15\nif x > 10:\n    print(\"גדול\")\nelse:\n    print(\"קטן\")",
        options: ["גדול", "קטן", "גדול\nקטן", "שגיאה"],
        correctAnswer: 0,
      },
      {
        question: "מה ידפיס?\nx = 5\nif x > 10 or x < 8:\n    print(\"כן\")\nelse:\n    print(\"לא\")",
        options: ["כן", "לא", "כן\nלא", "שגיאה"],
        correctAnswer: 0,
      },
    ],
    guidedExamples: [
      {
        title: "מעקב אחרי if-elif-else",
        code: `grade = 75
if grade >= 90:
    print("מצוין")
elif grade >= 80:
    print("טוב מאוד")
elif grade >= 70:
    print("טוב")
else:
    print("צריך לשפר")`,
        steps: [
          {
            narration: "בשורה הראשונה משימים את הציון 75 במשתנה grade. זהו ערך ה-int שיעבור בדיקת תנאים.",
            highlightLines: [1],
            traceRow: [{ variable: "grade", value: "75" }],
          },
          {
            narration: "בשורה השנייה בודקים: האם 75 >= 90? 75 גדול מ-90? לא! התנאי שקרי (False), לכן מדלגים על הבלוק הזה.",
            highlightLines: [2, 3],
            traceRow: [{ variable: "grade >= 90", value: "False" }],
          },
          {
            narration: "עכשיו בודקים את ה-elif הראשון: האם 75 >= 80? 75 גדול מ-80? לא! גם זה False — ממשיכים לבדיקה הבאה.",
            highlightLines: [4, 5],
            traceRow: [{ variable: "grade >= 80", value: "False" }],
          },
          {
            narration: "בודקים את ה-elif השני: האם 75 >= 70? כן! 75 אכן גדול מ-70. התנאי True — מבצעים את הבלוק הזה.",
            highlightLines: [6, 7],
            traceRow: [{ variable: "grade >= 70", value: "True" }],
          },
          {
            narration: "מדפיסים \"טוב\" ומסיימים. ה-else לא מתבצע כלל כי כבר מצאנו תנאי שהתקיים. הפלט: טוב.",
            highlightLines: [7],
          },
        ],
      },
    ],
  },
  {
    topicId: "11111111-0004-0000-0000-000000000000",
    title: "לולאות",
    realWorldAnalogy:
      "לולאה זה כמו מכונת כביסה — חוזרת על אותה פעולה שוב ושוב. " +
      "כל סיבוב הוא איטרציה, ובסוף התהליך נגמר. " +
      "בתכנות, לולאה חוסכת לנו את הצורך לכתוב את אותו קוד מאות פעמים.",
    introduction:
      "בנושא הזה נלמד איך לחזור על פעולות בקוד. " +
      "for משמשת כשידוע מספר החזרות, while כשצריך גמישות. " +
      "לולאות מופיעות כמעט בכל שאלה במבחן — " +
      "הדפסת דפוסים, סכימה, ספירה ועוד.",
    concepts: [
      {
        title: "לולאת for עם range — חזרה מספר ידוע של פעמים",
        explanation:
          "range(n) מייצר מספרים מ-0 עד n-1. " +
          "range(start, stop) מייצר מ-start עד stop-1. " +
          "שימו לב: המספר האחרון (stop) לא נכלל!",
        codeExample: `for i in range(5):
    print(i)`,
        expectedOutput: "0\n1\n2\n3\n4",
      },
      {
        title: "לולאת while — חזרה עד שתנאי מתקיים",
        explanation:
          "while ממשיכה כל עוד התנאי True. " +
          "חשוב לעדכן את המשתנה בתוך הלולאה — אחרת תיתקעו בלולאה אינסופית! " +
          "while שימושית כשלא ידוע מראש כמה פעמים צריך לחזור.",
        codeExample: `count = 1
while count <= 5:
    print(count)
    count = count + 1`,
        expectedOutput: "1\n2\n3\n4\n5",
      },
      {
        title: "break ו-continue",
        explanation:
          "break — עוצר את הלולאה לגמרי ויוצא ממנה. " +
          "continue — מדלג על שאר הקוד באיטרציה הנוכחית וממשיך לאיטרציה הבאה.",
        codeExample: `for i in range(10):
    if i == 3:
        continue
    if i == 6:
        break
    print(i)`,
        expectedOutput: "0\n1\n2\n4\n5",
      },
      {
        title: "דפוסי לולאות — צבירה וספירה",
        explanation:
          "דפוס הצבירה: מתחילים ממשתנה (כמו total = 0) ומוסיפים בכל סיבוב. " +
          "דפוס הספירה: סופרים כמה פעמים תנאי מתקיים. " +
          "שני הדפוסים האלה חוזרים שוב ושוב במבחן!",
        codeExample: `total = 0
for i in range(1, 6):
    total = total + i
print("הסכום:", total)

count = 0
for i in range(1, 11):
    if i % 2 == 0:
        count = count + 1
print("זוגיים:", count)`,
        expectedOutput: "הסכום: 15\nזוגיים: 5",
      },
      {
        title: "לולאות מקוננות",
        explanation:
          "לולאה בתוך לולאה — הפנימית רצה מלאה בכל איטרציה של החיצונית. " +
          "חשבו על שעון: המחוג הקטן זז לאט, והגדול רץ סיבוב שלם על כל צעד של הקטן.",
        codeExample: `for i in range(1, 4):
    for j in range(1, 4):
        print(i * j, end=" ")
    print()`,
        expectedOutput: "1 2 3 \n2 4 6 \n3 6 9 ",
      },
    ],
    commonMistakes: [
      "שכחה ש-range(5) מתחיל מ-0 ולא כולל 5",
      "לולאה אינסופית — שכחת לעדכן את המשתנה ב-while",
      "בלבול בין break (יציאה מהלולאה) ל-continue (דילוג לאיטרציה הבאה)",
      "שכחה ש-break יוצא רק מהלולאה הפנימית בלולאות מקוננות",
    ],
    quickTip:
      "בונים טבלת מעקב! רשמו עמודה לכל משתנה ושורה לכל איטרציה — ככה תדעו בדיוק מה קורה.",
    patternFamilies: [
      "range_loop",
      "range_step",
      "while_counter",
      "while_break",
      "continue_statement",
      "nested_loops",
    ],
    symbolExplainers: [
      { symbol: "for", meaning: "לולאה שרצה מספר ידוע של פעמים" },
      { symbol: "while", meaning: "לולאה שרצה כל עוד תנאי מתקיים" },
      { symbol: "range()", meaning: "מייצר רצף מספרים ללולאת for" },
      { symbol: "break", meaning: "יוצא מהלולאה מיד" },
      { symbol: "continue", meaning: "מדלג לאיטרציה הבאה" },
    ],
    prepQuestions: [
      {
        question: "כמה פעמים ירוץ הקוד בתוך הלולאה?\nfor i in range(4):\n    print(i)",
        options: ["4", "3", "5", "שגיאה"],
        correctAnswer: 0,
      },
      {
        question: "מה ידפיס הקוד?\ntotal = 0\nfor i in range(1, 4):\n    total = total + i\nprint(total)",
        options: ["6", "10", "3", "0"],
        correctAnswer: 0,
      },
    ],
    guidedExamples: [
      {
        title: "סכימת מספרים בלולאה — שלב אחרי שלב",
        code: `total = 0
for i in range(1, 5):
    total = total + i
print("הסכום:", total)`,
        steps: [
          {
            narration: "מתחילים ביצירת משתנה total עם ערך 0. זה \"מצבר\" — כאן נצבור את הסכום. בכל סיבוב של הלולאה נוסיף לו את ה-i הנוכחי.",
            highlightLines: [1],
            traceRow: [{ variable: "total", value: "0" }],
          },
          {
            narration: "הלולאה מתחילה: range(1, 5) מייצרת את המספרים 1, 2, 3, 4 (5 לא נכלל!). בסיבוב הראשון i=1. מחשבים total + i: 0 + 1 = 1. שומרים 1 בתוך total.",
            highlightLines: [2, 3],
            traceRow: [{ variable: "i", value: "1" }, { variable: "total", value: "1" }],
          },
          {
            narration: "סיבוב שני: i=2. מחשבים total + i: 1 + 2 = 3. total עודכן ל-3.",
            highlightLines: [2, 3],
            traceRow: [{ variable: "i", value: "2" }, { variable: "total", value: "3" }],
          },
          {
            narration: "סיבוב שלישי: i=3. מחשבים 3 + 3 = 6. total עודכן ל-6.",
            highlightLines: [2, 3],
            traceRow: [{ variable: "i", value: "3" }, { variable: "total", value: "6" }],
          },
          {
            narration: "סיבוב רביעי ואחרון: i=4. מחשבים 6 + 4 = 10. total עודכן ל-10. הלולאה מסתיימת — range(1,5) לא כולל 5.",
            highlightLines: [2, 3],
            traceRow: [{ variable: "i", value: "4" }, { variable: "total", value: "10" }],
          },
          {
            narration: "לבסוף מדפיסים את total. הפלט: הסכום: 10. שימו לב: 1+2+3+4 = 10. זה דפוס הצבירה הנפוץ ביותר במבחן!",
            highlightLines: [4],
          },
        ],
      },
    ],
  },
  {
    topicId: "11111111-0007-0000-0000-000000000000",
    title: "רשימות",
    realWorldAnalogy:
      "רשימה זה כמו עגלת קניות — אפשר להוסיף פריטים, להסיר, " +
      "לסדר אותם ולעבור על כולם. " +
      "בניגוד למחרוזות, ברשימה אפשר לשנות פריטים ישירות!",
    introduction:
      "בנושא הזה נלמד לעבוד עם רשימות — אוסף סדור של ערכים. " +
      "רשימות הן mutable (ניתנות לשינוי), מה שהופך אותן לכלי חזק ושימושי. " +
      "נלמד ליצור, לגשת, להוסיף, להסיר, למיין ולחתוך רשימות.",
    concepts: [
      {
        title: "יצירת רשימה וגישה לאיברים",
        explanation:
          "רשימה נוצרת בסוגריים מרובעים []. " +
          "גישה לאיבר לפי אינדקס (מתחיל מ-0). " +
          "אינדקס שלילי סופר מהסוף: lst[-1] הוא האחרון.",
        codeExample: `fruits = ["תפוח", "בננה", "תפוז"]
print(fruits[0])
print(fruits[-1])
print(len(fruits))`,
        expectedOutput: "תפוח\nתפוז\n3",
      },
      {
        title: "הוספה והסרה — append, pop, remove",
        explanation:
          "append() מוסיף איבר לסוף הרשימה. " +
          "pop() מסיר ומחזיר את האחרון (או לפי אינדקס). " +
          "remove() מסיר את המופע הראשון של ערך מסוים.",
        codeExample: `lst = [1, 2, 3]
lst.append(4)
print(lst)

lst.pop()
print(lst)

lst.remove(2)
print(lst)`,
        expectedOutput: "[1, 2, 3, 4]\n[1, 2, 3]\n[1, 3]",
      },
      {
        title: "חיתוך רשימות (Slicing)",
        explanation:
          "lst[start:stop] מחזיר רשימה חדשה מ-start עד stop-1. " +
          "בדיוק כמו חיתוך מחרוזות! " +
          "שימושי לחילוץ חלק מרשימה.",
        codeExample: `nums = [10, 20, 30, 40, 50]
print(nums[1:4])
print(nums[:3])
print(nums[2:])
print(nums[::-1])`,
        expectedOutput: "[20, 30, 40]\n[10, 20, 30]\n[30, 40, 50]\n[50, 40, 30, 20, 10]",
      },
      {
        title: "מיון וחיפוש — sort, in",
        explanation:
          "sort() ממיין את הרשימה במקום (משנה אותה). " +
          "sorted() מחזיר רשימה חדשה ממוינת בלי לשנות את המקור. " +
          "in בודק אם איבר קיים ברשימה.",
        codeExample: `nums = [3, 1, 4, 1, 5]
nums.sort()
print(nums)

print(4 in nums)
print(9 in nums)`,
        expectedOutput: "[1, 1, 3, 4, 5]\nTrue\nFalse",
      },
      {
        title: "List Comprehension — יצירת רשימה בשורה אחת",
        explanation:
          "דרך קומפקטית ליצור רשימה חדשה מתוך רשימה קיימת. " +
          "אפשר לסנן עם if ולהפעיל פעולה על כל איבר. " +
          "זו טכניקה מתקדמת שחוסכת הרבה שורות!",
        codeExample: `nums = [1, 2, 3, 4, 5, 6]
evens = [x for x in nums if x % 2 == 0]
print(evens)

squares = [x ** 2 for x in range(5)]
print(squares)`,
        expectedOutput: "[2, 4, 6]\n[0, 1, 4, 9, 16]",
      },
    ],
    commonMistakes: [
      "sort() ממיין במקום ומחזיר None — אל תכתבו lst = lst.sort()",
      "בלבול בין append (מוסיף איבר בודד) ל-extend (מוסיף רשימה)",
      "שינוי רשימה בתוך לולאה שרצה עליה — עלול לגרום לבאגים",
    ],
    quickTip:
      "שאלה שכיחה במבחן: כתוב קוד שמקבל רשימה ומחזיר רשימה חדשה. חשבו — האם לשנות את המקור או ליצור חדש?",
    patternFamilies: [
      "list_append_pop",
      "list_comprehension",
      "list_methods",
      "list_sort_vs_sorted",
      "list_extend_vs_append",
      "list_slicing",
    ],
    symbolExplainers: [
      { symbol: "[]", meaning: "יצירת רשימה ריקה או גישה לאיבר לפי אינדקס" },
      { symbol: ".append()", meaning: "מוסיף איבר לסוף הרשימה" },
      { symbol: ".pop()", meaning: "מסיר ומחזיר את האיבר האחרון" },
      { symbol: ".sort()", meaning: "ממיין את הרשימה במקום (משנה אותה)" },
      { symbol: "sorted()", meaning: "מחזיר רשימה חדשה ממוינת" },
      { symbol: "in", meaning: "בודק אם איבר קיים ברשימה" },
    ],
    prepQuestions: [
      {
        question: "מה ידפיס?\nlst = [3, 1, 4, 1, 5]\nlst.sort()\nprint(lst[-1])",
        options: ["5", "3", "None", "שגיאה"],
        correctAnswer: 0,
      },
      {
        question: "מה ידפיס?\nlst = [1, 2, 3]\nlst.append(4)\nprint(len(lst))",
        options: ["4", "3", "[1, 2, 3, 4]", "שגיאה"],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0005-0000-0000-000000000000",
    title: "פונקציות",
    realWorldAnalogy:
      "פונקציה זה כמו מתכון — כותבים אותו פעם אחת, " +
      "ואחר כך אפשר לבשל לפיו כמה פעמים שרוצים. " +
      "למתכון יש מרכיבים (פרמטרים) ותוצאה (ערך חזרה).",
    introduction:
      "בנושא הזה נלמד איך ליצור פונקציות — קטעי קוד עם שם שאפשר לקרוא להם שוב ושוב. " +
      "פונקציות הן אחד הנושאים המרכזיים במבחן: " +
      "תצטרכו לכתוב פונקציות, לקרוא להן ולהבין כיצד ערכים עוברים דרכן.",
    concepts: [
      {
        title: "פונקציה ראשונה — def וקריאה",
        explanation:
          "מגדירים פונקציה עם def, בוחרים שם, ומוסיפים נקודתיים. " +
          "הקוד בפנים מוזח. כדי להפעיל אותה — כותבים את שמה עם סוגריים.",
        codeExample: `def say_hello():
    print("שלום עולם!")

say_hello()
say_hello()`,
        expectedOutput: "שלום עולם!\nשלום עולם!",
      },
      {
        title: "פרמטרים וערך חזרה — return",
        explanation:
          "פרמטרים הם ערכים שהפונקציה מקבלת מבחוץ. " +
          "return מחזיר תוצאה לקוד שקרא לפונקציה. " +
          "בלי return — הפונקציה מחזירה None.",
        codeExample: `def add(a, b):
    return a + b

result = add(3, 4)
print(result)
print(add(10, 20))`,
        expectedOutput: "7\n30",
      },
      {
        title: "ערכי ברירת מחדל",
        explanation:
          "אפשר לתת לפרמטר ערך ברירת מחדל — " +
          "אז לא חייבים לשלוח אותו בקריאה. " +
          "פרמטרים עם ברירת מחדל תמיד בסוף!",
        codeExample: `def greet(name, greeting="שלום"):
    return greeting + ", " + name + "!"

print(greet("דנה"))
print(greet("יוסי", "היי"))`,
        expectedOutput: "שלום, דנה!\nהיי, יוסי!",
      },
      {
        title: "סקופ — משתנים מקומיים וגלובליים",
        explanation:
          "משתנה שמוגדר בתוך פונקציה הוא מקומי (local) — " +
          "לא נגיש מחוצה לה. משתנה מחוץ לפונקציה הוא גלובלי. " +
          "הפונקציה יכולה לקרוא משתנה גלובלי, אבל לא לשנות אותו בלי global.",
        codeExample: `x = 10

def show():
    y = 5
    print("בתוך הפונקציה:", x, y)

show()
print("בחוץ:", x)`,
        expectedOutput: "בתוך הפונקציה: 10 5\nבחוץ: 10",
      },
      {
        title: "רקורסיה — פונקציה שקוראת לעצמה",
        explanation:
          "פונקציה רקורסיבית קוראת לעצמה עם קלט קטן יותר. " +
          "חייב להיות תנאי עצירה (base case) — אחרת היא תרוץ לאינסוף! " +
          "כל קריאה עובדת על בעיה קטנה יותר עד שמגיעים לבסיס.",
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
      "שכחת return — הפונקציה מחזירה None ואז חישובים לא עובדים כצפוי",
      "שימוש במשתנה מקומי מחוץ לפונקציה — שגיאת NameError",
      "רקורסיה ללא תנאי עצירה — קריסה עם RecursionError",
    ],
    quickTip:
      "בשאלת כתיבת פונקציה במבחן: קראו את הדרישות, כתבו את החתימה (שם + פרמטרים), ודאו שיש return, ובדקו על דוגמת הקלט.",
    patternFamilies: [
      "return_value_usage",
      "return_none",
      "default_parameters",
      "local_scope",
      "global_keyword",
      "recursion",
    ],
    symbolExplainers: [
      { symbol: "def", meaning: "מילת המפתח להגדרת פונקציה" },
      { symbol: "return", meaning: "מחזיר ערך מהפונקציה לקוד שקרא לה" },
      { symbol: "None", meaning: "ערך ריק — מוחזר כשאין return" },
      { symbol: "global", meaning: "מאפשר לפונקציה לשנות משתנה גלובלי" },
    ],
    prepQuestions: [
      {
        question: "מה ידפיס הקוד?\ndef double(x):\n    return x * 2\n\nprint(double(5))",
        options: ["10", "5", "None", "שגיאה"],
        correctAnswer: 0,
      },
      {
        question: "מה תחזיר greet(\"עמי\") אם:\ndef greet(name, greeting=\"שלום\"):\n    return greeting + \", \" + name + \"!\"",
        options: ["שלום, עמי!", "עמי, שלום!", "None", "שגיאה"],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0006-0000-0000-000000000000",
    title: "מחרוזות",
    realWorldAnalogy:
      "מחרוזת זה כמו שרשרת חרוזים — כל חרוז הוא תו (אות, ספרה או סימן). " +
      "אפשר לגשת לכל חרוז לפי מיקומו בשרשרת, " +
      "אבל אי אפשר להחליף חרוז בודד — צריך ליצור שרשרת חדשה.",
    introduction:
      "בנושא הזה נלמד לעבוד עם טקסט בפייתון. " +
      "מחרוזות הן אחד מסוגי המידע הכי נפוצים — " +
      "נלמד לגשת לתווים בודדים, לחתוך חלקים, להשתמש במתודות שימושיות, " +
      "ולעבד מחרוזות בלולאות. נושא זה חוזר בכמעט כל מבחן!",
    concepts: [
      {
        title: "יצירת מחרוזות ואינדקסים",
        explanation:
          "מחרוזת נוצרת בגרשיים (\"\" או ''). len() מחזיר את האורך. " +
          "s[0] הוא התו הראשון, s[-1] הוא האחרון. " +
          "אינדקסים מתחילים מ-0!",
        codeExample: `s = "Python"
print(s[0])
print(s[-1])
print(len(s))`,
        expectedOutput: "P\nn\n6",
      },
      {
        title: "חיתוך (Slicing)",
        explanation:
          "s[start:stop] מחזיר תת-מחרוזת מ-start עד stop-1. " +
          "s[::-1] הופך את המחרוזת. " +
          "אפשר להשמיט start (מההתחלה) או stop (עד הסוף).",
        codeExample: `s = "Python"
print(s[1:4])
print(s[:3])
print(s[3:])
print(s[::-1])`,
        expectedOutput: "yth\nPyt\nhon\nnohtyP",
      },
      {
        title: "מתודות מחרוזת — upper, lower, find, replace",
        explanation:
          "upper() ממיר לאותיות גדולות, lower() לקטנות. " +
          "find() מוצא מיקום תת-מחרוזת (-1 אם לא נמצאת). " +
          "replace() מחליף כל מופע בתת-מחרוזת אחרת. " +
          "כל המתודות מחזירות מחרוזת חדשה — המקורית לא משתנה!",
        codeExample: `s = "Hello World"
print(s.upper())
print(s.lower())
print(s.find("World"))
print(s.replace("World", "Python"))`,
        expectedOutput: "HELLO WORLD\nhello world\n6\nHello Python",
      },
      {
        title: "פיצול וחיבור — split ו-join",
        explanation:
          "split() מפצל מחרוזת לרשימת מילים (ברירת מחדל: לפי רווחים). " +
          "join() מחבר רשימה למחרוזת עם מפריד ביניהם. " +
          "שני הדפוסים האלה חוזרים הרבה במבחן!",
        codeExample: `sentence = "שלום עולם יפה"
words = sentence.split()
print(words)
print("-".join(words))

csv = "80,95,70"
grades = csv.split(",")
print(grades)`,
        expectedOutput: "['שלום', 'עולם', 'יפה']\nשלום-עולם-יפה\n['80', '95', '70']",
      },
      {
        title: "עיבוד מחרוזות בלולאה",
        explanation:
          "אפשר לעבור תו אחרי תו עם for. " +
          "הדפוס הנפוץ: מתחילים עם result = \"\" ומוסיפים תווים בכל סיבוב. " +
          "אפשר גם לספור תווים מסוימים או לבנות מחרוזת חדשה לפי תנאי.",
        codeExample: `text = "Hello123"
count = 0
for ch in text:
    if ch.isdigit():
        count = count + 1
print("ספרות:", count)

result = ""
for ch in "abc":
    result = result + ch.upper()
print(result)`,
        expectedOutput: "ספרות: 3\nABC",
      },
    ],
    commonMistakes: [
      "ניסיון לשנות תו: s[0] = \"A\" — שגיאה! מחרוזות הן immutable",
      "שכחת שאינדקסים מתחילים מ-0 ולא מ-1",
      "בלבול בין find() (מחזיר -1) ל-index() (זורק שגיאה)",
    ],
    quickTip:
      "לבנות מחרוזת חדשה בלולאה: התחילו עם result = \"\" ואז result += בכל איטרציה. זהו הדפוס הכי נפוץ במבחן!",
    patternFamilies: [
      "string_slicing",
      "string_indexing",
      "string_find",
      "string_split",
      "string_join",
      "string_methods",
      "string_length",
      "string_concatenation",
    ],
    symbolExplainers: [
      { symbol: "s[i]", meaning: "גישה לתו במיקום i (מתחיל מ-0)" },
      { symbol: "s[a:b]", meaning: "חיתוך — תת-מחרוזת ממיקום a עד b-1" },
      { symbol: "s[::-1]", meaning: "היפוך המחרוזת" },
      { symbol: "len()", meaning: "מחזיר את אורך המחרוזת" },
      { symbol: ".split()", meaning: "מפצל מחרוזת לרשימה" },
      { symbol: ".join()", meaning: "מחבר רשימה למחרוזת" },
      { symbol: "in", meaning: "בודק אם תת-מחרוזת נמצאת בתוך מחרוזת" },
    ],
    prepQuestions: [
      {
        question: "מה יחזיר הביטוי \"Python\"[::-1]?",
        options: ["nohtyP", "Python", "P", "שגיאה"],
        correctAnswer: 0,
      },
      {
        question: "מה יחזיר \"hello world\".split()?",
        options: ["['hello', 'world']", "['hello world']", "hello world", "שגיאה"],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0008-0000-0000-000000000000",
    title: "טאפלים, סטים ומילונים",
    realWorldAnalogy:
      "שלושה מבנים שונים לשמירת מידע: " +
      "טאפל כמו תעודת זהות — אי אפשר לשנות את מה שכתוב בה. " +
      "סט (קבוצה) כמו סל ללא כפילויות — כל פריט מופיע פעם אחת בלבד. " +
      "מילון כמו ספר טלפונים — לכל שם יש מספר.",
    introduction:
      "בנושא הזה נלמד שלושה מבנים חשובים שמשלימים את רשימות: " +
      "טאפלים (לא ניתנים לשינוי), קבוצות (ללא כפילויות), " +
      "ומילונים (מיפוי מפתח לערך). " +
      "נושא זה חוזר בשאלות על עיבוד נתונים, ספירה וחיפוש.",
    concepts: [
      {
        title: "טאפלים — יצירה וגישה",
        explanation:
          "טאפל נוצר בסוגריים עגולים () או בפסיקים. " +
          "דומה לרשימה — אפשר לגשת לפי אינדקס — אבל אי אפשר לשנות! " +
          "שימושי לערכים שלא צריכים להשתנות, כמו קואורדינטות.",
        codeExample: `point = (3, 7)
print(point[0])
print(point[1])
print(len(point))`,
        expectedOutput: "3\n7\n2",
      },
      {
        title: "פריקת טאפל (Unpacking)",
        explanation:
          "אפשר לשים את האיברים של טאפל לתוך משתנים נפרדים בבת אחת. " +
          "מספר המשתנים חייב להתאים למספר האיברים בטאפל. " +
          "שימושי גם להחלפת ערכים: a, b = b, a",
        codeExample: `point = (3, 7)
x, y = point
print("x:", x)
print("y:", y)

a, b = 1, 2
a, b = b, a
print("a:", a, "b:", b)`,
        expectedOutput: "x: 3\ny: 7\na: 2 b: 1",
      },
      {
        title: "קבוצות (Sets) — ייחודיות",
        explanation:
          "קבוצה נוצרת עם set() או עם {} (עם ערכים בפנים). " +
          "אין כפילויות — אם מוסיפים ערך שכבר קיים, הוא לא נוסף. " +
          "אין סדר — אי אפשר לגשת לפי אינדקס.",
        codeExample: `nums = {1, 2, 3, 2, 1}
print(nums)

nums.add(4)
print(nums)
print(3 in nums)`,
        expectedOutput: "{1, 2, 3}\n{1, 2, 3, 4}\nTrue",
      },
      {
        title: "פעולות קבוצה — איחוד, חיתוך, הפרש",
        explanation:
          "| (או union) — איחוד, כל האיברים משתי הקבוצות. " +
          "& (או intersection) — חיתוך, רק מה שמשותף. " +
          "- (או difference) — הפרש, מה שבראשונה ולא בשנייה.",
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
          "מילון נוצר עם {} וזוגות key: value. " +
          "גישה לפי מפתח: d[key]. d.get(key, default) בטוח יותר — לא זורק שגיאה. " +
          "d.keys() — המפתחות, d.values() — הערכים, d.items() — הזוגות.",
        codeExample: `grades = {"דנה": 95, "יוסי": 80}
grades["רן"] = 90
print(grades["דנה"])
print(grades.get("לילי", 0))

for name, grade in grades.items():
    print(name, grade)`,
        expectedOutput: "95\n0\nדנה 95\nיוסי 80\nרן 90",
      },
    ],
    commonMistakes: [
      "ניסיון לשנות טאפל: t[0] = 5 — שגיאת TypeError",
      "גישה לאיבר בקבוצה לפי אינדקס: s[0] — שגיאה! לקבוצות אין סדר",
      "בלבול בין {} ריק (מילון!) ל-set() ריק (קבוצה)",
    ],
    quickTip:
      "ספירת מופעים עם מילון: d[key] = d.get(key, 0) + 1 — דפוס שחוזר הרבה במבחן!",
    patternFamilies: [
      "tuple_immutability",
      "set_operations",
      "set_duplicates",
      "dict_access",
      "dict_iteration",
      "dict_get_default",
    ],
    symbolExplainers: [
      { symbol: "()", meaning: "יצירת טאפל (אוסף לא ניתן לשינוי)" },
      { symbol: "set()", meaning: "יצירת קבוצה ריקה" },
      { symbol: "{k: v}", meaning: "יצירת מילון עם מפתח וערך" },
      { symbol: "|", meaning: "איחוד קבוצות" },
      { symbol: "&", meaning: "חיתוך קבוצות" },
      { symbol: ".get()", meaning: "גישה בטוחה למילון — לא זורק שגיאה" },
      { symbol: ".items()", meaning: "מחזיר את זוגות מפתח-ערך מהמילון" },
    ],
    prepQuestions: [
      {
        question: "מה יחזיר הביטוי {1, 2, 3} & {2, 3, 4}?",
        options: ["{2, 3}", "{1, 2, 3, 4}", "{1, 4}", "שגיאה"],
        correctAnswer: 0,
      },
      {
        question: "מה ידפיס?\nd = {\"a\": 1}\nprint(d.get(\"b\", 0))",
        options: ["0", "None", "שגיאה", "\"b\""],
        correctAnswer: 0,
      },
    ],
  },
  {
    topicId: "11111111-0002-0000-0000-000000000000",
    title: "אריתמטיקה ואופרטורים",
    realWorldAnalogy:
      "אופרטורים זה כמו כפתורים במחשבון — " +
      "כל כפתור עושה פעולה מתמטית אחרת. " +
      "בפייתון יש לנו את כל הכפתורים הרגילים (+, -, ×, ÷) " +
      "ועוד כמה מיוחדים שלא קיימים במחשבון רגיל.",
    introduction:
      "בנושא הזה נלמד את כל הפעולות החשבוניות בפייתון: " +
      "חיבור, חיסור, כפל, חילוק, חילוק שלם, שארית וחזקות. " +
      "נכיר גם פונקציות מתמטיות מובנות כמו abs() ו-round(). " +
      "הכרת האופרטורים האלה חיונית — הם מופיעים בכל נושא שנלמד אחר כך.",
    concepts: [
      {
        title: "ארבע פעולות חשבון",
        explanation:
          "פייתון תומך בחיבור (+), חיסור (-), כפל (*) וחילוק (/). " +
          "שימו לב: חילוק רגיל (/) תמיד מחזיר מספר עשרוני (float), גם אם התוצאה שלמה.",
        codeExample: `print(10 + 3)
print(10 - 3)
print(10 * 3)
print(10 / 3)`,
        expectedOutput: "13\n7\n30\n3.3333333333333335",
      },
      {
        title: "חילוק שלם ושארית — // ו-%",
        explanation:
          "// מחזיר רק את החלק השלם של החילוק (בלי שבר). " +
          "% (מודולו) מחזיר את השארית. " +
          "שני האופרטורים האלה שימושיים מאוד — למשל, n % 10 נותן את הספרה האחרונה של מספר.",
        codeExample: `print(17 // 5)
print(17 % 5)
print(123 % 10)
print(123 // 10)`,
        expectedOutput: "3\n2\n3\n12",
      },
      {
        title: "חזקות וסדר פעולות",
        explanation:
          "** מחשב חזקה. סדר הפעולות בפייתון זהה למתמטיקה: " +
          "סוגריים ← חזקות ← כפל/חילוק ← חיבור/חיסור. " +
          "כשלא בטוחים — שימו סוגריים!",
        codeExample: `print(2 ** 3)
print(3 ** 2)
print(2 + 3 * 4)
print((2 + 3) * 4)`,
        expectedOutput: "8\n9\n14\n20",
      },
      {
        title: "פונקציות מתמטיות מובנות",
        explanation:
          "abs() מחזיר ערך מוחלט. round() מעגל מספר עשרוני. " +
          "לפונקציות נוספות כמו שורש ועיגול למעלה/למטה — " +
          "משתמשים ב-import math.",
        codeExample: `print(abs(-7))
print(round(3.7))
print(round(3.14159, 2))

import math
print(math.sqrt(16))
print(math.floor(3.9))`,
        expectedOutput: "7\n4\n3.14\n4.0\n3",
      },
      {
        title: "ביטויים משולבים",
        explanation:
          "אפשר לשלב כמה אופרטורים בביטוי אחד. " +
          "פייתון מחשב לפי סדר פעולות, משמאל לימין כשהעדיפות שווה. " +
          "שימו לב: חילוק (/) תמיד נותן float!",
        codeExample: `x = 10
y = 3
print(x + y * 2)
print(x % y)
print(x ** 2 + y ** 2)`,
        expectedOutput: "16\n1\n109",
      },
    ],
    commonMistakes: [
      "בלבול בין / (חילוק עשרוני, מחזיר float) ל-// (חילוק שלם, מחזיר int)",
      "שכחה שסדר פעולות קיים: 2 + 3 * 4 זה 14 ולא 20",
      "בלבול בין ** (חזקה) ל-* (כפל): 2**3 = 8, לא 6",
      "שכחה ש-round() מעגל לזוגי: round(2.5) = 2, לא 3",
    ],
    quickTip:
      "% ו-// הם הצמד הכי שימושי: % 10 נותן את הספרה האחרונה, // 10 מסיר אותה. נשתמש בזה הרבה!",
    patternFamilies: [
      "floor_division",
      "modulo",
      "power_operator",
      "operator_precedence",
      "math_functions",
      "rounding",
      "mixed_type_arithmetic",
    ],
    symbolExplainers: [
      { symbol: "//", meaning: "חילוק שלם — מחזיר רק את החלק השלם" },
      { symbol: "%", meaning: "מודולו — מחזיר את השארית מחילוק" },
      { symbol: "**", meaning: "חזקה — בסיס בחזקת מעריך" },
      { symbol: "abs()", meaning: "ערך מוחלט — מרחק מאפס" },
      { symbol: "round()", meaning: "עיגול מספר עשרוני" },
    ],
    prepQuestions: [
      {
        question: "מה יחזיר הביטוי 17 % 5?",
        options: ["3", "2", "3.4", "0"],
        correctAnswer: 1,
      },
      {
        question: "מה יחזיר הביטוי 7 // 2?",
        options: ["3", "3.5", "4", "שגיאה"],
        correctAnswer: 0,
      },
    ],
  },
];

topicTutorials.push(pythonOopTopicTutorialForLearnPage);

export function getTutorialByTopicId(topicId: string): TopicTutorial | undefined {
  return topicTutorials.find((t) => t.topicId === topicId);
}

/**
 * Bidirectional slug ↔ UUID map for the 8 canonical topics.
 * Allows routes to work with either `/learn/variables_io` or
 * `/learn/11111111-0001-0000-0000-000000000000`.
 */
const SLUG_TO_UUID: Record<string, string> = {
  variables_io: "11111111-0001-0000-0000-000000000000",
  arithmetic: "11111111-0002-0000-0000-000000000000",
  conditions: "11111111-0003-0000-0000-000000000000",
  loops: "11111111-0004-0000-0000-000000000000",
  functions: "11111111-0005-0000-0000-000000000000",
  strings: "11111111-0006-0000-0000-000000000000",
  lists: "11111111-0007-0000-0000-000000000000",
  tuples_sets_dicts: "11111111-0008-0000-0000-000000000000",
  classes_objects: "11111111-0009-0000-0000-000000000000",
  inheritance: "11111111-000a-0000-0000-000000000000",
  polymorphism: "11111111-000b-0000-0000-000000000000",
  files_exceptions: "11111111-000c-0000-0000-000000000000",
  decorators_special: "11111111-000d-0000-0000-000000000000",
  [PYTHON_OOP_TOPIC_SLUG]: PYTHON_OOP_TOPIC_UUID,
};

const UUID_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_TO_UUID).map(([slug, uuid]) => [uuid, slug]),
);

/**
 * Resolve a topic identifier that may be either a slug (`variables_io`) or a
 * UUID (`11111111-0001-…`).  Returns both forms so callers can use whichever
 * their data layer expects, or `null` when the identifier is unknown.
 */
export function resolveTopicId(idOrSlug: string): { uuid: string; slug: string } | null {
  if (SLUG_TO_UUID[idOrSlug]) {
    return { uuid: SLUG_TO_UUID[idOrSlug], slug: idOrSlug };
  }
  if (UUID_TO_SLUG[idOrSlug]) {
    return { uuid: idOrSlug, slug: UUID_TO_SLUG[idOrSlug] };
  }
  return null;
}
