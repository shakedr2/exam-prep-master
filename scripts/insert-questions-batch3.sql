-- Sprint 3.3 batch 3 - 56 reviewed Hebrew questions (7 per topic x 8 topics)
-- Schema mirrors scripts/insert-questions-batch2.sql:
--   topic_id, question_type, difficulty, pattern_family,
--   text, option_a, option_b, option_c, option_d, correct_answer,
--   explanation, common_mistake, is_generated
-- correct_answer is char(1) ('a'..'d').
-- For tracing/fill_blank rows, the real answer is in option_a, the
-- other option columns are empty strings, and correct_answer = 'a'.
-- Code snippets are folded into the text column.
-- Run with: supabase db query --file scripts/insert-questions-batch3.sql --linked

BEGIN;

-- ============================================================
-- TOPIC 1: variables_io  (11111111-0001)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','easy','int_vs_float',$v$מה ההבדל בין int(2.9) ל-float("2.9")?$v$,$v$int(2.9) → 2 ; float("2.9") → 2.9$v$,$v$שניהם מחזירים 2.9$v$,$v$int(2.9) → 3 ; float("2.9") → 2.9$v$,'שגיאה','a',$v$int() חותך לכיוון אפס ולכן 2.9 הופך ל-2. float() ממיר מחרוזת לערך עשרוני 2.9.$v$,$v$לחשוב ש-int מעגל לערך הקרוב ביותר.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','easy','print_end_empty',$v$מה יודפס?
print("a", end="")
print("b")$v$,$v$a
b$v$,'ab','a b','a\nb','b',$v$end="" מבטל את ירידת השורה אחרי "a", ולכן "b" מודפס מיד אחריו באותה שורה.$v$,$v$לשכוח ש-end החדש מחליף לחלוטין את \n.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','medium','bool_conversion',$v$מה הערך של bool("False")?$v$,'True','False','None','שגיאה','a',$v$bool() על מחרוזת מחזיר True לכל מחרוזת לא ריקה. גם "False" היא מחרוזת לא ריקה.$v$,$v$לחשוב שהמחרוזת "False" מתפרשת כערך False.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'tracing','medium','chained_assign',$v$מה יודפס?
a = b = 5
b = 10
print(a, b)$v$,'5 10','','','','a',$v$השמה משורשרת מציבה את 5 גם ל-a וגם ל-b. השמה חדשה ל-b לא משפיעה על a.$v$,$v$להניח שהמשתנים נשארים מקושרים אחרי a = b = 5.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'multiple_choice','medium','str_conversion',$v$מה יודפס?
x = 7
print("ערך: " + str(x))$v$,$v$ערך: 7$v$,$v$ערך: x$v$,'TypeError','שגיאה','a',$v$str() ממיר int למחרוזת. בלי ההמרה, חיבור מחרוזת ומספר היה זורק TypeError.$v$,$v$לנסות לחבר int למחרוזת ישירות בלי str().$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'fill_blank','medium','float_input',$v$השלם כדי לקרוא מספר עשרוני מהמשתמש:
x = ___(input("הכנס מספר: "))$v$,'float','','','','a',$v$float() ממיר את המחרוזת מהקלט לערך עשרוני.$v$,$v$להשתמש ב-int() כשמצופה מספר עם נקודה עשרונית.$v$,true),
($v$11111111-0001-0000-0000-000000000000$v$,'tracing','hard','shadowing',$v$מה יודפס?
x = 1
def f(x):
    x = x + 10
    return x
print(f(5), x)$v$,'15 1','','','','a',$v$הפרמטר x של הפונקציה הוא משתנה מקומי חדש; שינוי שלו לא משפיע על x הגלובלי.$v$,$v$להניח ששינוי הפרמטר משנה את המשתנה הגלובלי.$v$,true);

