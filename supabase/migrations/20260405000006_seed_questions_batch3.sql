-- Seed batch 3: 5 additional questions per topic (40 total)
-- Brings grand total to 80+ questions
-- Mixes difficulty: 2 easy, 2 medium, 1 hard per topic
-- All multiple_choice type, Hebrew content, no DELETE statements
-- Uses fixed topic UUIDs 11111111-0001..0008-0000-0000-000000000000

-- ============================================================
-- TOPIC 1: משתנים וקלט/פלט  (11111111-0001)
-- ============================================================

-- 1-A  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'multiple_choice', 'easy', 'variable_naming',
  'איזה משמות המשתנים הבאים חוקי בפייתון?',
  'my_var',
  '2name',
  'my-var',
  'class',
  'a',
  'שם משתנה חוקי יכול להכיל אותיות, ספרות וקו תחתון, אך חייב להתחיל באות או קו תחתון. 2name מתחיל בספרה, my-var מכיל מקף, ו-class הוא מילה שמורה.',
  'לחשוב ש-class הוא שם חוקי — זו מילה שמורה בפייתון ולא ניתן להשתמש בה כשם משתנה.',
  true
);

-- 1-B  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'multiple_choice', 'easy', 'print_end',
  'מה יודפס?
print("שלום", end="!")
print("עולם")',
  'שלום ! עולם',
  'שלום
!עולם',
  'שלום!
עולם',
  'שלום!עולם',
  'd',
  'הפרמטר end מחליף את תו ירידת השורה בסוף ההדפסה. כאן end="!" כך ש-print הראשון מדפיס "שלום!" ללא ירידת שורה, והשני ממשיך מאותו מקום.',
  'לחשוב ש-end מוסיף רווח אוטומטי — end מחליף לחלוטין את תו הסיום (ברירת מחדל: \n).',
  true
);

-- 1-C  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'multiple_choice', 'medium', 'multiple_assignment',
  'מה יודפס?
a, b, c = 1, 2, 3
a, b = b, a
print(a, b, c)',
  '2 1 3',
  '1 2 3',
  '3 2 1',
  'שגיאה',
  'a',
  'השמה מרובה a, b = b, a מחליפה את הערכים: a מקבל את הערך של b (2) ו-b מקבל את הערך של a (1). c נשאר 3.',
  'לחשוב שההחלפה קורית בזו אחר זו (a=b ואז b=a) — בפייתון החלפה מרובה קורית בו-זמנית.',
  true
);

-- 1-D  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'multiple_choice', 'medium', 'type_check',
  'מה יחזיר הביטוי: isinstance(True, int) ?',
  'False',
  'TypeError',
  'True',
  'None',
  'c',
  'בפייתון bool יורש מ-int, לכן True נחשב גם מטיפוס int. isinstance בודק גם ירושה.',
  'לחשוב ש-bool ו-int הם טיפוסים נפרדים לחלוטין — בפועל bool יורש מ-int.',
  true
);

-- 1-E  hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'multiple_choice', 'hard', 'chained_assignment',
  'מה יודפס?
x = y = [1, 2]
x.append(3)
print(y)',
  '[1, 2]',
  '[1, 2, 3]',
  'שגיאה',
  '[3]',
  'b',
  'בהשמה משורשרת x = y = [1, 2], שני המשתנים מצביעים על אותו אובייקט בזיכרון. שינוי דרך x משפיע גם על y.',
  'לחשוב שנוצרות שתי רשימות נפרדות — בפועל שני המשתנים מצביעים על אותו אובייקט.',
  true
);

-- ============================================================
-- TOPIC 2: חשבון ואופרטורים  (11111111-0002)
-- ============================================================

-- 2-A  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'multiple_choice', 'easy', 'abs_function',
  'מה יחזיר הביטוי: abs(-7) ?',
  '-7',
  '0',
  'שגיאת TypeError',
  '7',
  'd',
  'הפונקציה abs() מחזירה את הערך המוחלט של מספר, כלומר את המרחק שלו מ-0 ללא סימן.',
  'לחשוב ש-abs מחזיר תמיד מספר שלילי — abs מחזיר ערך חיובי (או אפס).',
  true
);

