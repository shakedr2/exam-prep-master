-- Sprint 2 batch 2 - 72 reviewed Hebrew questions (9 per topic x 8 topics)
-- Schema matches supabase/migrations/20260405000006_seed_questions_batch3.sql:
--   topic_id, question_type, difficulty, pattern_family,
--   text, option_a, option_b, option_c, option_d, correct_answer,
--   explanation, common_mistake, is_generated
-- correct_answer is char(1) with check constraint ('a','b','c','d').
-- For tracing/fill_blank the real answer is stored in option_a and
-- correct_answer = 'a'; any code snippet is folded into text.
-- Run with: supabase db execute --file scripts/insert-questions-batch2.sql

BEGIN;

-- ============================================================
-- TOPIC 1: variables_io  (11111111-0001)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','easy','type_function',$v$מה יחזיר type(3.14)?$v$,$v$<class 'int'>$v$,$v$<class 'float'>$v$,$v$<class 'str'>$v$,$v$<class 'number'>$v$,'b',$v$type() מחזירה את טיפוס הערך. 3.14 מכיל נקודה עשרונית ולכן הטיפוס float.$v$,$v$לחשוב שכל מספר הוא int.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','easy','input_return',$v$מה הטיפוס שמחזירה input()?$v$,'int','float','str','bool','c',$v$input() תמיד מחזירה מחרוזת, גם עבור מספר שהוקלד. יש להמיר עם int() או float().$v$,$v$לשכוח להמיר את הקלט למספר.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','medium','int_conversion',$v$מה יודפס?
x = int("12") + int(3.7)
print(x)$v$,'15','15.7','16','שגיאה','a',$v$int("12")=12, int(3.7) חותך ל-3. הסכום 15.$v$,$v$לחשוב ש-int(3.7) מעגל ל-4.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'tracing','medium','print_sep',$v$מה יודפס?
print("a","b","c",sep="-")$v$,'a-b-c',NULL,NULL,NULL,'a',$v$sep מחליף את המפריד בין ארגומנטים מרווח למקף.$v$,$v$לחשוב ש-sep מתווסף אחרי כל ערך.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','medium','fstring',$v$מה יודפס?
name = "דנה"
age = 20
print(f"{name} בת {age}")$v$,$v${name} בת {age}$v$,$v$דנה בת 20$v$,$v$דנה בת age$v$,'שגיאה','b',$v$f-string מחליף את הביטויים בסוגריים בערכים שלהם.$v$,$v$לשכוח את ה-f לפני המרכאות.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','hard','type_coerce',$v$מה יודפס?
print(type(True + 1))$v$,$v$<class 'bool'>$v$,$v$<class 'int'>$v$,$v$<class 'tuple'>$v$,'שגיאה','b',$v$True מתנהג כ-1. True+1=2, הטיפוס int.$v$,$v$לחשוב שהתוצאה bool.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'fill_blank','medium','input_convert',$v$השלם כדי לקרוא מספר שלם:
n = ___(input("מספר: "))$v$,'int',NULL,NULL,NULL,'a',$v$int() ממיר את המחרוזת שמחזירה input() למספר שלם.$v$,$v$לשכוח את ההמרה ולקבל שגיאה בפעולה מתמטית.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','easy','str_concat',$v$מה יודפס?
print("שלום " + "עולם")$v$,$v$שלוםעולם$v$,$v$שלום עולם$v$,'שגיאה',$v$"שלום עולם"$v$,'b',$v$+ מחבר מחרוזות. הרווח שבסוף נשמר.$v$,$v$לחשוב ש-+ מוסיף רווח אוטומטי.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'tracing','hard','multi_print',$v$מה יודפס?
x = 5
y = x
x = 10
print(x, y)$v$,'10 5',NULL,NULL,NULL,'a',$v$השמה מעתיקה ערך. y קיבל 5 לפני שינוי x.$v$,$v$לחשוב ש-y משתנה יחד עם x.$v$,true);

