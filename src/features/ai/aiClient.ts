export type AIExplanationResult = { explanation: string; tip?: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const AI_EXPLAIN_ENDPOINT = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/ai-explain`
  : null;

function getMockExplanation(
  questionText: string,
  choices: string[],
  correctIndex: number,
  userAnswerIndex?: number,
): AIExplanationResult {
  const correct = choices[correctIndex];
  const userPart =
    userAnswerIndex !== undefined && userAnswerIndex !== correctIndex
      ? ` בחרת "${choices[userAnswerIndex]}" שהיא שגויה.`
      : "";
  return {
    explanation: `הסבר לשאלה: "${questionText}". התשובה הנכונה היא "${correct}".${userPart}`,
    tip: "טיפ: קרא את השאלה בעיון לפני בחירת תשובה.",
  };
}

function getMockSimilarQuestion(questionText: string, topic: string): string {
  return `שאלה דומה בנושא "${topic}": שאלה זו דומה ל-"${questionText}". נסה לחשוב על מקרים נוספים בנושא זה.`;
}

export async function getQuestionExplanation(
  questionText: string,
  choices: string[],
  correctIndex: number,
  userAnswerIndex?: number,
): Promise<AIExplanationResult> {
  if (!AI_EXPLAIN_ENDPOINT || !SUPABASE_KEY) {
    console.warn(
      "VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not set – falling back to mock AI response.",
    );
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    return getMockExplanation(questionText, choices, correctIndex, userAnswerIndex);
  }
  const res = await fetch(AI_EXPLAIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "apikey": SUPABASE_KEY,
    },
    body: JSON.stringify({
      questionText,
      choices,
      correctIndex,
      userAnswerIndex,
      type: "explain",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ai-explain error ${res.status}: ${text}`);
  }
  const data = (await res.json()) as { explanation: string; tip?: string };
  return { explanation: data.explanation, tip: data.tip };
}

export async function generateSimilarQuestion(
  questionText: string,
  topic: string,
): Promise<string> {
  if (!AI_EXPLAIN_ENDPOINT || !SUPABASE_KEY) {
    console.warn(
      "VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not set – falling back to mock AI response.",
    );
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    return getMockSimilarQuestion(questionText, topic);
  }
  const res = await fetch(AI_EXPLAIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "apikey": SUPABASE_KEY,
    },
    body: JSON.stringify({
      questionText,
      topic,
      type: "similar",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ai-explain error ${res.status}: ${text}`);
  }
  const data = (await res.json()) as { question: string };
  return data.question;
}
