# מפרט מדריך AI — ExamPrep Master

מסמך זה מגדיר את חוזה ההתנהגות של מדריך ה-AI באפליקציית ExamPrep Master. כל שינוי בהתנהגות המדריך חייב להיות עקבי עם מסמך זה.

---

## 1. הקשר קלט (Input Context)

בכל קריאה למדריך ה-AI מועברים הפרמטרים הבאים:

| פרמטר | סוג | תיאור |
|---|---|---|
| `questionText` | `string` | נוסח השאלה המלא |
| `questionType` | `quiz \| tracing \| coding \| fill-blank` | סוג השאלה |
| `topic` | `string` | מזהה נושא (למשל `loops`, `strings`) |
| `hintLevel` | `1 \| 2 \| 3` | רמת הרמז הנדרשת |
| `choices` | `string[]` | אפשרויות תשובה (לשאלות רב-ברירה) |
| `correctAnswer` | `string` | התשובה הנכונה |
| `userAnswer` | `string?` | תשובת המשתמש (אם קיימת) |
| `codeSnippet` | `string?` | קוד Python מצורף לשאלה (אם קיים) |

---

## 2. סולם הרמזים (Hint Ladder)

המדריך פועל בשלושה שלבים הדרגתיים. **לא ניתן לדלג על שלב.**

### רמה 1 — כיוון כללי (רמז)

**מטרה:** לתת לתלמיד דחיפה קלה בכיוון הנכון, מבלי לחשוף מידע ספציפי על התשובה.

**כללים:**
- משפט או שניים בלבד
- ללא ציון התשובה הנכונה
- שאלה סוקרטית מכוונת, או תזכורת לאיזה מושג רלוונטי לבדוק
- לדוגמה: "חשוב/י מה המשמעות של האופרטור `%` — מה הוא מחזיר?"

### רמה 2 — רמז ספציפי עם תזכורת מושג

**מטרה:** להצביע על המנגנון הספציפי שנדרש להבנת השאלה.

**כללים:**
- 3–5 משפטים
- הזכרת המושג/האופרטור/הפונקציה הספציפית שרלוונטית
- הדגמה קצרה עם דוגמת קוד אם מועיל
- עדיין ללא גילוי התשובה הסופית
- לדוגמה: "אופרטור `%` (מודולו) מחזיר את השארית של חלוקה. לדוגמה: `7 % 3 == 1`. נסה/י להפעיל אותו על הערכים בשאלה."

### רמה 3 — הסבר מלא (הצג תשובה)

**מטרה:** הסבר מלא ומפורט, כולל פתרון צעד אחר צעד.

**כללים:**
- מלא ומפורט — ללא הגבלת אורך
- עקיבה אחרי הקוד שורה אחרי שורה (אם יש קוד)
- ציון התשובה הנכונה בפירוש
- הסבר מדוע תשובות שגויות נפוצות שגויות
- טיפ לזכירה

---

## 3. בדיקת ניסיונות תשובה

כאשר המשתמש ענה תשובה שגויה (לפני הצגת רמז):

1. **ראשית** — המדריך מסביר **מדוע** תשובת המשתמש שגויה (בשלב רמה 3 בלבד)
2. **לאחר מכן** — מסביר מדוע התשובה הנכונה נכונה
3. **לעולם אל** — לא מגנה על המשתמש, לא מבייש

דוגמה: "בחרת `i += 2` — זה יגרום ללולאה לדלג כל פעם על אינדקס אחד, ולכן לא כל הערכים ייבדקו. התשובה הנכונה היא `i += 1` כי..."

---

## 4. מתי מותר להציג תשובה מלאה

תשובה מלאה (רמה 3) זמינה:
- **לאחר שרמות 1 ו-2 הוצגו** — המשתמש לחץ "עזרה נוספת" פעמיים
- **בבקשה מפורשת** — המשתמש לחץ "הצג תשובה" לאחר לפחות ניסיון אחד
- **בסיום שאלה** — המשתמש ענה (נכון או שגוי) ורוצה הסבר לאחר-מעשה

**לא** מציגים פתרון מלא בלחיצה ראשונה.

---

## 5. התנהגות תגובה בעברית

- **כל** טקסט גלוי למשתמש — בעברית בלבד
- כיוון RTL בממשק
- ניתן לכלול בלוקי קוד Python (LTR) בתוך הסבר עברי
- לא לערבב עברית ואנגלית בתוך משפטים

---

## 6. הסבר טעות

כאשר המשתמש ענה תשובה שגויה ומגיע לרמה 3:

