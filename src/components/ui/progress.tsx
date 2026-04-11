import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { progressFillTransition } from "@/shared/lib/motion";

/**
 * Progress — shadcn primitive, extended in Phase 10.3 so the indicator
 * fill animates when `value` changes.
 *
 * Implementation:
 *   • Radix still owns the Root + Indicator wrappers so accessibility
 *     (ARIA role, valuemin/max/now) keeps working unchanged.
 *   • The inner fill element is a motion.div that animates `x` between
 *     renders. We intentionally animate `x` rather than `width` because
 *     the original shadcn implementation uses translateX too — which
 *     means the visual position behaves identically for both LTR and
 *     RTL layouts.
 *   • `initial={false}` prevents a mount-time animation from 0 → value
 *     on pages that receive an already-computed number (the fill just
 *     appears at its target).
 *   • Reduced-motion users get a `duration: 0` transition, so updates
 *     snap instantly with no visible movement.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const shouldReduceMotion = useReducedMotion();
  const target = `-${100 - (value || 0)}%`;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild>
        <motion.div
          className="h-full w-full flex-1 bg-primary"
          initial={false}
          animate={{ x: target }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : progressFillTransition
          }
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
