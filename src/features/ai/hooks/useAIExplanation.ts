import { useState, useCallback } from "react";
import { getQuestionExplanation, type AIExplanationResult } from "@/features/ai/aiClient";

interface UseAIExplanationResult {
  explanation: AIExplanationResult | null;
  loading: boolean;
  error: string | null;
  fetchExplanation: (
    questionText: string,
    choices: string[],
    correctIndex: number,
    userAnswerIndex?: number
  ) => Promise<void>;
  reset: () => void;
}

export function useAIExplanation(): UseAIExplanationResult {
  const [explanation, setExplanation] = useState<AIExplanationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(
    async (
      questionText: string,
      choices: string[],
      correctIndex: number,
      userAnswerIndex?: number
    ) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getQuestionExplanation(
          questionText,
          choices,
          correctIndex,
          userAnswerIndex
        );
        setExplanation(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setExplanation(null);
    setError(null);
  }, []);

  return { explanation, loading, error, fetchExplanation, reset };
}
