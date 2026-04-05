-- Seed batch 2: 4+ additional questions per topic (32 total)
-- Mixes difficulty (easy/medium/hard) and types (multiple_choice, tracing, fill_blank)
-- Uses fixed topic UUIDs 11111111-0001..0008-0000-0000-000000000000

-- ============================================================
-- TOPIC 1: משתנים וקלט/פלט  (11111111-0001)
-- ============================================================

-- 1-A  tracing / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'tracing', 'easy', 'print_sep',
  'מה יודפס לאחר הרצת הקוד הבא?',
  'print(1, 2, 3, sep="-")',
  '1-2-3',
  '1-2-3',
  '1 2 3',
  '123',
  '1,2,3',
  'a',
  'הפרמטר sep מגדיר את המפריד בין הארגומנטים. ברירת המחדל היא רווח, אבל כאן הוגדר "-".',
  'לשכוח ש-sep רק מפריד בין הפריטים ואינו מוסיף לפני הפריט הראשון או אחרי האחרון.',
  true
);

-- 1-B  multiple_choice / hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'multiple_choice', 'hard', 'type_conversion',
  'מה יודפס?
x = int(float("3.9"))
print(x, type(x).__name__)',
  '3 int',
  '4 int',
  '3.9 float',
  'שגיאת ValueError',
  'a',
  'float("3.9") ממיר את המחרוזת ל-3.9, לאחר מכן int() חותך את החלק העשרוני ונותן 3.',
  'לחשוב ש-int() מעגל — הוא חותך (floor) ולא מעגל.',
  true
);

-- 1-C  fill_blank / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'fill_blank', 'medium', 'input_conversion',
  'השלם את הקוד כך שיקרא מספר שלם מהמשתמש ויאחסן אותו ב-n:
n = _____(input("הכנס מספר: "))',
  'int',
  'float',
  'str',
  'num',
  'a',
  'input() תמיד מחזיר מחרוזת. כדי לאחסן מספר שלם יש לעטוף ב-int().',
  'לשכוח לעטוף ב-int() — input() מחזיר str, לא int.',
  true
);

-- 1-D  multiple_choice / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0001-0000-0000-000000000000',
  'multiple_choice', 'easy', 'bool_type',
  'מה יחזיר הביטוי: type(True).__name__ ?',
  'bool',
  'int',
  'str',
  'True',
  'a',
  'True ו-False הם ערכי טיפוס bool בפייתון.',
  'לחשוב ש-True הוא int (למרות ש-bool יורש מ-int, type() מחזיר bool).',
  true
);

-- ============================================================
-- TOPIC 2: חשבון ואופרטורים  (11111111-0002)
-- ============================================================

-- 2-A  tracing / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'tracing', 'medium', 'operator_precedence',
  'מה יודפס לאחר הרצת הקוד הבא?',
  'print(2 + 3 * 4 - 1)',
  '13',
  '13',
  '20',
  '19',
  '11',
  'a',
  'עדיפות אופרטורים: קודם 3*4=12, אחר כך 2+12=14, לבסוף 14-1=13.',
  'לחשב משמאל לימין ללא התחשבות בעדיפות — לחשב 2+3=5, ואז 5*4=20.',
  true
);

-- 2-B  multiple_choice / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'multiple_choice', 'easy', 'modulo',
  'מה הערך של 25 % 7 ?',
  '4',
  '3',
  '2',
  '5',
  'a',
  '25 = 7 * 3 + 4. השארית היא 4.',
  'לחלק ישירות ולא לחשב שארית: 25/7 ≈ 3.57 ולא לחשב 7*3=21, 25-21=4.',
  true
);

-- 2-C  fill_blank / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'fill_blank', 'medium', 'math_functions',
  'השלם את הקוד כדי לקבל את הערך המעוגל כלפי מטה של 7.9:
import math
result = math._____(7.9)',
  'floor',
  'ceil',
  'round',
  'int',
  'a',
  'math.floor() מחזיר את המספר השלם הגדול ביותר שאינו גדול מהארגומנט (עיגול כלפי מטה).',
  'לבלבל בין math.floor (מטה) ל-math.ceil (מעלה).',
  true
);

