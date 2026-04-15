import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonPressMotion } from "@/shared/lib/motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-background transition-[background,color,border-color,box-shadow,filter] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-primary-foreground shadow-[var(--shadow-sm)] hover:brightness-110 hover:shadow-[var(--shadow-md)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-sm)] hover:bg-destructive/90 hover:shadow-[var(--shadow-md)]",
        outline:
          "border border-[var(--border-color-strong)] bg-background/50 backdrop-blur-sm text-foreground hover:border-primary/40 hover:bg-foreground/[0.03] hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[var(--bg-surface-hover)]",
        ghost:
          "text-foreground hover:bg-foreground/[0.05] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        snake:
          "bg-gradient-to-r from-[var(--color-snake)] to-[var(--color-snake-light)] text-[#0a0b10] font-semibold shadow-[var(--shadow-sm)] hover:brightness-105 hover:shadow-[var(--glow-snake)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[var(--radius-md)] px-3",
        lg: "h-11 rounded-[var(--radius-md)] px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Button — shadcn primitive, extended in Phase 10.3 with a subtle
 * Framer Motion `whileTap` scale so every button press gets tactile
 * feedback.
 *
 * Behavior:
 *   • When `asChild` is false (the vast majority of call sites), the
 *     button renders as `motion.button` and applies the press scale.
 *   • When `asChild` is true, we fall back to the original Radix `Slot`
 *     so the parent element's semantics are preserved — `motion(Slot)`
 *     is intentionally avoided because Slot forwards refs in a way that
 *     doesn't round-trip cleanly through framer-motion's HOC.
 *   • Reduced-motion users never see the scale transform; the button
 *     still responds to the usual Tailwind hover/focus classes.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    // Framer Motion's prop surface for `motion.button` diverges from React's
    // native button props for a handful of legacy event names
    // (`onAnimationStart`, `onDrag*`, `onPan*`). Those collisions force a
    // double-cast through `unknown`; this is the same pattern shadcn uses in
    // its own motion wrappers.
    const motionProps = props as unknown as HTMLMotionProps<"button">;

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileTap={shouldReduceMotion ? undefined : buttonPressMotion.whileTap}
        transition={buttonPressMotion.transition}
        {...motionProps}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
