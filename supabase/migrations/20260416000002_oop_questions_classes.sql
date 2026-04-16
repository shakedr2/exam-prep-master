-- ============================================================
-- OOP Questions Part 1: Classes & Objects (מחלקות ואובייקטים)
-- 16 questions — mix of multiple_choice, tracing, coding, fill_blank
-- ============================================================

-- Q1 — easy, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'easy', 'class_basics',
  'מה התפקיד של המילה self בתוך מחלקה בפייתון?',
  'self מתייחס למופע (instance) הנוכחי של המחלקה',
  'self הוא שם של משתנה גלובלי',
  'self מייצג את המחלקה עצמה ולא את המופע',
  'self הוא מילה שמורה שחובה להשתמש בה',
  'a',
  'self הוא הפרמטר הראשון בכל מתודה במחלקה והוא מצביע על המופע הספציפי שעליו נקראה המתודה. דרכו ניגשים לתכונות ולמתודות של האובייקט.',
  'לחשוב ש-self הוא מילה שמורה — בפועל זו מוסכמה, אפשר לקרוא לו בכל שם אחר.',
  true);

-- Q2 — easy, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'easy', 'class_basics',
  'מה תפקיד מתודת __init__ במחלקה?',
  'היא הבנאי (constructor) — נקראת אוטומטית כשיוצרים מופע חדש',
  'היא מתודה שמוחקת את האובייקט מהזיכרון',
  'היא מדפיסה את תכונות האובייקט',
  'היא מתודה פרטית שלא ניתן לקרוא לה מבחוץ',
  'a',
  '__init__ היא מתודת האתחול (בנאי). היא נקראת אוטומטית בכל פעם שיוצרים אובייקט חדש מהמחלקה, ומשמשת להגדרת תכונות התחלתיות.',
  'לחשוב ש-__init__ מחזירה ערך — היא תמיד מחזירה None.',
  true);

-- Q3 — easy, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'easy', 'class_basics',
  E'מה יודפס?\n\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n\nd = Dog("רקס")\nprint(d.name)',
  'רקס',
  'Dog',
  'name',
  'שגיאה',
  'a',
  'יצרנו מופע של Dog עם name="רקס". d.name ניגש לתכונה name של המופע d, שהוגדרה ב-__init__.',
  'לשכוח self.name ולכתוב רק name — אז זה משתנה מקומי שלא נשמר באובייקט.',
  true);

-- Q4 — medium, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'medium', 'class_attributes',
  E'מה יודפס?\n\nclass Counter:\n    count = 0\n    def __init__(self):\n        Counter.count += 1\n\na = Counter()\nb = Counter()\nc = Counter()\nprint(Counter.count)',
  '3',
  '1',
  '0',
  'שגיאה',
  'a',
  'count היא תכונת מחלקה (class attribute) משותפת לכל המופעים. כל יצירת מופע מגדילה אותה ב-1. יצרנו 3 מופעים, לכן count = 3.',
  'לבלבל בין תכונת מחלקה (משותפת) לתכונת מופע (ייחודית לכל אובייקט).',
  true);

-- Q5 — medium, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'medium', 'class_methods',
  E'מה יודפס?\n\nclass Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    def area(self):\n        return self.w * self.h\n\nr = Rect(3, 4)\nprint(r.area())',
  '12',
  '7',
  '(3, 4)',
  'שגיאה — חסר self',
  'a',
  'area() מחשבת שטח מלבן: self.w * self.h = 3 * 4 = 12. המתודה ניגשת לתכונות דרך self.',
  'לשכוח את הסוגריים בקריאה ל-r.area() — בלי סוגריים מקבלים הפניה לפונקציה, לא את התוצאה.',
  true);

-- Q6 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'tracing', 'medium', 'class_state',
  'מה יודפס לאחר הרצת הקוד הבא?',
  E'class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n        return self.balance\n\nacc = BankAccount(100)\nacc.deposit(50)\nacc.withdraw(30)\nprint(acc.balance)',
  '120',
  '120',
  '150',
  '70',
  '100',
  'a',
  'מתחילים עם balance=100. deposit(50) → 150. withdraw(30) → 150-30=120. acc.balance = 120.',
  'לשכוח שהמתודות משנות את self.balance — כל פעולה משנה את המצב הפנימי של האובייקט.',
  true);

