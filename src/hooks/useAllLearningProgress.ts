import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAnonUserId } from "@/lib/anonUserId";

const STORAGE_PREFIX = "learn_progress_";

function loadAllLocal(): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(STORAGE_PREFIX)) continue;
      const topicId = key.slice(STORAGE_PREFIX.length);
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) result[topicId] = parsed;
      } catch {
        // skip malformed entries
      }
    }
  } catch {
    // localStorage unavailable
  }
  return result;
}

/**
 * Fetches every `user_learning_progress` row for the current user in a single
 * query and returns a map from topic ID → completed concept indices.
 *
 * Remote data is merged with the existing `learn_progress_<topicId>`
 * localStorage keys (same surface as `useLearningProgress`) so that guests
 * and offline sessions still get correct values.
 *
 * The effect re-runs when authentication state changes so a newly
 * logged-in user sees their remote progress immediately.
 */
export function useAllLearningProgress(): {
  learnMap: Record<string, number[]>;
  loading: boolean;
} {
  const { user } = useAuth();
  const userIdRef = useRef(user?.id ?? getAnonUserId());
  useEffect(() => {
    userIdRef.current = user?.id ?? getAnonUserId();
  }, [user]);

  const [learnMap, setLearnMap] = useState<Record<string, number[]>>(() =>
    loadAllLocal()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const { data, error } = await supabase
        .from("user_learning_progress")
        .select("topic_id, concept_index")
        .eq("user_id", userIdRef.current);

      if (cancelled) return;

      if (error) {
        setLoading(false);
        return;
      }

      // Group remote rows by topic
      const remote: Record<string, number[]> = {};
      for (const row of data ?? []) {
        if (!remote[row.topic_id]) remote[row.topic_id] = [];
        remote[row.topic_id].push(row.concept_index);
      }

      // Merge remote with localStorage
      const local = loadAllLocal();
      const merged: Record<string, number[]> = { ...local };
      for (const [topicId, indices] of Object.entries(remote)) {
        const combined = Array.from(
          new Set([...(local[topicId] ?? []), ...indices])
        ).sort((a, b) => a - b);
        merged[topicId] = combined;
        try {
          localStorage.setItem(STORAGE_PREFIX + topicId, JSON.stringify(combined));
        } catch {
          // storage unavailable
        }
      }

      setLearnMap(merged);
      setLoading(false);
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [user?.id]); // re-fetch when auth state changes

  return { learnMap, loading };
}
