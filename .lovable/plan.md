

# כפתור "דלג על תיאוריה" + פיצ'רים חדשים לשיפור ההכנה למבחן

## 1. כפתור "אני מכיר, דלג" בתיאוריה

| קובץ | שינוי |
|------|-------|
| `src/components/TheoryCard.tsx` | הוספת כפתור משני "אני מכיר את זה, דלג ←" מתחת לכפתור הראשי, בסגנון ghost/link שקוף |

## 2. שעון פומודורו (Pomodoro Timer)

| קובץ | שינוי |
|------|-------|
| `src/components/PomodoroTimer.tsx` | קומפוננטה חדשה — טיימר 25 דקות לימוד / 5 דקות הפסקה, עם כפתור start/pause/reset, התראה קולית (sonner toast) בסיום, אנימציית progress circle |
| `src/pages/Index.tsx` | הוספת ווידג'ט פומודורו קטן בדף הבית, או כפתור שפותח אותו |
| `src/components/BottomNav.tsx` | (אופציונלי) הוספת אייקון טיימר בנאב |

## 3. מצב כהה/בהיר (Theme Toggle)

| קובץ | שינוי |
|------|-------|
| `src/App.tsx` | הסרת ה-`dark` class הקבוע מה-div העוטף, שימוש ב-state/localStorage לניהול theme |
| `src/components/ThemeToggle.tsx` | קומפוננטה חדשה — כפתור שמש/ירח שמחליף בין dark/light |
| `src/pages/Index.tsx` | הוספת ThemeToggle בהדר |

## 4. רעיונות נוספים שאיישם

| פיצ'ר | קובץ | תיאור |
|-------|------|-------|
| **גיליון טעויות** | `src/pages/ReviewMistakes.tsx` (כבר קיים) | שיפור עם אפשרות לתרגל מחדש רק שאלות שנכשלו |
| **מונה זמן לשאלה** | `src/pages/TopicPractice.tsx` | טיימר קטן שמראה כמה זמן לקח לענות על כל שאלה — מכין לעבודה תחת לחץ זמן |
| **סיכום יומי** | `src/pages/Index.tsx` | באנר "היום למדת X שאלות, דיוק Y%" שמעודד המשכיות |

## 5. פרטים טכניים

- Theme נשמר ב-localStorage, ברירת מחדל dark
- פומודורו משתמש ב-`setInterval` עם cleanup, toast מ-sonner בסיום
- כפתור הדילוג בתיאוריה פשוט קורא ל-`onContinue` (אותו callback)