-- 2-B  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'multiple_choice', 'easy', 'float_division',
  'מה יחזיר הביטוי: 10 / 4 ?',
  '2',
  '2.25',
  '2.5',
  '3',
  'c',
  'האופרטור / מבצע חילוק רגיל ומחזיר תמיד float. 10 / 4 = 2.5.',
  'לבלבל בין / (חילוק רגיל, מחזיר float) לבין // (חילוק שלם, מחזיר int).',
  true
);

-- 2-C  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'multiple_choice', 'medium', 'round_function',
  'מה יחזיר הביטוי: round(2.5) ?',
  '2',
  '3',
  '2.5',
  'שגיאה',
  'a',
  'פייתון משתמש ב-"עיגול בנקאי" (banker''s rounding): כשהספרה בדיוק באמצע, היא מעגלת למספר הזוגי הקרוב. 2.5 מתעגל ל-2.',
  'לחשוב שפייתון תמיד מעגל כלפי מעלה כש-.5 — פייתון משתמש בעיגול בנקאי.',
  true
);

-- 2-D  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'multiple_choice', 'medium', 'negative_modulo',
  'מה יחזיר הביטוי: -7 % 3 ?',
  '-1',
  '1',
  '2',
  '-2',
  'c',
  'בפייתון, תוצאת % תמיד בעלת אותו סימן כמו המחלק. -7 % 3 = 2, כי -7 = (-3)*3 + 2.',
  'לחשוב שהתוצאה תהיה שלילית (-1) כמו בשפות אחרות — בפייתון % תמיד מחזיר ערך עם סימן המחלק.',
  true
);

-- 2-E  hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'multiple_choice', 'hard', 'mixed_type_arithmetic',
  'מה יודפס?
x = 3 + 2.0
print(type(x).__name__, x)',
  'int 5',
  'float 5',
  'שגיאת TypeError',
  'float 5.0',
  'd',
  'כאשר מחברים int ו-float, פייתון ממיר אוטומטית את ה-int ל-float. התוצאה היא float. 3 + 2.0 = 5.0.',
  'לחשוב שהתוצאה תהיה int כי שני המספרים שלמים — חיבור עם float תמיד מחזיר float.',
  true
);

-- ============================================================
-- TOPIC 3: תנאים  (11111111-0003)
-- ============================================================

-- 3-A  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'multiple_choice', 'easy', 'truthy_falsy',
  'מה יודפס?
if "":
    print("כן")
else:
    print("לא")',
  'כן',
  'לא',
  'שגיאה',
  'None',
  'b',
  'מחרוזת ריקה "" היא ערך falsy בפייתון. לכן התנאי if "" הוא False והקוד נכנס ל-else.',
  'לחשוב שכל מחרוזת היא truthy — מחרוזת ריקה, 0, None ו-[] הם falsy.',
  true
);

-- 3-B  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'multiple_choice', 'easy', 'comparison_operators',
  'מה יחזיר הביטוי: 5 != 5 ?',
  'False',
  'True',
  '0',
  'שגיאה',
  'a',
  'האופרטור != בודק אי-שוויון. מכיוון ש-5 שווה ל-5, התוצאה היא False.',
  'לבלבל בין != (שונה) ל-== (שווה).',
  true
);

-- 3-C  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'multiple_choice', 'medium', 'chained_comparison',
  'מה יחזיר הביטוי: 1 < 3 < 2 ?',
  'True',
  'False',
  'שגיאה',
  '1',
  'b',
  'פייתון תומך בהשוואות משורשרות. 1 < 3 < 2 שקול ל: 1 < 3 and 3 < 2. החלק הראשון True אבל 3 < 2 הוא False, לכן התוצאה False.',
  'לחשוב שפייתון מחשב (1 < 3) ואז משווה True < 2 — פייתון מפרש השוואות משורשרות כ-and.',
  true
);

-- 3-D  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'multiple_choice', 'medium', 'pass_statement',
  'מה יודפס?
