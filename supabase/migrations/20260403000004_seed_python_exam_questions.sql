-- Seed: 8 course topics + 8 starter questions (one per topic, multiple_choice, medium)
-- Step 1 of incremental seed — additional questions will be added in subsequent migrations

-- Clear existing data (order matters due to foreign keys)
DELETE FROM user_progress;
DELETE FROM questions;
DELETE FROM topics;

-- ============================================================
-- TOPICS  (fixed UUIDs for stable cross-migration references)
-- ============================================================
INSERT INTO topics (id, name, description, icon) VALUES
  ('11111111-0001-0000-0000-000000000000', 'משתנים וקלט/פלט',   'הגדרת משתנים, פונקציות print ו-input, המרת טיפוסים', '📦'),
  ('11111111-0002-0000-0000-000000000000', 'חשבון ואופרטורים',  'פעולות אריתמטיות, עדיפות אופרטורים, חילוק שלם ומודולו', '🔢'),
  ('11111111-0003-0000-0000-000000000000', 'תנאים',              'if / elif / else, אופרטורים לוגיים, השוואות', '🔀'),
  ('11111111-0004-0000-0000-000000000000', 'לולאות',             'for, while, break, continue, range', '🔁'),
  ('11111111-0005-0000-0000-000000000000', 'פונקציות',           'def, פרמטרים, ערך חזרה, תחום (scope)', '🧩'),
  ('11111111-0006-0000-0000-000000000000', 'מחרוזות',            'פעולות על מחרוזות, slicing, מתודות שכיחות', '🔤'),
  ('11111111-0007-0000-0000-000000000000', 'רשימות',             'יצירה, גישה, שינוי, מתודות רשימה, list comprehension', '📋'),
  ('11111111-0008-0000-0000-000000000000', 'טאפלים, קבוצות ומילונים', 'tuple, set, dict — יצירה, גישה ופעולות עיקריות', '🗂️');

-- ============================================================
-- QUESTIONS  — 8 questions, one per topic
-- question_type = multiple_choice, difficulty = medium
-- ============================================================

-- 1. משתנים וקלט/פלט
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'multiple_choice', 'medium', 'type_conversion',
  'מה יודפס לאחר הרצת הקוד הבא?
x = "5"
y = 3
print(x * y)',
  '555',
  '15',
  'שגיאת TypeError',
  '53',
  'a',
  'בפייתון, כפל מחרוזת במספר שלם מכפיל את המחרוזת. "5" * 3 ייתן "555".',
  'לבלבל בין כפל מספרי לכפל מחרוזת — חייבים להמיר ל-int לפני פעולה מתמטית.',
  true
);

-- 2. חשבון ואופרטורים
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'multiple_choice', 'medium', 'integer_division_modulo',
  'מה הערך של הביטוי: 17 // 5 + 17 % 5 ?',
  '5',
  '6',
  '7',
  '8',
  'a',
  '17 // 5 = 3 (חילוק שלם), 17 % 5 = 2 (שארית). 3 + 2 = 5.',
  'לבלבל בין // ל- / — // מחזיר מספר שלם, / מחזיר עשרוני.',
  true
);

-- 3. תנאים
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'multiple_choice', 'medium', 'nested_conditions',
  'מה יודפס?
x = 10
if x > 5:
    if x > 8:
        print("A")
    else:
        print("B")
else:
    print("C")',
  'A',
  'B',
  'C',
  'A ו-B',
  'a',
  'x=10 עומד בתנאי x>5 ובתנאי x>8, לכן מודפסת האות A.',
  'לשכוח לבדוק את התנאי הפנימי בנפרד — x>5 נכון, אבל חשוב להמשיך לתנאי הפנימי.',
  true
);

-- 4. לולאות
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'multiple_choice', 'medium', 'range_loop',
  'כמה פעמים תרוץ הלולאה?
for i in range(2, 10, 3):
    print(i)',
  '3',
  '4',
  '2',
  '8',
  'a',
  'range(2, 10, 3) מייצרת: 2, 5, 8 — בסך הכל 3 ערכים, לכן הלולאה רצה 3 פעמים.',
  'לחשב range(start, stop, step) כ-(stop-start) במקום לספור ערכים בפועל.',
  true
);

-- 5. פונקציות
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'multiple_choice', 'medium', 'default_parameters',
  'מה יודפס?
def greet(name, msg="שלום"):
    print(msg + " " + name)

greet("דנה")',
  'שלום דנה',
  'דנה שלום',
  'שגיאת TypeError',
  'None',
  'a',
  'הפרמטר msg מקבל ערך ברירת מחדל "שלום". קריאה עם ארגומנט אחד תשתמש בברירת המחדל.',
  'לחשוב שפרמטר עם ברירת מחדל הוא חובה — הוא אופציונלי.',
  true
);

-- 6. מחרוזות
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'multiple_choice', 'medium', 'string_slicing',
  'מה הערך של s[1:4] כאשר s = "Python"?',
  'yth',
  'Pyt',
  'ytho',
  'ython',
  'a',
  'slicing [1:4] לוקח תווים במיקומים 1, 2, 3 (לא כולל 4): y, t, h — כלומר "yth".',
  'לחשוב ש-[1:4] כולל את האינדקס 4 — הגבול העליון אינו כלול.',
  true
);

-- 7. רשימות
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'multiple_choice', 'medium', 'list_methods',
  'מה יודפס?
lst = [3, 1, 4, 1, 5]
lst.sort()
print(lst[0], lst[-1])',
  '1 5',
  '3 5',
  '1 4',
  '5 1',
  'a',
  'sort() ממיינת את הרשימה במקום בסדר עולה: [1,1,3,4,5]. lst[0]=1, lst[-1]=5.',
  'לחשוב ש-sort() מחזיר רשימה חדשה — היא משנה את הרשימה המקורית ומחזירה None.',
  true
);

-- 8. טאפלים, קבוצות ומילונים
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'multiple_choice', 'medium', 'dict_access',
  'מה יודפס?
d = {"a": 1, "b": 2, "c": 3}
print(d.get("d", 0))',
  '0',
  'None',
  'שגיאת KeyError',
  '3',
  'a',
  'המתודה get() מחזירה את ערך ברירת המחדל (0) כאשר המפתח לא קיים, במקום לזרוק שגיאה.',
  'לבלבל בין d["d"] (זורק KeyError) ל-d.get("d", 0) (מחזיר ברירת מחדל).',
  true
);
