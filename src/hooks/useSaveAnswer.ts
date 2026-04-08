import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAnonUserId } from "@/lib/anonUserId";

// Offline queue for answers that couldn't reach Supabase. Persisted in
// localStorage so a reload won't lose data. Flushed on the next successful
// save attempt.
interface PendingAnswer {
  questionId: string;
  topicId: string;
  isCorrect: boolean;
  at: string;
}
const PENDING_KEY = "examprep_pending_answers";

function loadPending(): PendingAnswer[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PendingAnswer[]) : [];
  } catch {
    return [];
  }
}

function savePending(q: PendingAnswer[]) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(q));
  } catch {
    // storage full / unavailable — drop silently
  }
}

async function upsertAnswer(
  userId: string,
  questionId: string,
  topicId: string,
  isCorrect: boolean,
  at: string
): Promise<boolean> {
  // Read existing row to compute the new attempts count. The table has a
  // unique constraint on (user_id, question_id); once we know the current
  // attempts we upsert with the new value.
  const { data: existing, error: readError } = await supabase
    .from("user_progress")
    .select("attempts")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (readError) {
    console.error("user_progress read failed:", readError.message);
    return false;
  }

  const nextAttempts = (existing?.attempts ?? 0) + 1;

  const { error: upsertError } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      question_id: questionId,
      topic_id: topicId,
      is_correct: isCorrect,
      answered_at: at,
      attempts: nextAttempts,
      last_attempted_at: at,
    },
    { onConflict: "user_id,question_id" }
  );

  if (upsertError) {
    console.error("user_progress upsert failed:", upsertError.message);
    return false;
  }
  return true;
}

export function useSaveAnswer() {
  const { user } = useAuth();
  // Prefer real user id when auth is present; otherwise use the anon id.
  const userIdRef = useRef<string>(user?.id ?? getAnonUserId());
  useEffect(() => {
    userIdRef.current = user?.id ?? getAnonUserId();
  }, [user]);

  const flushPending = useCallback(async () => {
    const queue = loadPending();
    if (queue.length === 0) return;
    const remaining: PendingAnswer[] = [];
    for (const item of queue) {
      const ok = await upsertAnswer(
        userIdRef.current,
        item.questionId,
        item.topicId,
        item.isCorrect,
        item.at
      );
      if (!ok) remaining.push(item);
    }
    savePending(remaining);
  }, []);

  const saveAnswer = useCallback(
    async (questionId: string, topicId: string, isCorrect: boolean) => {
      const at = new Date().toISOString();

      // Try to flush any previously-queued answers first.
      await flushPending();

      const ok = await upsertAnswer(
        userIdRef.current,
        questionId,
        topicId,
        isCorrect,
        at
      );
      if (!ok) {
        const queue = loadPending();
        queue.push({ questionId, topicId, isCorrect, at });
        savePending(queue);
      }
    },
    [flushPending]
  );

  return { saveAnswer, isAuthenticated: !!user };
}