x = 10
if x > 5:
    pass
else:
    print("קטן")
print("סוף")',
  'קטן
סוף',
  'סוף',
  'קטן',
  'שגיאה',
  'b',
  'pass היא פקודה ריקה שלא עושה כלום. x=10 גדול מ-5 אז נכנסים ל-if ומבצעים pass (כלום). אחרי ה-if מודפס "סוף".',
  'לחשוב ש-pass מדלג על הקוד שאחרי ה-if — pass רק ממלא את בלוק ה-if בפקודה ריקה.',
  true
);

-- 3-E  hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'multiple_choice', 'hard', 'or_return_value',
  'מה יודפס?
x = 0 or "" or [] or "hello" or 42
print(x)',
  '0',
  'True',
  'hello',
  '42',
  'c',
  'אופרטור or מחזיר את הערך הראשון שהוא truthy. 0, "", [] הם falsy. "hello" הוא truthy ולכן הוא מוחזר.',
  'לחשוב ש-or מחזיר True/False — בפייתון or מחזיר את הערך עצמו, לא בוליאני.',
  true
);

-- ============================================================
-- TOPIC 4: לולאות  (11111111-0004)
-- ============================================================

-- 4-A  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'multiple_choice', 'easy', 'for_string_loop',
  'מה יודפס?
for c in "abc":
    print(c, end=" ")',
  'abc',
  'a b c',
  '"a" "b" "c"',
  'a b c ',
  'd',
  'לולאת for על מחרוזת עוברת תו אחר תו. end=" " מוסיף רווח אחרי כל תו במקום ירידת שורה. התוצאה: a b c ואחריה רווח.',
  'לחשוב שהלולאה מדפיסה את כל המחרוזת בבת אחת — for על מחרוזת עוברת תו-תו.',
  true
);

-- 4-B  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'multiple_choice', 'easy', 'range_len',
  'מה הערך של list(range(5)) ?',
  '[1, 2, 3, 4, 5]',
  '[0, 1, 2, 3, 4, 5]',
  '[0, 1, 2, 3, 4]',
  '[5]',
  'c',
  'range(5) מייצר רצף מ-0 עד 4 (לא כולל 5). לכן list(range(5)) הוא [0, 1, 2, 3, 4].',
  'לחשוב ש-range(5) מתחיל מ-1 או כולל את 5 — range מתחיל מ-0 ולא כולל את הערך העליון.',
  true
);

-- 4-C  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'multiple_choice', 'medium', 'while_counter',
  'מה יודפס?
i = 0
while i < 3:
    i += 1
print(i)',
  '0',
  '2',
  '3',
  '4',
  'c',
  'הלולאה מגדילה את i ב-1 כל סיבוב: 0→1, 1→2, 2→3. כש-i=3 התנאי i<3 כבר לא מתקיים, הלולאה נעצרת ומודפס 3.',
  'לחשוב שמודפס 2 (הערך האחרון שבו התנאי התקיים) — i כבר הוגדל ל-3 לפני בדיקת התנאי.',
  true
);

-- 4-D  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'multiple_choice', 'medium', 'range_step',
  'מה הערך של list(range(10, 0, -3)) ?',
  '[10, 7, 4, 1]',
  '[10, 7, 4]',
  '[10, 7, 4, 1, -2]',
  '[7, 4, 1]',
  'a',
  'range(10, 0, -3) מתחיל מ-10, יורד ב-3 כל פעם, ועוצר לפני 0. הערכים: 10, 7, 4, 1 (הבא היה -2 שקטן מ-0 אז עוצר).',
  'לחשוב ש-range עוצר כולל את 0 — range לא כולל את ערך הסיום.',
  true
);

-- 4-E  hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'multiple_choice', 'hard', 'loop_else',
  'מה יודפס?
for i in range(3):
    if i == 5:
        break
else:
    print("done")
print("end")',
  'end',
  'done
