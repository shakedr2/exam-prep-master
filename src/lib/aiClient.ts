export type AIExplanationResult = { explanation: string; tip?: string };

export async function getQuestionExplanation(
  questionText: string,
  choices: string[],
  correctIndex: number,
  userAnswerIndex?: number,
): Promise<AIExplanationResult> {
  // TODO: replace mock with OpenAI API call
  await new Promise<void>((resolve) => setTimeout(resolve, 800));
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

export async function generateSimilarQuestion(
  questionText: string,
  topic: string,
): Promise<string> {
  // TODO: replace mock with OpenAI API call
  await new Promise<void>((resolve) => setTimeout(resolve, 800));
  return `שאלה דומה בנושא "${topic}": שאלה זו דומה ל-"${questionText}". נסה לחשוב על מקרים נוספים בנושא זה.`;
}
