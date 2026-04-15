import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card — shadcn primitive with CSS-only hover/tap feedback for interactive
 * cards.  Interactive cards get `hover:-translate-y-0.5 active:scale-[0.99]`
 * via Tailwind; the shadow transition is handled by the `transition-all`
 * class already in `interactiveClasses`.
 *
 * Reduced-motion: CSS `@media (prefers-reduced-motion: reduce)` suppresses
 * the transform so purely decorative movement is automatically skipped
 * without any JS check.
 */

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, onClick, ...props }, ref) => {
    const isInteractive = interactive ?? typeof onClick === "function";

    const baseClasses =
      "rounded-xl border border-[var(--border-color)] bg-card text-card-foreground shadow-[var(--shadow-card)]";
    const interactiveClasses = isInteractive
      ? "transition-all duration-100 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
      : "";

    return (
      <div
        ref={ref}
        className={cn(baseClasses, interactiveClasses, className)}
        onClick={onClick}
        {...props}
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
