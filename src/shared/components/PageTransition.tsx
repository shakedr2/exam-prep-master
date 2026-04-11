import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  pageTransition,
  pageTransitionVariants,
  reducedPageTransition,
  reducedPageTransitionVariants,
} from "@/shared/lib/motion";

/**
 * Wraps a route element in a motion.div that animates on mount/unmount.
 *
 * Used inside AnimatePresence (see App.tsx → AnimatedRoutes) to produce
 * fade+slide page transitions. Honors `prefers-reduced-motion` by falling
 * back to a no-op opacity swap (no transform, zero duration).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? reducedPageTransitionVariants
    : pageTransitionVariants;
  const transition = shouldReduceMotion ? reducedPageTransition : pageTransition;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      // min-h keeps short pages from collapsing during the exit animation
      // (prevents a visual "jump" from the Navbar + bottom-nav sandwich).
      className="min-h-[40vh]"
    >
      {children}
    </motion.div>
  );
}
