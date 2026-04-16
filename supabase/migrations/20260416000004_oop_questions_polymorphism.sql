-- ============================================================
-- OOP Questions Part 3: Polymorphism (פולימורפיזם) — 16 questions
-- ============================================================

-- Q1 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'easy', 'duck_typing',
  'מה הכוונה ב-"duck typing" בפייתון?',
  'אם אובייקט מתנהג כמו ברווז (יש לו את המתודות הנדרשות) — אפשר להשתמש בו',
  'חובה להגדיר טיפוסים לכל משתנה',
  'רק אובייקטים מאותו סוג יכולים לשתף מתודות',
  'פייתון בודקת טיפוסים בזמן קומפילציה',
  'a',
  'בפייתון לא חשוב מאיזו מחלקה האובייקט — חשוב שיש לו את המתודות הנדרשות. "אם זה הולך כמו ברווז ומקרקר כמו ברווז — זה ברווז."',
  'לחשוב שפייתון דורשת ירושה כדי להשתמש בפולימורפיזם — duck typing לא דורש ירושה.',
  true);

-- Q2 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'easy', 'polymorphism_basics',
  E'מה יודפס?\n\nclass Dog:\n    def sound(self):\n        return "הב"\n\nclass Cat:\n    def sound(self):\n        return "מיאו"\n\nfor animal in [Dog(), Cat()]:\n    print(animal.sound(), end=" ")',
  'הב מיאו',
  'שגיאה — Dog ו-Cat לא יורשות ממחלקה משותפת',
  'הב הב',
  'מיאו מיאו',
  'a',
  'זה פולימורפיזם — שני אובייקטים שונים עם מתודה באותו שם. הלולאה קוראת ל-sound() על כל אובייקט, ולכל אחד יש מימוש אחר.',
  'לחשוב שצריך מחלקת אב משותפת — בפייתון duck typing מספיק.',
  true);

-- Q3 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'medium', 'abstract_class',
  E'מה קורה כשמנסים ליצור מופע של מחלקה אבסטרקטית?\n\nfrom abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\ns = Shape()',
  'TypeError — לא ניתן ליצור מופע של מחלקה אבסטרקטית',
  'נוצר אובייקט ריק',
  'area() מחזירה None',
  'SyntaxError',
  'a',
  'מחלקה שיורשת מ-ABC ומכילה מתודות @abstractmethod לא ניתנת ליצירת מופע ישירות. חובה ליצור מחלקת בן שמממשת את כל המתודות האבסטרקטיות.',
  'לחשוב שאפשר ליצור מופע וה-abstractmethod פשוט מחזירה None.',
  true);

-- Q4 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'tracing', 'medium', 'polymorphism_func',
  'מה יודפס?',
  E'def total_area(shapes):\n    return sum(s.area() for s in shapes)\n\nclass Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    def area(self):\n        return self.w * self.h\n\nclass Circle:\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return 3 * self.r * self.r\n\nshapes = [Rect(2, 3), Circle(2), Rect(1, 1)]\nprint(total_area(shapes))',
  '19',
  '19',
  '18',
  'שגיאה',
  '12',
  'a',
  'Rect(2,3).area()=6, Circle(2).area()=3*4=12, Rect(1,1).area()=1. סה"כ: 6+12+1=19. total_area עובדת עם כל אובייקט שיש לו area().',
  'לשכוח שהפונקציה עובדת עם duck typing — לא צריך מחלקת אב משותפת.',
  true);

-- Q5 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'medium', 'builtin_polymorphism',
  E'מה יודפס?\n\nprint(len("hello"), len([1,2,3]), len({"a":1, "b":2}))',
  '5 3 2',
  '5 3 3',
  'שגיאה — len לא עובדת על dict',
  '5 3 1',
  'a',
  'len() היא דוגמה לפולימורפיזם מובנה: היא עובדת על מחרוזות (5 תווים), רשימות (3 איברים) ומילונים (2 מפתחות) — כל אחד מממש __len__.',
  'לחשוב ש-len() של dict סופרת ערכים ומפתחות — היא סופרת רק מפתחות.',
  true);