-- ============================================================
-- TOPIC 2: arithmetic  (11111111-0002)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','easy','floor_div',$v$מה הערך של 17 // 5?$v$,'3','3.4','4','2','a',$v$// חלוקה שלמה. 17/5 = 3 שארית 2.$v$,$v$לבלבל בין / ל-//.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','easy','modulo',$v$מה הערך של 17 % 5?$v$,'3','2','3.4','0','b',$v$% מחזיר שארית חלוקה. 17 = 3*5 + 2.$v$,$v$לחשוב ש-% הוא אחוז.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','medium','power_order',$v$מה הערך של 2 ** 3 ** 2?$v$,'64','512','256','36','b',$v$** קושר ימינה: 3**2=9, אז 2**9=512.$v$,$v$לחשב משמאל לימין.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'tracing','medium','mixed_ops',$v$מה יודפס?
print(2 + 3 * 4 - 1)$v$,'13',NULL,NULL,NULL,'a',$v$כפל לפני חיבור: 3*4=12, 2+12-1=13.$v$,$v$לחשב משמאל לימין בלי כללי קדימות.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','medium','round_banker',$v$מה הערך של round(2.5)?$v$,'3','2','2.5','שגיאה','b',$v$פייתון משתמש בעיגול בנקאי: 2.5 מתעגל לזוגי הקרוב, שהוא 2.$v$,$v$להניח ש-round תמיד מעגל כלפי מעלה.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','hard','math_ceil',$v$מה יודפס?
import math
print(math.ceil(-3.2))$v$,'-3','-4','3','4','a',$v$math.ceil מחזיר את השלם הקטן ביותר שגדול או שווה. עבור -3.2 זה -3.$v$,$v$לחשוב ש-ceil תמיד מגדיל בערך מוחלט.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'fill_blank','medium','abs',$v$השלם כדי להחזיר את הערך המוחלט של x:
result = ___(x)$v$,'abs',NULL,NULL,NULL,'a',$v$abs() היא פונקציה מובנית שמחזירה ערך מוחלט.$v$,$v$לכתוב פונקציה ידנית עם if.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','easy','float_div',$v$מה הערך של 7 / 2?$v$,'3','3.5','4','שגיאה','b',$v$/ בפייתון 3 תמיד מחזיר float, גם אם החלוקה עגולה.$v$,$v$לחשוב ש-/ מחזיר int כשאין שארית.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'tracing','hard','precedence',$v$מה יודפס?
print((10 - 2) ** 2 // 3)$v$,'21',NULL,NULL,NULL,'a',$v$סוגריים: 10-2=8. חזקה: 8**2=64. חלוקה שלמה: 64//3=21.$v$,$v$לשכוח סדר קדימות.$v$,true);

-- ============================================================
-- TOPIC 3: conditions  (11111111-0003)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','easy','if_else',$v$מה יודפס?
x = 7
if x > 5:
    print("גדול")
else:
    print("קטן")$v$,'גדול','קטן',$v$גדול קטן$v$,'שגיאה','a',$v$x=7 גדול מ-5 ולכן התנאי נכון.$v$,$v$לחשוב ששני הענפים ירוצו.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','easy','and_or',$v$מה הערך של True and False or True?$v$,'True','False','None','שגיאה','a',$v$and לפני or: True and False = False, אחר כך False or True = True.$v$,$v$לראות or ו-and באותה קדימות.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','medium','nested_if',$v$מה יודפס?
x = 10
if x > 5:
    if x > 8:
        print("A")
    else:
        print("B")
else:
    print("C")$v$,'A','B','C',$v$A B$v$,'a',$v$x=10 מקיים גם x>5 וגם x>8 ולכן A.$v$,$v$לחשוב ששני תנאים מקוננים מדפיסים יחד.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'tracing','medium','elif_chain',$v$מה יודפס?
x = 75
if x >= 90:
    print("מצוין")
elif x >= 70:
    print("טוב")
elif x >= 50:
    print("עובר")
else:
    print("נכשל")$v$,'טוב',NULL,NULL,NULL,'a',$v$הענף הראשון שמתקיים הוא x>=70, ושאר ה-elif לא נבדקים.$v$,$v$להמשיך לבדוק elif אחרי שתנאי התקיים.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','medium','not_operator',$v$מה הערך של not (5 > 3)?$v$,'True','False','5','None','b',$v$5>3 הוא True, ו-not True הוא False.$v$,$v$לחשוב ש-not משנה גודל.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','hard','short_circuit',$v$מה יודפס?
x = 0
if x != 0 and 10/x > 1:
    print("A")
else:
    print("B")$v$,'A','B','ZeroDivisionError','None','b',$v$short-circuit: x!=0 False, ולכן 10/x לא מחושב. התוצאה B.$v$,$v$לפחד מ-ZeroDivisionError כשה-and מגן.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'fill_blank','medium','range_check',$v$השלם כדי לבדוק ש-x בטווח 1..10 כולל:
if ___:
    print("בטווח")$v$,$v$1 <= x <= 10$v$,NULL,NULL,NULL,'a',$v$בפייתון ניתן לשרשר השוואות: 1<=x<=10 שקול ל-(1<=x) and (x<=10).$v$,$v$לכתוב 1<=x and x<=10 (עובד אך ארוך).$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','easy','equality',$v$איזה אופרטור בודק שוויון?$v$,'=','==','===','!=','b',$v$= היא השמה, == בודקת שוויון. === לא קיים בפייתון.$v$,$v$להשתמש ב-= בתוך if.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'tracing','hard','complex_cond',$v$מה יודפס?
a, b = 4, 9
if a > 3 and (b < 5 or b > 8):
    print("yes")
else:
    print("no")$v$,'yes',NULL,NULL,NULL,'a',$v$a>3 True. b<5 False, b>8 True, or = True. True and True = True.$v$,$v$להחליט לפי תנאי יחיד בלי לסיים צרופים.$v$,true);

