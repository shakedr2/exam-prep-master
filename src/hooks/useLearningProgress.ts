import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAnonUserId } from "@/lib/anonUserId";

const STORAGE_PREFIX = "learn_progress_";

function loadLocal(topicId: string): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + topicId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocal(topicId: string, completed: number[]) {
  try {
    localStorage.setItem(STORAGE_PREFIX + topicId, JSON.stringify(completed));
  } catch {
    // storage unavailable
  }
}

export function useLearningProgress(topicId: string) {
  const { user } = useAuth();
  const userIdRef = useRef(user?.id ?? getAnonUserId());
  useEffect(() => {
    userIdRef.current = user?.id ?? getAnonUserId();
  }, [user]);

  const [completedConcepts, setCompletedConcepts] = useState<number[]>(() =>
    loadLocal(topicId)
  );
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      const { data, error } = await supabase
        .from("user_learning_progress")
        .select("concept_index")
        .eq("user_id", userIdRef.current)
        .eq("topic_id", topicId);

      if (cancelled) return;

      if (error) {
        // Fall back to localStorage (already loaded in initial state)
        setLoading(false);
        return;
      }

      const indices = (data ?? []).map((r) => r.concept_index);
      const local = loadLocal(topicId);
      const merged = Array.from(new Set([...local, ...indices])).sort(
        (a, b) => a - b
      );
      setCompletedConcepts(merged);
      saveLocal(topicId, merged);
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  const markConceptComplete = useCallback(
    async (conceptIndex: number) => {
      setCompletedConcepts((prev) => {
        if (prev.includes(conceptIndex)) return prev;
        const next = [...prev, conceptIndex].sort((a, b) => a - b);
        saveLocal(topicId, next);
        return next;
      });

      // Persist to Supabase (fire-and-forget, localStorage is the safety net)
      await supabase.from("user_learning_progress").upsert(
        {
          user_id: userIdRef.current,
          topic_id: topicId,
          concept_index: conceptIndex,
        },
        { onConflict: "user_id,topic_id,concept_index" }
      );
    },
    [topicId]
  );

  return { completedConcepts, markConceptComplete, loading };
}