-- Q7 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'tracing', 'medium', 'class_state',
  'מה יודפס לאחר הרצת הקוד הבא?',
  E'class Student:\n    def __init__(self, name, grades=None):\n        self.name = name\n        self.grades = grades if grades else []\n    def add_grade(self, grade):\n        self.grades.append(grade)\n    def average(self):\n        if not self.grades:\n            return 0\n        return sum(self.grades) / len(self.grades)\n\ns = Student("דני")\ns.add_grade(80)\ns.add_grade(90)\ns.add_grade(100)\nprint(s.average())',
  '90.0',
  '90.0',
  '80',
  '270',
  'שגיאה',
  'a',
  'הציונים הם [80, 90, 100]. הממוצע: (80+90+100)/3 = 270/3 = 90.0.',
  'לשכוח ש-sum()/len() מחזיר float בפייתון 3 (90.0 ולא 90).',
  true);

-- Q8 — medium, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'medium', 'class_vs_instance',
  E'מה יודפס?\n\nclass Cat:\n    species = "חתול"\n    def __init__(self, name):\n        self.name = name\n\na = Cat("מיצי")\nb = Cat("שמוליק")\na.species = "נמר"\nprint(b.species)',
  'חתול',
  'נמר',
  'שגיאה',
  'Cat',
  'a',
  'a.species = "נמר" יוצרת תכונת מופע חדשה ב-a שמסתירה את תכונת המחלקה. b עדיין ניגש לתכונת המחלקה המקורית "חתול".',
  'לחשוב שהשינוי ב-a משפיע על b — שינוי דרך מופע יוצר תכונה מקומית ולא משנה את המחלקה.',
  true);

-- Q9 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'tracing', 'hard', 'mutable_default',
  'מה יודפס לאחר הרצת הקוד הבא?',
  E'class Team:\n    def __init__(self, name, members=[]):\n        self.name = name\n        self.members = members\n    def add(self, member):\n        self.members.append(member)\n\nt1 = Team("A")\nt1.add("Alice")\nt2 = Team("B")\nt2.add("Bob")\nprint(t1.members)',
  E'[''Alice'', ''Bob'']',
  E'[''Alice'', ''Bob'']',
  E'[''Alice'']',
  E'[''Bob'']',
  'שגיאה',
  'a',
  'מלכודת קלאסית! ברירת מחדל מסוג מותנה (mutable default) משותפת בין כל הקריאות. t1 ו-t2 חולקים את אותה רשימה. הפתרון: להשתמש ב-None כברירת מחדל.',
  'לחשוב שכל קריאה ל-__init__ יוצרת רשימה חדשה — רשימת ברירת המחדל נוצרת פעם אחת.',
  true);

-- Q10 — hard, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'hard', 'class_methods',
  E'מה יודפס?\n\nclass MyList:\n    def __init__(self):\n        self.items = []\n    def add(self, item):\n        self.items.append(item)\n        return self\n\nm = MyList()\nm.add(1).add(2).add(3)\nprint(m.items)',
  '[1, 2, 3]',
  '[3]',
  'שגיאה — add לא מחזירה ערך',
  '[1]',
  'a',
  'add() מחזירה self, מה שמאפשר שרשור מתודות (method chaining). כל קריאה מוסיפה איבר ומחזירה את האובייקט עצמו.',
  'לשכוח את return self — בלי זה השרשור לא עובד כי add מחזירה None.',
  true);

-- Q11 — easy, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'fill_blank', 'easy', 'class_basics',
  'השלם את הקוד כדי שהמחלקה Circle תקבל רדיוס ותחשב שטח:',
  E'import math\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = ___\n    def area(self):\n        return math.pi * self.___ ** 2',
  'radius, radius',
  'r, r',
  'self.radius, radius',
  'radius, self.radius',
  'a',
  'בשורה הראשונה שומרים את הפרמטר radius בתכונה self.radius = radius. בשורה השנייה ניגשים לתכונה: self.radius.',
  'לשכוח self בגישה לתכונה — בלי self.radius ניגשים למשתנה מקומי שלא קיים.',
  true);

