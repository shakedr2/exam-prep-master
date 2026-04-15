// Issue #148: Central constants for the gamification system.
//
// Keep these in sync with the `award_xp` SQL RPC (migration
// 20260415000002_gamification_xp_streaks.sql) — that RPC computes `level`
// server-side using the same XP_PER_LEVEL formula.

export const XP_PER_CORRECT_ANSWER = 10;
export const XP_PER_EXAM_COMPLETE = 50;
export const XP_PER_PERFECT_EXAM = 100;
export const XP_PER_DAILY_LOGIN = 5;
export const XP_PER_STREAK_DAY = 5;
export const XP_PER_LEVEL = 100;

export type XpReason =
  | "correct_answer"
  | "exam_complete"
  | "perfect_exam"
  | "daily_login"
  | "streak_bonus";

export type Milestone =
  | "first_exam"
  | "ten_correct"
  | "seven_day_streak"
  | "thirty_day_streak"
  | "first_perfect_exam"
  | "level_5"
  | "level_10";

export function xpToLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}
