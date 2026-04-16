-- ============================================================
-- OOP Questions Part 5: Decorators & Special Methods — 16 questions
-- ============================================================

-- Q1 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'easy', 'dunder_str',
  E'מה יודפס?\n\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    def __str__(self):\n        return f"כלב: {self.name}"\n\nd = Dog("רקס")\nprint(d)',
  'כלב: רקס',
  E'<__main__.Dog object>',
  'Dog(רקס)',
  'שגיאה',
  'a',
  '__str__ מגדיר מה מודפס כש-print() פועל על האובייקט. בלי __str__, מודפסת כתובת הזיכרון של האובייקט.',
  'לשכוח להגדיר __str__ ולקבל ייצוג לא קריא של האובייקט.',
  true);

-- Q2 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'easy', 'dunder_repr',
  'מה ההבדל בין __str__ ל-__repr__?',
  '__str__ מיועד למשתמש הסופי, __repr__ מיועד למפתח (ייצוג חד-ערכי)',
  '__str__ מחזיר מספר, __repr__ מחזיר מחרוזת',
  'אין הבדל — שניהם עושים אותו דבר',
  '__repr__ נקרא רק בדיבאגר',
  'a',
  '__str__ נקרא ע"י print() ו-str() ומיועד לתצוגה קריאה. __repr__ נקרא בקונסולה ו-repr() ומיועד לתת ייצוג חד-ערכי שאידיאלית ניתן ליצור ממנו את האובייקט מחדש.',
  'לחשוב ש-__repr__ לא חשוב — הוא קריטי לדיבאגינג.',
  true);

-- Q3 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'medium', 'property_decorator',
  E'מה יודפס?\n\nclass Circle:\n    def __init__(self, radius):\n        self._radius = radius\n    @property\n    def radius(self):\n        return self._radius\n    @radius.setter\n    def radius(self, value):\n        if value < 0:\n            raise ValueError("רדיוס שלילי")\n        self._radius = value\n\nc = Circle(5)\nc.radius = 10\nprint(c.radius)',
  '10',
  '5',
  'שגיאה — radius הוא property ולא ניתן להציב בו',
  'שגיאה — ValueError',
  'a',
  '@property מגדיר getter, @radius.setter מגדיר setter. c.radius=10 קורא ל-setter (10≥0, תקין). c.radius קורא ל-getter → 10.',
  'לחשוב שproperty רק-קריאה — אפשר להוסיף setter.',
  true);

-- Q4 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'tracing', 'medium', 'dunder_eq',
  'מה יודפס?',
  E'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y\n\np1 = Point(1, 2)\np2 = Point(1, 2)\np3 = Point(3, 4)\nprint(p1 == p2, p1 == p3)',
  'True False',
  'True False',
  'False False',
  'True True',
  'שגיאה',
  'a',
  '__eq__ מגדיר == מותאם. p1==p2: שניהם (1,2) → True. p1==p3: (1,2)≠(3,4) → False. בלי __eq__, == בודק זהות (is), לא שוויון.',
  'לחשוב ש-== כברירת מחדל משווה ערכים — בלי __eq__ הוא משווה כתובות בזיכרון.',
  true);

-- Q5 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'medium', 'staticmethod',
  E'מה יודפס?\n\nclass MathUtils:\n    @staticmethod\n    def add(a, b):\n        return a + b\n\nprint(MathUtils.add(3, 7))\nm = MathUtils()\nprint(m.add(1, 2))',
  E'10\n3',
  E'10\nשגיאה',
  E'שגיאה — staticmethod לא מקבל פרמטרים',
  E'10\nNone',
  'a',
  '@staticmethod לא מקבל self. אפשר לקרוא לה דרך המחלקה (MathUtils.add) או דרך מופע (m.add). שני האופנים עובדים.',
  'לחשוב ש-staticmethod ניתנת לקריאה רק דרך המחלקה.',
  true);