-- ============================================================
-- TOPIC 4: loops  (11111111-0004)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','easy','for_range',$v$כמה איטרציות יבצע for i in range(5)?$v$,'4','5','6','0','b',$v$range(5) מפיק 0..4 — חמישה ערכים.$v$,$v$לחשוב ש-range(5) כולל את 5.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','easy','while_basic',$v$מה יודפס?
i = 0
while i < 3:
    print(i)
    i += 1$v$,$v$0 1 2$v$,$v$1 2 3$v$,$v$0 1 2 3$v$,'לולאה אינסופית','a',$v$הלולאה רצה כל עוד i<3 ומדפיסה 0,1,2.$v$,$v$לשכוח להגדיל את i.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','medium','break',$v$מה יודפס?
for i in range(10):
    if i == 4:
        break
    print(i, end=" ")$v$,$v$0 1 2 3 $v$,$v$0 1 2 3 4 $v$,$v$0 1 2 3 4 5 $v$,'4','a',$v$break יוצא מהלולאה מיד כש-i==4, לכן 4 לא מודפס.$v$,$v$לבלבל בין break ל-continue.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'tracing','medium','sum_loop',$v$מה יודפס?
s = 0
for i in range(1, 5):
    s += i
print(s)$v$,'10',NULL,NULL,NULL,'a',$v$range(1,5) מפיק 1..4. 1+2+3+4=10.$v$,$v$לכלול את 5 ולקבל 15.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','medium','continue',$v$מה יודפס?
for i in range(5):
    if i % 2 == 0:
        continue
    print(i, end=" ")$v$,$v$0 1 2 3 4 $v$,$v$1 3 $v$,$v$0 2 4 $v$,'','b',$v$continue מדלג לאיטרציה הבאה עבור i זוגי, נשארו 1 ו-3.$v$,$v$לחשוב ש-continue עוצר את הלולאה.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','hard','nested_count',$v$כמה פעמים יודפס "*"?
for i in range(3):
    for j in range(4):
        print("*", end="")$v$,'7','12','3','4','b',$v$3*4=12.$v$,$v$לסכם (3+4) במקום להכפיל.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'fill_blank','medium','range_step',$v$השלם כדי להדפיס מספרים זוגיים מ-0 עד 10 כולל:
for i in ___:
    print(i)$v$,$v$range(0, 11, 2)$v$,NULL,NULL,NULL,'a',$v$range(start, stop, step): 0 עד 11 (לא כולל) בצעדים של 2.$v$,$v$להשתמש ב-range(10) ולפספס את 10.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','easy','range_len',$v$מה מייצר range(2, 7)?$v$,$v$2,3,4,5,6,7$v$,$v$2,3,4,5,6$v$,$v$3,4,5,6,7$v$,$v$0..6$v$,'b',$v$range כולל start ולא כולל stop.$v$,$v$לכלול את stop בטעות.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'tracing','hard','nested_sum',$v$מה יודפס?
total = 0
for i in range(3):
    for j in range(i + 1):
        total += 1
