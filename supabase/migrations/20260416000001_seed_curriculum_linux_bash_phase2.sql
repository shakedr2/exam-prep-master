-- ============================================================
-- Seed: DevOps Engineer Track — Phase 2 (Linux & Bash)
--
-- Adds Phase 2 with 3 modules:
--   1. Linux Basics      (יסודות לינוקס)
--   2. Bash Scripting    (תכנות Bash)
--   3. File Permissions  (הרשאות קבצים)
--
-- Each module gets:
--   - 5 curriculum lessons with Hebrew body content
--   - 5 curriculum concepts (key terms)
--   - 10 practice questions in the questions table
--   - 1 practice session linking those questions
--   - Hebrew i18n translations
--
-- All UUIDs are stable for idempotent re-runs (ON CONFLICT DO NOTHING).
-- ============================================================

-- ---------------------------------------------------------------------------
-- Topics: 3 new DevOps/Linux topics
-- ---------------------------------------------------------------------------
INSERT INTO topics (id, name, description, icon) VALUES
  ('22222222-0001-0000-0000-000000000000', 'יסודות לינוקס',    'ניווט בטרמינל, מערכת קבצים, פקודות בסיס', '🐧'),
  ('22222222-0002-0000-0000-000000000000', 'תכנות Bash',       'צינורות, משתנים, בקרת זרימה וסקריפטים',  '📜'),
  ('22222222-0003-0000-0000-000000000000', 'הרשאות קבצים',     'chmod, chown, משתמשים, קבוצות וסודו',    '🔐')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Phase 2: Linux & Bash
