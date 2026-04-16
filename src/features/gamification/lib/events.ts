// Issue #148: Thin PostHog wrapper for gamification events.
//
// PostHog is initialized in src/lib/posthog.ts and identify()/reset() are
// handled by AuthContext; here we only capture domain events. The wrapper
// tolerates the "PostHog not initialized" case (no VITE_POSTHOG_KEY in dev)
// by checking `posthog.__loaded` before dispatching.

import posthog from "posthog-js";
import type { Milestone, XpReason } from "./constants";

type AnyProps = Record<string, unknown>;

function safeCapture(event: string, props?: AnyProps) {
  try {
    // posthog-js exposes __loaded after init(); when the key is missing we
    // never call init() and we want a silent no-op rather than a crash.
    if (!(posthog as unknown as { __loaded?: boolean }).__loaded) return;
    posthog.capture(event, props);
  } catch {
    // never let analytics break user flows
  }
}

export function trackXpAwarded(amount: number, reason: XpReason, props?: AnyProps) {
  safeCapture("xp_awarded", { amount, reason, ...props });
}

export function trackLevelUp(level: number, xp: number) {
  safeCapture("level_up", { level, xp });
}

export function trackStreakUpdated(currentStreak: number, longestStreak: number) {
  safeCapture("streak_updated", { current_streak: currentStreak, longest_streak: longestStreak });
}

export function trackMilestoneAchieved(milestone: Milestone) {
  safeCapture("milestone_achieved", { milestone });
}

export function trackOnboardingStep(step: string, props?: AnyProps) {
  safeCapture("onboarding_step", { step, ...props });
}

export function trackOnboardingCompleted(props?: AnyProps) {
  safeCapture("onboarding_completed", props);
}