print(total)$v$,'6',NULL,NULL,NULL,'a',$v$i=0 → פעם, i=1 → פעמיים, i=2 → שלוש. 1+2+3=6.$v$,$v$לחשוב שהלולאה הפנימית קבועה.$v$,true);

-- ============================================================
-- TOPIC 5: functions  (11111111-0005)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','easy','def_basic',$v$באיזו מילה שמורה מגדירים פונקציה בפייתון?$v$,'function','func','def','define','c',$v$פונקציה מוגדרת עם def.$v$,$v$להשתמש ב-function כמו בשפות אחרות.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','easy','return_none',$v$מה מחזירה פונקציה בלי return?$v$,'0','None','""','שגיאה','b',$v$ללא return הפונקציה מחזירה None.$v$,$v$להניח שתוחזר 0 או שגיאה.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','medium','default_args',$v$מה יודפס?
def greet(name, greeting="שלום"):
    return f"{greeting} {name}"
print(greet("דנה"))$v$,$v$שלום דנה$v$,'דנה',$v$greeting דנה$v$,'שגיאה','a',$v$greeting לא סופק ולכן משתמש בברירת המחדל "שלום".$v$,$v$לשכוח שברירת מחדל פועלת רק כשהפרמטר חסר.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'tracing','medium','call_func',$v$מה יודפס?
def square(x):
    return x * x
print(square(4) + square(3))$v$,'25',NULL,NULL,NULL,'a',$v$square(4)=16, square(3)=9, סכום 25.$v$,$v$לחבר 4+3 במקום להעלות בריבוע.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','medium','scope',$v$מה יודפס?
x = 1
def f():
    x = 5
    print(x)
f()
print(x)$v$,$v$1 1$v$,$v$5 5$v$,$v$5 1$v$,$v$1 5$v$,'c',$v$בתוך f, x=5 הוא מקומי ולא משנה את x הגלובלי.$v$,$v$לחשוב שהשמה בפונקציה משנה את המשתנה הגלובלי.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','hard','recursion',$v$מה מחזירה fact(4)?
def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)$v$,'10','24','12','שגיאה','b',$v$4*3*2*1 = 24.$v$,$v$לשכוח תנאי עצירה ברקורסיה.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'fill_blank','medium','return_keyword',$v$השלם כדי להחזיר את הסכום של שני מספרים:
def add(a, b):
    ___ a + b$v$,'return',NULL,NULL,NULL,'a',$v$המילה return מחזירה ערך מפונקציה.$v$,$v$לכתוב print במקום return.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','easy','params_count',$v$כמה פרמטרים מקבלת הפונקציה?
def f(a, b, c=3): pass$v$,'1','2','3','4','c',$v$שלושה פרמטרים: a, b, ו-c עם ברירת מחדל.$v$,$v$לספור רק את פרמטרי החובה.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'tracing','hard','recursion_trace',$v$מה יודפס?
def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)
print(f(5))$v$,'15',NULL,NULL,NULL,'a',$v$5+4+3+2+1+0=15.$v$,$v$לשכוח את f(0)=0.$v$,true);