-- ============================================================
-- TOPIC 2: arithmetic  (11111111-0002)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','easy','power_basic',$v$מה הערך של 5 ** 2?$v$,'10','25','7','52','b',$v$** הוא אופרטור החזקה. 5 בריבוע = 25.$v$,$v$לבלבל בין ** ל-* או לקבל 5*2.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','easy','precedence_basic',$v$מה הערך של 6 + 4 / 2?$v$,'5','5.0','8','8.0','d',$v$חלוקה לפני חיבור: 4/2=2.0, ואז 6+2.0=8.0. החלוקה / מחזירה תמיד float.$v$,$v$לחבר משמאל לימין ולקבל 5 או 5.0.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','medium','negative_modulo',$v$מה הערך של -7 % 3?$v$,'-1','2','1','-2','b',$v$בפייתון תוצאת % מקבלת את הסימן של המחלק. -7 = -3*3 + 2, ולכן השארית 2.$v$,$v$להניח ש-% מתנהג כמו ב-C ומחזיר -1.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'tracing','medium','math_pi',$v$מה יודפס?
import math
print(round(math.pi, 2))$v$,'3.14','','','','a',$v$math.pi הוא 3.141592..., ו-round עם 2 ספרות אחרי הנקודה מעגל ל-3.14.$v$,$v$לשכוח את הפרמטר השני של round ולקבל 3.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'multiple_choice','medium','int_truncate',$v$מה הערך של int(-2.9)?$v$,'-3','-2','2','3','b',$v$int() חותך לכיוון אפס. עבור -2.9 התוצאה היא -2 (לא -3).$v$,$v$לחשוב ש-int מעגל למטה כמו math.floor.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'fill_blank','medium','sqrt',$v$השלם כדי לחשב את השורש הריבועי של n:
import math
r = math.___(n)$v$,'sqrt','','','','a',$v$math.sqrt(n) מחזירה את השורש הריבועי של n.$v$,$v$לכתוב n ** 0.5 כפתרון נכון אך פחות קריא במקרה הזה.$v$,true),
($v$11111111-0002-0000-0000-000000000000$v$,'tracing','hard','mixed_precedence',$v$מה יודפס?
print(2 ** 3 * 2 + 1)$v$,'17','','','','a',$v$חזקה לפני כפל לפני חיבור: 2**3=8, 8*2=16, 16+1=17.$v$,$v$לחשב משמאל לימין ולקבל ערך אחר.$v$,true);

-- ============================================================
-- TOPIC 3: conditions  (11111111-0003)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','easy','if_no_else',$v$מה יודפס?
x = 3
if x > 5:
    print("גדול")
print("סוף")$v$,$v$גדול
סוף$v$,'גדול','סוף','','c',$v$x=3 לא מקיים x>5, ולכן ה-if לא רץ. ההדפסה אחריו תמיד רצה.$v$,$v$לחשוב ש-if בלי else דורש פעולה אחרת בענף השני.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','easy','chained_compare',$v$מה הערך של 3 < 7 < 10?$v$,'True','False','שגיאה','3','a',$v$השוואה משורשרת מתפרשת כ-(3<7) and (7<10), שניהם True.$v$,$v$להניח שמשרשור השוואות לא חוקי בפייתון.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','medium','truthy_string',$v$מה יודפס?
s = ""
if s:
    print("יש")
else:
    print("אין")$v$,'יש','אין','שגיאה','None','b',$v$מחרוזת ריקה היא falsy, ולכן if s לא מתקיים והענף else רץ.$v$,$v$לחשוב שמחרוזת ריקה היא truthy.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'tracing','medium','elif_only_first',$v$מה יודפס?
x = 8
if x > 0:
    print("חיובי")
elif x > 5:
    print("גדול מ-5")
else:
    print("אחר")$v$,'חיובי','','','','a',$v$הענף הראשון שמתקיים הוא x>0, ולכן רק "חיובי" מודפס. שאר ה-elif לא נבדקים.$v$,$v$לחשוב שכל הענפים שמתקיימים יודפסו.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'multiple_choice','medium','in_list_check',$v$מה יודפס?
