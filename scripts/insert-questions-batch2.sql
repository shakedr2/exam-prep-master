-- Sprint 2 batch 2 — 72 additional Hebrew questions (9 per topic x 8 topics)
-- Schema columns: topic_id, question_type, difficulty, pattern_family, text,
--   option_a..d, correct_answer, expected_output, code_snippet, explanation,
--   common_mistake, is_generated
-- Types used: multiple_choice, tracing, fill_blank
-- correct_answer for multiple_choice stores the literal option text so the
-- frontend's options.indexOf() mapping resolves correctly.
-- Apply via: psql ... -f scripts/insert-questions-batch2.sql
--         or supabase db execute --file scripts/insert-questions-batch2.sql

BEGIN;

-- ============================================================
-- TOPIC 1: variables_io  (11111111-0001)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, code_snippet, expected_output, explanation, common_mistake, is_generated) VALUES
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','easy','type_function',$v$מה יחזיר type(3.14)?$v$,$v$<class 'int'>$v$,$v$<class 'float'>$v$,$v$<class 'str'>$v$,$v$<class 'number'>$v$,$v$<class 'float'>$v$,NULL,NULL,$v$type() מחזירה את טיפוס הערך. 3.14 מכיל נקודה עשרונית ולכן הטיפוס שלו float.$v$,$v$לחשוב שכל מספר הוא int — בפייתון מספר עם נקודה הוא float.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','easy','input_return',$v$מה הטיפוס שמחזירה הפונקציה input()?$v$,'int','float','str','bool','str',NULL,NULL,$v$input() תמיד מחזירה מחרוזת גם אם המשתמש הקליד מספר. יש להמיר במפורש עם int() או float().$v$,$v$לשכוח שצריך להמיר את הקלט למספר לפני חישובים.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','medium','int_conversion',$v$מה יודפס?
x = int("12") + int(3.7)
print(x)$v$,'15','15.7','16','שגיאה','15',NULL,NULL,$v$int("12") = 12, int(3.7) חותך למטה ל-3. הסכום 12+3=15.$v$,$v$לחשוב ש-int(3.7) מעגל ל-4 — הוא חותך לכיוון אפס.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'tracing','medium','print_sep',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$print("a","b","c",sep="-")$v$,'a-b-c',$v$הפרמטר sep קובע את המפריד בין הארגומנטים. ברירת המחדל היא רווח, כאן הוא מוחלף במקף.$v$,$v$לחשוב ש-sep מוסיף אחרי כל ערך במקום ביניהם.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','medium','fstring',$v$מה יודפס?
name = "דנה"
age = 20
print(f"{name} בת {age}")$v$,$v${name} בת {age}$v$,$v$דנה בת 20$v$,$v$דנה בת age$v$,'שגיאה',$v$דנה בת 20$v$,NULL,NULL,$v$f-string מחליף את הביטויים בסוגריים בערכים שלהם.$v$,$v$לשכוח את ה-f לפני המרכאות — בלעדיו הסוגריים מודפסים כפי שהם.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','hard','type_coerce',$v$מה יודפס?
print(type(True + 1))$v$,$v$<class 'bool'>$v$,$v$<class 'int'>$v$,$v$<class 'tuple'>$v$,'שגיאה',$v$<class 'int'>$v$,NULL,NULL,$v$True מתנהג כ-1 בחישוב. True+1=2, והטיפוס של הסכום הוא int.$v$,$v$לחשוב שהתוצאה היא bool — חיבור עם int מחזיר int.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'fill_blank','medium','input_convert',$v$השלם כדי לקרוא מספר שלם מהמשתמש$v$,NULL,NULL,NULL,NULL,'int',$v$n = ___(input("מספר: "))$v$,NULL,$v$כדי להמיר את המחרוזת שמחזירה input() למספר שלם משתמשים בפונקציה int().$v$,$v$לשכוח את ההמרה ולקבל שגיאה בפעולה מתמטית.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','easy','str_concat',$v$מה יודפס?
print("שלום " + "עולם")$v$,$v$שלוםעולם$v$,$v$שלום עולם$v$,'שגיאה',$v$"שלום עולם"$v$,$v$שלום עולם$v$,NULL,NULL,$v$הסימן + מחבר שתי מחרוזות. הרווח שבסוף "שלום " נשמר.$v$,$v$לחשוב ש + מוסיף רווח אוטומטי בין מחרוזות.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'tracing','hard','multi_print',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$x = 5
y = x
x = 10
print(x, y)$v$,'10 5',$v$השמה מעתיקה את הערך. y קיבל 5 לפני שינוי x, ולכן y נשאר 5 ו-x הוא כעת 10.$v$,$v$לחשוב ש-y משתנה יחד עם x — הם לא מקושרים אחרי ההשמה.$v$,true);

