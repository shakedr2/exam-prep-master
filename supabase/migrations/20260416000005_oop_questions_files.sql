-- ============================================================
-- OOP Questions Part 4: Files & Exceptions (קבצים וחריגות) — 16 questions
-- ============================================================

-- Q1 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'easy', 'file_basics',
  'מה עושה הפקודה with open("data.txt", "r") as f?',
  'פותחת את הקובץ לקריאה וסוגרת אותו אוטומטית בסוף הבלוק',
  'יוצרת קובץ חדש בשם data.txt',
  'מוחקת את הקובץ data.txt',
  'פותחת את הקובץ לכתיבה',
  'a',
  'with open(...) as f פותח קובץ ומבטיח שהוא ייסגר אוטומטית גם אם יש שגיאה. "r" = read mode (ברירת מחדל).',
  'לשכוח ש-with סוגר אוטומטית — בלי with צריך לקרוא ל-f.close() ידנית.',
  true);

-- Q2 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'easy', 'file_modes',
  'מה ההבדל בין מצב "w" למצב "a" בפתיחת קובץ?',
  '"w" מוחק את התוכן הקיים וכותב מחדש, "a" מוסיף לסוף הקובץ',
  '"w" כותב בתחילת הקובץ, "a" כותב באמצע',
  'אין הבדל — שניהם כותבים לקובץ',
  '"w" לקריאה וכתיבה, "a" לקריאה בלבד',
  'a',
  'mode "w" (write) — מוחק הכל וכותב מחדש. mode "a" (append) — מוסיף לסוף הקובץ בלי למחוק את הקיים. שניהם יוצרים את הקובץ אם הוא לא קיים.',
  'לשכוח ש-"w" מוחק תוכן קיים — שגיאה נפוצה שגורמת לאובדן נתונים.',
  true);

-- Q3 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'medium', 'try_except',
  E'מה יודפס?\n\ntry:\n    x = int("abc")\n    print("הצלחה")\nexcept ValueError:\n    print("שגיאת ערך")\nexcept TypeError:\n    print("שגיאת טיפוס")',
  'שגיאת ערך',
  'הצלחה',
  'שגיאת טיפוס',
  'שגיאת ערך ואז הצלחה',
  'a',
  'int("abc") זורקת ValueError כי "abc" אינה מספר. הבלוק except ValueError תופס את השגיאה ומדפיס "שגיאת ערך". שורת print("הצלחה") לא מתבצעת.',
  'לחשוב שint("abc") זורקת TypeError — זו ValueError כי הערך לא תקין, לא הטיפוס.',
  true);

-- Q4 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'tracing', 'medium', 'try_finally',
  'מה יודפס?',
  E'def divide(a, b):\n    try:\n        result = a / b\n        print("תוצאה:", result)\n    except ZeroDivisionError:\n        print("חלוקה באפס!")\n    finally:\n        print("סיום")\n\ndivide(10, 0)',
  E'חלוקה באפס!\nסיום',
  E'חלוקה באפס!\nסיום',
  'חלוקה באפס!',
  E'תוצאה: 0\nסיום',
  'שגיאה',
  'a',
  '10/0 גורם ל-ZeroDivisionError. except תופס ומדפיס "חלוקה באפס!". finally תמיד מתבצע ומדפיס "סיום".',
  'לחשוב ש-finally לא מתבצע כשיש שגיאה — finally מתבצע תמיד, עם או בלי שגיאה.',
  true);

-- Q5 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'medium', 'file_read',
  E'לקובץ numbers.txt יש את התוכן:\n1\n2\n3\n\nמה יודפס?\n\nwith open("numbers.txt") as f:\n    lines = f.readlines()\nprint([line.strip() for line in lines])',
  E'[''1'', ''2'', ''3'']',
  '[1, 2, 3]',
  E'[''1\\n'', ''2\\n'', ''3\\n'']',
  'שגיאה',
  'a',
  'readlines() מחזירה רשימת שורות עם \\n. strip() מסיר רווחים ושורות חדשות מהקצוות. התוצאה: רשימת מחרוזות נקיות.',
  'לשכוח strip() — בלי strip, כל שורה תכיל \\n בסוף.',
  true);

