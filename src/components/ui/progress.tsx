import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

/**
 * Progress — shadcn primitive with CSS `transition-transform` for the
 * indicator fill.
 *
 * The translateX value is computed from `value` and applied via an inline
 * style so the Radix indicator stays as the accessible wrapper.
 * `transition-transform duration-[600ms] ease-out` matches the timing
 * previously provided by framer-motion's `progressFillTransition`.
 *
 * Reduced-motion: Tailwind's `motion-reduce:transition-none` utility
 * instantly snaps the fill without any movement.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const target = `-${100 - (value || 0)}%`;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.4)] transition-transform duration-[600ms] ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(${target})` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
