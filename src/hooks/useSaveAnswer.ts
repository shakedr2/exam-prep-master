import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useSaveAnswer() {
  const { user } = useAuth();

  const saveAnswer = useCallback(
    async (questionId: string, topicId: string, isCorrect: boolean) => {
      if (!user) return;

      // Upsert: when a user re-answers the same question, update the existing
      // record with the new result and timestamp (unique on user_id + question_id)
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          question_id: questionId,
          topic_id: topicId,
          is_correct: isCorrect,
          answered_at: new Date().toISOString(),
        },
        { onConflict: "user_id,question_id" }
      );

      if (error) {
        console.error("Failed to save answer:", error.message);
      }
    },
    [user]
  );

  return { saveAnswer, isAuthenticated: !!user };
}