nums = [1, 2, 3]
if 4 in nums:
    print("נמצא")
else:
    print("לא נמצא")$v$,'נמצא','לא נמצא','שגיאה','None','b',$v$האופרטור in בודק אם 4 ברשימה. הרשימה לא מכילה 4 ולכן מודפס "לא נמצא".$v$,$v$לבלבל בין in לרשימת אינדקסים.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'fill_blank','medium','ternary',$v$השלם כדי לחשב מקסימום של a ו-b בביטוי תנאי:
m = a if a >= b ___ b$v$,'else','','','','a',$v$הסינטקס של ביטוי תנאי הוא: <ערך> if <תנאי> else <ערך אחר>.$v$,$v$לכתוב : או ; במקום else.$v$,true),
($v$11111111-0003-0000-0000-000000000000$v$,'tracing','hard','nested_else',$v$מה יודפס?
x, y = 5, -3
if x > 0:
    if y > 0:
        print("שניהם חיוביים")
    else:
        print("y לא חיובי")
else:
    print("x לא חיובי")$v$,$v$y לא חיובי$v$,'','','','a',$v$x>0 True; פנים: y>0 False, ולכן ה-else הפנימי רץ.$v$,$v$לחשוב שה-else החיצוני רץ אחרי שה-if הפנימי לא מתקיים.$v$,true);

-- ============================================================
-- TOPIC 4: loops  (11111111-0004)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','easy','while_break',$v$מה יודפס?
i = 0
while True:
    if i >= 3:
        break
    print(i, end=" ")
    i += 1$v$,$v$0 1 2 $v$,$v$0 1 2 3 $v$,$v$0 1 $v$,'לולאה אינסופית','a',$v$break יוצא מהלולאה כאשר i מגיע ל-3, ולכן מודפס 0,1,2.$v$,$v$להניח ש-while True תמיד אינסופי.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','easy','for_string',$v$מה יודפס?
for ch in "abc":
    print(ch, end="")$v$,'abc','a b c','[a, b, c]','שגיאה','a',$v$איטרציה על מחרוזת נותנת את התווים בזה אחר זה. end="" מונע ירידת שורה בין ההדפסות.$v$,$v$לחשוב שצריך להמיר את המחרוזת לרשימה לפני האיטרציה.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','medium','range_reverse',$v$מה יודפס?
for i in range(5, 0, -1):
    print(i, end=" ")$v$,$v$5 4 3 2 1 $v$,$v$5 4 3 2 1 0 $v$,$v$1 2 3 4 5 $v$,$v$0 1 2 3 4 5 $v$,'a',$v$range(5, 0, -1) יורד מ-5 עד 1 (לא כולל 0).$v$,$v$לכלול את 0 או לטעות בכיוון.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'tracing','medium','accumulator',$v$מה יודפס?
prod = 1
for i in range(1, 4):
    prod *= i
print(prod)$v$,'6','','','','a',$v$1*1*2*3 = 6.$v$,$v$להתחיל מ-prod=0 ולקבל 0 בכל איטרציה.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'multiple_choice','medium','enumerate',$v$מה יודפס?
for i, v in enumerate(["a","b","c"]):
    print(i, v)$v$,$v$0 a
1 b
2 c$v$,$v$1 a
2 b
3 c$v$,$v$a 0
b 1
c 2$v$,'שגיאה','a',$v$enumerate נותן זוגות (אינדקס, ערך) החל מ-0.$v$,$v$להניח ש-enumerate מתחיל מ-1.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'fill_blank','medium','while_cond',$v$השלם כדי להדפיס מספרים כל עוד הם קטנים מ-100:
while n ___ 100:
    print(n)
    n *= 2$v$,'<','','','','a',$v$נשתמש באופרטור < כדי לעצור כאשר n מגיע או עובר את 100.$v$,$v$לכתוב <= ולהדפיס גם 100 אם זה הערך המדויק.$v$,true),
