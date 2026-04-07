export interface PrepQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
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
  },
];

export function getTutorialByTopicId(topicId: string): TopicTutorial | undefined {
  return topicTutorials.find((t) => t.topicId === topicId);
}