1. "בחרת [תשובת המשתמש] — ..." הסבר מדוע זה שגוי
2. "התשובה הנכונה היא [תשובה נכונה] כי..." הסבר מפורט
3. "טיפ לזכירה: ..." (אם רלוונטי)

---

## 7. טון

- **מעודד:** "כמעט! ניסיון טוב..."
- **סבלני:** אף פעם לא מביע אכזבה
- **מכוון מבחן:** מזכיר שהחומר חשוב למבחן, מציין פורמטים נפוצים במבחן
- **לא שיפוטי:** שגיאה = הזדמנות ללמידה

---

## 8. מבנה תגובה JSON

### רמות 1 ו-2:
```json
{
  "hint": "טקסט הרמז",
  "level": 1
}
```

### רמה 3:
```json
{
  "explanation": "הסבר מלא...",
  "tip": "טיפ לזכירה",
  "level": 3
}
```

---

## 9. ממשק המשתמש (UI Contract)

| מצב | כפתור מוצג | תוכן |
|-----|-----------|------|
| לפני כל עזרה | "💡 רמז" | — |
| אחרי רמה 1 | "➕ עזרה נוספת" | הצגת רמז 1 |
| אחרי רמה 2 | "📖 הצג תשובה" | הצגת רמז 1 + 2 |
| אחרי רמה 3 | — | הצגת הסבר מלא |

- מספר הרמז הנוכחי מוצג בממשק (רמה 1/3, 2/3, 3/3)
- כל רמה מצטברת (לא מחליפה) — כל הרמזים שהוצגו נשארים גלויים

---

## 10. גבולות ואיסורים

- **אסור** ליצור ממשק צ'אט חופשי
- **אסור** לענות על שאלות שאינן קשורות לשאלה הנוכחית
- **אסור** לייצר תוכן בשפה שאינה עברית (למעט קוד Python)
- **אסור** לעקוף את סולם הרמזים — תמיד מתחילים מרמה 1
- **אסור** לחשוף תשובה ברמות 1 ו-2

---

## 11. RAG Context Payload Design

כדי לתת למדריך ה-AI הקשר פדגוגי מדויק (הפרסונה של המורה, הנושא, היסטוריית התלמיד), כל בקשה נשלחת עם מטען (payload) מובנה של הקשר. המטען הזה מורכב משלוש שכבות, בסדר דטרמיניסטי: Persona → Curriculum → Learner. כל שכבה מוסיפה משקל מודלי אחר.

### 11.1 מקורות הנתונים

| שכבה | מקור | שכיחות רענון |
|---|---|---|
| Persona | `src/features/curriculum/prompts/*-tutor.ts` דרך `getTutorConfig(topicId)` | סטטי — נטען פעם אחת עם הבנדל |
| Curriculum | `src/data/modules.ts`, `src/data/questions.ts`, `src/data/topicTutorials.ts` | סטטי — נטען עם הבנדל |
| Learner | `useProgress`, `useTrackProgress`, `useModuleProgress` (localStorage לאורחים, Supabase למחוברים) | לכל בקשה |

### 11.2 מבנה המטען

```ts
type RagContextPayload = {
  persona: {
    tutorId: string;           // slug: "python" | "oop" | "linux" | …
    name: string;              // "פרופ׳ פייתון / Prof. Python"
    systemPrompt: string;      // מ-TutorConfig.systemPrompt
    language: "he" | "en";     // מה-i18n locale הפעיל
  };
  curriculum: {
    trackId: "python-fundamentals" | "python-oop" | "devops";
    moduleId: string;          // e.g. "control_flow"
    topicId: string;           // e.g. "loops"
    topicTitleHe: string;      // מ-topics[].name
    moduleTitleHe: string;     // מ-modules[].title
    syllabusAnchor?: string;   // e.g. "Curriculum §3 — Control Flow"
    tutorialSnippets?: Array<{
      conceptTitle: string;
      explanation: string;
      codeExample?: string;
      expectedOutput?: string;
    }>;                        // מ-topicTutorials — לא יותר מ-3 קטעים
  };
  question: {
    id: string;
    type: "quiz" | "tracing" | "coding" | "fill-blank";
    difficulty: "easy" | "medium" | "hard";
    text: string;
    code?: string;
    choices?: string[];
    correctAnswer: string;
    hintLevel: 1 | 2 | 3;
    userAnswer?: string;
    patternFamily?: string;    // קישור לדפוס במבחן
  };
  learner: {
    isAuthenticated: boolean;
    trackCompletionPct: number;      // 0–100 מ-useTrackProgress
    moduleCompletionPct: number;     // 0–100 מ-useModuleProgress
    topicAccuracy: number;           // correct/attempted למשתנה topicId
    recentMistakes: Array<{          // עד 5 התשובות השגויות האחרונות בנושא
      questionId: string;
      chosen: string;
      correct: string;
    }>;
    weakPatternFamilies: string[];   // מ-getWeakTopics / pattern labels
  };
};
```