-- ============================================================
-- TOPIC 2: arithmetic  (11111111-0002)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, code_snippet, expected_output, explanation, common_mistake, is_generated) VALUES
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','easy','floor_div',$v$מה הערך של 17 // 5?$v$,'3','3.4','4','2','3',NULL,NULL,$v$חלוקה שלמה (//) מחזירה את המנה מעוגלת למטה. 17 חלקי 5 זה 3 ושארית 2.$v$,$v$לבלבל בין / שמחזיר float לבין // שמחזיר int.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','easy','modulo',$v$מה הערך של 17 % 5?$v$,'3','2','3.4','0','2',NULL,NULL,$v$האופרטור % מחזיר את שארית החלוקה. 17 = 3*5 + 2, ולכן השארית היא 2.$v$,$v$לחשוב ש-% הוא אחוז — בפייתון הוא שארית חלוקה.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','medium','power_order',$v$מה הערך של 2 ** 3 ** 2?$v$,'64','512','256','36','512',NULL,NULL,$v$החזקה מתבצעת מימין לשמאל: קודם 3**2=9, אחר כך 2**9=512.$v$,$v$לחשב משמאל לימין — ** שונה מרוב האופרטורים וקושר ימינה.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'tracing','medium','mixed_ops',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$print(2 + 3 * 4 - 1)$v$,'13',$v$כפל לפני חיבור וחיסור: 3*4=12, ואז 2+12-1=13.$v$,$v$לחשב משמאל לימין בלי כללי קדימות.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','medium','round_banker',$v$מה הערך של round(2.5)?$v$,'3','2','2.5','שגיאה','2',NULL,NULL,$v$פייתון משתמש בעיגול בנקאי: 2.5 מתעגל לזוגי הקרוב, שהוא 2.$v$,$v$להניח ש-round תמיד מעגל כלפי מעלה כמו במתמטיקה.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','hard','math_ceil',$v$מה יודפס?
import math
print(math.ceil(-3.2))$v$,'-3','-4','3','4','-3',NULL,NULL,$v$math.ceil מחזיר את השלם הקטן ביותר שגדול או שווה לערך. עבור -3.2 זה -3.$v$,$v$לחשוב ש-ceil תמיד מגדיל בערך מוחלט.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'fill_blank','medium','abs',$v$השלם כדי להחזיר את הערך המוחלט של x$v$,NULL,NULL,NULL,NULL,'abs',$v$result = ___(x)$v$,NULL,$v$abs() היא פונקציה מובנית שמחזירה את הערך המוחלט.$v$,$v$לכתוב פונקציה מותאמת עם if במקום להשתמש ב-abs.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','easy','divmod_like',$v$מה הערך של 7 / 2?$v$,'3','3.5','4','שגיאה','3.5',NULL,NULL,$v$האופרטור / בפייתון 3 תמיד מחזיר float, גם כשהחלוקה עגולה.$v$,$v$לחשוב ש-/ מחזיר int כשאין שארית — בפייתון 3 זה תמיד float.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'tracing','hard','precedence',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$print((10 - 2) ** 2 // 3)$v$,'21',$v$סוגריים קודם: 10-2=8. אחר כך חזקה: 8**2=64. ולבסוף חלוקה שלמה: 64//3=21.$v$,$v$לשכוח את סדר הקדימות ולחלק לפני החזקה.$v$,true);

-- ============================================================
-- TOPIC 3: conditions  (11111111-0003)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, code_snippet, expected_output, explanation, common_mistake, is_generated) VALUES
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','easy','if_else',$v$מה יודפס?
x = 7
if x > 5:
    print("גדול")