end',
  'done',
  'שגיאה',
  'b',
  'בפייתון, בלוק else של לולאת for מתבצע אם הלולאה הסתיימה ללא break. כאן i לעולם לא שווה ל-5, אז break לא מופעל, ומודפס "done" ואז "end".',
  'לחשוב ש-else של for עובד כמו else של if — else של for מופעל רק אם הלולאה לא נקטעה ב-break.',
  true
);

-- ============================================================
-- TOPIC 5: פונקציות  (11111111-0005)
-- ============================================================

-- 5-A  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'multiple_choice', 'easy', 'function_call_order',
  'מה יודפס?
def greet():
    print("שלום")

greet()
greet()',
  'שלום
שלום',
  'שלום',
  'שגיאה',
  'None',
  'a',
  'הפונקציה greet() מודפסת "שלום". היא נקראת פעמיים ולכן "שלום" מודפס פעמיים.',
  'לחשוב שהפונקציה רצה רק פעם אחת — כל קריאה לפונקציה מבצעת את הקוד שלה מחדש.',
  true
);

-- 5-B  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'multiple_choice', 'easy', 'return_value_usage',
  'מה יודפס?
def double(n):
    return n * 2

result = double(3)
print(result)',
  '3',
  'None',
  'שגיאה',
  '6',
  'd',
  'הפונקציה double מקבלת 3 ומחזירה 3*2=6. הערך 6 נשמר ב-result ומודפס.',
  'לבלבל בין return ל-print — return מחזיר ערך לקוד הקורא, print מדפיס למסך.',
  true
);

-- 5-C  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'multiple_choice', 'medium', 'global_keyword',
  'מה יודפס?
x = 10
def change():
    global x
    x = 20
change()
print(x)',
  '20',
  '10',
  'שגיאה',
  'None',
  'a',
  'המילה global מאפשרת לפונקציה לשנות משתנה גלובלי. ללא global, היתה נוצרת משתנה מקומי חדש.',
  'לחשוב שפונקציה תמיד יכולה לשנות משתנים גלובליים — ללא global, x בתוך הפונקציה הוא מקומי.',
  true
);

-- 5-D  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'multiple_choice', 'medium', 'multiple_return',
  'מה יודפס?
def min_max(lst):
    return min(lst), max(lst)

a, b = min_max([3, 1, 4, 1, 5])
print(a, b)',
  '1 5',
  '3 5',
  '(1, 5)',
  'שגיאה',
  'a',
  'הפונקציה מחזירה tuple של שני ערכים. a, b = ... מבצע unpacking: a=1 (המינימום), b=5 (המקסימום).',
  'לחשוב שלא ניתן להחזיר שני ערכים — return עם פסיק מחזיר tuple.',
  true
);

-- 5-E  hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'multiple_choice', 'hard', 'closure_scope',
  'מה יודפס?
def outer():
    x = 10
    def inner():
        return x + 5
    return inner

f = outer()
print(f())',
  '5',
  '10',
  '15',
  'שגיאה — x לא מוגדר',
  'c',
  'inner היא closure: היא "זוכרת" את x מהפונקציה החיצונית גם אחרי ש-outer סיימה. f() מחזיר 10+5=15.',
  'לחשוב ש-x לא קיים אחרי ש-outer סיימה — closure שומר גישה למשתנים מה-scope החיצוני.',
  true
);

-- ============================================================
-- TOPIC 6: מחרוזות  (11111111-0006)
-- ============================================================

-- 6-A  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'multiple_choice', 'easy', 'string_len',
  'מה יחזיר הביטוי: len("שלום") ?',
  '3',
  '4',
  '8',
  '0',
  'b',
  'len() מחזיר את מספר התווים במחרוזת. "שלום" מכילה 4 תווים: ש, ל, ו, ם.',
  'לספור בתים במקום תווים — len() סופר תווים, לא בתים.',
  true
);

-- 6-B  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'multiple_choice', 'easy', 'string_concat',
  'מה יודפס?
s = "hello" + " " + "world"
print(s)',
  'helloworld',
  'hello + world',
  'שגיאה',
  'hello world',
  'd',
  'אופרטור + על מחרוזות מבצע שרשור (concatenation). "hello" + " " + "world" יוצר "hello world".',
  'לשכוח שצריך להוסיף רווח ידנית — שרשור מחרוזות לא מוסיף רווחים אוטומטית.',
  true
);

