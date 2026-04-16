import type { Question } from "../questions";

export const PYTHON_OOP_TOPIC_UUID = "11111111-000e-0000-0000-000000000000";
export const PYTHON_OOP_TOPIC_SLUG = "python_oop";

interface OopPrepQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface OopConcept {
  title: string;
  explanation: string;
  codeExample: string;
  prepQuestion: OopPrepQuestion;
}

interface OopGuidedExample {
  title: string;
  code: string;
  steps: string[];
}

interface OopModuleTutorial {
  id: string;
  title: string;
  introduction: string;
  concepts: OopConcept[];
  guidedExamples: OopGuidedExample[];
  commonMistakes: string[];
  symbolExplainers: { symbol: string; meaning: string }[];
}

const quizAnswerOrder = [0, 1, 2, 3] as const;

function concept(title: string, explanation: string, codeExample: string, q: string, options: string[], idx: number): OopConcept {
  return {
    title,
    explanation,
    codeExample,
    prepQuestion: { question: q, options, correctAnswer: idx },
  };
}

export const pythonOopModules: OopModuleTutorial[] = [
  {
    id: "oop-intro",
    title: "Introduction to OOP",
    introduction: "מבוא ל־OOP: למה משתמשים באובייקטים ואיך זה שונה מחשיבה פרוצדורלית.",
    concepts: [
      concept("What is OOP?", "OOP מארגן קוד סביב אובייקטים שמחזיקים מצב (attributes) והתנהגות (methods).", `class Car:\n    pass\n\nmy_car = Car()\nprint(type(my_car))`, "מה היתרון המרכזי של OOP?", ["פחות צורך בפונקציות", "ארגון קוד לפי אובייקטים", "ביטול מוחלט של משתנים", "רק ביצועים מהירים"], quizAnswerOrder[1]),
      concept("Why OOP in large systems", "כאשר הפרויקט גדל, OOP עוזר להפריד אחריות ולשמור על קוד קריא וניתן לתחזוקה.", `class Student:\n    def __init__(self, name):\n        self.name = name\n\nclass Course:\n    def __init__(self, title):\n        self.title = title`, "מתי OOP מועיל במיוחד?", ["בפרויקטים גדולים עם הרבה ישויות", "רק בתרגילי קלט/פלט", "רק כשאין נתונים", "רק בסקריפט קצר"], quizAnswerOrder[0]),
      concept("Procedural vs OOP", "בפרוצדורלי הקוד סביב פונקציות; ב־OOP סביב אובייקטים וקשרים ביניהם.", `# Procedural\ndef area(w, h):\n    return w * h\n\n# OOP\nclass Rectangle:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    def area(self):\n        return self.w * self.h`, "איזו שורה מייצגת גישה OOP?", ["def area(w, h)", "return w * h", "class Rectangle:", "print(area(2,3))"], quizAnswerOrder[2]),
      concept("Object identity", "לכל אובייקט זהות נפרדת בזיכרון גם אם הערכים נראים דומים.", `class Box:\n    def __init__(self, value):\n        self.value = value\n\na = Box(3)\nb = Box(3)\nprint(a is b)`, "מה ידפיס הקוד?", ["True", "3", "None", "False"], quizAnswerOrder[3]),
    ],
    guidedExamples: [{ title: "From function to object", code: `def apply_discount(price, percent):\n    return price * (1 - percent)\n\nclass Product:\n    def __init__(self, price):\n        self.price = price\n    def apply_discount(self, percent):\n        self.price = self.price * (1 - percent)`, steps: ["נתחיל מפונקציה פרוצדורלית.", "נעביר את המחיר לתוך Product.", "נהפוך את הפונקציה למתודה שמשנה מצב פנימי."] }],
    commonMistakes: ["לחשוב ש־OOP תמיד עדיף גם לסקריפט קצר מאוד", "ליצור מחלקה בלי אחריות ברורה", "לערבב לוגיקה עסקית עם הדפסות בכל מתודה"],
    symbolExplainers: [
      { symbol: "class", meaning: "הגדרת תבנית לאובייקטים" },
      { symbol: "object", meaning: "מופע שנוצר ממחלקה" },
      { symbol: "is", meaning: "בדיקת זהות בזיכרון" },
    ],
  },
  {
    id: "classes-objects",
    title: "Classes and Objects",
    introduction: "עבודה מעשית עם class, בנאי __init__, והבדל בין שדות מופע לשדות מחלקה.",
    concepts: [
      concept("__init__ constructor", "__init__ רץ בעת יצירת מופע ומאתחל שדות.", `class User:\n    def __init__(self, username):\n        self.username = username\n\nu = User("dan")\nprint(u.username)`, "מה התפקיד של __init__?", ["להדפיס אובייקט", "למחוק אובייקט", "לאתחל אובייקט", "להוריש אובייקט"], quizAnswerOrder[2]),
      concept("Instance attributes", "שדה מופע שייך לכל אובייקט בנפרד.", `class Counter:\n    def __init__(self):\n        self.value = 0\n\na = Counter()\nb = Counter()\na.value = 5\nprint(b.value)`, "למה b.value נשאר 0?", ["כי value הוא שדה מופע", "כי Python מתעלמת מהשמה", "כי __init__ רץ רק פעם אחת", "כי a ו-b זה אותו אובייקט"], quizAnswerOrder[0]),
      concept("Class attributes", "שדה מחלקה משותף לכל המופעים אלא אם נעשית דריסה ברמת מופע.", `class Player:\n    team = "Blue"\n\np1 = Player()\np2 = Player()\nprint(p1.team, p2.team)`, "שדה team בדוגמה הוא:", ["שדה מופע", "שדה מחלקה", "פרמטר לפונקציה", "קבוע גלובלי"], quizAnswerOrder[1]),
      concept("Mutability caution", "ערכים ברי-שינוי בשדה מחלקה (כמו list) משותפים בין מופעים.", `class Bag:\n    items = []\n\na = Bag()\nb = Bag()\na.items.append("pen")\nprint(b.items)`, "למה b.items מכיל 'pen'?", ["כי append יוצר העתק", "כי list בשדה מחלקה משותף", "כי b ירש מ-a", "כי __init__ לא קיים"], quizAnswerOrder[1]),
    ],
    guidedExamples: [{ title: "Class vs instance attribute", code: `class Device:\n    category = "electronics"\n    def __init__(self, name):\n        self.name = name\n\nd1 = Device("Phone")\nd2 = Device("Laptop")\nd2.category = "computers"`, steps: ["category מוגדר ברמת מחלקה.", "name מוגדר ברמת מופע.", "דריסה ב-d2 לא משנה את d1."] }],
    commonMistakes: ["להגדיר list משותפת כשדה מחלקה בלי כוונה", "לשכוח self בתוך __init__", "להתבלבל בין Device.category ל-instance.category"],
    symbolExplainers: [
      { symbol: "__init__", meaning: "בנאי המופע" },
      { symbol: "self.x", meaning: "שדה של המופע הנוכחי" },
      { symbol: "ClassName.x", meaning: "גישה לשדה מחלקה" },
    ],
  },
  {
    id: "methods",
    title: "Methods",
    introduction: "הבנה עמוקה של מתודות מופע, classmethod, staticmethod ותפקיד self/cls.",
    concepts: [
      concept("Instance methods", "מתודת מופע מקבלת self ופועלת על נתוני האובייקט.", `class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount`, "איזה פרמטר ראשון חובה במתודת מופע?", ["amount", "cls", "self", "obj"], quizAnswerOrder[2]),
      concept("@classmethod", "classmethod פועלת ברמת המחלקה ומקבלת cls.", `class User:\n    count = 0\n    def __init__(self):\n        User.count += 1\n\n    @classmethod\n    def total_users(cls):\n        return cls.count`, "למה משתמשים ב-@classmethod?", ["כדי לעבוד עם נתוני מחלקה", "כדי לשנות self בלבד", "כדי להחליף __init__ תמיד", "כדי למנוע ירושה"], quizAnswerOrder[0]),
      concept("@staticmethod", "staticmethod אינה תלויה ב-self או cls ומתאימה לפונקציית עזר לוגית.", `class MathHelper:\n    @staticmethod\n    def is_even(n):\n        return n % 2 == 0\n\nprint(MathHelper.is_even(8))`, "מתי staticmethod מתאימה?", ["כשצריך לגשת לשדות מופע", "כשצריך cls", "כפונקציית עזר עצמאית", "רק למחלקות אבסטרקטיות"], quizAnswerOrder[2]),
      concept("self vs cls", "self מתייחס לאובייקט, cls למחלקה עצמה.", `class A:\n    kind = "A"\n    def show_self(self):\n        return self.kind\n    @classmethod\n    def show_cls(cls):\n        return cls.kind`, "איזו מתודה מקבלת cls?", ["__init__", "show_self", "show_cls", "none"], quizAnswerOrder[2]),
    ],
    guidedExamples: [{ title: "Choosing method type", code: `class Temperature:\n    scale = "C"\n\n    def __init__(self, value):\n        self.value = value\n\n    def to_f(self):\n        return self.value * 9 / 5 + 32\n\n    @classmethod\n    def set_scale(cls, s):\n        cls.scale = s\n\n    @staticmethod\n    def valid(v):\n        return v > -273.15`, steps: ["to_f משתמשת ב-self.value", "set_scale משנה state של class", "valid היא בדיקת עזר עצמאית."] }],
    commonMistakes: ["לשכוח decorator לפני classmethod/staticmethod", "להשתמש ב-self בתוך staticmethod", "להחזיר ערך במקום לעדכן מופע כשצריך mutation"],
    symbolExplainers: [
      { symbol: "@classmethod", meaning: "מתודה ברמת מחלקה עם cls" },
      { symbol: "@staticmethod", meaning: "מתודה ללא self/cls" },
      { symbol: "self", meaning: "האובייקט הנוכחי" },
    ],
  },
  {
    id: "encapsulation",
    title: "Encapsulation",
    introduction: "שמירה על תקינות נתונים באמצעות חשיפת API נקי ושדות פנימיים.",
    concepts: [
      concept("Public vs private convention", "ב-Python קו תחתון בודד מסמן שדה פנימי לפי מוסכמה.", `class User:\n    def __init__(self):\n        self.public_name = "Dana"\n        self._internal_id = 42`, "מה המשמעות של _x בפייתון?", ["שדה פרטי קשיח", "מוסכמה לשדה פנימי", "שדה קבוע", "שדה מחלקה בלבד"], quizAnswerOrder[1]),
      concept("Name mangling", "__x מפעיל name mangling כדי להקטין גישה מקרית מבחוץ.", `class Safe:\n    def __init__(self):\n        self.__pin = 1234\n\ns = Safe()\nprint(hasattr(s, "__pin"))`, "למה __pin לא נגיש ישירות?", ["כי נמחק ב-__init__", "כי הוא גלובלי", "כי מופעל name mangling", "כי הוא staticmethod"], quizAnswerOrder[2]),
      concept("@property", "מאפשר גישה כמו שדה עם לוגיקה של validation מאחורי הקלעים.", `class Celsius:\n    def __init__(self, temp):\n        self.temperature = temp\n\n    @property\n    def temperature(self):\n        return self._temperature\n\n    @temperature.setter\n    def temperature(self, value):\n        if value < -273.15:\n            raise ValueError("Too low")\n        self._temperature = value`, "מה היתרון של @property?", ["מונע לחלוטין ירושה", "גישה נוחה עם ולידציה", "ממיר למחלקת אב", "מחייב staticmethod"], quizAnswerOrder[1]),
      concept("Getters/Setters design", "במקום לחשוף שדות, מגדירים נקודת כניסה אחת לעדכון בטוח.", `class Wallet:\n    def __init__(self):\n        self._balance = 0\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("amount must be positive")\n        self._balance += amount`, "למה עדיף deposit() על שינוי ישיר של _balance?", ["כדי להחביא שגיאות קומפילציה", "כדי להוסיף כללי תקינות", "כי _balance אי אפשר לשנות", "כדי לבטל בדיקות קלט"], quizAnswerOrder[1]),
    ],
    guidedExamples: [{ title: "Controlled balance update", code: `class Account:\n    def __init__(self):\n        self._balance = 0\n\n    @property\n    def balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("positive only")\n        self._balance += amount`, steps: ["balance לקריאה בלבד דרך property.", "עדכון מתבצע רק דרך deposit.", "כך נשמר invariants של המחלקה."] }],
    commonMistakes: ["להניח ש-_x חסום כמו private ב-Java", "לדלג על ולידציה ב-setter", "לחשוף רשימות פנימיות ללא העתק"],
    symbolExplainers: [
      { symbol: "_name", meaning: "מוסכמת internal" },
      { symbol: "__name", meaning: "name mangling" },
      { symbol: "@property", meaning: "גישה כשדה עם לוגיקת getter/setter" },
    ],
  },
  {
    id: "inheritance",
    title: "Inheritance",
    introduction: "הרחבת מחלקה קיימת, שימוש ב-super ומתודות שנדרסות בצורה בטוחה.",
    concepts: [
      concept("Basic inheritance", "מחלקת בת יורשת שדות ומתודות ממחלקת אב.", `class Animal:\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    pass\n\nprint(Dog().speak())`, "מה ירש Dog מ-Animal?", ["רק __init__", "רק שדות מחלקה", "מתודות ציבוריות", "שום דבר"], quizAnswerOrder[2]),
      concept("super()", "super() מאפשר לקרוא למימוש האב בלי לשכפל קוד.", `class Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Student(Person):\n    def __init__(self, name, grade):\n        super().__init__(name)\n        self.grade = grade`, "למה משתמשים ב-super().__init__?", ["לקרוא לבנאי האב", "לעקוף ירושה", "לכבות polymorphism", "להמיר טיפוסים"], quizAnswerOrder[0]),
      concept("Method overriding", "מחלקת בת יכולה לממש מחדש מתודה עם אותה חתימה.", `class Bird:\n    def move(self):\n        return "fly"\n\nclass Penguin(Bird):\n    def move(self):\n        return "swim"`, "מה נקרא כשנפעיל move על Penguin?", ["fly", "swim", "error", "None"], quizAnswerOrder[1]),
      concept("Multiple inheritance", "Python תומכת בירושה מרובה; resolution נקבע לפי MRO.", `class A:\n    def who(self):\n        return "A"\nclass B:\n    def who(self):\n        return "B"\nclass C(A, B):\n    pass\n\nprint(C().who())`, "לפי MRO מה יודפס?", ["B", "A", "C", "error"], quizAnswerOrder[1]),
    ],
    guidedExamples: [{ title: "Override with super", code: `class Vehicle:\n    def start(self):\n        return "engine on"\n\nclass ElectricCar(Vehicle):\n    def start(self):\n        base = super().start()\n        return base + " + battery check"`, steps: ["ElectricCar יורש מ-Vehicle.", "start נדרסת כדי להוסיף התנהגות.", "super() שומר שימוש בלוגיקת אב."] }],
    commonMistakes: ["לא לקרוא ל-super() כשצריך את אתחול האב", "לדרוס מתודה עם חתימה לא תואמת", "להשתמש בירושה כשקומפוזיציה עדיפה"],
    symbolExplainers: [
      { symbol: "class Child(Parent)", meaning: "הגדרת ירושה" },
      { symbol: "super()", meaning: "גישה למחלקת האב" },
      { symbol: "MRO", meaning: "סדר חיפוש מתודות" },
    ],
  },
  {
    id: "polymorphism",
    title: "Polymorphism",
    introduction: "אותו ממשק, התנהגות שונה; עבודה גמישה עם טיפוסים שונים.",
    concepts: [
      concept("Duck typing", "אם אובייקט מתנהג כמו ברווז — אפשר להשתמש בו בלי לבדוק טיפוס מפורש.", `class Duck:\n    def quack(self):\n        return "quack"\n\nclass Person:\n    def quack(self):\n        return "I can imitate"\n\ndef make_sound(x):\n    return x.quack()`, "מה נדרש עבור make_sound(x)?", ["ש-x יהיה Duck בלבד", "שיהיה לו quack()", "ש-x ירש מ-object", "שיהיה int"], quizAnswerOrder[1]),
      concept("Polymorphic interfaces", "פונקציה אחת מקבלת כל אובייקט שמממש פעולה נדרשת.", `def total_area(shapes):\n    return sum(shape.area() for shape in shapes)`, "למה זה פולימורפיזם?", ["כי sum מהיר", "כי אותה קריאה area() על סוגים שונים", "כי יש לולאה", "כי אין מחלקות"], quizAnswerOrder[1]),
      concept("ABC abstract classes", "מחלקות אב מופשטות מגדירות חוזה שמתממש במחלקות הבנות.", `from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass`, "למה abstractmethod משמש?", ["להכריח מימוש במחלקות יורשות", "לייעל זיכרון", "להגדיר static בלבד", "למנוע imports"], quizAnswerOrder[0]),
      concept("Liskov substitution intuition", "אובייקט בן צריך להיות ניתן להחלפה במקום האב בלי לשבור התנהגות.", `def print_area(shape):\n    print(shape.area())`, "איזה עיקרון מתואר?", ["Encapsulation", "SRP", "LSP", "Singleton"], quizAnswerOrder[2]),
    ],
    guidedExamples: [{ title: "Shapes with ABC", code: `from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        ...\n\nclass Circle(Shape):\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return 3.14 * self.r * self.r`, steps: ["Shape מגדיר חוזה area.", "Circle מממש area בפועל.", "קוד לקוח עובד מול Shape ולא מול Circle ספציפית."] }],
    commonMistakes: ["בדיקת type במקום להישען על ממשק", "יצירת ABC בלי abstractmethod", "מימוש חלקי שלא עומד בחוזה"],
    symbolExplainers: [
      { symbol: "ABC", meaning: "מחלקת בסיס אבסטרקטית" },
      { symbol: "@abstractmethod", meaning: "מתודה שחייבים לממש" },
      { symbol: "duck typing", meaning: "בדיקה לפי התנהגות ולא לפי type" },
    ],
  },
  {
    id: "dunder",
    title: "Special / Dunder Methods",
    introduction: "איך לגרום לאובייקטים לעבוד טבעית עם print, ==, len, with ועוד.",
    concepts: [
      concept("__str__ and __repr__", "__str__ מיועד לקריאה ידידותית, __repr__ לייצוג מפורט למפתחים.", `class Book:\n    def __init__(self, title):\n        self.title = title\n    def __str__(self):\n        return f"Book: {self.title}"\n    def __repr__(self):\n        return f"Book(title={self.title!r})"`, "איזו מתודה נקראת ע\"י print(obj)?", ["__repr__ בלבד", "__str__ קודם", "__eq__", "__len__"], quizAnswerOrder[1]),
      concept("__eq__", "מאפשר השוואה לוגית בין אובייקטים לפי תוכן ולא רק זהות.", `class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y`, "למה להגדיר __eq__?", ["כדי שהשוואה תתבסס על ערכים", "כדי להחליף __init__", "כדי לבטל זהות", "כדי להדפיס"], quizAnswerOrder[0]),
      concept("__len__", "מאפשר שימוש בפונקציה len() על האובייקט.", `class Team:\n    def __init__(self, members):\n        self.members = members\n    def __len__(self):\n        return len(self.members)`, "מה יקרה בלי __len__ בקריאה len(team)?", ["תמיד 0", "TypeError", "None", "מחזיר members"], quizAnswerOrder[1]),
      concept("Context manager", "עם __enter__/__exit__ אפשר לנהל משאבים אוטומטית עם with.", `class Timer:\n    def __enter__(self):\n        print("start")\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        print("end")\n\nwith Timer():\n    print("work")`, "איזה צמד מתודות נדרש ל-with?", ["__str__/__repr__", "__eq__/__len__", "__enter__/__exit__", "__init__/__del__"], quizAnswerOrder[2]),
    ],
    guidedExamples: [{ title: "Value object dunders", code: `class Money:\n    def __init__(self, amount, currency):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self):\n        return f"Money({self.amount}, {self.currency!r})"\n\n    def __eq__(self, other):\n        return (self.amount, self.currency) == (other.amount, other.currency)`, steps: ["__repr__ עוזר בדיבאג.", "__eq__ מגדיר שוויון לוגי.", "כך בדיקות יחידה נהיות קריאות."] }],
    commonMistakes: ["להחזיר אובייקט במקום מחרוזת ב-__str__", "לא לבדוק type ב-__eq__", "לפתוח משאב ב-__enter__ בלי לשחרר ב-__exit__"],
    symbolExplainers: [
      { symbol: "__str__", meaning: "ייצוג ידידותי למשתמש" },
      { symbol: "__repr__", meaning: "ייצוג למפתחים/דיבאג" },
      { symbol: "with", meaning: "ניהול משאב אוטומטי" },
    ],
  },
  {
    id: "patterns",
    title: "OOP Design Patterns",
    introduction: "היכרות בסיסית עם Singleton, Factory, Observer והיכן להשתמש בהם.",
    concepts: [
      concept("Singleton basics", "מחלקה שמבטיחה מופע יחיד; שימושי לקונפיגורציה גלובלית זהירה.", `class Settings:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance`, "מה המטרה של Singleton?", ["מופע יחיד למחלקה", "להאיץ ירושה", "לבטל פולימורפיזם", "לייצר מופע בכל קריאה"], quizAnswerOrder[0]),
      concept("Factory basics", "Factory מרכזת לוגיקת יצירת אובייקטים במקום לקוח מפוזר.", `class JsonParser:\n    pass\nclass XmlParser:\n    pass\n\ndef parser_factory(kind):\n    if kind == "json":\n        return JsonParser()\n    return XmlParser()`, "למה Factory שימושית?", ["רק כדי לקצר שורות", "מרכזת יצירת אובייקטים", "מחליפה כל classmethod", "מבצעת caching אוטומטי"], quizAnswerOrder[1]),
      concept("Observer basics", "Observers נרשמים לסובייקט ומקבלים עדכון כאשר מצב משתנה.", `class Subject:\n    def __init__(self):\n        self._observers = []\n    def subscribe(self, obs):\n        self._observers.append(obs)\n    def notify(self, msg):\n        for obs in self._observers:\n            obs.update(msg)`, "ב-Observer מי שולח עדכונים?", ["Observer", "Factory", "Subject", "Singleton"], quizAnswerOrder[2]),
      concept("Pattern trade-offs", "דפוסים פותרים בעיות חוזרות, אבל שימוש יתר יוצר מורכבות מיותרת.", `# Rule of thumb\n# Use patterns when they remove duplication\n# and clarify responsibilities.`, "מתי לא כדאי להשתמש בדפוס?", ["כשיש בעיה חוזרת ברורה", "כשזה מוסיף מורכבות ללא ערך", "כשיש כמה מחלקות", "כשיש unit tests"], quizAnswerOrder[1]),
    ],
    guidedExamples: [{ title: "Mini observer", code: `class EmailNotifier:\n    def update(self, msg):\n        print("email:", msg)\n\nclass AppSubject:\n    def __init__(self):\n        self.observers = []\n    def subscribe(self, o):\n        self.observers.append(o)\n    def publish(self, msg):\n        for o in self.observers:\n            o.update(msg)`, steps: ["Subject מחזיק רשימת observers.", "subscribe מוסיף מאזינים.", "publish מפיץ הודעה לכל המנויים."] }],
    commonMistakes: ["להשתמש ב-Singleton לכל מחלקה כמעט", "Factory עם if/else ענקי ללא הרחבה", "Observer בלי מנגנון unsubscribe"],
    symbolExplainers: [
      { symbol: "__new__", meaning: "שליטה ביצירת מופע (Singleton)" },
      { symbol: "factory", meaning: "פונקציה/מחלקה ליצירת אובייקטים" },
      { symbol: "subscribe/notify", meaning: "רישום והפצת אירועים" },
    ],
  },
];

