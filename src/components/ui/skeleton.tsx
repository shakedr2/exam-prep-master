import { cn } from "@/lib/utils";

/**
 * Skeleton — shimmer sweep via CSS `@keyframes shimmer` (see index.css).
 *
 * The sweep is a `div` absolutely positioned inside the skeleton block,
 * animated with a linear `translateX(-100% → 100%)` loop entirely on the
 * compositor thread.  `overflow-hidden` on the outer block constrains the
 * sweep so it looks the same in RTL and LTR.
 *
 * Reduced-motion: the `.animate-shimmer` class is suppressed by an
 * `@media (prefers-reduced-motion: reduce)` rule in index.css, and the
 * outer block falls back to `animate-pulse` (opacity-only loop).
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted animate-pulse",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
      />
    </div>
  );
}

export { Skeleton };