-- Q12 — medium, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'fill_blank', 'medium', 'class_methods',
  'השלם כדי שהמתודה describe תחזיר מחרוזת עם שם ועיר:',
  E'class Person:\n    def __init__(self, name, city):\n        self.name = name\n        self.city = city\n    def describe(___):\n        return f"{___.name} גר/ה ב-{___.city}"',
  'self, self, self',
  'this, this, this',
  'cls, cls, cls',
  'Person, Person, Person',
  'a',
  'כל מתודה של מופע מקבלת self כפרמטר ראשון. בתוך המתודה ניגשים לתכונות דרך self.name ו-self.city.',
  'להשתמש ב-this במקום self — בפייתון המוסכמה היא self.',
  true);

-- Q13 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'tracing', 'hard', 'class_scope',
  'מה יודפס לאחר הרצת הקוד הבא?',
  E'class Box:\n    size = 0\n    def __init__(self, size):\n        self.size = size\n    def grow(self, n):\n        self.size += n\n\nb1 = Box(5)\nb2 = Box(10)\nb1.grow(3)\nprint(b1.size, b2.size, Box.size)',
  '8 10 0',
  '8 10 0',
  '8 10 8',
  '13 10 0',
  '8 13 0',
  'a',
  'b1 מתחיל עם size=5 (תכונת מופע שמסתירה את תכונת המחלקה). grow(3) → 5+3=8. b2.size=10 (לא השתנה). Box.size=0 (תכונת המחלקה לא נגעו בה).',
  'לבלבל בין self.size (תכונת מופע) ל-Box.size (תכונת מחלקה).',
  true);

-- Q14 — medium, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'medium', 'class_basics',
  'מה ההבדל בין מתודה לפונקציה רגילה?',
  'מתודה מוגדרת בתוך מחלקה ומקבלת self כפרמטר ראשון',
  'מתודה יכולה להחזיר ערך ופונקציה לא יכולה',
  'אין הבדל — זה אותו דבר',
  'מתודה חייבת לקבל בדיוק פרמטר אחד',
  'a',
  'מתודה היא פונקציה שמוגדרת בתוך מחלקה. ההבדל העיקרי הוא שמתודת מופע מקבלת את self כפרמטר ראשון, שמאפשר גישה לתכונות ולמתודות אחרות של האובייקט.',
  'לחשוב שמתודות לא יכולות לקבל פרמטרים נוספים מעבר ל-self.',
  true);

-- Q15 — easy, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'easy', 'class_basics',
  E'מה יודפס?\n\nclass Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Point(3, 7)\nprint(type(p))',
  E'<class ''__main__.Point''>',
  'Point',
  'dict',
  'tuple',
  'a',
  'type() על מופע מחזיר את המחלקה שממנה נוצר. p הוא מופע של Point, לכן type(p) הוא <class ''__main__.Point''>.',
  'לצפות שtype() יחזיר מחרוזת פשוטה — הוא מחזיר אובייקט מחלקה.',
  true);

-- Q16 — hard, multiple_choice
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-0009-0000-0000-000000000000', 'multiple_choice', 'hard', 'class_methods',
  E'מה יודפס?\n\nclass Node:\n    def __init__(self, val, next_node=None):\n        self.val = val\n        self.next = next_node\n\nc = Node(3)\nb = Node(2, c)\na = Node(1, b)\n\nresult = []\ncurrent = a\nwhile current:\n    result.append(current.val)\n    current = current.next\nprint(result)',
  '[1, 2, 3]',
  '[3, 2, 1]',
  '[1]',
  'שגיאה — לולאה אינסופית',
  'a',
  'זו רשימה מקושרת: a→b→c. הלולאה עוברת מ-a (val=1) ל-b (val=2) ל-c (val=3), ואז current=None והלולאה נגמרת.',
  'לחשוב שהלולאה אינסופית — current.next של הצומת האחרון הוא None שעוצר את ה-while.',
  true);