-- Q6 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'tracing', 'medium', 'abstract_class',
  'מה יודפס?',
  E'from abc import ABC, abstractmethod\n\nclass Animal(ABC):\n    @abstractmethod\n    def sound(self):\n        pass\n    def describe(self):\n        return f"I say {self.sound()}"\n\nclass Dog(Animal):\n    def sound(self):\n        return "Woof"\n\nclass Cat(Animal):\n    def sound(self):\n        return "Meow"\n\nprint(Dog().describe())\nprint(Cat().describe())',
  E'I say Woof\nI say Meow',
  E'I say Woof\nI say Meow',
  E'שגיאה — Animal אבסטרקטית',
  E'I say None\nI say None',
  E'Woof\nMeow',
  'a',
  'describe() מוגדרת ב-Animal וקוראת ל-self.sound(). בזמן ריצה, self הוא Dog או Cat, לכן sound() המתאים נקרא. זה פולימורפיזם דרך ABC.',
  'לחשוב שמתודות קונקרטיות במחלקה אבסטרקטית לא עובדות — רק מתודות @abstractmethod חייבות מימוש.',
  true);

-- Q7 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'hard', 'protocol_typing',
  E'מה יודפס?\n\nclass Printer:\n    def __init__(self, items):\n        self.items = items\n    def print_all(self):\n        for item in self.items:\n            print(item.display(), end=" ")\n\nclass Text:\n    def __init__(self, s): self.s = s\n    def display(self): return self.s\n\nclass Number:\n    def __init__(self, n): self.n = n\n    def display(self): return str(self.n * 2)\n\nPrinter([Text("hi"), Number(3), Text("bye")]).print_all()',
  'hi 6 bye',
  'hi 3 bye',
  'שגיאה — Text ו-Number לא קשורות',
  'hi Number bye',
  'a',
  'Printer.print_all() קורא ל-display() על כל איבר. Text.display() מחזיר את המחרוזת, Number.display() מחזיר את המספר כפול 2 כמחרוזת.',
  'לחשוב שצריך ממשק משותף — duck typing פותר את זה.',
  true);

-- Q8 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'tracing', 'hard', 'polymorphism_chain',
  'מה יודפס?',
  E'class Base:\n    def process(self, x):\n        return self.transform(x) + self.validate(x)\n    def transform(self, x):\n        return x\n    def validate(self, x):\n        return 0\n\nclass DoubleValidator(Base):\n    def transform(self, x):\n        return x * 2\n    def validate(self, x):\n        return 1 if x > 0 else -1\n\nprint(DoubleValidator().process(5))\nprint(DoubleValidator().process(-3))',
  E'11\n-7',
  E'11\n-7',
  E'5\n-3',
  E'10\n-6',
  E'6\n-2',
  'a',
  'process(5): transform(5)=10, validate(5)=1 → 11. process(-3): transform(-3)=-6, validate(-3)=-1 → -7. process() משתמש ב-self שמפנה ל-DoubleValidator.',
  'לשכוח שself.transform ו-self.validate קוראים לגרסה של DoubleValidator.',
  true);

-- Q9 — easy, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'fill_blank', 'easy', 'duck_typing',
  'השלם את הפונקציה שמדפיסה את הצליל של כל חיה ברשימה:',
  E'def make_sounds(animals):\n    for animal in animals:\n        print(animal.___())',
  'sound',
  'speak',
  'noise',
  'type',
  'a',
  'הפונקציה קוראת ל-sound() על כל אובייקט ברשימה. בגלל duck typing, כל אובייקט שיש לו מתודת sound() יעבוד.',
  'לחשוב שצריך לבדוק את הטיפוס לפני הקריאה — duck typing לא דורש בדיקת טיפוס.',
  true);

-- Q10 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'medium', 'operator_overload',
  E'מה יודפס?\n\nclass Vec:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __add__(self, other):\n        return Vec(self.x + other.x, self.y + other.y)\n    def __repr__(self):\n        return f"({self.x}, {self.y})"\n\nv = Vec(1, 2) + Vec(3, 4)\nprint(v)',
  '(4, 6)',
  '(1, 2, 3, 4)',
  'שגיאה — לא ניתן לחבר אובייקטים',
  'Vec(4, 6)',
  'a',
  '__add__ מאפשר להשתמש באופרטור +. Vec(1,2)+Vec(3,4) → Vec(1+3, 2+4) = Vec(4,6). __repr__ קובע איך האובייקט מודפס.',
  'לחשוב ש-+ לא עובד על אובייקטים — __add__ מגדיר את ההתנהגות.',
  true);

-- Q11 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'medium', 'abstract_class',
  E'מה יקרה בהרצה?\n\nfrom abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): pass\n\nclass Circle(Shape):\n    def __init__(self, r):\n        self.r = r\n\nc = Circle(5)',
  'TypeError — Circle לא מממשת area()',
  'נוצר אובייקט Circle תקין',
  'SyntaxError',
  'area() מחזירה None',
  'a',
  'Circle יורשת מ-Shape (שהיא ABC) אבל לא מממשת את area() שהוגדרה כ-@abstractmethod. לכן לא ניתן ליצור מופע של Circle.',
  'לחשוב שמספיק לרשת מ-ABC — חובה לממש את כל המתודות האבסטרקטיות.',
  true);