-- ============================================================
-- TOPIC 6: strings  (11111111-0006)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','easy','len_str',$v$מה יחזיר len("פייתון")?$v$,'5','6','7','1','b',$v$המילה "פייתון" מכילה 6 תווים.$v$,$v$לחשוב ש-len כולל גרשיים.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','easy','indexing',$v$מה יודפס?
s = "Python"
print(s[0])$v$,'P','y','Python','n','a',$v$אינדקסים מתחילים מ-0. s[0] הוא P.$v$,$v$לחשוב ש-[0] מחזיר את המחרוזת כולה.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','medium','slicing',$v$מה יודפס?
s = "exam"
print(s[1:3])$v$,'xa','xam','ex','exam','a',$v$s[1:3] מחזיר את התווים 1,2 — לא כולל 3.$v$,$v$לכלול את אינדקס הסיום.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'tracing','medium','upper_method',$v$מה יודפס?
s = "hello"
print(s.upper())
print(s)$v$,$v$HELLO
hello$v$,NULL,NULL,NULL,'a',$v$upper מחזירה מחרוזת חדשה. s המקורי נשאר.$v$,$v$לחשוב ש-upper משנה במקום.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','medium','replace',$v$מה יודפס?
print("abcabc".replace("a", "X"))$v$,'Xbcabc','XbcXbc','abcabc','שגיאה','b',$v$replace מחליפה את כל ההתאמות כברירת מחדל.$v$,$v$לחשוב ש-replace מחליפה רק התאמה ראשונה.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','hard','split_join',$v$מה יודפס?
parts = "one,two,three".split(",")
print("-".join(parts))$v$,$v$one,two,three$v$,$v$one-two-three$v$,'onetwothree','שגיאה','b',$v$split מפצל לרשימה, join מחבר עם מפריד.$v$,$v$להחליף בין split ל-join.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'fill_blank','medium','find',$v$השלם כדי למצוא את המיקום של "o" ב-"hello":
pos = "hello".___("o")$v$,'find',NULL,NULL,NULL,'a',$v$find() מחזירה את האינדקס הראשון, או -1 אם לא נמצא.$v$,$v$להשתמש ב-index ולא לטפל בחריגה.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','easy','in_operator',$v$מה הערך של "py" in "python"?$v$,'True','False','1','שגיאה','a',$v$in בודק תת-מחרוזת. "py" מופיע ב-"python".$v$,$v$להשתמש ב-== במקום in.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'tracing','hard','reverse_slice',$v$מה יודפס?
s = "abcdef"
print(s[::-1])$v$,'fedcba',NULL,NULL,NULL,'a',$v$חיתוך עם step -1 הופך את המחרוזת.$v$,$v$לחשוב שצריך לולאה ידנית.$v$,true);

-- ============================================================
-- TOPIC 7: lists  (11111111-0007)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','easy','append',$v$מה יודפס?
lst = [1, 2]
lst.append(3)
print(lst)$v$,$v$[1, 2]$v$,$v$[1, 2, 3]$v$,$v$[3, 1, 2]$v$,'שגיאה','b',$v$append מוסיפה איבר יחיד לסוף הרשימה במקום.$v$,$v$לחשוב ש-append מחזיר רשימה חדשה.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','easy','list_neg_index',$v$מה יודפס?
lst = [10, 20, 30]
print(lst[-1])$v$,'10','20','30','שגיאה','c',$v$אינדקס -1 הוא האיבר האחרון.$v$,$v$לחשוב ש-[-1] זורק שגיאה.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','medium','list_slice',$v$מה יודפס?
lst = [0, 1, 2, 3, 4]
print(lst[1:4])$v$,$v$[0, 1, 2, 3]$v$,$v$[1, 2, 3]$v$,$v$[1, 2, 3, 4]$v$,$v$[2, 3]$v$,'b',$v$חיתוך כולל start ולא כולל stop.$v$,$v$לכלול את stop.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'tracing','medium','sort',$v$מה יודפס?
lst = [3, 1, 2]
lst.sort()
print(lst)$v$,$v$[1, 2, 3]$v$,NULL,NULL,NULL,'a',$v$sort ממיינת במקום בלי להחזיר ערך.$v$,$v$לצפות ש-lst.sort() יחזיר ערך.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','medium','pop',$v$מה יודפס?
lst = [1, 2, 3]
x = lst.pop()
print(x, lst)$v$,$v$1 [2, 3]$v$,$v$3 [1, 2]$v$,$v$3 [1, 2, 3]$v$,'שגיאה','b',$v$pop ללא ארגומנט מסירה את האיבר האחרון.$v$,$v$לחשוב ש-pop מסיר את הראשון.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','hard','list_comp',$v$מה יודפס?
print([x*x for x in range(4)])$v$,$v$[0, 1, 4, 9]$v$,$v$[1, 4, 9, 16]$v$,$v$[0, 1, 2, 3]$v$,$v$[0, 2, 4, 6]$v$,'a',$v$מרבעים את 0,1,2,3 → 0,1,4,9.$v$,$v$לכלול את 4.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'fill_blank','medium','list_len',$v$השלם כדי לקבל את מספר האיברים ברשימה:
n = ___(lst)$v$,'len',NULL,NULL,NULL,'a',$v$len() מחזירה את מספר האיברים.$v$,$v$לכתוב lst.length() כמו בשפות אחרות.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','easy','extend',$v$מה יודפס?
a = [1, 2]
a.extend([3, 4])
print(a)$v$,$v$[1, 2, [3, 4]]$v$,$v$[1, 2, 3, 4]$v$,$v$[3, 4, 1, 2]$v$,'שגיאה','b',$v$extend מוסיפה כל איבר. append היה יוצר רשימה מקוננת.$v$,$v$לבלבל בין extend ל-append.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'tracing','hard','nested_list',$v$מה יודפס?
m = [[1, 2], [3, 4], [5, 6]]
total = 0
for row in m:
    total += row[0]
