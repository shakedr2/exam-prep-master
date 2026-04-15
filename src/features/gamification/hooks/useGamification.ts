// Issue #148: Authoritative client hook for XP, streaks, and milestones.
//
// This hook wraps the server-side RPCs created in
// 20260415000002_gamification_xp_streaks.sql:
//   - award_xp(amount, reason, metadata)       → XP + level
//   - touch_streak()                           → daily streak bookkeeping
//   - claim_milestone(name)                    → idempotent gate for confetti
//
// Guests (no auth session) get a no-op fallback that still fires PostHog
// events and drives the local XP badge via useLocalProgress. The only
// thing guests lose is server persistence — which matches the app-wide
// "localStorage remains valid for guest state only" rule.

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  trackLevelUp,
  trackMilestoneAchieved,
  trackStreakUpdated,
  trackXpAwarded,
} from "../lib/events";
import {
  XP_PER_LEVEL,
  xpToLevel,
  type Milestone,
  type XpReason,
} from "../lib/constants";

interface XpState {
  xp: number;
  level: number;
  loading: boolean;
}

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  loading: boolean;
}

export interface AwardXpResult {
  xp: number;
  level: number;
  leveledUp: boolean;
}

export interface TouchStreakResult {
  currentStreak: number;
  longestStreak: number;
  incremented: boolean;
}

export function useGamification() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [xpState, setXpState] = useState<XpState>({ xp: 0, level: 1, loading: true });
  const [streakState, setStreakState] = useState<StreakState>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    loading: true,
  });
  const [milestones, setMilestones] = useState<Set<string>>(new Set());

  // --- initial load ---------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setXpState({ xp: 0, level: 1, loading: false });
      setStreakState({ currentStreak: 0, longestStreak: 0, lastActiveDate: null, loading: false });
      setMilestones(new Set());
      return;
    }

    (async () => {
      const [xpRes, streakRes, milestonesRes] = await Promise.all([
        supabase.from("user_xp").select("xp, level").eq("user_id", userId).maybeSingle(),
        supabase
          .from("user_streaks")
          .select("current_streak, longest_streak, last_active_date")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase.from("user_milestones").select("milestone").eq("user_id", userId),
      ]);

      if (cancelled) return;

      setXpState({
        xp: xpRes.data?.xp ?? 0,
        level: xpRes.data?.level ?? 1,
        loading: false,
      });
      setStreakState({
        currentStreak: streakRes.data?.current_streak ?? 0,
        longestStreak: streakRes.data?.longest_streak ?? 0,
        lastActiveDate: streakRes.data?.last_active_date ?? null,
        loading: false,
      });
      setMilestones(new Set((milestonesRes.data ?? []).map((m) => m.milestone)));
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // --- award XP -------------------------------------------------------------
  const awardXp = useCallback(
    async (
      amount: number,
      reason: XpReason,
      metadata: Record<string, unknown> = {}
    ): Promise<AwardXpResult | null> => {
      if (amount <= 0) return null;

      // Always emit analytics. PostHog events fire even for guests so
      // we can measure practice behavior pre-signup.
      trackXpAwarded(amount, reason, metadata);

      if (!userId) {
        // Guest: optimistically bump client state so the XP badge ticks.
        let next: AwardXpResult | null = null;
        setXpState((prev) => {
          const xp = prev.xp + amount;
          const level = xpToLevel(xp);
          const leveledUp = level > prev.level;
          next = { xp, level, leveledUp };
          if (leveledUp) trackLevelUp(level, xp);
          return { xp, level, loading: false };
        });
        return next;
      }

      const { data, error } = await supabase.rpc("award_xp", {
        p_amount: amount,
        p_reason: reason,
        p_metadata: metadata as never,
      });
      if (error || !data) {
        console.error("award_xp failed:", error);
        return null;
      }
      // supabase returns SETOF record → array
      const row = Array.isArray(data) ? data[0] : data;
      const result: AwardXpResult = {
        xp: row.xp,
        level: row.level,
        leveledUp: row.leveled_up,
      };
      setXpState({ xp: result.xp, level: result.level, loading: false });
      if (result.leveledUp) trackLevelUp(result.level, result.xp);
      return result;
    },
    [userId]
  );

  // --- touch streak ---------------------------------------------------------
  const touchStreak = useCallback(async (): Promise<TouchStreakResult | null> => {
    if (!userId) return null;
    const { data, error } = await supabase.rpc("touch_streak");
    if (error || !data) {
      console.error("touch_streak failed:", error);
      return null;
    }
    const row = Array.isArray(data) ? data[0] : data;
    const result: TouchStreakResult = {
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
      incremented: row.incremented,
    };
    setStreakState({
      currentStreak: result.currentStreak,
      longestStreak: result.longestStreak,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      loading: false,
    });
    if (result.incremented) {
      trackStreakUpdated(result.currentStreak, result.longestStreak);
    }
    return result;
  }, [userId]);

  // --- claim milestone (idempotent) ----------------------------------------
  const claimMilestone = useCallback(
    async (milestone: Milestone): Promise<boolean> => {
      // Local short-circuit: if we already know the user has it, skip the RPC.
      if (milestones.has(milestone)) return false;

      if (!userId) {
        // Guests: cache locally for this session only. First trigger wins
        // so the confetti doesn't fire twice on the same page.
        setMilestones((prev) => {
          if (prev.has(milestone)) return prev;
          const next = new Set(prev);
          next.add(milestone);
          return next;
        });
        trackMilestoneAchieved(milestone);
        return true;
      }

      const { data, error } = await supabase.rpc("claim_milestone", {
        p_milestone: milestone,
      });
      if (error) {
        console.error("claim_milestone failed:", error);
        return false;
      }
      const firstTime = data === true;
      if (firstTime) {
        setMilestones((prev) => {
          const next = new Set(prev);
          next.add(milestone);
          return next;
        });
        trackMilestoneAchieved(milestone);
      }
      return firstTime;
    },
    [userId, milestones]
  );

  return {
    // state
    xp: xpState.xp,
    level: xpState.level,
    xpIntoLevel: xpState.xp % XP_PER_LEVEL,
    xpLoading: xpState.loading,
    currentStreak: streakState.currentStreak,
    longestStreak: streakState.longestStreak,
    lastActiveDate: streakState.lastActiveDate,
    streakLoading: streakState.loading,
    milestones,
    // actions
    awardXp,
    touchStreak,
    claimMilestone,
  };
}