($v$11111111-0004-0000-0000-000000000000$v$,'tracing','hard','nested_break',$v$מה יודפס?
for i in range(3):
    for j in range(3):
        if j == 2:
            break
        print(i, j)$v$,$v$0 0
0 1
1 0
1 1
2 0
2 1$v$,'','','','a',$v$break יוצא רק מהלולאה הפנימית; החיצונית ממשיכה. עבור כל i מודפסים j=0 ו-j=1 בלבד.$v$,$v$להניח ש-break יוצא משתי הלולאות.$v$,true);

-- ============================================================
-- TOPIC 5: functions  (11111111-0005)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','easy','no_args',$v$מה יודפס?
def hello():
    print("שלום")
hello()$v$,'שלום','hello','שגיאה','None','a',$v$הקריאה hello() מבצעת את גוף הפונקציה ומדפיסה "שלום".$v$,$v$לשכוח את הסוגריים בקריאה ולקבל אובייקט פונקציה.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','easy','positional_order',$v$מה יודפס?
def sub(a, b):
    return a - b
print(sub(10, 3))$v$,'7','-7','13','שגיאה','a',$v$ארגומנטים פוזיציוניים מועברים לפי הסדר. a=10, b=3, ולכן 10-3=7.$v$,$v$להניח שסדר הארגומנטים לא משנה.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','medium','keyword_args',$v$מה יודפס?
def f(a, b):
    return a * 10 + b
print(f(b=3, a=2))$v$,'23','32','5','שגיאה','a',$v$ארגומנטים בעלי שם משויכים לפי השם, לא לפי הסדר. a=2, b=3, ולכן 2*10+3=23.$v$,$v$להחליף בין הסדר הפוזיציוני לסדר הקריאה.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'tracing','medium','return_none',$v$מה יודפס?
def greet(name):
    print("שלום", name)
result = greet("דנה")
print(result)$v$,$v$שלום דנה
None$v$,'','','','a',$v$הפונקציה מדפיסה אך לא מחזירה ערך, ולכן result הוא None.$v$,$v$להניח ש-print היא return.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'multiple_choice','medium','lambda_basic',$v$מה יודפס?
sq = lambda x: x * x
print(sq(6))$v$,'36','12','6','שגיאה','a',$v$lambda x: x*x מגדירה פונקציה אנונימית שמקבלת x ומחזירה את x בריבוע. sq(6)=36.$v$,$v$לחשוב ש-lambda דורש return בגוף.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'fill_blank','medium','helper',$v$השלם כדי להגדיר פונקציה שמחזירה את האיבר המקסימלי בין שני מספרים:
def my_max(a, b):
    ___ a if a > b else b$v$,'return','','','','a',$v$נחזיר את הערך הגדול יותר באמצעות ביטוי תנאי וההוראה return.$v$,$v$לכתוב print במקום return ולא לקבל ערך מהפונקציה.$v$,true),
($v$11111111-0005-0000-0000-000000000000$v$,'tracing','hard','func_in_func',$v$מה יודפס?
def add(a, b):
    return a + b
def double_add(x, y):
    return add(x, y) * 2
print(double_add(3, 4))$v$,'14','','','','a',$v$add(3,4)=7, double_add מכפיל ב-2: 14.$v$,$v$להוסיף את 2 במקום להכפיל בו.$v$,true);