-- 6-C  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'multiple_choice', 'medium', 'string_count',
  'מה יחזיר הביטוי: "banana".count("an") ?',
  '2',
  '1',
  '3',
  '0',
  'a',
  'count() סופר מופעים שאינם חופפים של תת-מחרוזת. "banana" מכיל "an" בפוזיציות 1 ו-3, סה"כ 2 פעמים.',
  'לחשוב ש-count סופר מופעים חופפים — count סופר רק מופעים שאינם חופפים.',
  true
);

-- 6-D  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'multiple_choice', 'medium', 'string_strip',
  'מה יחזיר הביטוי: "  hello  ".strip() ?',
  '"  hello  "',
  '"hello  "',
  '"  hello"',
  '"hello"',
  'd',
  'strip() מסיר רווחים (ותווים לבנים) מתחילת וסוף המחרוזת. התוצאה היא "hello".',
  'לחשוב ש-strip מסיר רק מצד אחד — strip מסיר משני הצדדים. lstrip ו-rstrip מסירים מצד אחד.',
  true
);

-- 6-E  hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'multiple_choice', 'hard', 'string_multiply_join',
  'מה יודפס?
s = "-".join(["a"] * 3)
print(s)',
  'a-a-a',
  'aaa',
  'a--a--a',
  '---aaa',
  'a',
  '["a"] * 3 יוצר ["a", "a", "a"]. "-".join() מחבר את האיברים עם "-" ביניהם: "a-a-a".',
  'לבלבל בין כפל רשימה לכפל מחרוזת, או לחשוב ש-join מוסיף מפריד גם בהתחלה ובסוף.',
  true
);

-- ============================================================
-- TOPIC 7: רשימות  (11111111-0007)
-- ============================================================

-- 7-A  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'multiple_choice', 'easy', 'list_len',
  'מה יחזיר הביטוי: len([1, [2, 3], 4]) ?',
  '4',
  '3',
  '5',
  '2',
  'b',
  'len() סופר את מספר האיברים ברמה העליונה. [1, [2, 3], 4] מכיל 3 איברים: 1, [2,3], ו-4. הרשימה הפנימית נספרת כאיבר אחד.',
  'לספור את כל האיברים כולל אלה ברשימה הפנימית — len() סופר רק ברמה העליונה.',
  true
);

-- 7-B  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'multiple_choice', 'easy', 'list_index_access',
  'מה יחזיר הביטוי: [10, 20, 30, 40][-1] ?',
  '10',
  '30',
  '40',
  'שגיאת IndexError',
  'c',
  'אינדקס שלילי -1 מחזיר את האיבר האחרון ברשימה, כלומר 40.',
  'לחשוב ש-[-1] גורם לשגיאה או מחזיר את האיבר הראשון — אינדקס שלילי סופר מהסוף.',
  true
);

-- 7-C  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'multiple_choice', 'medium', 'list_extend_vs_append',
  'מה יודפס?
a = [1, 2]
a.extend([3, 4])
print(a)',
  '[1, 2, [3, 4]]',
  'שגיאה',
  '[3, 4, 1, 2]',
  '[1, 2, 3, 4]',
  'd',
  'extend() מוסיף את כל האיברים מהרשימה הנתונה אחד-אחד. append() היה מוסיף את הרשימה כאיבר אחד.',
  'לבלבל בין extend ל-append — extend פורס את האיברים, append מוסיף את האובייקט כפי שהוא.',
  true
);

-- 7-D  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'multiple_choice', 'medium', 'list_sort_vs_sorted',
  'מה יודפס?
lst = [3, 1, 2]
new_lst = sorted(lst)
print(lst, new_lst)',
  '[3, 1, 2] [1, 2, 3]',
  '[1, 2, 3] [1, 2, 3]',
  '[3, 1, 2] [3, 1, 2]',
  '[1, 2, 3] [3, 1, 2]',
  'a',
  'sorted() מחזיר רשימה חדשה ממוינת בלי לשנות את המקורית. lst נשאר [3,1,2] ו-new_lst הוא [1,2,3].',
  'לבלבל בין sorted() (מחזיר רשימה חדשה) ל-.sort() (ממיין במקום ומחזיר None).',
  true
);

