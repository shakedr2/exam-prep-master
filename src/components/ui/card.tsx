import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";
import { cardHoverMotion } from "@/shared/lib/motion";

/**
 * Card — shadcn primitive, extended in Phase 10.3 to support a subtle
 * Framer Motion hover lift + tap nudge.
 *
 * Behavior:
 *   • When the caller passes `onClick` (or the new `interactive` prop),
 *     the card becomes a motion.div that lifts on hover and eases back
 *     on tap. A tailwind shadow transition is added so the hover shadow
 *     fades smoothly alongside the lift.
 *   • When reduced-motion is enabled, the lift + tap are disabled but
 *     the shadow transition stays — it's purely a color change, not a
 *     movement.
 *   • Purely decorative (non-interactive) cards render an unchanged
 *     <div> so no existing consumers see a layout diff.
 *
 * The `interactive` prop is explicit so callers can opt-in even when
 * they don't hook up an onClick (e.g. when the whole card is wrapped
 * in a <Link>).
 */

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, onClick, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    const isInteractive = interactive ?? typeof onClick === "function";

    const baseClasses =
      "rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-card text-card-foreground shadow-[var(--shadow-card)] transition-[box-shadow,border-color,background-color] duration-200 ease-out";
    const interactiveClasses = isInteractive
      ? "cursor-pointer hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--border-color-strong)]"
      : "";

    if (!isInteractive) {
      return (
        <div
          ref={ref}
          className={cn(baseClasses, className)}
          onClick={onClick}
          {...props}
        />
      );
    }

    // Framer Motion's prop surface for `motion.div` diverges from React's
    // native div props for a handful of legacy event names
    // (`onAnimationStart`, `onDrag*`, `onPan*`). Those collisions force a
    // double-cast through `unknown`; otherwise TS refuses the assignment
    // even though every runtime prop we care about (id, className, data-*,
    // aria-*, onClick) is structurally compatible.
    const motionProps = props as unknown as HTMLMotionProps<"div">;

    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        className={cn(baseClasses, interactiveClasses, className)}
        whileHover={shouldReduceMotion ? undefined : cardHoverMotion.whileHover}
        whileTap={shouldReduceMotion ? undefined : cardHoverMotion.whileTap}
        transition={cardHoverMotion.transition}
        {...motionProps}
      />
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