-- Q6 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'tracing', 'medium', 'dunder_len',
  'מה יודפס?',
  E'class Playlist:\n    def __init__(self, songs):\n        self.songs = songs\n    def __len__(self):\n        return len(self.songs)\n    def __getitem__(self, idx):\n        return self.songs[idx]\n\np = Playlist(["שיר א", "שיר ב", "שיר ג"])\nprint(len(p))\nprint(p[1])',
  E'3\nשיר ב',
  E'3\nשיר ב',
  E'שגיאה — len לא עובדת על Playlist',
  E'3\nשיר א',
  E'3\n1',
  'a',
  '__len__ מאפשר len(p)=3. __getitem__ מאפשר p[1]="שיר ב" (אינדוקס 0-based). שני הdunders הופכים את Playlist לאוסף.',
  'לשכוח שאינדוקס מתחיל מ-0 — p[1] זה האיבר השני.',
  true);

-- Q7 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'hard', 'classmethod',
  E'מה יודפס?\n\nclass Date:\n    def __init__(self, day, month, year):\n        self.day = day\n        self.month = month\n        self.year = year\n    @classmethod\n    def from_string(cls, s):\n        d, m, y = s.split("-")\n        return cls(int(d), int(m), int(y))\n    def __repr__(self):\n        return f"{self.day}/{self.month}/{self.year}"\n\nprint(Date.from_string("15-04-2026"))',
  '15/4/2026',
  '15-04-2026',
  'שגיאה — cls לא מוגדר',
  'Date(15, 4, 2026)',
  'a',
  '@classmethod מקבל cls (המחלקה). from_string מפרק את המחרוזת ויוצר Date חדש. __repr__ מגדיר את הצגת האובייקט → "15/4/2026".',
  'לבלבל בין @classmethod (מקבל cls) ל-@staticmethod (לא מקבל cls/self).',
  true);

-- Q8 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'tracing', 'hard', 'dunder_add',
  'מה יודפס?',
  E'class Money:\n    def __init__(self, amount):\n        self.amount = amount\n    def __add__(self, other):\n        return Money(self.amount + other.amount)\n    def __gt__(self, other):\n        return self.amount > other.amount\n    def __repr__(self):\n        return f"₪{self.amount}"\n\na = Money(50)\nb = Money(30)\nc = a + b\nprint(c, a > b, b > a)',
  E'₪80 True False',
  E'₪80 True False',
  E'80 True False',
  E'₪80 False True',
  'שגיאה',
  'a',
  'a+b → __add__ → Money(80). a>b → __gt__ → 50>30=True. b>a → 30>50=False. __repr__ מגדיר הצגת "₪80".',
  'לשכוח ש-__gt__ מגדיר רק > — צריך __lt__ בנפרד ל-<.',
  true);

-- Q9 — easy, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'fill_blank', 'easy', 'dunder_str',
  'השלם כדי שprint על אובייקט Book ידפיס את הכותרת:',
  E'class Book:\n    def __init__(self, title):\n        self.title = title\n    def ___(self):\n        return self.title\n\nb = Book("הנסיך הקטן")\nprint(b)',
  '__str__',
  '__repr__',
  '__print__',
  'to_string',
  'a',
  '__str__ נקרא ע"י print() ו-str(). כדי שprint(b) ידפיס את הכותרת, צריך להגדיר __str__ שמחזיר self.title.',
  'לחפש מתודה בשם __print__ — היא לא קיימת בפייתון.',
  true);

-- Q10 — medium, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'fill_blank', 'medium', 'property_decorator',
  'השלם כדי ש-name יהיה property רק-קריאה:',
  E'class User:\n    def __init__(self, name):\n        self._name = name\n    ___\n    def name(self):\n        return self._name',
  '@property',
  '@staticmethod',
  '@classmethod',
  '@getter',
  'a',
  '@property מעל מתודה הופך אותה ל-getter. אפשר לגשת ל-user.name בלי סוגריים, וכיוון שאין setter, הוא רק-קריאה.',
  'לחשוב שצריך @getter — בפייתון זה @property.',
  true);

-- Q11 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'medium', 'dunder_str',
  E'מה יודפס?\n\nclass Color:\n    def __init__(self, r, g, b):\n        self.r = r\n        self.g = g\n        self.b = b\n    def __repr__(self):\n        return f"Color({self.r}, {self.g}, {self.b})"\n\nc = Color(255, 128, 0)\nprint(c)\nprint([c])',
  E'Color(255, 128, 0)\n[Color(255, 128, 0)]',
  E'<Color object>\n[<Color object>]',
  E'Color(255, 128, 0)\n[<Color object>]',
  'שגיאה',
  'a',
  'כשאין __str__, print משתמש ב-__repr__. ברשימות, print תמיד משתמש ב-__repr__ לכל איבר. לכן שני הפלטים משתמשים ב-__repr__.',
  'לחשוב שברשימה print משתמש ב-__str__ — ברשימות תמיד __repr__.',
  true);

