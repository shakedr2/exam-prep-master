import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAnonUserId } from "@/lib/anonUserId";

// Shape consumed by `selectNextQuestion` in
// src/features/progress/lib/adaptiveSelection.ts — it only needs a map of
// question id -> { correct, attempts }. Anything else is ignored.
export interface AnsweredQuestionsMap {
  [questionId: string]: { correct: boolean; attempts: number };
}

export interface AnsweredQuestionsResult {
  answeredQuestions: AnsweredQuestionsMap;
  loading: boolean;
}

/**
 * Fetches the current learner's answered questions from Supabase (filtered
 * by topic when provided) and returns them in the shape expected by
 * `selectNextQuestion`. Uses the anonymous learner id when no auth user
 * is present.
 */
export function useSupabaseAnsweredQuestions(
  topicId?: string
): AnsweredQuestionsResult {
  const { user } = useAuth();
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestionsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const effectiveUserId = user?.id ?? getAnonUserId();

      let query = supabase
        .from("user_progress")
        .select("question_id, is_correct, attempts")
        .eq("user_id", effectiveUserId);
      if (topicId) {
        query = query.eq("topic_id", topicId);
      }

      const { data, error } = await query;
      if (cancelled) return;

      if (error) {
        console.error("useSupabaseAnsweredQuestions failed:", error.message);
        setAnsweredQuestions({});
        setLoading(false);
        return;
      }

      const map: AnsweredQuestionsMap = {};
      for (const row of data ?? []) {
        map[row.question_id] = {
          correct: row.is_correct,
          attempts: row.attempts ?? 1,
        };
      }
      setAnsweredQuestions(map);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, topicId]);

  return { answeredQuestions, loading };
}
