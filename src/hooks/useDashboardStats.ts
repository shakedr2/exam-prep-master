/**
 * Issue #161: Reads precomputed dashboard stats from the `dashboard_stats`
 * table instead of aggregating all user_progress rows client-side.
 *
 * Only returns data for authenticated users. For guests the hook returns
 * `null` so callers can fall back to on-the-fly computation.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DashboardStats {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  totalPracticeTimeSeconds: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;
}

function dashboardStatsKey(userId: string | undefined) {
  return ["dashboard_stats", userId] as const;
}

export function useDashboardStats() {
  const { user } = useAuth();
  const userId = user?.id;

  const query = useQuery({
    queryKey: dashboardStatsKey(userId),
    enabled: !!userId,
    staleTime: 30_000,
    queryFn: async (): Promise<DashboardStats | null> => {
      if (!userId) return null;

      const { data, error } = await supabase.rpc("get_dashboard_stats", {
        p_user_id: userId,
      });

      if (error) {
        console.error("get_dashboard_stats failed:", error.message);
        return null;
      }

      const row = data as Record<string, unknown> | null;
      if (!row || Object.keys(row).length === 0) return null;

      return {
        totalQuestionsAnswered: (row.total_questions_answered as number) ?? 0,
        correctAnswers: (row.correct_answers as number) ?? 0,
        totalPracticeTimeSeconds: (row.total_practice_time_seconds as number) ?? 0,
        currentStreak: (row.current_streak as number) ?? 0,
        longestStreak: (row.longest_streak as number) ?? 0,
        lastActivityAt: (row.last_activity_at as string) ?? null,
      };
    },
  });

  return {
    stats: query.data ?? null,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}
