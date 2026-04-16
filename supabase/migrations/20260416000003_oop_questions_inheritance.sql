-- ============================================================
-- OOP Questions Part 2: Inheritance (ירושה) — 16 questions
-- ============================================================

-- Q1 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'easy', 'inheritance_basics',
  'מה מאפשרת ירושה (inheritance) בפייתון?',
  'ליצור מחלקה חדשה שמקבלת תכונות ומתודות ממחלקה קיימת',
  'ליצור עותק של אובייקט קיים',
  'להעביר משתנים בין פונקציות',
  'לשתף קובץ בין תוכניות שונות',
  'a',
  'ירושה מאפשרת למחלקת בן (child class) לקבל את כל התכונות והמתודות של מחלקת אב (parent class) ולהרחיב אותן.',
  'לבלבל בין ירושה ליצירת מופע — ירושה היא קשר בין מחלקות, לא בין אובייקטים.',
  true);

-- Q2 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'easy', 'inheritance_basics',
  E'מה יודפס?\n\nclass Animal:\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return "הב!"\n\nd = Dog()\nprint(d.speak())',
  'הב!',
  '...',
  'שגיאה',
  'Animal',
  'a',
  'Dog יורשת מ-Animal אבל דורסת (override) את speak(). כשקוראים ל-d.speak(), פייתון מפעילה את הגרסה של Dog.',
  'לחשוב שמתודת האב תמיד נקראת — דריסה מחליפה לחלוטין את המתודה.',
  true);

-- Q3 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'medium', 'super_call',
  E'מה יודפס?\n\nclass Shape:\n    def __init__(self, color):\n        self.color = color\n\nclass Circle(Shape):\n    def __init__(self, color, radius):\n        super().__init__(color)\n        self.radius = radius\n\nc = Circle("אדום", 5)\nprint(c.color, c.radius)',
  'אדום 5',
  'שגיאה — Shape לא מקבל radius',
  'None 5',
  'אדום None',
  'a',
  'super().__init__(color) קורא לבנאי של Shape שמגדיר self.color. אחר כך Circle מגדיר self.radius. שני התכונות קיימות באובייקט.',
  'לשכוח super().__init__() — אז תכונת color לא תוגדר.',
  true);

-- Q4 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'tracing', 'medium', 'inheritance_chain',
  'מה יודפס לאחר הרצת הקוד הבא?',
  E'class A:\n    def greet(self):\n        return "A"\n\nclass B(A):\n    pass\n\nclass C(B):\n    def greet(self):\n        return "C"\n\nprint(B().greet(), C().greet())',
  'A C',
  'A C',
  'B C',
  'A A',
  'שגיאה',
  'a',
  'B לא דורסת greet ולכן יורשת מ-A → "A". C דורסת greet ומחזירה "C". זהו סדר הרזולוציה (MRO).',
  'לחשוב ש-B חייבת להגדיר greet בעצמה — היא יורשת אותה מ-A.',
  true);

-- Q5 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'medium', 'isinstance_check',
  E'מה יודפס?\n\nclass Vehicle:\n    pass\nclass Car(Vehicle):\n    pass\n\nc = Car()\nprint(isinstance(c, Vehicle), isinstance(c, Car))',
  'True True',
  'False True',
  'True False',
  'False False',
  'a',
  'isinstance בודקת אם אובייקט הוא מופע של מחלקה או של מחלקת אב שלה. Car יורשת מ-Vehicle, לכן c הוא גם Car וגם Vehicle.',
  'לחשוב ש-isinstance בודקת רק את המחלקה הישירה — היא בודקת את כל שרשרת הירושה.',
  true);

