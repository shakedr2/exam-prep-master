/**
 * Fetches all dashboard data that varies per user in a single Supabase RPC
 * call instead of firing separate queries for user_learning_progress and the
 * questions-per-topic count.
 *
 * Combines:
 *   • user_learning_progress  (concept indices completed per topic)
 *   • question count per topic (static aggregate, same for all users)
 *
 * Remote learning data is merged with the existing `learn_progress_<topicId>`
 * localStorage keys so guests and offline sessions remain correct.
 */

import { useEffect, useState } from "react";
import { supabase } from "@/shared/integrations/supabase/client";
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

export interface DashboardData {
  /** Completed concept indices per topic ID. */
  learnMap: Record<string, number[]>;
  /** Total question count per topic ID. */
  questionCounts: Record<string, number>;
  loading: boolean;
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();

  const [learnMap, setLearnMap] = useState<Record<string, number[]>>(loadAllLocal);
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Use the authenticated user id when available, otherwise the stable
    // anonymous UUID stored in localStorage.
    const userId = user?.id ?? getAnonUserId();

    async function fetchAll() {
      const { data, error } = await supabase.rpc("get_dashboard_data", {
        p_user_id: userId,
      });

      if (cancelled) return;

      if (error) {
        setLoading(false);
        return;
      }

      const result = data as {
        learning: Array<{ topic_id: string; concept_index: number }>;
        topic_counts: Record<string, number>;
      };

      // Merge remote learning progress with localStorage
      const remote: Record<string, number[]> = {};
      for (const row of result.learning ?? []) {
        if (!remote[row.topic_id]) remote[row.topic_id] = [];
        remote[row.topic_id].push(row.concept_index);
      }

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
      setQuestionCounts(result.topic_counts ?? {});
      setLoading(false);
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [user?.id]); // re-fetch when auth state changes (anon id is stable)

  return { learnMap, questionCounts, loading };
}