-- Q6 — medium, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'tracing', 'medium', 'try_else',
  'מה יודפס?',
  E'def safe_int(s):\n    try:\n        n = int(s)\n    except ValueError:\n        print("לא מספר")\n    else:\n        print(f"המספר: {n}")\n    finally:\n        print("סיום")\n\nsafe_int("42")\nprint("---")\nsafe_int("abc")',
  E'המספר: 42\nסיום\n---\nלא מספר\nסיום',
  E'המספר: 42\nסיום\n---\nלא מספר\nסיום',
  E'42\nסיום\n---\nלא מספר\nסיום',
  E'המספר: 42\n---\nלא מספר',
  E'שגיאה',
  'a',
  'safe_int("42"): int מצליח → else מדפיס "המספר: 42", finally מדפיס "סיום". safe_int("abc"): ValueError → except מדפיס "לא מספר", finally מדפיס "סיום".',
  'לבלבל בין else ל-finally: else רץ רק כשאין שגיאה, finally רץ תמיד.',
  true);

-- Q7 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'hard', 'custom_exception',
  E'מה יודפס?\n\nclass AgeError(ValueError):\n    def __init__(self, age):\n        super().__init__(f"גיל {age} לא תקין")\n        self.age = age\n\ndef check_age(age):\n    if age < 0 or age > 120:\n        raise AgeError(age)\n    return age\n\ntry:\n    check_age(150)\nexcept AgeError as e:\n    print(e)\nexcept ValueError as e:\n    print("ValueError:", e)',
  'גיל 150 לא תקין',
  'ValueError: גיל 150 לא תקין',
  'שגיאה לא נתפסת',
  'AgeError',
  'a',
  'check_age(150) זורקת AgeError. except AgeError תופס אותה ראשון (לפני except ValueError). print(e) מדפיס את ההודעה שהוגדרה ב-super().__init__().',
  'לחשוב ש-except ValueError יתפוס — except בודק לפי סדר, ו-AgeError ספציפי יותר.',
  true);

-- Q8 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'tracing', 'hard', 'nested_try',
  'מה יודפס?',
  E'def process(data):\n    results = []\n    for item in data:\n        try:\n            results.append(100 // item)\n        except ZeroDivisionError:\n            results.append(-1)\n        except TypeError:\n            results.append(0)\n    return results\n\nprint(process([10, 0, "x", 5]))',
  '[10, -1, 0, 20]',
  '[10, -1, 0, 20]',
  'שגיאה',
  '[10, 0, 0, 20]',
  '[10, -1, -1, 20]',
  'a',
  '100//10=10, 100//0→ZeroDivisionError→-1, 100//"x"→TypeError→0, 100//5=20. כל שגיאה נתפסת בנפרד.',
  'לחשוב ששגיאה אחת עוצרת את הלולאה — try בתוך for מאפשר להמשיך.',
  true);

-- Q9 — easy, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'fill_blank', 'easy', 'file_basics',
  'השלם את הקוד כדי לקרוא את כל תוכן הקובץ:',
  E'___ open("data.txt", "r") as f:\n    content = f.___()\nprint(content)',
  'with, read',
  'open, read',
  'with, readline',
  'file, get',
  'a',
  'with open() פותח קובץ עם מנהל הקשר. f.read() קורא את כל תוכן הקובץ כמחרוזת אחת.',
  'לבלבל בין read() (כל הקובץ) ל-readline() (שורה אחת) ל-readlines() (רשימת שורות).',
  true);

-- Q10 — medium, fill_blank
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'fill_blank', 'medium', 'try_except',
  'השלם את הקוד לתפיסת שגיאת חלוקה באפס:',
  E'try:\n    result = 10 / 0\n___ ZeroDivisionError:\n    result = 0\nprint(result)',
  'except',
  'catch',
  'handle',
  'error',
  'a',
  'except ZeroDivisionError תופס את שגיאת החלוקה באפס. בפייתון משתמשים ב-except (לא catch כמו ב-Java).',
  'לכתוב catch במקום except — בפייתון המילה היא except.',
  true);

-- Q11 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'easy', 'file_basics',
  'מה מחזיר f.readline() כשקוראים שורה מקובץ?',
  'מחרוזת של שורה אחת כולל \\n בסוף',
  'רשימה של כל השורות בקובץ',
  'מספר שורה נוכחי',
  'מחרוזת בלי \\n',
  'a',
  'readline() קוראת שורה אחת מהקובץ ומחזירה אותה כמחרוזת, כולל תו שורה חדשה (\\n) בסוף. כשהקובץ נגמר, מחזירה מחרוזת ריקה.',
  'לשכוח ש-readline כוללת \\n — צריך strip() כדי לנקות.',
  true);

