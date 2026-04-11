/**
 * Motion primitives — Phase 10.3
 *
 * Shared Framer Motion variants, transitions, and helpers used by:
 *   • Page transitions (AnimatePresence wrapper in App.tsx)
 *   • Card hover / lift effects (ui/card.tsx)
 *   • Button press feedback (ui/button.tsx)
 *   • Progress bar fill (ui/progress.tsx)
 *   • Skeleton shimmer (ui/skeleton.tsx)
 *
 * Timing values are sourced from the design tokens
 * (`src/styles/tokens.ts → animation.duration / animation.easing`)
 * so Phase 10.1 remains the single source of truth. Framer Motion's
 * `transition` API expects seconds (numbers) and easing tuples, so this
 * file converts the token strings once at module load.
 *
 * All animations are direction-agnostic — they use `y`, `opacity`, and
 * `scale` rather than `x` — so RTL and LTR layouts behave identically.
 * Components that still rely on `x` must mirror per-direction themselves.
 *
 * Reduced-motion: consumers are expected to call `useReducedMotion()` from
 * framer-motion and pass the result into helpers here. When reduced motion
 * is active, helpers return no-op transitions so that the only user-visible
 * change is an instant state swap (no transforms, no opacity fades).
 */

import type { Transition, Variants } from "framer-motion";
import { animation } from "@/styles/tokens";

// ---------------------------------------------------------------------------
// Token → framer-motion conversions
// ---------------------------------------------------------------------------

/** Parse a CSS ms-suffixed duration ("200ms") into seconds (0.2). */
function msToSeconds(ms: string): number {
  return parseFloat(ms) / 1000;
}

/** Parse a `cubic-bezier(a, b, c, d)` string into the 4-tuple Framer expects. */
function parseCubicBezier(css: string): [number, number, number, number] {
  const match = css.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) return [0, 0, 0.2, 1]; // easeOut fallback
  const parts = match[1].split(",").map((s) => parseFloat(s.trim()));
  return [parts[0], parts[1], parts[2], parts[3]];
}

export const DURATION = {
  fast: msToSeconds(animation.duration.fast),     // 0.1s
  normal: msToSeconds(animation.duration.normal), // 0.2s
  slow: msToSeconds(animation.duration.slow),     // 0.4s
  slower: msToSeconds(animation.duration.slower), // 0.6s
} as const;

export const EASE = {
  easeIn: parseCubicBezier(animation.easing.easeIn),
  easeOut: parseCubicBezier(animation.easing.easeOut),
  easeInOut: parseCubicBezier(animation.easing.easeInOut),
  spring: parseCubicBezier(animation.easing.spring),
} as const;

// ---------------------------------------------------------------------------
// Page transitions — used by AnimatePresence in App.tsx
// ---------------------------------------------------------------------------

/**
 * Gentle fade + vertical slide used between route changes. Vertical (y)
 * instead of horizontal (x) keeps the motion identical in RTL and LTR and
 * avoids any clash with the fixed top Navbar / bottom nav.
 */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const pageTransition: Transition = {
  duration: DURATION.normal,
  ease: EASE.easeOut,
};

/** Reduced-motion fallback: instantly swap with no transform. */
export const reducedPageTransitionVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const reducedPageTransition: Transition = {
  duration: 0,
};

// ---------------------------------------------------------------------------
// Card hover / lift
// ---------------------------------------------------------------------------

/**
 * Subtle lift applied to interactive cards on hover. The shadow class is
 * handled via Tailwind (`hover:shadow-lg`) — this only owns the transform.
 */
export const cardHoverMotion = {
  whileHover: { y: -2 },
  whileTap: { y: 0, scale: 0.99 },
  transition: { duration: DURATION.fast, ease: EASE.easeOut },
} as const;

// ---------------------------------------------------------------------------
// Button press feedback
// ---------------------------------------------------------------------------

export const buttonPressMotion = {
  whileTap: { scale: 0.97 },
  transition: { duration: DURATION.fast, ease: EASE.easeOut },
} as const;

// ---------------------------------------------------------------------------
// Progress bar fill
// ---------------------------------------------------------------------------

/** Transition applied to the Radix Progress indicator when `value` changes. */
export const progressFillTransition: Transition = {
  duration: DURATION.slower, // 0.6s — long enough to feel, short enough to never block
  ease: EASE.easeOut,
};

// ---------------------------------------------------------------------------
// Skeleton shimmer
// ---------------------------------------------------------------------------

/**
 * Infinite shimmer sweep. Uses `x` transform, but because skeletons are
 * always a rectangular block with `overflow-hidden`, the sweep direction is
 * purely visual — it looks the same regardless of document direction.
 */
export const shimmerAnimation = {
  initial: { x: "-100%" },
  animate: { x: "100%" },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    duration: 1.6,
    ease: "linear",
  },
} as const;
