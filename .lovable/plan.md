

# הוספת שאלות חימום חסרות — כדי שכל שאלה תהיה עם 2-3 שאלות הכנה

## מצב נוכחי
כל השאלות כבר מכילות `warmupQuestions`, אבל חלקן מכילות רק שאלה אחת בודדת. שאלות עם חימום מלא (2-3 שאלות) מכינות טוב יותר למבחן.

## שינויים נדרשים

### קובץ: `src/data/questions.ts`
הוספת שאלות חימום נוספות לכל שאלה שמכילה רק 1 warmup. שאלות שצריכות הרחבה:

| שאלה | נושא | סוג | חימומים כרגע | יהיו |
|------|------|------|-------------|------|
| t1 | tracing | tracing | 1 | 3 |
| l1 | loops | tracing | 1 | 2 |
| li1 | lists | quiz | 1 | 2 |
| li2 | lists | quiz | 1 | 2 |
| c5 | conditions | quiz | 1 | 2 |
| l5 | loops | coding | 1 | 2 |
| t6 | tracing | tracing | 1 | 2 |
| c9 | conditions | quiz | 1 | 2 |
| li11 | lists | tracing | 1 | 2 |
| l7 | loops | coding | 1 | 2 |
| fb1 | math | fill-blank | 1 | 2 |
| fb2 | lists | fill-blank | 1 | 2 |
| fb4 | math | fill-blank | 1 | 2 |

כל שאלת חימום חדשה תהיה ממוקדת בקונספט ספציפי שנבדק בשאלה המלאה, ותכלול הסבר מפורט בשדה `explanation`.