### 11.3 חוקי בנייה (Invariants)

1. **סדר דטרמיניסטי.** השדות תמיד מסודרים בסדר `persona → curriculum → question → learner`. זה שומר על יציבות cache-keys עבור cache-hit rate גבוה ב-prompt caching של Anthropic.
2. **פרטיות.** `learner` לעולם לא כולל PII (שם, אימייל, user_id). `recentMistakes` מוגבל ל-5 רשומות ולא כולל timestamps.
3. **אורך.** `tutorialSnippets` מוגבל ל-3 קטעי מושג, `recentMistakes` ל-5, `weakPatternFamilies` ל-10. כל חריגה נחתכת בצד הלקוח לפני השליחה.
4. **שפה.** שפת `persona.language` קובעת — אם `he`, כל טקסט המוזרק חייב להיות עברית; אם `en`, אנגלית. ערבוב גורר שגיאת validation בצד הלקוח.
5. **נפילה בטוחה.** אם `topicId` לא נמצא ב-`tutorRegistry`, ה-persona נופל ל-`pythonTutor` (ראו `getTutorConfig` ב-`features/curriculum/prompts/index.ts`).
6. **אי-הדלפה.** `correctAnswer` נשלח תמיד; אך ה-system prompt (ראו §2) מונע מהמדריך לחשוף אותו לפני רמת רמז 3.
7. **גרסאות סכמה.** כל שינוי למבנה הזה מחייב bump לגרסת `ragSchemaVersion` (שולחים כ-meta header) כדי ש-edge function תוכל לאמת תאימות.

### 11.4 הרכבה — Pseudo-code

```ts
import { getTutorConfig } from "@/features/curriculum/prompts";
import { getModuleForTopic } from "@/data/modules";
import { getTutorialByTopicId } from "@/data/topicTutorials";

export function buildRagContext({
  question,
  topicId,
  userAnswer,
  hintLevel,
  learnerSnapshot,
  locale,
}: BuildRagContextArgs): RagContextPayload {
  const persona = getTutorConfig(topicId);
  const module = getModuleForTopic(topicId);
  const tutorial = getTutorialByTopicId(topicId);

  return {
    persona: {
      tutorId: /* derived slug */,
      name: persona.name,
      systemPrompt: persona.systemPrompt,
      language: locale,
    },
    curriculum: {
      trackId: module?.track ?? "python-fundamentals",
      moduleId: module?.id ?? "unknown",
      topicId,
      topicTitleHe: /* from topics[] */,
      moduleTitleHe: module?.title ?? "",
      tutorialSnippets: tutorial?.concepts.slice(0, 3),
    },
    question: { ...question, hintLevel, userAnswer },
    learner: learnerSnapshot,      // כבר חתוך ומנורמל
  };
}
```

### 11.5 Prompt Caching

- ה-system prompt (`persona.systemPrompt`) עולה במלואו כ-cache-point ראשון. גודל טיפוסי 600–900 טוקנים לפרסונה.
- ה-`curriculum` block (קבוע לנושא) עולה כ-cache-point שני. גודל טיפוסי 200–400 טוקנים.
- בלוק `question + learner` הוא החלק הדינמי. בקשות עוקבות עם אותו `topicId` מקבלות cache-hit על שני הבלוקים הראשונים.
- יעד cache hit rate: **≥ 85%** לסשן תרגול רציף באותו topic.

### 11.6 מה לא שייך ל-RAG

- **אסור** להזרים כל שיחה קודמת של התלמיד כ-context — תוכן השיחה מנוהל בצד הלקוח דרך `useTutorChat`.
- **אסור** להזרים את מאגר השאלות המלא — רק השאלה הנוכחית + מטה-דאטה.
- **אסור** להזרים מסמכים חיצוניים (PDFs, web pages) — המודל עובד רק עם תוכן מהקוריקולום הסטטי.

### 11.7 תאימות

- כל מדריך (פרסונה) חייב לקבל את אותו מבנה `RagContextPayload` — הפרסונה בלבד משתנה.
- בדיקת תאימות מכוסה ב-`src/features/curriculum/prompts/__tests__/tutorRegistry.test.ts` — היא מוודאת שכל slug של module מ-`src/data/modules.ts` ממופה לפרסונה הנכונה וש-`getTutorConfig` לא נופל ל-`pythonTutor` עבור OOP/DevOps.