-- 2-D  multiple_choice / hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0002-0000-0000-000000000000',
  'multiple_choice', 'hard', 'power_operator',
  'מה הערך של: 2 ** 3 ** 2 ?',
  '512',
  '64',
  '8',
  '729',
  'a',
  'אופרטור ** הוא ימני-אסוציאטיבי: 3**2=9 מחושב קודם, לאחר מכן 2**9=512.',
  'לחשב משמאל לימין: (2**3)**2 = 8**2 = 64. האסוציאטיביות של ** היא מימין לשמאל.',
  true
);

-- ============================================================
-- TOPIC 3: תנאים  (11111111-0003)
-- ============================================================

-- 3-A  tracing / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'tracing', 'medium', 'elif_chain',
  'מה יודפס לאחר הרצת הקוד הבא?',
  'x = 15
if x > 20:
    print("גדול")
elif x > 10:
    print("בינוני")
elif x > 5:
    print("קטן")
else:
    print("זעיר")',
  'בינוני',
  'בינוני',
  'גדול',
  'קטן',
  'זעיר',
  'a',
  'x=15: התנאי הראשון x>20 שקרי. התנאי השני x>10 אמתי (15>10) → מדפיס "בינוני" ומפסיק.',
  'לבדוק את כל התנאים גם לאחר שנמצא תנאי אמתי — ב-elif רק הבלוק הראשון האמתי מתבצע.',
  true
);

-- 3-B  multiple_choice / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'multiple_choice', 'easy', 'logical_operators',
  'מה הערך של: True and False or True ?',
  'True',
  'False',
  'None',
  'שגיאת SyntaxError',
  'a',
  'עדיפות: and לפני or. (True and False)=False, לאחר מכן False or True = True.',
  'לחשב משמאל לימין: True and False = False, ולאחר מכן False or True = True — בפועל התשובה נכונה, אך יש להבין את העדיפות.',
  true
);

-- 3-C  fill_blank / hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'fill_blank', 'hard', 'not_operator',
  'השלם כדי שהקוד ידפיס "לא זוגי" כאשר n אי-זוגי:
n = 7
if _____(n % 2 == 0):
    print("לא זוגי")',
  'not',
  'and',
  'or',
  'is not',
  'a',
  'not הופך ערך בוליאני. n%2==0 שקרי עבור 7, ולכן not(False)=True ומדפיס "לא זוגי".',
  'לכתוב n % 2 != 0 במקום not(n % 2 == 0) — שתיהן נכונות, אך השאלה מבקשת שימוש ב-not.',
  true
);

-- 3-D  multiple_choice / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0003-0000-0000-000000000000',
  'multiple_choice', 'medium', 'short_circuit',
  'מה יודפס?
x = 0
if x != 0 and 10 / x > 2:
    print("כן")
else:
    print("לא")',
  'לא',
  'כן',
  'שגיאת ZeroDivisionError',
  'None',
  'a',
  'Python מבצע "short-circuit evaluation": כיוון ש-x!=0 שקרי, הביטוי השני 10/x לא נבדק כלל.',
  'לחשוב שהקוד יגרום לחלוקה באפס — Python מפסיק לבדוק and כשהביטוי הראשון שקרי.',
  true
);

-- ============================================================
-- TOPIC 4: לולאות  (11111111-0004)
-- ============================================================

-- 4-A  tracing / hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'tracing', 'hard', 'while_break',
  'מה יודפס לאחר הרצת הקוד הבא?',
  'i = 0
total = 0
while i < 10:
    i += 1
    if i % 3 == 0:
        continue
    if i > 6:
        break
    total += i
print(total)',
  '12',
  '12',
  '15',
  '10',
  '28',
  'a',
  'בכל איטרציה: i מוגדל ב-1 לפני הבדיקות. i=1: נוסף, total=1. i=2: נוסף, total=3. i=3: 3%3==0 → continue, לא נוסף. i=4: נוסף, total=7. i=5: נוסף, total=12. i=6: 6%3==0 → continue. i=7: 7>6 → break. תוצאה: 1+2+4+5=12.',
  'לשכוח שעל continue לדלג על שארית גוף הלולאה כולל total+=i.',
  true
);

