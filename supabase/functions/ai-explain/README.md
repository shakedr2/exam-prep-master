# ai-explain Edge Function

This Supabase Edge Function provides AI-powered explanations and similar question generation for the exam prep app, using the OpenAI API.

## What it does

- **type: 'explain'** – Given a multiple-choice question, its answer choices, the correct answer index, and optionally the user's (wrong) answer index, it returns a Hebrew explanation of why the correct answer is right and a memory tip.
- **type: 'similar'** – Given a question and its topic, it generates a new, similar multiple-choice question in Hebrew on the same topic.

### Request format

`POST /functions/v1/ai-explain`

Headers:
```
Content-Type: application/json
Authorization: Bearer <SUPABASE_ANON_KEY>
```

Body:
```json
{
  "questionText": "מה יודפס?",
  "choices": ["1", "2", "3", "4"],
  "correctIndex": 0,
  "userAnswerIndex": 2,
  "topic": "לולאות",
  "type": "explain"
}
```

### Response format

For `type: 'explain'`:
```json
{ "explanation": "...", "tip": "..." }
```

For `type: 'similar'`:
```json
{ "question": "..." }
```

## How to deploy

```bash
npx supabase functions deploy ai-explain
```

## How to set the OpenAI secret

```bash
npx supabase secrets set OPENAI_API_KEY=sk-...
```

## How to test locally

```bash
npx supabase functions serve ai-explain
```

Then send a test request:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/ai-explain' \
  --header 'Content-Type: application/json' \
  --data '{
    "questionText": "מה יודפס הקוד הבא?",
    "choices": ["0", "1", "2", "שגיאה"],
    "correctIndex": 1,
    "topic": "לולאות",
    "type": "explain"
  }'
```