-- Q12 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'medium', 'raise_exception',
  E'מה יודפס?\n\ndef validate(x):\n    if x < 0:\n        raise ValueError("מספר שלילי")\n    return x * 2\n\ntry:\n    print(validate(5))\n    print(validate(-3))\nexcept ValueError as e:\n    print(f"שגיאה: {e}")',
  E'10\nשגיאה: מספר שלילי',
  E'10\n-6',
  'שגיאה: מספר שלילי',
  E'10\nשגיאה: מספר שלילי\n-6',
  'a',
  'validate(5) מצליח ומחזיר 10 (מודפס). validate(-3) זורק ValueError. except תופס ומדפיס "שגיאה: מספר שלילי".',
  'לחשוב שגם השורה אחרי raise תתבצע — raise עוצר מיד את הפונקציה.',
  true);

-- Q13 — hard
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'hard', 'file_processing',
  E'מה עושה הקוד הבא?\n\nwith open("input.txt") as fin, open("output.txt", "w") as fout:\n    for line in fin:\n        fout.write(line.upper())',
  'קורא כל שורה מ-input.txt, ממיר לאותיות גדולות, וכותב ל-output.txt',
  'מעתיק את input.txt ל-output.txt בלי שינוי',
  'שגיאה — לא ניתן לפתוח שני קבצים בו-זמנית',
  'כותב את שמות הקבצים לקובץ חדש',
  'a',
  'ניתן לפתוח מספר קבצים בפקודת with אחת. הלולאה עוברת שורה-שורה על fin, ממירה ל-upper case וכותבת ל-fout.',
  'לחשוב שלא ניתן לפתוח שני קבצים בבלוק with אחד — אפשר, עם פסיק.',
  true);

-- Q14 — hard, tracing
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'tracing', 'hard', 'exception_chain',
  'מה יודפס?',
  E'def f1():\n    return f2()\n\ndef f2():\n    return f3()\n\ndef f3():\n    raise ValueError("boom")\n\ntry:\n    f1()\nexcept ValueError as e:\n    print(f"נתפס: {e}")\nprint("המשך")',
  E'נתפס: boom\nהמשך',
  E'נתפס: boom\nהמשך',
  'נתפס: boom',
  E'שגיאה לא נתפסת',
  E'ValueError: boom',
  'a',
  'f1()→f2()→f3()→raise ValueError. השגיאה "מבעבעת" חזרה דרך f2 ו-f1 עד שנתפסת ב-except. אחרי except הקוד ממשיך.',
  'לחשוב שהשגיאה לא מגיעה ל-try — שגיאות מבעבעות עד שנתפסות.',
  true);

-- Q15 — easy
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'easy', 'try_except',
  'מתי רץ בלוק finally?',
  'תמיד — גם כשיש שגיאה וגם כשאין',
  'רק כשיש שגיאה',
  'רק כשאין שגיאה',
  'רק כש-except לא תפס את השגיאה',
  'a',
  'finally מתבצע תמיד, בכל מצב: בהצלחה, בשגיאה שנתפסה, ואפילו אם יש return בתוך try. הוא משמש בדרך כלל לניקוי משאבים.',
  'לחשוב ש-finally רץ רק בהצלחה — הוא רץ תמיד.',
  true);

-- Q16 — medium
INSERT INTO questions (topic_id, question_type, difficulty, pattern_family, text,
  option_a, option_b, option_c, option_d, correct_answer, explanation, common_mistake, is_generated)
VALUES ('11111111-000c-0000-0000-000000000000', 'multiple_choice', 'medium', 'file_write',
  E'מה יהיה בקובץ אחרי הרצת הקוד?\n\nwith open("out.txt", "w") as f:\n    f.write("שורה 1\\n")\n    f.write("שורה 2\\n")\n\nwith open("out.txt", "a") as f:\n    f.write("שורה 3\\n")',
  E'שורה 1\nשורה 2\nשורה 3',
  E'שורה 3',
  E'שורה 1\nשורה 2',
  E'שגיאה — לא ניתן לפתוח קובץ פעמיים',
  'a',
  'פתיחה ב-"w" כותבת שורות 1 ו-2. פתיחה ב-"a" מוסיפה שורה 3 בסוף. תוצאה: 3 שורות.',
  'לחשוב שפתיחה ב-"a" מוחקת את הקיים — "a" רק מוסיף.',
  true);
