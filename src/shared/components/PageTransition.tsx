import type { ReactNode } from "react";

/**
 * Wraps a route element in a div with a CSS entrance animation.
 *
 * The `.animate-page-enter` class (defined in index.css) produces a gentle
 * fade + slide-up on mount.  It honours `prefers-reduced-motion` via an
 * `@media` rule in the same stylesheet — no JS needed.
 *
 * Exit animations are intentionally omitted: they required framer-motion's
 * `AnimatePresence` and added ~50 kB to every route's bundle.  The instant
 * swap on navigation is imperceptible at normal interaction speeds.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="animate-page-enter min-h-[40vh]">
      {children}
    </div>
  );
}