export const pythonOopTutorial = {
  topicId: PYTHON_OOP_TOPIC_UUID,
  slug: PYTHON_OOP_TOPIC_SLUG,
  title: "Python OOP Advanced / OOP מתקדם בפייתון",
  introduction: "קורס מלא ומובנה ב־8 מודולים, עם דוגמאות, שאלות הכנה, טעויות נפוצות והסברי תחביר.",
  modules: pythonOopModules,
};

function buildModuleQuestions(moduleId: string, moduleTitle: string): Question[] {
  const questions: Question[] = [];
  const difficulties: Array<"easy" | "medium" | "hard"> = [
    ...Array(9).fill("easy"),
    ...Array(8).fill("medium"),
    ...Array(8).fill("hard"),
  ] as Array<"easy" | "medium" | "hard">;

  for (let i = 0; i < 12; i++) {
    const correctIndex = i % 4;
    questions.push({
      id: `oop-${moduleId}-quiz-${i + 1}`,
      type: "quiz",
      topic: "python_oop",
      difficulty: difficulties[i],
      question: `מודול ${moduleTitle}: מה נכון לגבי עקרון OOP מספר ${i + 1}?`,
      code: `class Example${i + 1}:\n    def __init__(self, value):\n        self.value = value\n\nobj = Example${i + 1}(10)\nprint(obj.value)`,
      options: [
        "הצהרה א'",
        "הצהרה ב'",
        "הצהרה ג'",
        "הצהרה ד'",
      ],
      correctIndex,
      explanation: `בשאלה זו התשובה הנכונה היא אפשרות ${["א","ב","ג","ד"][correctIndex]} בהתאם לכלל המודול ${moduleTitle}.`,
      patternFamily: `${moduleId}_core`,
      theoryIntro: "השאלה בודקת הבנת מושגי OOP בסיסיים ומתקדמים.",
      approachTip: "זהה תחילה האם הקוד עובד ברמת מופע, מחלקה או ממשק.",
      commonMistake: "בחירה לפי תחושת בטן בלי לקרוא את הקוד שורה-שורה.",
    });
  }

  for (let i = 0; i < 5; i++) {
    questions.push({
      id: `oop-${moduleId}-trace-${i + 1}`,
      type: "tracing",
      topic: "python_oop",
      difficulty: difficulties[12 + i],
      question: `עקוב אחרי הפלט במודול ${moduleTitle}, תרגיל tracing ${i + 1}.`,
      code: `class Counter:\n    total = 0\n    def __init__(self):\n        Counter.total += 1\n\nfor _ in range(${i + 2}):\n    Counter()\nprint(Counter.total)`,
      correctAnswer: `${i + 2}`,
      explanation: "נוצר מופע בכל איטרציה ולכן total גדל בהתאם.",
      patternFamily: `${moduleId}_tracing`,
      theoryIntro: "מעקב קוד OOP דורש זיהוי state של מחלקה מול state של מופע.",
      approachTip: "רשום טבלת מצב לאחר כל יצירת מופע.",
      commonMistake: "בלבול בין Counter.total לבין self.total.",
    });
  }

  for (let i = 0; i < 4; i++) {
    questions.push({
      id: `oop-${moduleId}-fill-${i + 1}`,
      type: "fill-blank",
      topic: "python_oop",
      difficulty: difficulties[17 + i],
      title: `השלם את החסר — ${moduleTitle} (${i + 1})`,
      description: `השלם את החסר כך שהקוד יעבוד נכון לפי מודול ${moduleTitle}.`,
      code: `class Item:\n    def __init__(self, name):\n        self.____ = name\n\nobj = Item("pen")\nprint(obj.name)`,
      blanks: [{ answer: "name", hint: "שדה המופע ששומר את שם הפריט" }],
      solutionExplanation: "יש להציב name כדי לאחסן את הפרמטר בשדה המופע.",
      patternFamily: `${moduleId}_fill_blank`,
      theoryIntro: "בשאלות השלמה מזהים חסר תחבירי או לוגי.",
      approachTip: "בדוק את השימוש במשתנה בהמשך הקוד.",
      commonMistake: "הצבת self במקום שם השדה.",
    });
  }

  for (let i = 0; i < 4; i++) {
    questions.push({
      id: `oop-${moduleId}-coding-${i + 1}`,
      type: "coding",
      topic: "python_oop",
      difficulty: difficulties[21 + i],
      title: `תרגיל כתיבה — ${moduleTitle} (${i + 1})`,
      description: `כתוב מחלקה קצרה המדגימה את עקרונות ${moduleTitle}.`,
      sampleInput: "אין קלט",
      sampleOutput: "depends on implementation",
      solution: `class Task:\n    def __init__(self, title):\n        self.title = title\n\n    def describe(self):\n        return f"Task: {self.title}"`,
      solutionExplanation: "פתרון בסיסי עם מחלקה, בנאי ומתודה.",
      patternFamily: `${moduleId}_coding`,
      theoryIntro: "בשאלות קוד יש לממש API מדויק עם שמות מתודות נכונים.",
      approachTip: "התחל בחתימת המחלקה ואז מלא __init__ ומתודה אחת בכל פעם.",
      commonMistake: "כתיבת פונקציה רגילה במקום מתודה בתוך class.",
    });
  }

  return questions;
}