else:
    print("קטן")$v$,'גדול','קטן','גדול קטן','שגיאה','גדול',NULL,NULL,$v$x=7 גדול מ-5 ולכן התנאי נכון וה-if מתבצע.$v$,$v$לשכוח שגם if וגם else לא יכולים לרוץ באותו זרם.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','easy','and_or',$v$מה הערך של True and False or True?$v$,'True','False','None','שגיאה','True',NULL,NULL,$v$and לפני or. תחילה True and False = False, אחר כך False or True = True.$v$,$v$להתייחס ל-or ו-and באותה קדימות.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','medium','nested_if',$v$מה יודפס?
x = 10
if x > 5:
    if x > 8:
        print("A")
    else:
        print("B")
else:
    print("C")$v$,'A','B','C','A B','A',NULL,NULL,$v$x=10 מקיים x>5 וגם x>8 ולכן מודפס A בלבד.$v$,$v$לחשוב ששני תנאים מקוננים יודפסו יחד.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'tracing','medium','elif_chain',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$x = 75
if x >= 90:
    print("מצוין")
elif x >= 70:
    print("טוב")
elif x >= 50:
    print("עובר")
else:
    print("נכשל")$v$,'טוב',$v$התנאי הראשון שמתקיים הוא x>=70 ולכן מודפס "טוב" ושאר ה-elif לא נבדקים.$v$,$v$להמשיך לבדוק elif גם אחרי שתנאי התקיים.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','medium','not_operator',$v$מה הערך של not (5 > 3)?$v$,'True','False','5','None','False',NULL,NULL,$v$5>3 הוא True, ו-not True הוא False.$v$,$v$לחשוב ש-not משנה גודל ולא ערך בוליאני.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','hard','short_circuit',$v$מה יודפס?
x = 0
if x != 0 and 10/x > 1:
    print("A")
else:
    print("B")$v$,'A','B','ZeroDivisionError','None','B',NULL,NULL,$v$בגלל short-circuit: x!=0 הוא False, ולכן פייתון לא מחשב את 10/x ואין שגיאה. התוצאה B.$v$,$v$לפחד מ-ZeroDivisionError כשה-and מוגן על ידי הבדיקה הראשונה.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'fill_blank','medium','range_check',$v$השלם כדי לבדוק ש-x בטווח 1..10 כולל$v$,NULL,NULL,NULL,NULL,'1 <= x <= 10',$v$if ___:
    print("בטווח")$v$,NULL,$v$בפייתון ניתן לשרשר השוואות: 1 <= x <= 10 שקול ל-(1<=x) and (x<=10).$v$,$v$לכתוב 1 <= x and x <= 10 (עובד אך ארוך מהצורך).$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','easy','equality',$v$איזה אופרטור בודק שוויון?$v$,'=','==','===','!=','==',NULL,NULL,$v$= היא השמה, ו-== בודקת שוויון. === לא קיים בפייתון.$v$,$v$להשתמש ב-= בתוך if במקום ==.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'tracing','hard','complex_cond',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$a, b = 4, 9
if a > 3 and (b < 5 or b > 8):
    print("yes")
else:
    print("no")$v$,'yes',$v$a>3 True. הפנים: b<5 False, b>8 True → or מחזיר True. True and True = True.$v$,$v$להחליט לפי תנאי יחיד בלי לסיים את הצרופים.$v$,true);

-- ============================================================
-- TOPIC 4: loops  (11111111-0004)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, code_snippet, expected_output, explanation, common_mistake, is_generated) VALUES
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','easy','for_range',$v$כמה איטרציות יבצע for i in range(5)?$v$,'4','5','6','0','5',NULL,NULL,$v$range(5) מפיק 0,1,2,3,4 — חמישה ערכים.$v$,$v$לחשוב ש-range(5) כולל את 5.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','easy','while_basic',$v$מה יודפס?
i = 0
while i < 3:
    print(i)
    i += 1$v$,'0 1 2','1 2 3','0 1 2 3','לולאה אינסופית','0 1 2',NULL,NULL,$v$הלולאה רצה כל עוד i<3. הערכים המודפסים הם 0,1,2. אחרי 2 → 3 והתנאי מפסיק.$v$,$v$לשכוח להגדיל את i ולקבל לולאה אינסופית.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','medium','break',$v$מה יודפס?
