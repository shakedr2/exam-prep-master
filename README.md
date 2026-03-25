# ExamPrep — הכנה למבחן Python

> אפליקציית ווב פרוגרסיבית (PWA) לתרגול והכנה למבחנים בקורס Python בסיסי.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://exam-prep-master.vercel.app)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black)](https://vercel.com)
[![Supabase](https://img.shields.io/badge/backend-Supabase-3ECF8E)](https://supabase.com)

---

## מה האפליקציה עושה?

ExamPrep היא אפליקציה שנבנתה כדי לעזור לסטודנטים להתכונן למבחן בקורס **כתנות בסיסית (Python)** של ד"ר רמי רשקוביץ.

### תכונות עיקריות

| תכונה | תיאור |
|---|---|
| **תרגול לפי נושאים** | שאלות מרובות בחירה מחולקות לנושאים: רשימות, לולאות, פונקציות, מחרוזות, תנאים ועוד |
| **מבחן סימולציה** | מבחן מדומה עם טיימר של 3 שעות, ציון סופי, ומשוב מפורט |
| **הסבר AI** | לחיצה על "AI Explanation" לאחר כל תשובה — מקבלים הסבר מפורט בעברית מדוע התשובה נכונה |
| **פרופ' פייתון** | עוזר AI מבוסס צ'אט (Socratic method) שמלמד בלי לתת תשובות ישירות |
| **מעקב התקדמות** | Dashboard עם אחוז הצלחה, נושאים חלשים, וסטטיסטיקות אישיות |
| **PWA** | ניתן להתקין על הטלפון/מחשב ולהשתמש גם אופליין |
| **RTL מלא** | ממשק מלא בעברית עם תמיכה מלאה בכיוון ימין-שמאל |

---

## טכנולוגיות

### Frontend
- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** + **shadcn/ui** — עיצוב
- **React Router v6** — ניתוב
- **Framer Motion** — אנימציות
- **Vitest** — בדיקות יחידה

### Backend
- **Supabase** — בסיס נתונים (PostgreSQL), אימות משתמשים
- **Supabase Edge Functions** (Deno) — לוגיקה שרתית:
  - `ai-explain` — הסבר AI לכל שאלה
  - `ai-tutor` — צ'אט פדגוגי עם פרופ' פייתון
- **OpenAI GPT-4o-mini** — מנוע ה-AI

### Deployment
- **Vercel** — פריסת ה-Frontend (CD אוטומטי מ-`main`)
- **GitHub Actions** — CI: בדיקות ובנייה בכל PR

---

## מבנה הפרויקט

```
exam-prep-master/
├── src/
│   ├── features/          # Feature-based architecture
│   │   ├── ai/            # לוגיקת קריאות AI (aiClient.ts)
│   │   ├── questions/     # קומפוננטות שאלות ותרגול
│   │   ├── exam/          # מצב מבחן סימולציה
│   │   ├── dashboard/     # מסך התקדמות
│   │   └── topics/        # רשימת נושאים
│   ├── shared/            # קומפוננטות משותפות (AiTutor, Layout)
│   ├── data/              # קובצי JSON עם כל השאלות
│   └── lib/               # Supabase client, utils
├── supabase/
│   ├── functions/
│   │   ├── ai-explain/    # Edge Function: הסבר שאלה
│   │   └── ai-tutor/      # Edge Function: צ'אט פדגוגי
│   └── migrations/        # מיגרציות PostgreSQL
├── .github/workflows/     # GitHub Actions CI
└── public/                # Assets, PWA manifest
```

---

## התקנה והרצה מקומית

### דרישות מוקדמות
- Node.js 20+
- npm
- חשבון Supabase
- מפתח OpenAI API

### שלבים

```bash
# שכפול הפרויקט
git clone https://github.com/shakedr2/exam-prep-master.git
cd exam-prep-master

# התקנת תלויות
npm install

# הגדרת משתני סביבה
cp .env.example .env
# מלא את הערכים ב-.env

# הרצה מקומית
npm run dev
```

### משתני סביבה נדרשים (`.env`)

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_ADMIN_EMAIL=<admin-email>
```

### Supabase Edge Functions — Secret נדרש

```bash
# בלוח הבקרה של Supabase > Edge Functions > Secrets
OPENAI_API_KEY=sk-...
```

---

## פריסה (Deployment)

### Frontend — Vercel

הפרויקט מחובר ל-Vercel עם CD אוטומטי:
- כל push ל-`main` גורר פריסה אוטומטית
- משתני הסביבה מוגדרים ב-Vercel Dashboard תחת Project Settings > Environment Variables

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_ADMIN_EMAIL
```

### Backend — Supabase Edge Functions

פונקציות ה-Edge נפרסות **ידנית** דרך לוח הבקרה של Supabase (Editor) או דרך Supabase CLI:

```bash
# התקנת Supabase CLI
npm install -g supabase

# כניסה
supabase login

# פריסת פונקציה
supabase functions deploy ai-explain --project-ref txubfromrrlhqtyrxrei
supabase functions deploy ai-tutor --project-ref txubfromrrlhqtyrxrei
```

> **חשוב:** יש לוודא שה-Secret `OPENAI_API_KEY` מוגדר ב-Supabase לפני פריסת הפונקציות.

### GitHub Actions CI

בכל push/PR ל-`main` רץ workflow שמבצע:
1. `npm run lint` — בדיקת קוד
2. `npm test` — הרצת בדיקות Vitest
3. `npm run build` — וידוא שהבנייה עוברת

---

## בדיקות

```bash
# הרצת כל הבדיקות
npm test

# עם ממשק UI
npm run test:watch
```

---

## Live Demo

https://exam-prep-master.vercel.app

---

## רישיון

פרויקט פרטי — כל הזכויות שמורות.