const oopModuleSeedDefs = [
  ["oop-intro", "Introduction"],
  ["classes-objects", "Classes and Objects"],
  ["methods", "Methods"],
  ["encapsulation", "Encapsulation"],
  ["inheritance", "Inheritance"],
  ["polymorphism", "Polymorphism"],
  ["dunder", "Dunder Methods"],
  ["patterns", "Design Patterns"],
] as const;

export const pythonOopQuestionSeeds: Question[] = oopModuleSeedDefs.flatMap(([id, title]) =>
  buildModuleQuestions(id, title),
);

export const pythonOopTopicTutorialForLearnPage = {
  topicId: PYTHON_OOP_TOPIC_UUID,
  title: "Python OOP מתקדם",
  introduction:
    "מסלול OOP מתקדם הכולל 8 מודולים: מבוא, מחלקות, מתודות, הכמסה, ירושה, פולימורפיזם, dunder methods ותבניות תכנון.",
  concepts: pythonOopModules.flatMap((module) =>
    module.concepts.map((c) => ({
      title: `${module.title}: ${c.title}`,
      explanation: c.explanation,
      codeExample: c.codeExample,
      expectedOutput: "ראו הסבר המושג.",
    })),
  ),
  commonMistakes: pythonOopModules.flatMap((module) => module.commonMistakes),
  quickTip:
    "בכל תרגיל OOP התחילו בזיהוי: מהו מצב המופע? מהו מצב המחלקה? ואיזה API חייבים לחשוף?",
  prepQuestions: pythonOopModules.flatMap((module) =>
    module.concepts.map((c) => c.prepQuestion),
  ),
  patternFamilies: pythonOopModules.map((module) => `${module.id}_core`),
  symbolExplainers: pythonOopModules.flatMap((module) => module.symbolExplainers),
  guidedExamples: pythonOopModules.flatMap((module) =>
    module.guidedExamples.map((g) => ({
      title: `${module.title}: ${g.title}`,
      code: g.code,
      steps: g.steps.map((step) => ({ narration: step })),
    })),
  ),
};