for i in range(10):
    if i == 4:
        break
    print(i, end=" ")$v$,'0 1 2 3','0 1 2 3 4','0 1 2 3 4 5','4','0 1 2 3',NULL,NULL,$v$break יוצא מהלולאה מיד כש-i==4, לכן 4 אינו מודפס.$v$,$v$לחשוב ש-break מדלג על האיטרציה הנוכחית בלבד (זה continue).$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'tracing','medium','sum_loop',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$s = 0
for i in range(1, 5):
    s += i
print(s)$v$,'10',$v$range(1,5) מפיק 1,2,3,4. הסכום 1+2+3+4=10.$v$,$v$לכלול את 5 בטעות ולקבל 15.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','medium','continue',$v$מה יודפס?
for i in range(5):
    if i % 2 == 0:
        continue
    print(i, end=" ")$v$,'0 1 2 3 4','1 3','0 2 4','','1 3',NULL,NULL,$v$continue מדלג לאיטרציה הבאה כאשר i זוגי. נשארו 1 ו-3.$v$,$v$לחשוב ש-continue עוצר את הלולאה (זה break).$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','hard','nested_count',$v$כמה פעמים יודפס "*"?
for i in range(3):
    for j in range(4):
        print("*", end="")$v$,'7','12','3','4','12',NULL,NULL,$v$הלולאה הפנימית רצה 4 פעמים עבור כל איטרציה של החיצונית, 3*4=12.$v$,$v$לסכם (3+4) במקום להכפיל.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'fill_blank','medium','range_step',$v$השלם כדי להדפיס מספרים זוגיים מ-0 עד 10 כולל$v$,NULL,NULL,NULL,NULL,'range(0, 11, 2)',$v$for i in ___:
    print(i)$v$,NULL,$v$range(start, stop, step): התחלה 0, עצירה 11 (לא כולל), קפיצה 2.$v$,$v$להשתמש ב-range(10) ולפספס את 10.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','easy','range_len',$v$מה מייצר range(2, 7)?$v$,'2,3,4,5,6,7','2,3,4,5,6','3,4,5,6,7','0,1,2,3,4,5,6','2,3,4,5,6',NULL,NULL,$v$range(start, stop) כולל את start ולא כולל את stop.$v$,$v$לכלול את stop בטעות.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'tracing','hard','nested_sum',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$total = 0
for i in range(3):
    for j in range(i + 1):
        total += 1
print(total)$v$,'6',$v$i=0 → j רץ פעם אחת; i=1 → פעמיים; i=2 → שלוש. סכום 1+2+3=6.$v$,$v$לחשוב שהלולאה הפנימית תמיד רצה מספר קבוע של פעמים.$v$,true);

-- ============================================================
-- TOPIC 5: functions  (11111111-0005)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, code_snippet, expected_output, explanation, common_mistake, is_generated) VALUES
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','easy','def_basic',$v$מה יוגדר פונקציה בפייתון?$v$,'function','func','def','define','def',NULL,NULL,$v$הגדרת פונקציה מתחילה במילה השמורה def ואחריה שם ופרמטרים.$v$,$v$להשתמש ב-function כמו בשפות אחרות.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','easy','return',$v$מה מחזירה פונקציה בלי return?$v$,'0','None','""','שגיאה','None',NULL,NULL,$v$פונקציה שלא מבצעת return מחזירה None כברירת מחדל.$v$,$v$להניח שתוחזר שגיאה או 0.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','medium','default_args',$v$מה יודפס?
def greet(name, greeting="שלום"):
    return f"{greeting} {name}"
print(greet("דנה"))$v$,'שלום דנה','דנה','greeting דנה','שגיאה','שלום דנה',NULL,NULL,$v$הפרמטר greeting לא סופק, ולכן משתמש בברירת המחדל "שלום".$v$,$v$לשכוח שברירת מחדל פועלת רק כשלא מוסרים את הפרמטר.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'tracing','medium','call_func',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$def square(x):
    return x * x
print(square(4) + square(3))$v$,'25',$v$square(4)=16, square(3)=9. הסכום 16+9=25.$v$,$v$לחשוב ש-square מקבל שני ארגומנטים ולחבר במקום להעלות בריבוע.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','medium','scope',$v$מה יודפס?
x = 1
def f():
    x = 5
    print(x)