-- ============================================================
-- TOPIC 6: strings  (11111111-0006)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','easy','immutable',$v$מה יקרה?
s = "hello"
s[0] = "H"$v$,'TypeError','s = "Hello"','s = "hello"','None','a',$v$מחרוזות הן immutable - לא ניתן לשנות תווים בודדים. הניסיון יזרוק TypeError.$v$,$v$לחשוב שמחרוזות דומות לרשימות וניתנות לשינוי.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','easy','concat_int_error',$v$מה יקרה?
print("גיל: " + 25)$v$,'TypeError','גיל: 25','גיל: + 25','None','a',$v$אי אפשר לחבר מחרוזת ו-int בלי המרה מפורשת. צריך str(25).$v$,$v$לשכוח את ההמרה ל-str לפני חיבור.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','medium','count_method',$v$מה הערך של "abracadabra".count("a")?$v$,'5','4','3','11','a',$v$count מחזירה את מספר ההופעות של תת-המחרוזת. ב-"abracadabra" יש 5 פעמים האות a.$v$,$v$לספור גם תווים שונים שדומים גרפית.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'tracing','medium','strip',$v$מה יודפס?
s = "  hello  "
print(s.strip())
print(len(s))$v$,$v$hello
9$v$,'','','','a',$v$strip מחזירה מחרוזת חדשה ללא רווחים בקצוות. אורך המקור נשאר 9.$v$,$v$להניח ש-strip משנה את המחרוזת המקורית.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'multiple_choice','medium','startswith',$v$מה הערך של "hello world".startswith("hello")?$v$,'True','False','שגיאה','None','a',$v$startswith בודק אם המחרוזת מתחילה בתת-מחרוזת נתונה.$v$,$v$לבלבל בין startswith ל-endswith.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'fill_blank','medium','title_case',$v$השלם כדי להפוך את כל אותיות המילה הראשונה בכל מילה לאות גדולה:
title = name.___()$v$,'title','','','','a',$v$.title() מחזירה מחרוזת בה כל מילה מתחילה באות גדולה.$v$,$v$להשתמש ב-.upper() ולקבל את כל המחרוזת באותיות גדולות.$v$,true),
($v$11111111-0006-0000-0000-000000000000$v$,'tracing','hard','count_loop',$v$מה יודפס?
text = "Python"
count = 0
for ch in text:
    if ch.lower() in "aeiou":
        count += 1
print(count)$v$,'1','','','','a',$v$רק האות o היא תנועה (vowel). הספירה היא 1.$v$,$v$לכלול את y כתנועה ולקבל 2.$v$,true);

-- ============================================================
-- TOPIC 7: lists  (11111111-0007)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','easy','empty_list',$v$איך יוצרים רשימה ריקה?$v$,'[]','{}','()','list[]','a',$v$[] היא רשימה ריקה. {} הוא מילון ריק, () טאפל ריק.$v$,$v$להשתמש ב-{} שמייצג מילון ריק ולא רשימה.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','easy','insert',$v$מה יודפס?
lst = [1, 2, 4]
lst.insert(2, 3)
print(lst)$v$,'[1, 2, 3, 4]','[1, 2, 4, 3]','[3, 1, 2, 4]','שגיאה','a',$v$insert(index, value) שם את 3 באינדקס 2 והזיז את 4 אחורה.$v$,$v$להחליף בין insert ל-append.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','medium','copy_alias',$v$מה יודפס?
a = [1, 2, 3]
b = a
b.append(4)
print(a)$v$,'[1, 2, 3]','[1, 2, 3, 4]','[4, 1, 2, 3]','שגיאה','b',$v$השמה b = a לא יוצרת עותק - שני המשתנים מצביעים על אותה רשימה. שינוי דרך b משפיע גם על a.$v$,$v$לחשוב ש-b = a יוצרת עותק עצמאי.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'tracing','medium','in_list',$v$מה יודפס?
lst = ["a", "b", "c"]
print("b" in lst, "z" in lst)$v$,'True False','','','','a',$v$"b" קיים ברשימה (True), "z" לא קיים (False).$v$,$v$להניח ש-in מחזיר אינדקס במקום בוליאני.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'multiple_choice','medium','max_list',$v$מה יודפס?
print(max([3, 1, 4, 1, 5, 9, 2]))$v$,'9','5','3','שגיאה','a',$v$max מחזיר את הערך הגדול ביותר ברשימה.$v$,$v$לחשוב ש-max צריך פרמטר key תמיד.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'fill_blank','medium','sum_list',$v$השלם כדי לקבל את סכום האיברים ברשימה:
total = ___(lst)$v$,'sum','','','','a',$v$sum() היא פונקציה מובנית שמחזירה את סכום הערכים ברשימה.$v$,$v$לכתוב לולאה ידנית במקום sum.$v$,true),
($v$11111111-0007-0000-0000-000000000000$v$,'tracing','hard','list_of_lists',$v$מה יודפס?
m = [[1, 2], [3, 4]]
m[0][1] = 9
print(m)$v$,'[[1, 9], [3, 4]]','','','','a',$v$m[0] היא הרשימה [1, 2] ו-[1] בוחר את 2 ומחליף אותו ב-9.$v$,$v$לחשוב ש-m[0][1] משנה את כל הרשימה הראשונה.$v$,true);