print(total)$v$,'9',NULL,NULL,NULL,'a',$v$מסכמים את האיבר הראשון בכל שורה: 1+3+5=9.$v$,$v$לסכם את כל האיברים.$v$,true);

-- ============================================================
-- TOPIC 8: tuples_sets_dicts  (11111111-0008)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','easy','tuple_create',$v$איך יוצרים טאפל עם איבר יחיד?$v$,'(5)','(5,)','[5]','{5}','b',$v$(5) הוא מספר בסוגריים. טאפל עם איבר יחיד דורש פסיק: (5,).$v$,$v$לשכוח את הפסיק.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','easy','dict_access',$v$מה יודפס?
d = {"a": 1, "b": 2}
print(d["a"])$v$,'a','1','b','שגיאה','b',$v$גישה לפי מפתח מחזירה את הערך. "a" ממופה ל-1.$v$,$v$לחשוב שהגישה מחזירה את המפתח.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','medium','set_union',$v$מה יודפס?
a = {1, 2, 3}
b = {3, 4, 5}
print(sorted(a | b))$v$,$v$[1, 2, 3, 4, 5]$v$,$v$[1, 2, 3, 3, 4, 5]$v$,$v$[3]$v$,$v$[4, 5]$v$,'a',$v$| הוא איחוד סטים. איברים משותפים מופיעים פעם אחת.$v$,$v$לצפות לכפילויות.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'tracing','medium','dict_iter',$v$מה יודפס?
d = {"x": 10, "y": 20}
total = 0
for k in d:
    total += d[k]
print(total)$v$,'30',NULL,NULL,NULL,'a',$v$איטרציה על מילון נותנת מפתחות. הסכום 10+20=30.$v$,$v$לחשוב שהלולאה רצה על ערכים ולסכם מפתחות.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','medium','keys_method',$v$מה מחזירה d.keys() כאשר d = {"a":1,"b":2}?$v$,$v$[1, 2]$v$,$v$["a", "b"]$v$,$v$dict_keys(["a", "b"])$v$,$v$"a","b"$v$,'c',$v$keys() מחזירה dict_keys הניתן לאיטרציה.$v$,$v$לצפות לרשימה רגילה.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','hard','set_intersect',$v$מה יודפס?
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(sorted(a & b))$v$,$v$[1, 2, 5, 6]$v$,$v$[3, 4]$v$,$v$[1, 2, 3, 4, 5, 6]$v$,$v$[]$v$,'b',$v$& הוא חיתוך — רק איברים שמופיעים בשני הסטים.$v$,$v$לבלבל בין & ל-|.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'fill_blank','medium','dict_add',$v$השלם כדי להוסיף את הזוג "c": 3 למילון d:
___
print(d)$v$,$v$d["c"] = 3$v$,NULL,NULL,NULL,'a',$v$הוספת ערך למילון נעשית בהשמה למפתח חדש.$v$,$v$לכתוב d.add("c", 3) — לא קיים במילונים.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','easy','tuple_immutable',$v$מה יקרה?
t = (1, 2, 3)
t[0] = 9$v$,$v$t = (9, 2, 3)$v$,'TypeError',$v$t = [9, 2, 3]$v$,$v$t = (1, 2, 3)$v$,'b',$v$טאפלים הם immutable — לא ניתן לשנות איברים.$v$,$v$לחשוב שטאפלים דומים לרשימות.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'tracing','hard','dict_count',$v$מה יודפס?
text = "abba"
d = {}
for ch in text:
    d[ch] = d.get(ch, 0) + 1
print(d)$v$,$v${'a': 2, 'b': 2}$v$,NULL,NULL,NULL,'a',$v$d.get(ch, 0) מחזיר את הערך הקיים או 0. a ו-b מופיעים פעמיים כל אחד.$v$,$v$לקבל KeyError מגישה ישירה.$v$,true);

COMMIT;