f()
print(x)$v$,'1 1','5 5','5 1','1 5','5 1',NULL,NULL,$v$בתוך f, x=5 הוא משתנה מקומי חדש ולא משנה את x הגלובלי.$v$,$v$לחשוב שהשמה בפונקציה משנה את המשתנה הגלובלי.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','hard','recursion',$v$מה מחזירה fact(4)?
def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)$v$,'10','24','12','שגיאה','24',NULL,NULL,$v$fact(4)=4*fact(3)=4*3*fact(2)=4*3*2*fact(1)=4*3*2*1=24.$v$,$v$לשכוח את תנאי העצירה ולקבל רקורסיה אינסופית.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'fill_blank','medium','return_keyword',$v$השלם כדי להחזיר את הסכום של שני מספרים$v$,NULL,NULL,NULL,NULL,'return',$v$def add(a, b):
    ___ a + b$v$,NULL,$v$המילה return משמשת להחזרת ערך מפונקציה.$v$,$v$לכתוב print במקום return — הערך לא יוחזר לקורא.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','easy','params_count',$v$כמה פרמטרים מקבלת הפונקציה?
def f(a, b, c=3): pass$v$,'1','2','3','4','3',NULL,NULL,$v$הפונקציה מקבלת עד שלושה: a, b, ו-c עם ברירת מחדל.$v$,$v$לספור רק את הפרמטרים החובה.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'tracing','hard','recursion_trace',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)
print(f(5))$v$,'15',$v$סכום 5+4+3+2+1+0=15.$v$,$v$לשכוח את הקריאה הרקורסיבית האחרונה f(0)=0.$v$,true);

-- ============================================================
-- TOPIC 6: strings  (11111111-0006)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, code_snippet, expected_output, explanation, common_mistake, is_generated) VALUES
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','easy','len_str',$v$מה יחזיר len("פייתון")?$v$,'5','6','7','1','6',NULL,NULL,$v$len() מחזיר את מספר התווים במחרוזת. המילה "פייתון" מכילה 6 תווים.$v$,$v$לחשוב ש-len כולל את תווי הגרשיים.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','easy','indexing',$v$מה יודפס?
s = "Python"
print(s[0])$v$,'P','y','Python','n','P',NULL,NULL,$v$מחרוזות ממודדות מ-0. s[0] הוא התו הראשון P.$v$,$v$לחשוב שאינדקס 0 מחזיר את המחרוזת כולה.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','medium','slicing',$v$מה יודפס?
s = "exam"
print(s[1:3])$v$,'xa','xam','ex','exam','xa',NULL,NULL,$v$s[1:3] מחזיר את התווים באינדקסים 1,2 — לא כולל 3. התוצאה "xa".$v$,$v$לכלול את אינדקס הסיום בחיתוך.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'tracing','medium','upper_method',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$s = "hello"
print(s.upper())
print(s)$v$,$v$HELLO
hello$v$,$v$.upper() מחזירה מחרוזת חדשה באותיות גדולות, בלי לשנות את המקור. s עצמו נשאר "hello".$v$,$v$לחשוב ש-upper משנה את המחרוזת במקומה.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','medium','replace',$v$מה יודפס?
print("abcabc".replace("a", "X"))$v$,'Xbcabc','XbcXbc','abcabc','שגיאה','XbcXbc',NULL,NULL,$v$replace מחליפה את כל ההתאמות כברירת מחדל. שתי ה-a הופכות ל-X.$v$,$v$לחשוב ש-replace מחליפה רק את ההתאמה הראשונה.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','hard','split_join',$v$מה יודפס?
parts = "one,two,three".split(",")
print("-".join(parts))$v$,'one,two,three','one-two-three','onetwothree','שגיאה','one-two-three',NULL,NULL,$v$split(",") מפצל לרשימה ["one","two","three"]. "-".join מחברת עם מקף.$v$,$v$להחליף בין split ל-join.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'fill_blank','medium','find',$v$השלם כדי למצוא את המיקום של "o" ב-"hello"$v$,NULL,NULL,NULL,NULL,'find',$v$pos = "hello".___("o")$v$,NULL,$v$הפונקציה .find() מחזירה את האינדקס הראשון של תת-המחרוזת, או -1 אם לא נמצאה.$v$,$v$להשתמש ב-index (זורק חריגה אם לא נמצא) בלי לטפל בשגיאה.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','easy','in_operator',$v$מה הערך של "py" in "python"?$v$,'True','False','1','שגיאה','True',NULL,NULL,$v$האופרטור in בודק אם תת-מחרוזת מופיעה. "py" הן שתי האותיות הראשונות של "python".$v$,$v$להשתמש ב-== במקום in.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'tracing','hard','reverse_slice',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$s = "abcdef"
print(s[::-1])$v$,'fedcba',$v$חיתוך עם step -1 הופך את המחרוזת.$v$,$v$לחשוב שצריך לולאה ידנית כדי להפוך מחרוזת.$v$,true);

