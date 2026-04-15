// Issue #148: Confetti + toast celebration for milestones and level-ups.
//
// Respects prefers-reduced-motion (falls back to a toast only). The
// canvas-confetti lib is already a dependency (it's used in
// ReviewMistakes.tsx) so this is just a thin helper that centralizes the
// visual so the rest of the app calls one function.

import confetti from "canvas-confetti";
import { toast } from "sonner";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function burst() {
  if (prefersReducedMotion()) return;

  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
  };
  const shoot = (originX: number) => {
    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: originX, y: 0.6 },
    });
  };
  shoot(0.25);
  shoot(0.5);
  shoot(0.75);
}

export function celebrateMilestone(title: string, description?: string) {
  burst();
  toast.success(title, {
    description,
    duration: 5000,
  });
}

export function celebrateLevelUp(level: number) {
  burst();
  toast.success(`עלית לרמה ${level}! 🎉`, {
    description: "המשך כך – התקדמות מעולה",
    duration: 5000,
  });
}

export function celebrateStreak(days: number) {
  burst();
  toast.success(`רצף של ${days} ימים! 🔥`, {
    description: "תרגול יומי הוא המפתח להצלחה",
    duration: 5000,
  });
}