-- 4-B  multiple_choice / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'multiple_choice', 'easy', 'range_loop',
  'מה יודפס על ידי הקוד הבא?
for i in range(5):
    print(i, end=" ")',
  '0 1 2 3 4 ',
  '1 2 3 4 5 ',
  '0 1 2 3 4 5 ',
  '1 2 3 4 ',
  'a',
  'range(5) מייצר 0,1,2,3,4. end=" " מדפיס רווח במקום ירידת שורה.',
  'לחשוב ש-range(5) מתחיל מ-1 — range(n) תמיד מתחיל מ-0 כברירת מחדל.',
  true
);

-- 4-C  fill_blank / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'fill_blank', 'medium', 'continue_statement',
  'השלם את הקוד כדי לדלג על מספרים זוגיים ולהדפיס רק אי-זוגיים מ-1 עד 9:
for i in range(1, 10):
    if i % 2 == 0:
        _____
    print(i)',
  'continue',
  'break',
  'pass',
  'return',
  'a',
  'continue גורם לדילוג על שארית גוף הלולאה ומעבר לאיטרציה הבאה, כך שמספרים זוגיים לא יודפסו.',
  'לבחור ב-pass — pass לא עושה כלום ולא דולג על print(i).',
  true
);

-- 4-D  tracing / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0004-0000-0000-000000000000',
  'tracing', 'medium', 'nested_loops',
  'מה יודפס לאחר הרצת הקוד הבא?',
  'count = 0
for i in range(3):
    for j in range(i):
        count += 1
print(count)',
  '3',
  '3',
  '6',
  '9',
  '0',
  'a',
  'i=0: range(0) ריק, אפס איטרציות. i=1: range(1) איטרציה אחת, count=1. i=2: range(2) שתי איטרציות, count=3. סה"כ count=3.',
  'לחשב range(3)*range(3)=9 — לא נכון, range(i) משתנה בכל איטרציה.',
  true
);

-- ============================================================
-- TOPIC 5: פונקציות  (11111111-0005)
-- ============================================================

-- 5-A  tracing / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'tracing', 'medium', 'recursion',
  'מה יחזיר הקריאה mystery(4)?',
  'def mystery(n):
    if n == 0:
        return 0
    return n + mystery(n - 1)',
  '10',
  '10',
  '4',
  '0',
  '24',
  'a',
  'mystery(4) = 4 + mystery(3) = 4 + 3 + mystery(2) = 4+3+2+mystery(1) = 4+3+2+1+mystery(0) = 4+3+2+1+0 = 10.',
  'לחשוב שהפונקציה מחשבת עצרת (factorial) — היא סוכמת מ-0 עד n.',
  true
);

-- 5-B  multiple_choice / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'multiple_choice', 'easy', 'return_none',
  'מה יודפס?
def add(a, b):
    a + b

result = add(3, 4)
print(result)',
  'None',
  '7',
  '0',
  'שגיאת TypeError',
  'a',
  'הפונקציה לא מכילה return, לכן היא מחזירה None כברירת מחדל.',
  'לחשוב שהביטוי a+b מוחזר אוטומטית — בפייתון חייבים לכתוב return במפורש.',
  true
);

-- 5-C  fill_blank / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'fill_blank', 'medium', 'local_scope',
  'השלם את הקוד כדי לשנות משתנה גלובלי בתוך פונקציה:
count = 0
def increment():
    _____ count
    count += 1',
  'global',
  'local',
  'nonlocal',
  'import',
  'a',
  'הצהרת global מאפשרת לפונקציה לגשת ולשנות משתנה שהוגדר מחוץ לה (גלובלי).',
  'לחשוב שניתן לשנות משתנה גלובלי ישירות — בפייתון הקצאה יוצרת משתנה מקומי חדש ללא global.',
  true
);

-- 5-D  multiple_choice / hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0005-0000-0000-000000000000',
  'multiple_choice', 'hard', 'mutable_default_arg',
  'מה יודפס?
def append_to(val, lst=[]):
    lst.append(val)
    return lst

print(append_to(1))
print(append_to(2))',
  '[1]
[1, 2]',
  '[1]
[2]',
  '[1]