-- ============================================================
-- TOPIC 7: lists  (11111111-0007)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, code_snippet, expected_output, explanation, common_mistake, is_generated) VALUES
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','easy','append',$v$מה יודפס?
lst = [1, 2]
lst.append(3)
print(lst)$v$,'[1, 2]','[1, 2, 3]','[3, 1, 2]','שגיאה','[1, 2, 3]',NULL,NULL,$v$append מוסיפה איבר יחיד לסוף הרשימה ומשנה אותה במקום.$v$,$v$לחשוב ש-append מחזירה רשימה חדשה.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','easy','list_index',$v$מה יודפס?
lst = [10, 20, 30]
print(lst[-1])$v$,'10','20','30','שגיאה','30',NULL,NULL,$v$אינדקסים שליליים מתחילים מהסוף. -1 הוא האיבר האחרון.$v$,$v$לחשוב ש-[-1] זורק שגיאה בפייתון.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','medium','list_slice',$v$מה יודפס?
lst = [0, 1, 2, 3, 4]
print(lst[1:4])$v$,'[0, 1, 2, 3]','[1, 2, 3]','[1, 2, 3, 4]','[2, 3]','[1, 2, 3]',NULL,NULL,$v$חיתוך כולל את start ולא כולל את stop. האיברים באינדקסים 1,2,3.$v$,$v$לכלול את stop בחיתוך.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'tracing','medium','sort',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$lst = [3, 1, 2]
lst.sort()
print(lst)$v$,'[1, 2, 3]',$v$.sort() ממיינת את הרשימה במקום, בלי להחזיר ערך.$v$,$v$לצפות ש-lst.sort() יחזיר את הרשימה הממוינת.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','medium','pop',$v$מה יודפס?
lst = [1, 2, 3]
x = lst.pop()
print(x, lst)$v$,'1 [2, 3]','3 [1, 2]','3 [1, 2, 3]','שגיאה','3 [1, 2]',NULL,NULL,$v$pop ללא ארגומנט מסירה ומחזירה את האיבר האחרון.$v$,$v$לחשוב ש-pop מסירה את האיבר הראשון.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','hard','list_comp',$v$מה יודפס?
print([x*x for x in range(4)])$v$,'[0, 1, 4, 9]','[1, 4, 9, 16]','[0, 1, 2, 3]','[0, 2, 4, 6]','[0, 1, 4, 9]',NULL,NULL,$v$list comprehension מרבעת את 0,1,2,3 → 0,1,4,9.$v$,$v$לכלול את 4 (range לא כולל אותו).$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'fill_blank','medium','list_len',$v$השלם כדי לקבל את מספר האיברים ברשימה$v$,NULL,NULL,NULL,NULL,'len',$v$n = ___(lst)$v$,NULL,$v$len() מחזירה את מספר האיברים ברשימה.$v$,$v$לכתוב lst.length() כמו בשפות אחרות.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','easy','extend',$v$מה יודפס?
a = [1, 2]
a.extend([3, 4])
print(a)$v$,'[1, 2, [3, 4]]','[1, 2, 3, 4]','[3, 4, 1, 2]','שגיאה','[1, 2, 3, 4]',NULL,NULL,$v$extend מוסיפה כל איבר מהרשימה השנייה. append היה יוצר רשימה מקוננת.$v$,$v$לבלבל בין extend לבין append.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'tracing','hard','nested_list',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$m = [[1, 2], [3, 4], [5, 6]]
total = 0
for row in m:
    total += row[0]
