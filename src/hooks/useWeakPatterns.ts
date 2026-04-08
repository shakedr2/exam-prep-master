import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAnonUserId } from "@/lib/anonUserId";

export interface PatternStat {
  patternFamily: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface WeakPatternsResult {
  weak: PatternStat[];       // accuracy < 60%
  inProgress: PatternStat[]; // 60% <= accuracy <= 85%
  mastered: PatternStat[];   // accuracy > 85%
  loading: boolean;
  refetch: () => void;
}

/**
 * Reads user_progress rows for the current user, groups by pattern_family,
 * and categorises each pattern as weak / in-progress / mastered.
 *
 * Only patterns with at least 2 attempts are included (same threshold as
 * selectNextQuestion / adaptiveSelection.ts).
 */
export function useWeakPatterns(): WeakPatternsResult {
  const { user } = useAuth();
  const [weak, setWeak] = useState<PatternStat[]>([]);
  const [inProgress, setInProgress] = useState<PatternStat[]>([]);
  const [mastered, setMastered] = useState<PatternStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatterns = useCallback(async () => {
    setLoading(true);
    const effectiveUserId = user?.id ?? getAnonUserId();

    const { data, error } = await supabase
      .from("user_progress")
      .select("pattern_family, is_correct")
      .eq("user_id", effectiveUserId)
      .not("pattern_family", "is", null);

    if (error) {
      console.error("useWeakPatterns fetch failed:", error.message);
      setLoading(false);
      return;
    }

    const agg: Record<string, { total: number; correct: number }> = {};
    for (const row of data ?? []) {
      const pf = row.pattern_family as string;
      if (!agg[pf]) agg[pf] = { total: 0, correct: 0 };
      agg[pf].total += 1;
      if (row.is_correct) agg[pf].correct += 1;
    }

    const weakList: PatternStat[] = [];
    const inProgressList: PatternStat[] = [];
    const masteredList: PatternStat[] = [];

    for (const [patternFamily, s] of Object.entries(agg)) {
      if (s.total < 2) continue;
      const accuracy = Math.round((s.correct / s.total) * 100);
      const stat: PatternStat = { patternFamily, total: s.total, correct: s.correct, accuracy };
      if (accuracy < 60) {
        weakList.push(stat);
      } else if (accuracy > 85) {
        masteredList.push(stat);
      } else {
        inProgressList.push(stat);
      }
    }

    // Sort weak first by lowest accuracy, mastered by highest
    weakList.sort((a, b) => a.accuracy - b.accuracy);
    inProgressList.sort((a, b) => a.accuracy - b.accuracy);
    masteredList.sort((a, b) => b.accuracy - a.accuracy);

    setWeak(weakList);
    setInProgress(inProgressList);
    setMastered(masteredList);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPatterns();
  }, [fetchPatterns]);

  return { weak, inProgress, mastered, loading, refetch: fetchPatterns };
}