[2]',
  'שגיאת TypeError',
  'a',
  'ברירת מחדל של ארגומנט mutable (רשימה) נוצרת פעם אחת בלבד בעת הגדרת הפונקציה. כל קריאה משתפת את אותה הרשימה.',
  'לחשוב שברירת מחדל נוצרת מחדש בכל קריאה — זה נכון רק לסוגי immutable כמו int ו-str.',
  true
);

-- ============================================================
-- TOPIC 6: מחרוזות  (11111111-0006)
-- ============================================================

-- 6-A  tracing / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'tracing', 'medium', 'string_methods',
  'מה יודפס לאחר הרצת הקוד הבא?',
  's = "Hello World"
print(s.lower().replace("o", "0"))',
  'hell0 w0rld',
  'hell0 w0rld',
  'Hello World',
  'hell0 World',
  'HELL0 W0RLD',
  'a',
  'קודם lower() הופך הכל לאותיות קטנות: "hello world". לאחר מכן replace("o","0") מחליף כל "o" ב-"0": "hell0 w0rld".',
  'לחשוב שהסדר לא משנה — lower() קודם הופך גם את ה-W לאות קטנה, כך ש-replace יחפש "o" קטנה בלבד.',
  true
);

-- 6-B  multiple_choice / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'multiple_choice', 'easy', 'string_indexing',
  'מה הערך של s[-1] כאשר s = "Python"?',
  'n',
  'P',
  'o',
  'שגיאת IndexError',
  'a',
  'אינדקס שלילי -1 מצביע על האלמנט האחרון במחרוזת. "Python"[-1] = "n".',
  'לחשוב ש-[-1] גורם לשגיאה — אינדקסים שליליים חוקיים בפייתון ומתחילים מהסוף.',
  true
);

-- 6-C  fill_blank / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'fill_blank', 'medium', 'split_join',
  'השלם את הקוד כדי לפצל את המשפט למילים ולאחד אותן עם "-":
sentence = "שלום עולם פייתון"
words = sentence.split()
result = "_____".join(words)',
  '-',
  ' ',
  ',',
  '/',
  'a',
  'join() מאחד את הפריטים ברשימה עם המחרוזת שקראת לה. "-".join(words) מאחד עם מקפים.',
  'לבלבל בין split (מפצל) ל-join (מאחד) — split() פוצל לרשימה, join() אוחד מרשימה.',
  true
);

-- 6-D  multiple_choice / hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0006-0000-0000-000000000000',
  'multiple_choice', 'hard', 'string_find',
  'מה יחזיר הקוד?
s = "abcabc"
print(s.find("b"), s.find("z"))',
  '1 -1',
  '1 0',
  '2 -1',
  'שגיאת ValueError',
  'a',
  'find() מחזיר את האינדקס של המופע הראשון, או -1 אם לא נמצא. "b" נמצא במיקום 1, "z" לא קיים → -1.',
  'לבלבל בין find() (מחזיר -1 אם לא נמצא) ל-index() (זורק ValueError אם לא נמצא).',
  true
);

-- ============================================================
-- TOPIC 7: רשימות  (11111111-0007)
-- ============================================================

-- 7-A  tracing / hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'tracing', 'hard', 'list_comprehension',
  'מה יודפס לאחר הרצת הקוד הבא?',
  'nums = [1, 2, 3, 4, 5]
result = [x ** 2 for x in nums if x % 2 != 0]
print(result)',
  '[1, 9, 25]',
  '[1, 9, 25]',
  '[1, 4, 9, 16, 25]',
  '[4, 16]',
  '[1, 3, 5]',
  'a',
  'List comprehension מסנן רק אי-זוגיים (1,3,5) ומרבע אותם: 1²=1, 3²=9, 5²=25.',
  'להתעלם מהתנאי if ולרבע את כל המספרים — חשוב לשים לב לסינון if בתוך ה-comprehension.',
  true
);

-- 7-B  multiple_choice / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'multiple_choice', 'easy', 'list_append_pop',
  'מה יודפס?