print(total)$v$,'9',$v$מסכמים את האיבר הראשון בכל שורה: 1+3+5=9.$v$,$v$לסכם את כל האיברים במטריצה במקום את הטור הראשון בלבד.$v$,true);

-- ============================================================
-- TOPIC 8: tuples_sets_dicts  (11111111-0008)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, code_snippet, expected_output, explanation, common_mistake, is_generated) VALUES
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','easy','tuple_create',$v$איך יוצרים טאפל עם איבר יחיד?$v$,'(5)','(5,)','[5]','{5}','(5,)',NULL,NULL,$v$(5) הוא פשוט מספר בסוגריים. טאפל עם איבר יחיד דורש פסיק סיום: (5,).$v$,$v$לשכוח את הפסיק ולקבל int במקום tuple.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','easy','dict_access',$v$מה יודפס?
d = {"a": 1, "b": 2}
print(d["a"])$v$,'a','1','b','שגיאה','1',NULL,NULL,$v$גישה במילון לפי מפתח מחזירה את הערך. המפתח "a" ממופה ל-1.$v$,$v$לחשוב של-d["a"] מחזיר את המפתח.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','medium','set_union',$v$מה יודפס?
a = {1, 2, 3}
b = {3, 4, 5}
print(sorted(a | b))$v$,'[1, 2, 3, 4, 5]','[1, 2, 3, 3, 4, 5]','[3]','[4, 5]','[1, 2, 3, 4, 5]',NULL,NULL,$v$| הוא איחוד סטים. איברים משותפים מופיעים פעם אחת.$v$,$v$לחשוב שאיחוד ישמור כפילויות.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'tracing','medium','dict_iter',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$d = {"x": 10, "y": 20}
total = 0
for k in d:
    total += d[k]
print(total)$v$,'30',$v$איטרציה על מילון נותנת את המפתחות. סכום הערכים 10+20=30.$v$,$v$לחשוב שהלולאה רצה על הערכים ולסכם את המפתחות.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','medium','keys_method',$v$מה מחזירה d.keys() כאשר d = {"a":1,"b":2}?$v$,'[1, 2]','["a", "b"]','dict_keys(["a", "b"])','"a","b"','dict_keys(["a", "b"])',NULL,NULL,$v$.keys() מחזירה אובייקט dict_keys הניתן לאיטרציה של המפתחות.$v$,$v$לצפות לרשימה רגילה במקום dict_keys.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','hard','set_intersect',$v$מה יודפס?
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(sorted(a & b))$v$,'[1, 2, 5, 6]','[3, 4]','[1, 2, 3, 4, 5, 6]','[]','[3, 4]',NULL,NULL,$v$& הוא חיתוך סטים — רק האיברים שמופיעים בשניהם.$v$,$v$לבלבל בין & (חיתוך) ל-| (איחוד).$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'fill_blank','medium','dict_add',$v$השלם כדי להוסיף את הזוג "c": 3 למילון d$v$,NULL,NULL,NULL,NULL,'d["c"] = 3',$v$___
print(d)$v$,NULL,$v$הוספת ערך למילון נעשית באמצעות השמה למפתח חדש.$v$,$v$לכתוב d.add("c", 3) — לא קיים במילונים בפייתון.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','easy','tuple_immutable',$v$מה יקרה?
t = (1, 2, 3)
t[0] = 9$v$,'t = (9, 2, 3)','TypeError','t = [9, 2, 3]','t = (1, 2, 3)','TypeError',NULL,NULL,$v$טאפלים הם immutable — לא ניתן לשנות איברים לאחר היצירה.$v$,$v$לחשוב שטאפלים דומים לרשימות וניתנים לשינוי.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'tracing','hard','dict_count',$v$מה יודפס?$v$,NULL,NULL,NULL,NULL,NULL,$v$text = "abba"
d = {}
for ch in text:
    d[ch] = d.get(ch, 0) + 1
print(d)$v$,$v${'a': 2, 'b': 2}$v$,$v$d.get(ch, 0) מחזיר את הערך הקיים או 0. a מופיע פעמיים וגם b פעמיים.$v$,$v$לקבל KeyError מגישה ישירה כשהמפתח עדיין לא קיים.$v$,true);

COMMIT;