-- Q12 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'hard', 'polymorphism_dispatch',
  E'מה יודפס?\n\nclass Logger:\n    def log(self, msg):\n        return self.format(msg)\n    def format(self, msg):\n        return msg\n\nclass TimedLogger(Logger):\n    def format(self, msg):\n        return f"[00:00] {msg}"\n\nclass ColorLogger(Logger):\n    def format(self, msg):\n        return f"** {msg} **"\n\nloggers = [Logger(), TimedLogger(), ColorLogger()]\nfor l in loggers:\n    print(l.log("hi"))',
  E'hi\n[00:00] hi\n** hi **',
  E'hi\nhi\nhi',
  E'שגיאה',
  E'hi\n[00:00] hi\nhi',
  'a',
  'log() קורא ל-self.format(). כל logger מממש format() אחרת. זה פולימורפיזם — אותה קריאה (log) מתנהגת שונה לפי הסוג.',
  'לחשוב ש-log() תמיד קורא ל-format() של Logger.',
  true);

-- Q13 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'easy', 'polymorphism_basics',
  'איזו מהבאות היא דוגמה לפולימורפיזם בפייתון?',
  'שימוש ב-+ לחיבור מספרים ולשרשור מחרוזות',
  'שימוש ב-import לייבוא מודולים',
  'שימוש ב-for למעבר על רשימה',
  'שימוש ב-if לבדיקת תנאי',
  'a',
  'אופרטור + מתנהג שונה לפי סוג הנתונים: מחבר מספרים (1+2=3), משרשר מחרוזות ("a"+"b"="ab"). זה פולימורפיזם של אופרטורים.',
  'לחשוב שפולימורפיזם קיים רק במחלקות — הוא קיים גם באופרטורים ובפונקציות מובנות.',
  true);

-- Q14 — medium, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'fill_blank', 'medium', 'abstract_class',
  'השלם כדי ש-Shape תהיה מחלקה אבסטרקטית עם מתודה אבסטרקטית area:',
  E'from abc import ABC, ___\n\nclass Shape(___):\n    @___\n    def area(self):\n        pass',
  'abstractmethod, ABC, abstractmethod',
  'abstract, ABC, abstract',
  'abstractmethod, object, abstractmethod',
  'Abstract, Abstract, abstract',
  'a',
  'מייבאים abstractmethod מ-abc. Shape יורשת מ-ABC. area() מעוטרת ב-@abstractmethod כדי לחייב מימוש בתת-מחלקות.',
  'לבלבל בין ABC (מחלקה) ל-abstractmethod (דקורטור).',
  true);

-- Q15 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'hard', 'dunder_polymorphism',
  E'מה יודפס?\n\nclass Bag:\n    def __init__(self, items):\n        self.items = items\n    def __len__(self):\n        return len(self.items)\n    def __contains__(self, item):\n        return item in self.items\n    def __iter__(self):\n        return iter(self.items)\n\nb = Bag([10, 20, 30])\nprint(len(b), 20 in b, list(b))',
  '3 True [10, 20, 30]',
  '3 True Bag([10, 20, 30])',
  'שגיאה — Bag לא ניתנת לאיטרציה',
  '3 False [10, 20, 30]',
  'a',
  'Bag מממשת __len__ (len()), __contains__ (in), ו-__iter__ (for/list). זה מאפשר לה להתנהג כמו אוסף מובנה.',
  'לשכוח שמימוש dunders מאפשר לאובייקטים לעבוד עם פונקציות מובנות.',
  true);

-- Q16 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000b-0000-0000-000000000000', 'multiple_choice', 'easy', 'polymorphism_basics',
  'מה היתרון העיקרי של פולימורפיזם?',
  'אפשר לכתוב קוד כללי שעובד עם סוגים שונים של אובייקטים',
  'הקוד רץ מהר יותר',
  'אפשר להשתמש בפחות זיכרון',
  'אפשר למחוק אובייקטים אוטומטית',
  'a',
  'פולימורפיזם מאפשר לכתוב פונקציות ומחלקות שעובדות עם כל אובייקט שעונה על הממשק הנדרש, בלי תלות בסוג הספציפי.',
  'לחשוב שפולימורפיזם קשור לביצועים — הוא קשור לגמישות ושימוש-חוזר בקוד.',
  true);