-- Q12 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'hard', 'property_validation',
  E'מה יודפס?\n\nclass Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n    @property\n    def celsius(self):\n        return self._celsius\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError("מתחת לאפס מוחלט")\n        self._celsius = value\n    @property\n    def fahrenheit(self):\n        return self._celsius * 9/5 + 32\n\nt = Temperature(100)\nprint(t.fahrenheit)',
  '212.0',
  '100',
  'שגיאה — fahrenheit הוא property',
  '373.15',
  'a',
  'celsius setter שומר 100 ב-_celsius. fahrenheit property מחשב: 100 * 9/5 + 32 = 212.0. Property מאפשר חישוב דינמי בגישה.',
  'לשכוח ש-__init__ משתמש ב-setter (self.celsius = celsius עובר דרך ה-setter).',
  true);

-- Q13 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'easy', 'staticmethod',
  'מה ההבדל בין @staticmethod ל-@classmethod?',
  '@staticmethod לא מקבל self או cls, @classmethod מקבל cls',
  '@staticmethod מהיר יותר',
  'אין הבדל — שניהם זהים',
  '@classmethod לא ניתן לקרוא מבחוץ',
  'a',
  '@staticmethod היא פונקציה רגילה שיושבת במחלקה — לא מקבלת self או cls. @classmethod מקבלת cls (המחלקה) ויכולה ליצור מופעים או לגשת לתכונות מחלקה.',
  'לחשוב שstaticmethod ו-classmethod זה אותו דבר — יש הבדל משמעותי.',
  true);

-- Q14 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'medium', 'dunder_contains',
  E'מה יודפס?\n\nclass WordSet:\n    def __init__(self, words):\n        self.words = [w.lower() for w in words]\n    def __contains__(self, word):\n        return word.lower() in self.words\n\nws = WordSet(["Hello", "WORLD"])\nprint("hello" in ws, "python" in ws)',
  'True False',
  'False False',
  'True True',
  'שגיאה',
  'a',
  '__contains__ מגדיר את אופרטור in. הוא ממיר לאותיות קטנות לפני ההשוואה. "hello" → True, "python" → False.',
  'לשכוח lower() ולקבל False על "hello" כי המקורי הוא "Hello".',
  true);

-- Q15 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'tracing', 'hard', 'dunder_call',
  'מה יודפס?',
  E'class Multiplier:\n    def __init__(self, factor):\n        self.factor = factor\n    def __call__(self, x):\n        return x * self.factor\n\ndouble = Multiplier(2)\ntriple = Multiplier(3)\n\nprint(double(5), triple(5))\nprint(double(double(3)))',
  E'10 15\n12',
  E'10 15\n12',
  E'שגיאה — אובייקט לא ניתן לקריאה',
  E'10 15\n6',
  E'Multiplier(10) Multiplier(15)\n12',
  'a',
  '__call__ הופך אובייקט לcallable. double(5)=10, triple(5)=15. double(double(3))=double(6)=12.',
  'לחשוב שאובייקטים לא ניתנים לקריאה כפונקציה — __call__ מאפשר בדיוק את זה.',
  true);

-- Q16 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000d-0000-0000-000000000000', 'multiple_choice', 'hard', 'decorator_pattern',
  E'מה יודפס?\n\nclass Cached:\n    def __init__(self, func):\n        self.func = func\n        self.cache = {}\n    def __call__(self, *args):\n        if args not in self.cache:\n            self.cache[args] = self.func(*args)\n        return self.cache[args]\n\n@Cached\ndef fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)\n\nprint(fib(6))',
  '8',
  '13',
  'שגיאה — Cached לא דקורטור',
  '6',
  'a',
  '@Cached הופך את fib לאובייקט Cached עם __call__. fib(6)=fib(5)+fib(4)=5+3=8. ה-cache מונע חישובים כפולים.',
  'לשכוח שמחלקה עם __call__ יכולה לשמש כדקורטור — לא רק פונקציות.',
  true);
