# Exam Prep Master — Product Vision & Rules

## What This App Is
A **Hebrew-only, RTL** exam preparation tool for the **"Introduction to Programming with Python" (מבוא לתכנות בפייתון)** course at the **Open University of Israel**.

The app helps students practice for their final exam by solving questions that match real exam patterns, tracking progress per topic, and simulating the actual exam experience.

## Single Flow
```
Onboarding (enter name) → Dashboard (progress overview) → Pick Topic → Practice Questions → Track Improvement
```

There is ONE way to practice: pick a topic, answer questions, see explanations. No duplicate pages, no alternate flows, no concept flashcards, no learning-vs-practice split.

### Pages (exhaustive list)
| Route | Page | Purpose |
|-------|------|---------|
| `/` | Onboarding | Enter name, one-time |
| `/dashboard` | Dashboard | Progress overview, topic grid, pick a topic |
| `/practice/:topicId` | Practice | Answer questions for a topic (ALL question types) |
| `/exam` | Exam Mode | Simulate real exam (6 questions, 3 hours) |
| `/progress` | Progress | Stats, exam history, review mistakes |
| `/review-mistakes` | Review Mistakes | Re-practice incorrect answers |

**No other pages.** Remove or consolidate: Topics, TopicPractice, TopicLearn, ConceptsPractice, ConceptsPracticePage, QuestionsPracticePage, FocusedPracticePage, AnalyticsPage, AdminPage.

## Course Syllabus — 8 Topics (in order)

| # | Topic ID | Hebrew Name | Key Concepts |
|---|----------|-------------|--------------|
| 1 | `variables_io` | משתנים, טיפוסים וקלט/פלט | int, float, str, bool, type(), input(), print(sep, end), type conversion |
| 2 | `arithmetic` | אריתמטיקה ואופרטורים | +, -, *, /, //, %, **, abs(), math.sqrt, math.ceil, math.floor, round() |
| 3 | `conditions` | תנאים | if, if-else, if-elif-else, nested, and, or, not, pass, comparison operators |
| 4 | `loops` | לולאות | for + range(), while, break, continue, nested loops, loop patterns |
| 5 | `functions` | פונקציות | def, parameters, return, default args, scope (local/global), recursion, import |
| 6 | `strings` | מחרוזות | len(), indexing, slicing, .upper(), .lower(), .find(), .replace(), .split(), .join(), in |
| 7 | `lists` | רשימות | indexing, slicing, .append(), .pop(), .sort(), .reverse(), list comprehensions, nested lists |
| 8 | `tuples_sets_dicts` | טאפלים, סטים ומילונים | tuple creation/access, set operations (union, intersection), dict creation/access/iteration, .keys(), .values(), .items() |

## Real Exam Format
- **6 questions**, 110 points total
- **3-hour duration**
- **Question types:**
  - **Tracing** (מעקב ביצוע): "What does `mystery([1,2,3,4,5])` return?" — student must trace code execution
  - **Coding** (כתיבת פונקציה): "Write a function `countDigits(text: str) -> int`" — student writes Python code
  - **Multiple choice** (רב-ברירה): "What is the output of this code?" with 4 options
  - **Fill-in-the-blank** (השלמה): Code with blanks `___` that student must fill
- **Heavy focus on**: loops + conditions + string/list manipulation + function writing
- **Exam patterns from real papers:**
  - `mystery1([1,2,3,4,5])` → trace list reversal
  - `mystery2('hello')` → trace string processing
  - `countDigits(text: str) -> int`
  - `calculateAverage(data: str) -> float` (parse `'Moshe:80,Anna:95,John:70'`)
  - `findLocalMaxima(nums: list[int]) -> list[int]`
  - `wordLengthDiff(sentence: str) -> int`

## Question Requirements

### Every question MUST have:
- `topic` — one of the 8 topic IDs above
- `type` — quiz | tracing | coding | fill-blank
- `difficulty` — easy | medium | hard
- `explanation` — **in Hebrew**, explaining WHY the answer is correct and common mistakes

### Tracing questions MUST:
- Include the actual code snippet (displayed in a code block)
- Show the expected output
- Have 4 plausible wrong options based on common mistakes

### Coding questions MUST:
- Include function signature and description
- Include sample input/output
- Include reference solution
- Include solution explanation in Hebrew

### Distribution targets:
- 15+ questions per topic (120+ total)
- Mix of types per topic: ~40% quiz, ~30% tracing, ~20% coding, ~10% fill-blank
- Difficulty: ~25% easy, ~45% medium, ~30% hard

## What NOT to Do

### Do NOT add:
- Social features (sharing, leaderboards, multiplayer)
- Gamification beyond basic XP/progress (no badges, no streaks, no achievements)
- AI chat/tutor/explanation generator (remove mock AI client)
- Concept flashcards or learning mode (practice IS learning)
- Admin panel (questions are managed in code/DB, not via UI)
- Analytics page with charts (progress page is sufficient)
- Multiple practice flows (no "focused practice", no "concept practice", no "learning mode")
- English text anywhere in the UI
- Features for other courses or programming languages

### Do NOT:
- Create duplicate pages that show the same data differently
- Add features without explicit user request
- Use mock/fake data — either use real data or remove the feature
- Add optional parameters, feature flags, or "just in case" abstractions
- Import libraries for single-use cases
- Add comments to code you didn't write

## Tech Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **State:** localStorage for progress (migrate to Supabase when ready)
- **Deployment:** Vercel
- **Language:** Hebrew only, RTL layout (`dir="rtl"` on root)

## File Structure Convention
```
src/
  data/questions.ts          — All question content (single source of truth)
  pages/                     — One file per route (6 pages max)
  components/                — Shared UI components
  features/
    progress/hooks/           — useProgress hook
    questions/components/     — QuizView, TracingView, CodingView, FillBlankView
  shared/
    integrations/supabase/   — Supabase client + types
    lib/                     — Utilities (grading, cn)
```

## Current Known Issues (to fix)
1. Practice page only renders quiz-type questions (skips tracing/coding/fill-blank)
2. Tracing questions don't display code snippet in some views
3. 3 missing topics: strings, functions, tuples/sets/dicts
4. variables/IO not split out as its own topic
5. Only 5 fill-blank questions exist (need 10+)
6. AnalyticsPage, ConceptsPracticePage, QuestionsPracticePage use mock data
7. FocusedPracticePage is unreachable
8. Multiple duplicate practice flows need consolidation
9. Supabase types.ts is empty (no generated types)
10. AI client returns mock responses