-- 7-E  hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'multiple_choice', 'hard', 'list_multiplication_trap',
  'מה יודפס?
matrix = [[0]] * 3
matrix[0][0] = 5
print(matrix)',
  '[[5], [0], [0]]',
  '[[5], [5], [5]]',
  '[[0], [0], [5]]',
  'שגיאה',
  'b',
  'כפל רשימה עם * יוצר הפניות לאותו אובייקט. כל שלוש הרשימות הפנימיות הן אותה רשימה, לכן שינוי אחת משנה את כולן.',
  'לחשוב ש-* יוצר עותקים עצמאיים — * יוצר הפניות (references) לאותו אובייקט.',
  true
);

-- ============================================================
-- TOPIC 8: טאפלים, קבוצות ומילונים  (11111111-0008)
-- ============================================================

-- 8-A  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'multiple_choice', 'easy', 'tuple_single_element',
  'מה הטיפוס של הביטוי: type((5,)) ?',
  'int',
  'tuple',
  'list',
  'שגיאה',
  'b',
  '(5,) עם פסיק אחרי המספר יוצר tuple. ללא פסיק — (5) — זה סוגריים רגילים ולא tuple.',
  'לשכוח את הפסיק — (5) הוא int ולא tuple. הפסיק הוא מה שיוצר tuple ולא הסוגריים.',
  true
);

-- 8-B  easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'multiple_choice', 'easy', 'dict_in_operator',
  'מה יחזיר הביטוי: "b" in {"a": 1, "b": 2, "c": 3} ?',
  'False',
  '2',
  'True',
  'שגיאה',
  'c',
  'האופרטור in על מילון בודק האם המפתח קיים. "b" הוא מפתח במילון, לכן התוצאה True.',
  'לחשוב ש-in בודק ערכים ולא מפתחות — in על מילון בודק רק מפתחות.',
  true
);

-- 8-C  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'multiple_choice', 'medium', 'set_duplicates',
  'מה יודפס?
s = {1, 2, 2, 3, 3, 3}
print(len(s))',
  '6',
  '3',
  '1',
  'שגיאה',
  'b',
  'קבוצה (set) לא מכילה כפילויות. {1, 2, 2, 3, 3, 3} הופכת ל-{1, 2, 3} עם 3 איברים בלבד.',
  'לספור את כל המופעים כולל כפילויות — set אוטומטית מסירה כפילויות.',
  true
);

-- 8-D  medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'multiple_choice', 'medium', 'dict_get_default',
  'מה יודפס?
d = {"a": 1, "b": 2}
print(d.get("c", 0))',
  'None',
  'שגיאת KeyError',
  '0',
  '2',
  'c',
  'get() מחזיר את הערך של המפתח אם קיים, אחרת מחזיר את ערך ברירת המחדל. "c" לא קיים, לכן מוחזר 0.',
  'לבלבל בין d["c"] (שגורם ל-KeyError) ל-d.get("c", 0) (שמחזיר ברירת מחדל).',
  true
);

-- 8-E  hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'multiple_choice', 'hard', 'dict_setdefault',
  'מה יודפס?
d = {"a": 1}
d.setdefault("b", 2)
d.setdefault("a", 99)
print(d)',
  '{"a": 99, "b": 2}',
  '{"a": 1, "b": 2}',
  '{"a": 1}',
  'שגיאה',
  'b',
  'setdefault() מוסיף מפתח עם ערך רק אם המפתח לא קיים. "b" לא קיים — נוסף עם 2. "a" כבר קיים — לא משתנה. התוצאה: {"a": 1, "b": 2}.',
  'לחשוב ש-setdefault תמיד מעדכן את הערך — setdefault לא משנה ערך קיים, רק מוסיף חסר.',
  true
);