-- ---------------------------------------------------------------------------
INSERT INTO curriculum_phases (id, track_id, "order", slug, content_id, name, description)
VALUES (
  'bbbbbbbb-0002-0000-0000-000000000000',
  'aaaaaaaa-0001-0000-0000-000000000000',
  2,
  'linux-bash',
  'phase.linux-bash',
  'לינוקס ובאש',
  'מהטרמינל הראשון ועד סקריפטים מתקדמים: ניווט, קבצים, הרשאות ואוטומציה.'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Modules
-- ---------------------------------------------------------------------------

-- Module 9: Linux Basics
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0009-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  1,
  'linux-basics',
  'module.linux.linux-basics',
  'יסודות לינוקס',
  'ניווט בטרמינל, מבנה מערכת הקבצים, פקודות בסיסיות ועזרה.',
  '🐧',
  ARRAY['22222222-0001-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 10: Bash Scripting
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0010-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  2,
  'bash-scripting',
  'module.linux.bash-scripting',
  'תכנות Bash',
  'צינורות, הפניית פלט, עיבוד טקסט, משתנים, בקרת זרימה וסקריפטים.',
  '📜',
  ARRAY['22222222-0002-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 11: File Permissions
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0011-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  3,
  'file-permissions',
  'module.linux.file-permissions',
  'הרשאות קבצים',
  'מודל ההרשאות של לינוקס: rwx, chmod, chown, משתמשים, קבוצות וסודו.',
  '🔐',
  ARRAY['22222222-0003-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- LESSONS — 5 per module (15 total)
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Module 9: Linux Basics — Lessons
-- ---------------------------------------------------------------------------

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0001-0000-0000-000000000000',
  'cccccccc-0009-0000-0000-000000000000',
  1,
  'lesson.linux-basics.01',
  'מבוא ללינוקס',
  '## מה זה לינוקס?

לינוקס היא מערכת הפעלה חינמית ופתוחה המבוססת על גרעין (kernel) שנכתב ב-1991 על ידי לינוס טורבאלדס.

### מושגים מרכזיים

| מושג | הסבר |
|------|-------|
| **Kernel** | ליבת המערכת — מנהל חומרה, זיכרון ותהליכים |
| **Distro** | הפצה (Distribution) — Ubuntu, Debian, CentOS, RHEL |
| **Shell** | ממשק שורת הפקודה — Bash, Zsh, sh |
| **Terminal** | האמולטור שמפעיל את ה-Shell |

### למה DevOps חי בלינוקס?

- **שרתים**: 95%+ משרתי הענן מריצים לינוקס
- **Docker & Kubernetes**: פועלים על גרעין לינוקס
- **Automation**: כלים כמו Ansible, Terraform, CI/CD נכתבו עבור לינוקס
- **חינמי ופתוח**: אפשר לבדוק, לשנות ולהתאים כל חלק

### הפצות נפוצות

```
Ubuntu / Debian  → למפתחים ומחשבים אישיים
CentOS / RHEL   → שרתי ארגונים
Alpine Linux    → Docker images (קטן ומהיר)
Amazon Linux    → AWS
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0002-0000-0000-000000000000',
  'cccccccc-0009-0000-0000-000000000000',
  2,
  'lesson.linux-basics.02',
  'ניווט בטרמינל',
  '## פקודות ניווט בסיסיות

### pwd — Print Working Directory

```bash
$ pwd
/home/user/projects
```

מציגה את הנתיב הנוכחי.

### ls — List Files

```bash
$ ls          # קבצים ותיקיות
$ ls -l       # תצוגה מפורטת (הרשאות, גודל, תאריך)
$ ls -la      # כולל קבצים מוסתרים (מתחילים ב-.)
$ ls -lh      # גדלים קריאים (KB, MB)
```

### cd — Change Directory

```bash
$ cd /etc           # נתיב מוחלט
$ cd projects       # נתיב יחסי (מהנוכחי)
$ cd ..             # עלייה תיקייה אחת מעלה
$ cd ~              # חזרה ל-home directory
$ cd -              # חזרה לתיקייה הקודמת
```

### טיפ: Tab Completion

לחיצה על **Tab** משלימה שם קובץ/תיקייה אוטומטית.
לחיצה כפולה על **Tab** מציגה את כל האפשרויות.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0003-0000-0000-000000000000',
  'cccccccc-0009-0000-0000-000000000000',
  3,
  'lesson.linux-basics.03',
  'מבנה מערכת הקבצים',
  '## עץ הקבצים של לינוקס

לינוקס משתמשת במבנה עץ אחד שמתחיל מ-`/` (root).

### ספריות חשובות

| ספרייה | תפקיד |
|--------|--------|
| `/` | שורש המערכת |
| `/home` | תיקיות המשתמשים (`/home/user`) |
| `/etc` | קבצי תצורה (configuration files) |
| `/var` | נתונים משתנים (לוגים, cache) |
| `/tmp` | קבצים זמניים (נמחקים בהפעלה מחדש) |
| `/usr` | תוכנות ותוכניות |
| `/bin`, `/sbin` | פקודות בסיסיות |
| `/dev` | מכשירי חומרה |
| `/proc` | מידע על תהליכים |

### נתיב מוחלט vs. יחסי

```bash
# מוחלט: תמיד מתחיל מ-/
/home/user/documents/file.txt

# יחסי: יחסי למיקום הנוכחי
documents/file.txt   # אם אנחנו ב-/home/user
../user2/file.txt    # עלייה תיקייה ואז ירידה
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0004-0000-0000-000000000000',
  'cccccccc-0009-0000-0000-000000000000',
  4,
  'lesson.linux-basics.04',
  'פעולות קבצים',
  '## יצירה, העתקה, הזזה ומחיקה

### touch — יצירת קובץ ריק

```bash
$ touch myfile.txt
$ touch file1.txt file2.txt  # יצירת כמה קבצים
```

### mkdir — יצירת תיקייה

```bash
$ mkdir projects
$ mkdir -p a/b/c    # יצירת עץ שלם (כולל תיקיות אב)
```

### cp — העתקה

```bash
$ cp file.txt backup.txt          # העתקת קובץ
$ cp -r folder/ folder_backup/    # העתקת תיקייה
```

### mv — הזזה / שינוי שם

```bash
$ mv old.txt new.txt        # שינוי שם
$ mv file.txt ~/documents/  # הזזה לתיקייה
```

### rm — מחיקה

```bash
$ rm file.txt           # מחיקת קובץ
$ rm -r folder/         # מחיקת תיקייה
$ rm -rf folder/        # מחיקה בכוח (ללא אישור!)
```

> אזהרה: `rm` אינו שולח לסל המיחזור — המחיקה סופית!'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0005-0000-0000-000000000000',
  'cccccccc-0009-0000-0000-000000000000',
  5,
  'lesson.linux-basics.05',
  'עזרה ותיעוד',
  '## מציאת עזרה בשורת הפקודה

### man — Manual Pages

```bash
$ man ls        # מדריך מלא לפקודת ls
$ man -k copy   # חיפוש פקודות לפי מילת מפתח
```

ניווט ב-man: חצים / Page Up / Page Down. יציאה עם `q`.

### --help

```bash
$ ls --help     # עזרה קצרה ומהירה
$ git --help    # תפריט עזרה
```

### history — היסטוריית פקודות

```bash
$ history           # הצגת כל ההיסטוריה
$ history 10        # 10 פקודות אחרונות
$ !42               # הרצת פקודה מספר 42
$ Ctrl+R            # חיפוש אינטרקטיבי בהיסטוריה
```

### which ו-type

```bash
$ which python3     # איפה מותקנת פקודה
$ type ls           # מה הפקודה עושה (alias, builtin, file)
```'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Module 10: Bash Scripting — Lessons
-- ---------------------------------------------------------------------------

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0006-0000-0000-000000000000',
  'cccccccc-0010-0000-0000-000000000000',
  1,
  'lesson.bash-scripting.01',
  'צינורות והפניית פלט',
  '## Pipes & Redirection

### | — Pipe (צינור)

מעביר את הפלט של פקודה אחת כקלט לפקודה הבאה.

```bash
$ ls -la | grep ".txt"         # מסנן שורות עם .txt
$ cat access.log | sort | uniq # ממיין ומסיר כפילויות
$ ps aux | grep nginx          # מוצא תהליך nginx
```

### הפניית פלט (Output Redirection)

```bash
$ echo "שלום" > hello.txt     # כתיבה לקובץ (דורס!)
$ echo "שורה" >> hello.txt    # הוספה לקובץ (לא דורס)
$ ls -la 2> errors.txt        # הפניית שגיאות לקובץ
$ ls -la > output.txt 2>&1    # הפניית כל הפלט כולל שגיאות
```

### הפניית קלט (Input Redirection)

```bash
$ sort < unsorted.txt          # מיין את תוכן הקובץ
$ mysql db < backup.sql        # הרץ SQL מקובץ
```

### /dev/null — סל האשפה

```bash
$ command > /dev/null 2>&1     # השתק כל פלט
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0007-0000-0000-000000000000',
  'cccccccc-0010-0000-0000-000000000000',
  2,
  'lesson.bash-scripting.02',
  'עיבוד טקסט',
  '## כלי עיבוד טקסט חיוניים

### cat — הצגת קובץ

```bash
$ cat file.txt            # הצגת כל הקובץ
$ cat file1.txt file2.txt # שרשור קבצים
```

### grep — חיפוש בטקסט

```bash
$ grep "error" log.txt         # שורות עם error
$ grep -i "error" log.txt      # case-insensitive
$ grep -r "TODO" src/          # חיפוש רקורסיבי
$ grep -n "bug" file.txt       # עם מספרי שורות
$ grep -v "debug" log.txt      # שורות שאינן מכילות debug
```

### head ו-tail

```bash
$ head -n 20 file.txt    # 20 שורות ראשונות
$ tail -n 50 file.txt    # 50 שורות אחרונות
$ tail -f /var/log/syslog # מעקב אחר לוג בזמן אמת
```

### wc — ספירה

```bash
$ wc -l file.txt    # מספר שורות
$ wc -w file.txt    # מספר מילים
$ ls | wc -l        # כמה קבצים יש
```

### cut — חיתוך עמודות

```bash
$ cut -d"," -f1 data.csv    # עמודה ראשונה ב-CSV
$ cut -d":" -f1 /etc/passwd # שמות משתמשים
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0008-0000-0000-000000000000',
  'cccccccc-0010-0000-0000-000000000000',
  3,
  'lesson.bash-scripting.03',
  'משתנים ב-Bash',
  '## משתנים ב-Bash

### הגדרה והרחבה

```bash
NAME="Alice"          # הגדרה (ללא רווחים ב-=)
echo $NAME            # הדפסה: Alice
echo "שלום $NAME"     # הרחבה בתוך מרכאות כפולות
```

### משתנים מיוחדים

```bash
$0   # שם הסקריפט
$1   # ארגומנט ראשון
$#   # מספר הארגומנטים
$@   # כל הארגומנטים
$?   # קוד יציאה של הפקודה האחרונה (0=הצלחה)
$$   # PID של התהליך הנוכחי
```

### Command Substitution

```bash
TODAY=$(date +%Y-%m-%d)    # תוצאת הפקודה כמשתנה
FILES=$(ls *.txt | wc -l)  # ספירת קבצי txt
echo "היום: $TODAY, קבצים: $FILES"
```

### אריתמטיקה

```bash
A=5
B=3
echo $((A + B))      # 8
echo $((A * B))      # 15
echo $((A % B))      # 2
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0009-0000-0000-000000000000',
  'cccccccc-0010-0000-0000-000000000000',
  4,
  'lesson.bash-scripting.04',
  'בקרת זרימה',
  '## תנאים ולולאות ב-Bash

### if / elif / else

```bash
#!/bin/bash
FILE="config.txt"
if [ -f "$FILE" ]; then
  echo "הקובץ קיים"
elif [ -d "$FILE" ]; then
  echo "זוהי תיקייה"
else
  echo "לא קיים"
fi
```

### בדיקות נפוצות

```bash
[ -f file ]      # קובץ קיים
[ -d dir ]       # תיקייה קיימת
[ -z "$VAR" ]    # משתנה ריק
[ "$A" = "$B" ]  # שוויון מחרוזות
[ $A -eq $B ]    # שוויון מספרי
[ $A -gt $B ]    # גדול ממספרי
```

### for loop

```bash
for f in *.log; do
  echo "מעבד: $f"
done
```

### while loop

```bash
COUNT=0
while [ $COUNT -lt 5 ]; do
  echo "ספירה: $COUNT"
  COUNT=$((COUNT + 1))
done
```

### קודי יציאה

```bash
command
if [ $? -eq 0 ]; then
  echo "הצליח!"
else
  echo "נכשל"
fi
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0010-0000-0000-000000000000',
  'cccccccc-0010-0000-0000-000000000000',
  5,
  'lesson.bash-scripting.05',
  'כתיבת סקריפטים',
  '## Bash Scripts

### מבנה סקריפט בסיסי

```bash
#!/bin/bash
# ---------------
# שם: backup.sh
# תיאור: גיבוי תיקייה
# ---------------
set -e          # עצור בשגיאה
set -u          # שגיאה אם משתנה לא מוגדר

SOURCE_DIR="$1"
DEST_DIR="$2"

if [ -z "$SOURCE_DIR" ] || [ -z "$DEST_DIR" ]; then
  echo "שימוש: $0 <מקור> <יעד>"
  exit 1
fi

echo "מגבה $SOURCE_DIR -> $DEST_DIR"
cp -r "$SOURCE_DIR" "$DEST_DIR"
echo "הגיבוי הושלם בהצלחה!"
```

### הפיכה להרצה

```bash
$ chmod +x backup.sh
$ ./backup.sh /data /backup
```

### פונקציות

```bash
log_info() {
  echo "[INFO] $(date +%H:%M:%S) $1"
}

log_error() {
  echo "[ERROR] $1" >&2
}

log_info "תחילת הסקריפט"
```

### best practices

- השתמש ב-`set -e` תמיד
- ציטוט משתנים: `"$VAR"` ולא `$VAR`
- בדוק ארגומנטים לפני שימוש'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Module 11: File Permissions — Lessons
-- ---------------------------------------------------------------------------

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0011-0000-0000-000000000000',
  'cccccccc-0011-0000-0000-000000000000',
  1,
  'lesson.file-permissions.01',
  'מודל ההרשאות של לינוקס',
  '## הבנת הרשאות (rwx)

### קריאת ls -la

```
-rwxr-xr-- 1 alice devops 1234 Jan 15 10:30 script.sh
```

| חלק | משמעות |
|-----|---------|
| `-` | סוג (- קובץ, d תיקייה, l symlink) |
| `rwx` | הרשאות בעלים (owner) |
| `r-x` | הרשאות קבוצה (group) |
| `r--` | הרשאות אחרים (others) |
| `alice` | שם הבעלים |
| `devops` | שם הקבוצה |

### ביטים r, w, x

| ביט | קובץ | תיקייה |
|-----|------|--------|
| `r` (read) | קריאת תוכן | רשימת תוכן |
| `w` (write) | שינוי תוכן | יצירה/מחיקה |
| `x` (execute) | הרצה | כניסה (cd) |

### ערכים אוקטליים

```
r = 4,  w = 2,  x = 1
rwx = 7 (4+2+1)
rw- = 6 (4+2)
r-x = 5 (4+1)
r-- = 4
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0012-0000-0000-000000000000',
  'cccccccc-0011-0000-0000-000000000000',
  2,
  'lesson.file-permissions.02',
  'chmod — שינוי הרשאות',
  '## chmod (Change Mode)

### שיטה אוקטלית (מספרים)

```bash
$ chmod 755 script.sh    # rwxr-xr-x
$ chmod 644 file.txt     # rw-r--r--
$ chmod 600 id_rsa       # rw------- (מפתח פרטי!)
$ chmod 777 file         # rwxrwxrwx — בדרך כלל שגוי!
```

### שיטה סמלית (אותיות)

```bash
$ chmod u+x script.sh    # הוסף execute לבעלים
$ chmod g-w file.txt     # הסר write מהקבוצה
$ chmod o=r file.txt     # קבע others ל-read בלבד
$ chmod a+r file.txt     # הוסף read לכולם (a=all)
$ chmod u+x,g-w file     # שינויים מרוכבים
```

### -R להרשאות רקורסיביות

```bash
$ chmod -R 755 public/   # כל הקבצים והתיקיות בתוך public/
```

### למה 777 מסוכן?

`chmod 777` נותן לכל משתמש הרשאה מלאה לקרוא, לכתוב ולהריץ.
בשרת ייצור, זה מאפשר לכל תהליך לשנות, למחוק או להריץ את הקובץ.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0013-0000-0000-000000000000',
  'cccccccc-0011-0000-0000-000000000000',
  3,
  'lesson.file-permissions.03',
  'משתמשים וקבוצות',
  '## Users & Groups

### מידע על המשתמש הנוכחי

```bash
$ whoami           # שם המשתמש הנוכחי
$ id               # uid, gid וכל הקבוצות
$ groups           # הקבוצות שהמשתמש שייך אליהן
```

### /etc/passwd ו-/etc/group

```bash
$ cat /etc/passwd  # רשימת משתמשים
# פורמט: user:x:uid:gid:comment:home:shell
# alice:x:1001:1001:Alice:/home/alice:/bin/bash

$ cat /etc/group   # רשימת קבוצות
# פורמט: group:x:gid:members
# devops:x:1002:alice,bob
```

### ניהול משתמשים (צריך sudo)

```bash
$ sudo useradd -m newuser       # יצירת משתמש
$ sudo passwd newuser           # הגדרת סיסמה
$ sudo usermod -aG docker alice # הוספה לקבוצה
$ sudo userdel newuser          # מחיקת משתמש
```

### ניהול קבוצות

```bash
$ sudo groupadd developers      # יצירת קבוצה
$ sudo groupdel developers      # מחיקת קבוצה
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0014-0000-0000-000000000000',
  'cccccccc-0011-0000-0000-000000000000',
  4,
  'lesson.file-permissions.04',
  'chown — שינוי בעלות',
  '## chown (Change Owner)

### שינוי בעלים

```bash
$ sudo chown alice file.txt         # שנה בעלים
$ sudo chown alice:devops file.txt  # שנה בעלים וקבוצה
$ sudo chown :devops file.txt       # שנה קבוצה בלבד
$ sudo chown -R alice:alice dir/    # רקורסיבי
```

### chgrp — שינוי קבוצה בלבד

```bash
$ sudo chgrp developers file.txt
$ sudo chgrp -R www-data /var/www/
```

### דוגמה: הגדרת web server

```bash
# קבצי web צריכים להיות שייכים ל-www-data
$ sudo chown -R www-data:www-data /var/www/html/
$ sudo chmod -R 755 /var/www/html/

# קבצי תצורה סגורים
$ sudo chown root:root /etc/nginx/nginx.conf
$ sudo chmod 644 /etc/nginx/nginx.conf
```

### בדיקת בעלות

```bash
$ ls -la file.txt
-rw-r--r-- 1 alice devops 1024 Jan 15 10:00 file.txt
#           ^ בעלים ^ קבוצה
```'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_lessons (id, module_id, "order", content_id, title, body)
VALUES (
  'dddddddd-0015-0000-0000-000000000000',
  'cccccccc-0011-0000-0000-000000000000',
  5,
  'lesson.file-permissions.05',
  'sudo ובטיחות',
  '## sudo — Super User Do

### מה זה sudo?

`sudo` מאפשר להריץ פקודה עם הרשאות root (מנהל מערכת).

```bash
$ sudo apt update               # עדכון חבילות
$ sudo systemctl restart nginx  # הפעלה מחדש של שירות
$ sudo nano /etc/hosts          # עריכת קובץ מערכת
```

### sudo -i ו-su

```bash
$ sudo -i       # shell של root (זהירות!)
$ sudo su -     # מעבר למשתמש root
$ su - alice    # מעבר למשתמש alice
```

### /etc/sudoers

הקובץ שמגדיר מי יכול להשתמש ב-sudo.

```bash
$ sudo visudo   # עריכה בטוחה של sudoers

# הוספת משתמש:
# alice ALL=(ALL:ALL) ALL

# הרצה ללא סיסמה:
# alice ALL=(ALL) NOPASSWD: /usr/bin/systemctl
```

### עקרון הרשאות מינימליות (Least Privilege)

- תן רק הרשאות שנחוצות לביצוע המשימה
- אל תריץ תהליכים רגילים כ-root
- בדוק sudo logs: `journalctl -u sudo`

> כלל הזהב: לפני הרצת `sudo rm -rf`, חשוב פעמיים!'
)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- CONCEPTS — 5 per module (15 total)
-- ===========================================================================

-- Module 9: Linux Basics — Concepts
INSERT INTO curriculum_concepts (id, module_id, content_id, name, description)
VALUES
  (
    'ffffffff-0001-0000-0000-000000000000',
    'cccccccc-0009-0000-0000-000000000000',
    'concept.linux-basics.kernel',
    'Kernel ו-Shell',
    'ההבדל בין גרעין מערכת ההפעלה (kernel) לבין ממשק שורת הפקודה (shell)'
  ),
  (
    'ffffffff-0002-0000-0000-000000000000',
    'cccccccc-0009-0000-0000-000000000000',
    'concept.linux-basics.navigation',
    'ניווט בטרמינל',
    'שימוש ב-pwd, ls ו-cd לניווט במערכת הקבצים'
  ),
  (
    'ffffffff-0003-0000-0000-000000000000',
    'cccccccc-0009-0000-0000-000000000000',
    'concept.linux-basics.filesystem',
    'מבנה מערכת הקבצים',
    'ספריות /, /home, /etc, /var ונתיבים מוחלטים/יחסיים'
  ),
  (
    'ffffffff-0004-0000-0000-000000000000',
    'cccccccc-0009-0000-0000-000000000000',
    'concept.linux-basics.file-ops',
    'פעולות קבצים',
    'cp, mv, rm, mkdir, touch — יצירה, העתקה, הזזה ומחיקה'
  ),
  (
    'ffffffff-0005-0000-0000-000000000000',
    'cccccccc-0009-0000-0000-000000000000',
    'concept.linux-basics.help',
    'עזרה ותיעוד',
    'man pages, --help, history וחיפוש בהיסטוריה עם Ctrl-R'
  )
ON CONFLICT (id) DO NOTHING;

-- Module 10: Bash Scripting — Concepts
INSERT INTO curriculum_concepts (id, module_id, content_id, name, description)
VALUES
  (
    'ffffffff-0006-0000-0000-000000000000',
    'cccccccc-0010-0000-0000-000000000000',
    'concept.bash-scripting.pipes',
    'צינורות והפניה',
    'שימוש ב-|, >, >> ו-2>&1 להפניית קלט/פלט בין פקודות וקבצים'
  ),
  (
    'ffffffff-0007-0000-0000-000000000000',
    'cccccccc-0010-0000-0000-000000000000',
    'concept.bash-scripting.text-processing',
    'עיבוד טקסט',
    'grep, cat, head, tail, wc לסינון ועיבוד נתוני טקסט'
  ),
  (
    'ffffffff-0008-0000-0000-000000000000',
    'cccccccc-0010-0000-0000-000000000000',
    'concept.bash-scripting.variables',
    'משתנים ב-Bash',
    'הגדרה, הרחבה, ציטוט ו-command substitution עם $()'
  ),
  (
    'ffffffff-0009-0000-0000-000000000000',
    'cccccccc-0010-0000-0000-000000000000',
    'concept.bash-scripting.control-flow',
    'בקרת זרימה',
    'if/elif/else, for, while וקודי יציאה (exit codes) ב-Bash'
  ),
  (
    'ffffffff-0010-0000-0000-000000000000',
    'cccccccc-0010-0000-0000-000000000000',
    'concept.bash-scripting.scripts',
    'כתיבת סקריפטים',
    'shebang, set -e, פונקציות, ארגומנטים ועקרונות כתיבה טובה'
  )
ON CONFLICT (id) DO NOTHING;

-- Module 11: File Permissions — Concepts
INSERT INTO curriculum_concepts (id, module_id, content_id, name, description)
VALUES
  (
    'ffffffff-0011-0000-0000-000000000000',
    'cccccccc-0011-0000-0000-000000000000',
    'concept.file-permissions.rwx',
    'ביטי rwx',
    'משמעות read/write/execute עבור קבצים ותיקיות, וקריאת פלט ls -la'
  ),
  (
    'ffffffff-0012-0000-0000-000000000000',
    'cccccccc-0011-0000-0000-000000000000',
    'concept.file-permissions.chmod',
    'chmod',
    'שינוי הרשאות בשיטה אוקטלית (755, 644) וסמלית (u+x, g-w)'
  ),
  (
    'ffffffff-0013-0000-0000-000000000000',
    'cccccccc-0011-0000-0000-000000000000',
    'concept.file-permissions.users-groups',
    'משתמשים וקבוצות',
    'מבנה uid/gid, /etc/passwd, /etc/group וניהול משתמשים'
  ),
  (
    'ffffffff-0014-0000-0000-000000000000',
    'cccccccc-0011-0000-0000-000000000000',
    'concept.file-permissions.chown',
    'chown',
    'שינוי בעלות על קובץ — chown user:group ו-chgrp'
  ),
  (
    'ffffffff-0015-0000-0000-000000000000',
    'cccccccc-0011-0000-0000-000000000000',
    'concept.file-permissions.sudo',
    'sudo',
    'הרצת פקודות עם הרשאות root, /etc/sudoers ועקרון הרשאות מינימליות'
  )
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- QUESTIONS — 10 per module (30 total)
-- Fixed UUIDs so they can be referenced in curriculum_practices below.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Module 9: Linux Basics — 10 questions
-- ---------------------------------------------------------------------------

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0001-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'easy', 'linux_pwd_command',
  'מה מציגה הפקודה pwd?',
  'את שם המשתמש הנוכחי',
  'את הנתיב המוחלט של הספרייה הנוכחית',
  'את ה-PID של ה-shell הנוכחי',
  'את רשימת הקבצים בספרייה',
  'b',
  'pwd (Print Working Directory) מציגה את הנתיב המוחלט של הספרייה שבה אנחנו נמצאים כעת, למשל /home/user/projects.',
  'לבלבל בין pwd לבין whoami שמציגה את שם המשתמש.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0002-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'easy', 'linux_ls_hidden_files',
  'איזה flag של ls מציג גם קבצים מוסתרים (hidden files)?',
  'ls -l',
  'ls -h',
  'ls -a',
  'ls -r',
  'c',
  'קבצים מוסתרים בלינוקס מתחילים בנקודה (.). הפקודה ls -a (all) מציגה אותם יחד עם שאר הקבצים.',
  'לבלבל בין -a (all) לבין -l (long format) שמציג פרטים אך לא קבצים מוסתרים.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0003-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'easy', 'linux_cd_home',
  'מה עושה הפקודה cd ~ ?',
  'עולה תיקייה אחת מעלה',
  'עוברת לתיקייה /tmp',
  'עוברת לתיקיית הבית של המשתמש הנוכחי',
  'מציגה את הספרייה הנוכחית',
  'c',
  'התו ~ (tilde) מייצג את תיקיית הבית (home directory) של המשתמש הנוכחי, בדרך כלל /home/username. cd ~ זהה ל-cd $HOME.',
  'לבלבל בין ~ (home) לבין .. (ספרייה אחת מעלה).',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0004-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'medium', 'linux_mkdir_parents',
  'מה עושה הפקודה mkdir -p a/b/c ?',
  'יוצרת רק את הספרייה c',
  'מחזירה שגיאה אם a לא קיימת',
  'יוצרת את כל עץ הספריות a/b/c כולל ספריות ביניים',
  'מוחקת את עץ הספריות',
  'c',
  'הflag -p (parents) מאפשר ל-mkdir ליצור את כל ספריות הביניים הנדרשות. ללא -p, הפקודה תיכשל אם ספרייה בנתיב לא קיימת.',
  'לשכוח את -p ולקבל שגיאה כשהנתיב המלא לא קיים.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0005-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'medium', 'linux_absolute_vs_relative',
  'מה ההבדל בין הנתיבים /home/user/file.txt ו-user/file.txt?',
  'אין הבדל, שניהם מצביעים לאותו מקום',
  'הראשון הוא נתיב מוחלט מ-/, השני הוא נתיב יחסי למיקום הנוכחי',
  'הראשון הוא לקבצים, השני לתיקיות',
  'הראשון עובד רק כ-root',
  'b',
  'נתיב מוחלט מתחיל ב-/ ומצביע תמיד לאותו מקום. נתיב יחסי מתחיל ממיקום הנוכחי — user/file.txt ב-/tmp מצביע ל-/tmp/user/file.txt.',
  'לחשוב שנתיב יחסי עם שם קובץ דומה תמיד מגיע לאותו מקום.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0006-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'medium', 'linux_cp_recursive',
  'איזה flag נדרש ב-cp כדי להעתיק ספרייה שלמה?',
  '-f',
  '-r',
  '-l',
  '-p',
  'b',
  'הflag -r (recursive) ב-cp גורם להעתקת ספרייה שלמה כולל כל תוכנה. ללא -r, cp לא תעתיק ספריות.',
  'לשכוח -r ולהתבאס שcp לא מעתיקה ספריות.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0007-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'easy', 'linux_etc_purpose',
  'מה תפקיד הספרייה /etc בלינוקס?',
  'קבצים זמניים',
  'תוכניות המשתמש',
  'קבצי תצורה של המערכת',
  'מדיה חיצונית',
  'c',
  '/etc מכיל קבצי תצורה למערכת ולשירותים. לדוגמה: /etc/nginx/nginx.conf, /etc/hosts, /etc/passwd, /etc/ssh/sshd_config.',
  'לבלבל בין /etc (תצורה) לבין /var (נתונים משתנים כמו לוגים).',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0008-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'medium', 'linux_mv_rename',
  'מה תעשה הפקודה: mv report.txt report_final.txt',
  'תעתיק את הקובץ',
  'תשנה את שם הקובץ',
  'תמחק את הקובץ',
  'תיצור קישור סמלי',
  'b',
  'כאשר היעד של mv הוא שם קובץ ולא ספרייה, הפקודה משנה את שם הקובץ. זוהי הדרך הרגילה לשינוי שמות בלינוקס.',
  'לחשוב שצריך rename נפרד לשינוי שמות — mv משמש לשתי המטרות (הזזה ושינוי שם).',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0009-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'hard', 'linux_man_page_sections',
  'מה ההבדל בין man ls לבין man 1 ls?',
  'man ls מציג הרשאות, man 1 ls מציג פקודות',
  'man ls מציג את הדף הראשון שנמצא, man 1 ls מציג ספציפית פקודות משתמש (section 1)',
  'man 1 ls לא עובד — 1 אינו פרמטר חוקי',
  'אין הבדל, שניהם זהים',
  'b',
  'man מחולקת ל-8 סקציות. סקציה 1 = פקודות משתמש, 2 = system calls, 3 = library functions. כשיש פקודה ו-system call באותו שם, הסקציה מפרטת איזה עמוד להציג.',
  'לחשוב ש-man הוא חד-ממדי — יש כמה סקציות למסמכי man.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0010-0000-0000-000000000000',
  '22222222-0001-0000-0000-000000000000',
  'multiple_choice', 'hard', 'linux_rm_safety',
  'מה מסוכן בפקודה: rm -rf / ?',
  'תמחק רק את הספרייה הנוכחית',
  'תיצור שגיאה ולא תעשה כלום',
  'תמחק את כל מערכת הקבצים מה-root!',
  'תמחק רק קבצים זמניים',
  'c',
  'אזהרה: rm -rf / היא אחת הפקודות המסוכנות ביותר — היא מוחקת את כל מערכת הקבצים! -r = רקורסיבי, -f = ללא אישורים. מערכות מודרניות מגנות מפני זה, אך חשוב להבין את הסכנה.',
  'להריץ rm -rf ללא שימת לב לנתיב — שים לב לרווח בין -rf ל-/ .',
  true
) ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Module 10: Bash Scripting — 10 questions
-- ---------------------------------------------------------------------------

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0011-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'easy', 'bash_pipe_basic',
  'מה עושה הסמל | (pipe) בין שתי פקודות?',
  'מפעיל את שתי הפקודות בו-זמנית',
  'מעביר את הפלט הסטנדרטי של הפקודה הראשונה כקלט לפקודה השנייה',
  'מחבר שני קבצים לקובץ אחד',
  'מפנה שגיאות לקובץ',
  'b',
  'ה-pipe (|) מחבר את stdout של הפקודה הראשונה ל-stdin של הפקודה השנייה. לדוגמה: ps aux | grep nginx מציג רק שורות עם nginx מרשימת התהליכים.',
  'לבלבל בין pipe (|) לבין redirect (>). pipe מעביר בין פקודות, redirect מעביר לקובץ.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0012-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'easy', 'bash_redirect_append',
  'מה ההבדל בין > לבין >> בהפניית פלט?',
  'אין הבדל',
  '> כותב לקובץ ודורס תוכן קיים, >> מוסיף לסוף הקובץ',
  '> מוסיף לסוף, >> דורס',
  '> מפנה שגיאות, >> מפנה פלט רגיל',
  'b',
  '> (redirection) כותב לקובץ ודורס תוכן קיים. >> (append) מוסיף לסוף הקובץ מבלי למחוק תוכן קיים — חיוני לlogging.',
  'לשכוח ולדרוס לוג חשוב בטעות עם > במקום >>.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0013-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'medium', 'bash_grep_recursive',
  'מה תציג הפקודה: grep -r "TODO" src/ ?',
  'כל השורות בקובץ src/ שמכילות TODO',
  'שורות עם TODO רק בקבצי .txt',
  'שורות עם TODO בכל הקבצים בתיקיית src/ ותת-ספריותיה',
  'מספר ההופעות של TODO',
  'c',
  '-r (recursive) גורם ל-grep לחפש בכל הקבצים בספרייה src/ כולל תת-ספריות. מחזיר: שם_קובץ:מספר_שורה:תוכן_שורה.',
  'לשכוח -r ולחשוב ש-grep יחפש אוטומטית בתת-ספריות.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0014-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'easy', 'bash_variable_assign',
  'איך מגדירים משתנה ב-Bash בצורה נכונה?',
  'NAME = "Alice"',
  'NAME="Alice"',
  '$NAME = "Alice"',
  'set NAME="Alice"',
  'b',
  'בBash, הגדרת משתנה חייבת להיות ללא רווחים סביב סימן =. NAME="Alice" נכון. NAME = "Alice" יפרש NAME כפקודה ו-= כארגומנט.',
  'להוסיף רווחים סביב = כמו בשפות תכנות אחרות.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0015-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'medium', 'bash_special_var_exit',
  'מה משמעות $? ב-Bash?',
  'PID של התהליך הנוכחי',
  'מספר הארגומנטים שהועברו לסקריפט',
  'קוד היציאה של הפקודה האחרונה שהורצה',
  'שם הסקריפט הנוכחי',
  'c',
  '$? מכיל את קוד היציאה (exit code) של הפקודה האחרונה. 0 = הצלחה, כל ערך אחר = כישלון. נפוץ ב: if [ $? -eq 0 ]; then echo "הצליח"',
  'לבלבל בין $? (exit code) לבין $$ (PID נוכחי) או $# (מספר ארגומנטים).',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0016-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'medium', 'bash_command_substitution',
  'מה עושה $() ב-Bash?',
  'מגדיר תת-מעטפת (subshell)',
  'מבצע command substitution — מריץ פקודה ומחזיר את הפלט שלה',
  'מגדיר מערך (array)',
  'בודק אם משתנה מוגדר',
  'b',
  '$() היא command substitution — מריצה פקודה ומחליפה את ה-$() בתוצאה. לדוגמה: TODAY=$(date +%Y-%m-%d) שומר את התאריך הנוכחי במשתנה TODAY.',
  'לבלבל בין $() (command substitution) לבין ${} (variable expansion).',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0017-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'hard', 'bash_shebang',
  'מה תפקיד השורה #!/bin/bash בתחילת סקריפט?',
  'הערה שמסבירה שהסקריפט כתוב בBash',
  'Shebang — מגדיר איזה interpreter ירוץ את הסקריפט',
  'הצהרת משתנה מיוחד',
  'תנאי הרצה ראשוני',
  'b',
  '#! (shebang) בתחילת קובץ הרצה מגדיר את ה-interpreter. #!/bin/bash אומר: הרץ קובץ זה עם /bin/bash. ללא שורה זו, המערכת תנסה להריץ ב-sh ברירת המחדל.',
  'לחשוב שזוהי רק הערה — #! הוא מנגנון מיוחד של kernel.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0018-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'medium', 'bash_set_e',
  'מה עושה set -e בתחילת סקריפט Bash?',
  'מפעיל debug mode',
  'מגדיר encoding',
  'עוצר את הסקריפט כשפקודה מחזירה קוד שגיאה שאינו 0',
  'מגדיר את המשתנה e',
  'c',
  'set -e (errexit) גורם לסקריפט לעצור מיד כשפקודה מחזירה exit code שאינו 0. זוהי best practice — בלי set -e, הסקריפט ימשיך גם אחרי שגיאות קריטיות.',
  'לדלג על set -e וגלות שהסקריפט המשיך לאחר שגיאה קריטית.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0019-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'hard', 'bash_redirect_stderr',
  'מה עושה 2>&1 בסוף פקודה?',
  'מעלה את עדיפות הפקודה',
  'מפנה שגיאות (stderr) לאותו מיקום כמו הפלט הרגיל (stdout)',
  'מריץ את הפקודה פעמיים',
  'מדפיס את פלט השגיאה לשני מסכים',
  'b',
  '2 = file descriptor של stderr, 1 = של stdout. 2>&1 מפנה stderr לאותו מיקום כמו stdout. שימושי ב: command > log.txt 2>&1 לתפיסת גם שגיאות בלוג.',
  'לכתוב 1>&2 במקום 2>&1 (הפוך) ולתמוה למה השגיאות לא נכתבות לקובץ.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0020-0000-0000-000000000000',
  '22222222-0002-0000-0000-000000000000',
  'multiple_choice', 'hard', 'bash_for_glob',
  'מה עושה הלולאה: for f in *.log; do echo "$f"; done ?',
  'מדפיסה את המחרוזת *.log',
  'מדפיסה את כל שמות קבצי ה-.log בספרייה הנוכחית',
  'שגיאה — bash לא תומכת בגלובינג ב-for',
  'מדפיסה רק את הקובץ הראשון',
  'b',
  'Bash מבצעת glob expansion — *.log מוחלפת ברשימת כל הקבצים שמסתיימים ב-.log בספרייה הנוכחית. הלולאה חוזרת על כל אחד מהם.',
  'לחשוב שצריך ls *.log | while read f כדי לעבור על קבצים — for עם glob הוא נקי יותר.',
  true
) ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Module 11: File Permissions — 10 questions
-- ---------------------------------------------------------------------------

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0021-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'easy', 'perm_read_ls',
  'בפלט ls -la: -rwxr-xr-- מהן הרשאות הקבוצה (group)?',
  'rwx',
  'r-x',
  'r--',
  'rwxr-xr--',
  'b',
  'מחרוזת ההרשאות מחולקת: - (סוג), rwx (בעלים), r-x (קבוצה), r-- (אחרים). הקבוצה יכולה לקרוא ולהריץ, אך לא לכתוב.',
  'לבלבל בין עמדות הביטים — כל קבוצה היא 3 ביטים: בעלים (2-4), קבוצה (5-7), אחרים (8-10).',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0022-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'easy', 'perm_chmod_octal_755',
  'מה ההרשאות שמגדיר chmod 755 ?',
  'rwxrwxrwx',
  'rwxr-xr-x',
  'rw-rw-rw-',
  'r-xr-xr-x',
  'b',
  '7=rwx (4+2+1), 5=r-x (4+1), 5=r-x. לכן: rwx לבעלים, r-x לקבוצה, r-x לאחרים. זוהי הרשאה סטנדרטית לתוכניות הרצה ותיקיות.',
  'לחשב 5 כ-rw- — לזכור: r=4, w=2, x=1. לכן 5=r+x=4+1, לא r+w.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0023-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'medium', 'perm_chmod_symbolic_add',
  'מה עושה הפקודה chmod u+x script.sh ?',
  'מסירה הרשאת execute מכולם',
  'מוסיפה הרשאת execute לבעלים של הקובץ',
  'מוסיפה הרשאת execute לכולם',
  'מגדיר הרשאות ל-u=x',
  'b',
  'u = user (owner), + = הוסף, x = execute. chmod u+x מוסיפה הרשאת ריצה לבעלים בלבד, מבלי לשנות הרשאות אחרות.',
  'לבלבל בין u (user/owner) לבין a (all). chmod a+x יוסיף לכולם.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0024-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'easy', 'perm_chmod_644',
  'מה ההרשאות המומלצות לקובץ קונפיגורציה רגיל?',
  '777',
  '755',
  '644',
  '600',
  'c',
  '644 = rw-r--r-- : הבעלים יכול לקרוא ולכתוב, כל השאר רק לקרוא. זוהי הרשאה סטנדרטית לקבצים רגילים. 600 (rw-------) מיועד לקבצים רגישים כמו מפתחות SSH.',
  'לתת 777 לכל הקבצים כדי לפתור בעיות הרשאות — זה מסכן את האבטחה.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0025-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'medium', 'perm_execute_dir',
  'מה משמעות ביט x (execute) עבור תיקייה?',
  'מאפשר להריץ קבצים בתוך התיקייה',
  'מאפשר כניסה לתיקייה (cd) וגישה לקבצים בתוכה',
  'מאפשר צפייה ברשימת הקבצים',
  'ביט execute לא רלוונטי לתיקיות',
  'b',
  'עבור תיקיות, x = הרשאת כניסה. בלי x, אי אפשר cd לתיקייה ולא ניתן לגשת לקבצים בתוכה גם אם יש r. r ללא x בתיקייה = אפשר לראות שמות אך לא לגשת לקבצים.',
  'לחשוב שx בתיקייה = הרשאת הרצה לקבצים בתוכה.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0026-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'medium', 'perm_chown_command',
  'מה עושה הפקודה chown alice:devops file.txt ?',
  'מוסיפה alice לקבוצת devops',
  'משנה את בעל הקובץ ל-alice ואת הקבוצה ל-devops',
  'יוצרת משתמש alice עם group devops',
  'מגדיר הרשאות קובץ בשיטה סמלית',
  'b',
  'chown user:group file משנה גם את הבעלים וגם את הקבוצה. chown alice file ישנה רק בעלים. chown :devops file ישנה רק קבוצה. בדרך כלל דרוש sudo.',
  'לשכוח sudo לפני chown ולקבל "Operation not permitted".',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0027-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'easy', 'perm_whoami',
  'מה מציגה הפקודה whoami ?',
  'כתובת ה-IP של המחשב',
  'שם המשתמש הנוכחי',
  'כל המשתמשים במערכת',
  'שם ה-hostname',
  'b',
  'whoami מציגה את שם המשתמש הנוכחי (effective user). שימושית לאימות: האם אנחנו root? האם התחברנו בתור המשתמש הנכון?',
  'לבלבל בין whoami (משתמש נוכחי) לבין hostname (שם המחשב).',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0028-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'medium', 'perm_sudo_least_privilege',
  'מה עקרון ה-Least Privilege בהקשר של sudo?',
  'תמיד להשתמש ב-sudo לכל פקודה',
  'לעולם לא להשתמש ב-sudo',
  'לתת רק את הרשאות המינימליות הדרושות למשימה הספציפית',
  'להריץ כל תהליך כ-root לביצועים טובים יותר',
  'c',
  'Least Privilege = כל תהליך/משתמש יקבל רק את ההרשאות שהוא באמת צריך. לדוגמה: שרת web ירוץ כ-www-data ולא כ-root, כדי שפרצת אבטחה לא תפגע בכל המערכת.',
  'לחשוב שהרצה כ-root תפתור את כל בעיות ההרשאות — מסוכן מאוד.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0029-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'hard', 'perm_ssh_key_permissions',
  'מהן ההרשאות הנכונות לקובץ מפתח פרטי SSH (id_rsa)?',
  '755',
  '644',
  '600',
  '777',
  'c',
  '600 = rw------- : רק הבעלים יכול לקרוא ולכתוב. SSH דורש הגנה מחמירה על מפתחות פרטיים — אם יש הרשאות נרחבות, SSH יסרב להשתמש במפתח עם "UNPROTECTED PRIVATE KEY FILE".',
  'לתת 644 ל-id_rsa ולתמוה למה SSH מסרב להתחבר.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0030-0000-0000-000000000000',
  '22222222-0003-0000-0000-000000000000',
  'multiple_choice', 'hard', 'perm_usermod_group',
  'מה עושה הפקודה usermod -aG docker alice ?',
  'מוחקת את alice מקבוצת docker',
  'מוסיפה את alice לקבוצת docker מבלי להסיר מקבוצות אחרות',
  'יוצרת קבוצה חדשה docker:alice',
  'מגדירה docker כ-primary group של alice',
  'b',
  '-aG = append to Group. -a חיוני! בלי -a, usermod -G docker alice יסיר את alice מכל קבוצותיה האחרות! לאחר הרצה, על alice לצאת ולהיכנס מחדש.',
  'לשכוח -a ולהסיר את המשתמש מכל קבוצותיו האחרות בטעות.',
  true
) ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- PRACTICES — 1 per module (3 total)
-- ===========================================================================

INSERT INTO curriculum_practices (id, module_id, content_id, title, description, question_ids)
VALUES (
  'eeeeeeee-0001-0000-0000-000000000000',
  'cccccccc-0009-0000-0000-000000000000',
  'practice.linux.linux-basics',
  'תרגול — יסודות לינוקס',
  'תרגול פקודות בסיסיות: ניווט, קבצים ומערכת הקבצים.',
  ARRAY[
    '33333333-0001-0000-0000-000000000000',
    '33333333-0002-0000-0000-000000000000',
    '33333333-0003-0000-0000-000000000000',
    '33333333-0004-0000-0000-000000000000',
    '33333333-0005-0000-0000-000000000000',
    '33333333-0006-0000-0000-000000000000',
    '33333333-0007-0000-0000-000000000000',
    '33333333-0008-0000-0000-000000000000',
    '33333333-0009-0000-0000-000000000000',
    '33333333-0010-0000-0000-000000000000'
  ]::uuid[]
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_practices (id, module_id, content_id, title, description, question_ids)
VALUES (
  'eeeeeeee-0002-0000-0000-000000000000',
  'cccccccc-0010-0000-0000-000000000000',
  'practice.linux.bash-scripting',
  'תרגול — תכנות Bash',
  'תרגול צינורות, משתנים, בקרת זרימה וסקריפטים.',
  ARRAY[
    '33333333-0011-0000-0000-000000000000',
    '33333333-0012-0000-0000-000000000000',
    '33333333-0013-0000-0000-000000000000',
    '33333333-0014-0000-0000-000000000000',
    '33333333-0015-0000-0000-000000000000',
    '33333333-0016-0000-0000-000000000000',
    '33333333-0017-0000-0000-000000000000',
    '33333333-0018-0000-0000-000000000000',
    '33333333-0019-0000-0000-000000000000',
    '33333333-0020-0000-0000-000000000000'
  ]::uuid[]
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curriculum_practices (id, module_id, content_id, title, description, question_ids)
VALUES (
  'eeeeeeee-0003-0000-0000-000000000000',
  'cccccccc-0011-0000-0000-000000000000',
  'practice.linux.file-permissions',
  'תרגול — הרשאות קבצים',
  'תרגול chmod, chown, משתמשים, קבוצות וsudo.',
  ARRAY[
    '33333333-0021-0000-0000-000000000000',
    '33333333-0022-0000-0000-000000000000',
    '33333333-0023-0000-0000-000000000000',
    '33333333-0024-0000-0000-000000000000',
    '33333333-0025-0000-0000-000000000000',
    '33333333-0026-0000-0000-000000000000',
    '33333333-0027-0000-0000-000000000000',
    '33333333-0028-0000-0000-000000000000',
    '33333333-0029-0000-0000-000000000000',
    '33333333-0030-0000-0000-000000000000'
  ]::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- TRANSLATIONS — Hebrew for all content entities
-- ===========================================================================

INSERT INTO curriculum_translations (content_id, locale, fields)
VALUES
  ('phase.linux-bash', 'he', '{
    "name": "לינוקס ובאש",
    "description": "מהטרמינל הראשון ועד סקריפטים מתקדמים: ניווט, קבצים, הרשאות ואוטומציה."
  }'),
  ('module.linux.linux-basics', 'he', '{
    "name": "יסודות לינוקס",
    "description": "ניווט בטרמינל, מבנה מערכת הקבצים, פקודות בסיסיות ועזרה."
  }'),
  ('module.linux.bash-scripting', 'he', '{
    "name": "תכנות Bash",
    "description": "צינורות, הפניית פלט, עיבוד טקסט, משתנים, בקרת זרימה וסקריפטים."
  }'),
  ('module.linux.file-permissions', 'he', '{
    "name": "הרשאות קבצים",
    "description": "מודל ההרשאות של לינוקס: rwx, chmod, chown, משתמשים, קבוצות וסודו."
  }'),
  ('lesson.linux-basics.01', 'he', '{
    "title": "מבוא ללינוקס",
    "description": "kernel, הפצות, shell ולמה DevOps חי בלינוקס."
  }'),
  ('lesson.linux-basics.02', 'he', '{
    "title": "ניווט בטרמינל",
    "description": "pwd, ls, cd — פקודות הניווט הבסיסיות."
  }'),
  ('lesson.linux-basics.03', 'he', '{
    "title": "מבנה מערכת הקבצים",
    "description": "עץ הקבצים של לינוקס: /, /home, /etc, /var ונתיבים."
  }'),
  ('lesson.linux-basics.04', 'he', '{
    "title": "פעולות קבצים",
    "description": "cp, mv, rm, mkdir — יצירה, העתקה, הזזה ומחיקה."
  }'),
  ('lesson.linux-basics.05', 'he', '{
    "title": "עזרה ותיעוד",
    "description": "man, --help, history וחיפוש בהיסטוריה."
  }'),
  ('lesson.bash-scripting.01', 'he', '{
    "title": "צינורות והפניית פלט",
    "description": "שימוש ב-|, >, >> ו-2>&1."
  }'),
  ('lesson.bash-scripting.02', 'he', '{
    "title": "עיבוד טקסט",
    "description": "grep, cat, head, tail, wc — ניהול וסינון נתונים."
  }'),
  ('lesson.bash-scripting.03', 'he', '{
    "title": "משתנים ב-Bash",
    "description": "הגדרה, הרחבה, ציטוט ו-command substitution."
  }'),
  ('lesson.bash-scripting.04', 'he', '{
    "title": "בקרת זרימה",
    "description": "if, for, while וקודי יציאה ב-Bash."
  }'),
  ('lesson.bash-scripting.05', 'he', '{
    "title": "כתיבת סקריפטים",
    "description": "מבנה סקריפט, set -e, פונקציות ו-best practices."
  }'),
  ('lesson.file-permissions.01', 'he', '{
    "title": "מודל ההרשאות של לינוקס",
    "description": "קריאת ls -la, ביטי rwx ועמדות בעלים/קבוצה/אחרים."
  }'),
  ('lesson.file-permissions.02', 'he', '{
    "title": "chmod — שינוי הרשאות",
    "description": "שיטה אוקטלית וסמלית, -R ולמה 777 מסוכן."
  }'),
  ('lesson.file-permissions.03', 'he', '{
    "title": "משתמשים וקבוצות",
    "description": "whoami, id, /etc/passwd, /etc/group וניהול משתמשים."
  }'),
  ('lesson.file-permissions.04', 'he', '{
    "title": "chown — שינוי בעלות",
    "description": "chown, chgrp ודוגמאות מעשיות לשרתי web."
  }'),
  ('lesson.file-permissions.05', 'he', '{
    "title": "sudo ובטיחות",
    "description": "sudo, su, /etc/sudoers ועקרון הרשאות מינימליות."
  }'),
  ('practice.linux.linux-basics', 'he', '{
    "title": "תרגול — יסודות לינוקס",
    "description": "תרגול פקודות בסיסיות: ניווט, קבצים ומערכת הקבצים."
  }'),
  ('practice.linux.bash-scripting', 'he', '{
    "title": "תרגול — תכנות Bash",
    "description": "תרגול צינורות, משתנים, בקרת זרימה וסקריפטים."
  }'),
  ('practice.linux.file-permissions', 'he', '{
    "title": "תרגול — הרשאות קבצים",
    "description": "תרגול chmod, chown, משתמשים, קבוצות וsudo."
  }')
ON CONFLICT (content_id, locale) DO NOTHING;
