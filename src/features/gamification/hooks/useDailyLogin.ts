// Issue #148: Side-effect hook that runs once per mount when the user
// lands on the dashboard. It:
//   1. Bumps the daily streak (touch_streak RPC, idempotent within 24h)
//   2. Awards daily login XP (once per UTC day, gated in localStorage to
//      avoid double-awarding on page refresh)
//   3. Fires celebrations for milestone streak values (7, 30)
//
// Keeping this in a hook (not inside useGamification) means the XP/streak
// state for the hook itself stays pure state — and only the dashboard
// opts in to the side effects.

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "./useGamification";
import { XP_PER_DAILY_LOGIN } from "../lib/constants";
import {
  celebrateLevelUp,
  celebrateMilestone,
  celebrateStreak,
} from "../components/Celebration";

const LAST_LOGIN_KEY = "examprep_last_login_utc";

function todayUtcISO() {
  return new Date().toISOString().slice(0, 10);
}

export function useDailyLogin() {
  const { user, loading } = useAuth();
  const { awardXp, touchStreak, claimMilestone } = useGamification();
  const ran = useRef(false);

  useEffect(() => {
    if (loading || !user || ran.current) return;
    ran.current = true;

    (async () => {
      const today = todayUtcISO();
      const last = localStorage.getItem(LAST_LOGIN_KEY);
      const isNewDay = last !== today;

      // Tick the streak (idempotent within the same UTC day server-side)
      const streakResult = await touchStreak();

      if (isNewDay) {
        localStorage.setItem(LAST_LOGIN_KEY, today);

        const xpResult = await awardXp(XP_PER_DAILY_LOGIN, "daily_login", {
          date: today,
        });
        if (xpResult?.leveledUp) {
          celebrateLevelUp(xpResult.level);
        }

        // Celebrate streak milestones the first time they're hit.
        if (streakResult?.incremented) {
          if (streakResult.currentStreak === 7) {
            const firstTime = await claimMilestone("seven_day_streak");
            if (firstTime) celebrateStreak(7);
          } else if (streakResult.currentStreak === 30) {
            const firstTime = await claimMilestone("thirty_day_streak");
            if (firstTime) {
              celebrateMilestone(
                "30 ימים ברצף! 🏆",
                "הישג מרשים — ממשיכים חזק"
              );
            }
          }
        }
      }
    })();
  }, [user, loading, awardXp, touchStreak, claimMilestone]);
}