-- Q6 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'tracing', 'medium', 'super_call',
  'מה יודפס לאחר הרצת הקוד הבא?',
  E'class Base:\n    def __init__(self):\n        self.values = []\n    def add(self, v):\n        self.values.append(v)\n\nclass Child(Base):\n    def __init__(self):\n        super().__init__()\n        self.add(10)\n        self.add(20)\n\nc = Child()\nprint(c.values)',
  '[10, 20]',
  '[10, 20]',
  '[]',
  '[20]',
  'שגיאה',
  'a',
  'super().__init__() מאתחל values=[]. ואז add(10) ו-add(20) מוסיפים לרשימה. c.values = [10, 20].',
  'לשכוח לקרוא ל-super().__init__() — אז self.values לא קיים ותיזרק שגיאה.',
  true);

-- Q7 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'hard', 'mro',
  E'מה יודפס?\n\nclass A:\n    def who(self):\n        return "A"\n\nclass B(A):\n    pass\n\nclass C(A):\n    def who(self):\n        return "C"\n\nclass D(B, C):\n    pass\n\nprint(D().who())',
  'C',
  'A',
  'שגיאה — diamond problem',
  'D',
  'a',
  'סדר הרזולוציה (MRO) של D הוא: D → B → C → A. B לא מגדירה who, אז פייתון ממשיכה ל-C שמגדירה who → "C". זהו אלגוריתם C3 linearization.',
  'לחשוב ש-B תוריש ישירות מ-A — MRO עוקב אחרי C3 linearization, לא חיפוש לעומק.',
  true);

-- Q8 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'tracing', 'hard', 'super_chain',
  'מה יודפס לאחר הרצת הקוד הבא?',
  E'class A:\n    def __init__(self):\n        print("A", end=" ")\n\nclass B(A):\n    def __init__(self):\n        print("B", end=" ")\n        super().__init__()\n\nclass C(B):\n    def __init__(self):\n        print("C", end=" ")\n        super().__init__()\n\nC()',
  'C B A',
  'C B A',
  'A B C',
  'C A B',
  'C',
  'a',
  'C() → מדפיס "C", קורא ל-super() → B.__init__ → מדפיס "B", קורא ל-super() → A.__init__ → מדפיס "A". סדר ההדפסה: C B A.',
  'לחשוב שהסדר הפוך — super() קורא לשלב הבא ב-MRO, לא חוזר אחורה.',
  true);

-- Q9 — easy, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'fill_blank', 'easy', 'inheritance_basics',
  'השלם את הקוד כדי ש-Cat תירש מ-Animal:',
  E'class Animal:\n    def breathe(self):\n        return "נושם"\n\nclass Cat(___):\n    def meow(self):\n        return "מיאו"\n\nc = Cat()\nprint(c.breathe())',
  'Animal',
  'self',
  'object',
  'Cat',
  'a',
  'כדי ש-Cat תירש מ-Animal, כותבים class Cat(Animal). כך Cat מקבלת את כל המתודות של Animal כולל breathe().',
  'לכתוב class Cat: בלי סוגריים — אז Cat לא יורשת מ-Animal.',
  true);

-- Q10 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'medium', 'method_override',
  E'מה יודפס?\n\nclass Parent:\n    def show(self):\n        return self.value()\n    def value(self):\n        return 1\n\nclass Child(Parent):\n    def value(self):\n        return 2\n\nprint(Child().show())',
  '2',
  '1',
  'שגיאה',
  'None',
  'a',
  'show() קוראת ל-self.value(). מכיוון ש-self הוא מופע של Child, ו-Child דורסת value(), תופעל הגרסה של Child שמחזירה 2.',
  'לחשוב ש-show() של Parent תקרא ל-value() של Parent — self מפנה תמיד למופע האמיתי.',
  true);

-- Q11 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'hard', 'super_override',
  E'מה יודפס?\n\nclass Base:\n    def calc(self, x):\n        return x * 2\n\nclass Mid(Base):\n    def calc(self, x):\n        return super().calc(x) + 1\n\nclass Top(Mid):\n    def calc(self, x):\n        return super().calc(x) + 10\n\nprint(Top().calc(5))',
  '21',
  '11',
  '15',
  '20',
  'a',
  'Top.calc(5) → super().calc(5)+10 → Mid.calc(5)+10 → (super().calc(5)+1)+10 → (Base.calc(5)+1)+10 → (10+1)+10 = 21.',
  'לשכוח שכל super() מוסיף שכבה — צריך לעקוב אחרי כל שרשרת הקריאות.',
  true);