lst = [1, 2, 3]
lst.append(4)
lst.pop(0)
print(lst)',
  '[2, 3, 4]',
  '[1, 2, 3, 4]',
  '[1, 2, 3]',
  '[4, 2, 3]',
  'a',
  'append(4) מוסיף 4 לסוף: [1,2,3,4]. pop(0) מסיר את האיבר במיקום 0 (=1): [2,3,4].',
  'לחשוב ש-pop() ללא ארגומנט מסיר מהסוף — pop(0) מסיר מהתחלה.',
  true
);

-- 7-C  fill_blank / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'fill_blank', 'medium', 'list_slicing',
  'השלם את הקוד כדי לקבל רשימה הפוכה של lst:
lst = [1, 2, 3, 4, 5]
reversed_lst = lst[_____]',
  '::-1',
  '::1',
  '::-2',
  'reversed()',
  'a',
  'slicing [start:stop:step] עם step=-1 עובר מהסוף להתחלה: lst[::-1] מחזיר את הרשימה הפוכה.',
  'לכתוב lst.reverse() — זה משנה את הרשימה במקום ולא יוצר רשימה חדשה.',
  true
);

-- 7-D  multiple_choice / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0007-0000-0000-000000000000',
  'multiple_choice', 'medium', 'nested_list',
  'מה יודפס?
matrix = [[1, 2], [3, 4], [5, 6]]
print(matrix[1][0])',
  '3',
  '2',
  '4',
  '1',
  'a',
  'matrix[1] הוא השורה השנייה [3,4]. [0] הוא האיבר הראשון בה: 3.',
  'לבלבל בין שורה לעמודה: matrix[1][0] = שורה 1, עמודה 0 = 3 (לא 2).',
  true
);

-- ============================================================
-- TOPIC 8: טאפלים, קבוצות ומילונים  (11111111-0008)
-- ============================================================

-- 8-A  tracing / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'tracing', 'medium', 'dict_iteration',
  'מה יודפס לאחר הרצת הקוד הבא?',
  'grades = {"דנה": 90, "רון": 75, "מיה": 85}
total = sum(grades.values())
print(total)',
  '250',
  '250',
  '3',
  '90',
  'None',
  'a',
  'grades.values() מחזיר את הערכים 90, 75, 85. sum() סוכם אותם: 90+75+85=250.',
  'לקרוא grades.keys() במקום grades.values() — keys() יחזיר את השמות, לא את הציונים.',
  true
);

-- 8-B  multiple_choice / easy
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'multiple_choice', 'easy', 'tuple_immutability',
  'מה יקרה בעקבות הקוד הבא?
t = (1, 2, 3)
t[0] = 10',
  'שגיאת TypeError',
  'הטאפל יהיה (10, 2, 3)',
  'None',
  'שגיאת IndexError',
  'a',
  'טאפל הוא immutable — לא ניתן לשנות את איבריו לאחר היצירה. כל ניסיון הקצאה זורק TypeError.',
  'לבלבל בין רשימה (mutable) לטאפל (immutable) — לרשימה ניתן להקצות, לטאפל לא.',
  true
);

-- 8-C  fill_blank / medium
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'fill_blank', 'medium', 'set_operations',
  'השלם את הקוד כדי לקבל את האיחוד של שתי הקבוצות:
a = {1, 2, 3}
b = {3, 4, 5}
result = a._____(b)',
  'union',
  'intersection',
  'difference',
  'update',
  'a',
  'union() מחזיר קבוצה חדשה המכילה את כל האיברים משתי הקבוצות (ללא כפילויות).',
  'לבלבל בין union (איחוד) ל-intersection (חיתוך) — intersection מחזיר רק איברים משותפים.',
  true
);

-- 8-D  multiple_choice / hard
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '11111111-0008-0000-0000-000000000000',
  'multiple_choice', 'hard', 'dict_comprehension',
  'מה יודפס?
nums = [1, 2, 3, 4]
d = {x: x ** 2 for x in nums if x % 2 == 0}
print(d)',
  '{2: 4, 4: 16}',
  '{1: 1, 2: 4, 3: 9, 4: 16}',
  '{2: 4, 4: 8}',
  '[4, 16]',
  'a',
  'Dict comprehension מסנן רק זוגיים (2,4) ויוצר מילון x→x²: {2:4, 4:16}.',
  'להתעלם מהתנאי if ולכלול את כל המספרים — x²=x**2, לא x*2.',
  true
);
