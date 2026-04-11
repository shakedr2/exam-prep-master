import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { shimmerAnimation } from "@/shared/lib/motion";

/**
 * Skeleton — Phase 10.3 upgrade.
 *
 * Renders a muted block with a shimmer sweep passing across it. The
 * sweep is a `motion.div` absolutely positioned inside the skeleton
 * block, animated with a linear `x: -100% → 100%` loop.
 *
 * Why `x` and not a CSS gradient `background-position`:
 *   • Framer Motion can run the loop on the compositor thread (GPU)
 *     so the sweep stays smooth even when the page is busy.
 *   • `overflow-hidden` on the outer block constrains the sweep so
 *     it looks the same in RTL and LTR — the axis is purely visual.
 *
 * Reduced-motion: when the user prefers reduced motion, we fall back
 * to the previous `animate-pulse` behavior which is an opacity-only
 * loop with no movement.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        className,
      )}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
        initial={shimmerAnimation.initial}
        animate={shimmerAnimation.animate}
        transition={shimmerAnimation.transition}
      />
    </div>
  );
}

export { Skeleton };