-- Q12 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'easy', 'inheritance_basics',
  'מה הפלט של issubclass(Dog, Animal) אם Dog יורשת מ-Animal?',
  'True',
  'False',
  'שגיאה',
  'Dog',
  'a',
  'issubclass(A, B) בודקת אם A היא תת-מחלקה של B. מכיוון ש-Dog יורשת מ-Animal, התוצאה True.',
  'לבלבל עם isinstance — issubclass בודקת מחלקות, isinstance בודקת מופעים.',
  true);

-- Q13 — medium, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'fill_blank', 'medium', 'super_call',
  'השלם את הקוד כדי ש-Square יירש מ-Shape ויאתחל את הצלע:',
  E'class Shape:\n    def __init__(self, color):\n        self.color = color\n\nclass Square(Shape):\n    def __init__(self, color, side):\n        ___.__init__(color)\n        self.side = side',
  'super()',
  'Shape',
  'self',
  'parent',
  'a',
  'super().__init__(color) קורא לבנאי של Shape שמגדיר self.color. אפשר גם Shape.__init__(self, color) אבל super() עדיף.',
  'לשכוח לקרוא ל-super().__init__() — אז self.color לא יוגדר.',
  true);

-- Q14 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'medium', 'inheritance_chain',
  E'מה יודפס?\n\nclass A:\n    x = 1\nclass B(A):\n    pass\nclass C(B):\n    pass\n\nprint(C.x)',
  '1',
  'שגיאה — x לא קיים ב-C',
  'None',
  '0',
  'a',
  'C יורשת מ-B שיורשת מ-A. תכונת מחלקה x מוגדרת ב-A ונגישה דרך כל שרשרת הירושה, לכן C.x = 1.',
  'לחשוב שתכונות מחלקה לא עוברות בירושה — הן כן עוברות לכל תתי-המחלקות.',
  true);

-- Q15 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'tracing', 'hard', 'mro',
  'מה יודפס?',
  E'class X:\n    def f(self):\n        return "X"\n\nclass Y(X):\n    pass\n\nclass Z(X):\n    def f(self):\n        return "Z"\n\nclass W(Y, Z):\n    pass\n\nprint(W().f())\nprint([c.__name__ for c in W.__mro__])',
  E'Z\n[''W'', ''Y'', ''Z'', ''X'', ''object'']',
  E'Z\n[''W'', ''Y'', ''Z'', ''X'', ''object'']',
  E'X\n[''W'', ''Y'', ''X'', ''Z'', ''object'']',
  E'שגיאה',
  E'Y\n[''W'', ''Y'', ''Z'', ''X'', ''object'']',
  'a',
  'MRO של W: W → Y → Z → X → object. Y לא מגדירה f, אז ממשיכים ל-Z שמגדירה f → "Z". __mro__ מראה את הסדר המלא.',
  'לחשוב שחיפוש עומק-ראשון (Y→X) קודם — C3 linearization מבטיח ש-Z נבדקת לפני X.',
  true);

-- Q16 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000a-0000-0000-000000000000', 'multiple_choice', 'easy', 'inheritance_basics',
  'איזה מהבאים נכון לגבי ירושה?',
  'מחלקת בן יכולה להוסיף מתודות חדשות ולדרוס מתודות של מחלקת אב',
  'מחלקת בן לא יכולה להוסיף תכונות חדשות',
  'מחלקת אב יכולה לגשת למתודות של מחלקת בן',
  'ירושה אפשרית רק בין שתי מחלקות',
  'a',
  'מחלקת בן יורשת הכל מהאב, יכולה להוסיף תכונות/מתודות חדשות, ויכולה לדרוס מתודות קיימות.',
  'לחשוב שירושה חד-כיוונית מונעת הרחבה — מחלקת הבן חופשית להוסיף ולשנות.',
  true);