-- ============================================================
-- TOPIC 8: tuples_sets_dicts  (11111111-0008)
-- ============================================================
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text, option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated) VALUES
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','easy','set_dedup',$v$מה הערך של len(set([1, 1, 2, 3, 3, 3]))?$v$,'3','6','4','שגיאה','a',$v$set מסיר כפילויות. נשארים שלושה ערכים ייחודיים: 1, 2, 3.$v$,$v$להניח ש-set שומר על הכפילויות כמו ברשימה.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','easy','dict_get_default',$v$מה יודפס?
d = {"a": 1}
print(d.get("b", 0))$v$,'0','None','KeyError','b','a',$v$.get מחזיר את הערך עבור המפתח, או את ברירת המחדל (0) אם המפתח לא קיים.$v$,$v$להשתמש ב-d["b"] ולקבל KeyError.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','medium','tuple_unpack',$v$מה יודפס?
a, b, c = (10, 20, 30)
print(b)$v$,'20','10','30','(10, 20, 30)','a',$v$פירוק טאפל משייך כל ערך למשתנה לפי הסדר. b מקבל את 20.$v$,$v$להניח ש-b מקבל את כל הטאפל.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'tracing','medium','set_add',$v$מה יודפס?
s = {1, 2}
s.add(2)
s.add(3)
print(sorted(s))$v$,'[1, 2, 3]','','','','a',$v$הוספת 2 לא משנה את הסט (כפילות). הוספת 3 מצרפת אותו. הסטים אינם מסודרים, sorted נותן רשימה ממוינת.$v$,$v$לחשוב שאיברים כפולים נשמרים בסט.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'multiple_choice','medium','dict_update',$v$מה יודפס?
d = {"a": 1, "b": 2}
d["a"] = 5
print(d)$v$,$v${'a': 5, 'b': 2}$v$,$v${'a': 1, 'b': 2}$v$,$v${'a': 5}$v$,'KeyError','a',$v$השמה למפתח קיים במילון מעדכנת את הערך הקיים.$v$,$v$לחשוב שהשמה מוסיפה רשומה חדשה ומשאירה את הישנה.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'fill_blank','medium','dict_pop',$v$השלם כדי להסיר ולהחזיר את הערך עבור המפתח "x" מהמילון:
val = d.___("x")$v$,'pop','','','','a',$v$pop(key) מסירה את המפתח ומחזירה את הערך.$v$,$v$להשתמש ב-del שלא מחזיר ערך.$v$,true),
($v$11111111-0008-0000-0000-000000000000$v$,'tracing','hard','dict_comp',$v$מה יודפס?
nums = [1, 2, 3, 4]
d = {n: n * n for n in nums}
print(d[3])$v$,'9','','','','a',$v$dict comprehension יוצר {1:1, 2:4, 3:9, 4:16}. d[3]=9.$v$,$v$לחשוב שהמפתחות והערכים הפוכים.$v$,true);

COMMIT;
