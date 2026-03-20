# AI Integration Guide

## ⚠️ Security Warning

**Never expose your OpenAI API key in the browser.** The `VITE_` prefix makes environment variables available in the client bundle, where they can be extracted by anyone who visits your site. See the [Supabase Edge Function proxy recommendation](#️-security-recommendation-use-a-supabase-edge-function-as-a-proxy) at the bottom of this document before going to production.

---

## What is `aiClient.ts`?

**Location:** `src/lib/aiClient.ts`

The `aiClient.ts` module provides a typed AI service layer for the exam-prep app. It exposes two async functions and one exported type:

### Exported Type

```typescript
export type AIExplanationResult = { explanation: string; tip?: string };
```

### Exported Functions

#### `getQuestionExplanation`

```typescript
getQuestionExplanation(
  questionText: string,
  choices: string[],
  correctIndex: number,
  userAnswerIndex?: number,
): Promise<AIExplanationResult>
```

Returns an explanation for the given question along with an optional study tip. If `userAnswerIndex` is provided and is incorrect, the explanation also notes the wrong choice.

#### `generateSimilarQuestion`

```typescript
generateSimilarQuestion(
  questionText: string,
  topic: string,
): Promise<string>
```

Generates a new question that is similar to the provided question text, within the same topic.

---

## Current Behaviour (Mock)

Both functions currently return **mock strings** after an **800 ms simulated delay**. They are marked with `// TODO: replace mock with OpenAI API call` comments.

---

## Replacing the Mock with Real OpenAI API Calls

### 1. Set the Environment Variable

Add the following to your `.env` file (never commit this file):

```
VITE_OPENAI_API_KEY=sk-...
```

### 2. Replace the Mock Implementation

The OpenAI Chat Completions endpoint to call:

```
POST https://api.openai.com/v1/chat/completions
```

Recommended model: **`gpt-4o-mini`** (fast and cost-effective).

> **Note:** Always validate and sanitize any user-supplied data before including it in AI prompts to prevent prompt injection attacks. Avoid forwarding raw user input directly into system prompts without escaping or limiting it.

Example fetch call to replace a mock:

```typescript
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful Python programming tutor. Reply in Hebrew.",
      },
      {
        role: "user",
        content: `Explain the following question: "${questionText}"`,
      },
    ],
  }),
});
const data = await response.json();
const text: string = data.choices[0].message.content;
```

---

## ⚠️ Security Recommendation: Use a Supabase Edge Function as a Proxy

**Never expose your OpenAI API key in the browser.** The `VITE_` prefix makes environment variables available in the client bundle, where they can be extracted by anyone who visits your site.

Instead, use a **Supabase Edge Function** as a secure server-side proxy:

1. Create a Supabase Edge Function (e.g., `supabase/functions/ai-proxy/index.ts`) that:
   - Receives the question data from the client
   - Calls the OpenAI API using the secret stored as a Supabase secret
   - Returns the AI response to the client

2. Store the key securely:

   ```bash
   supabase secrets set OPENAI_API_KEY=sk-...
   ```

3. Update `aiClient.ts` to call your Edge Function URL instead of the OpenAI API directly:

   ```typescript
   const { data, error } = await supabase.functions.invoke("ai-proxy", {
     body: { questionText, choices, correctIndex, userAnswerIndex },
   });
   ```

This approach keeps the API key on the server and protects you from unauthorized usage and cost overruns.
