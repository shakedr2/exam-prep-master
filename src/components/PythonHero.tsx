import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 140;

/**
 * PythonHero — Premium hero section for the Python dashboard.
 *
 * Features:
 *   • Inline SVG Python logo with CSS glow-pulse animation
 *   • Gradient background from design tokens (--hero-gradient)
 *   • Framer Motion entrance: fade-in + slide-up (0.6s, easeOut)
 *   • Scroll-shrink: collapses to a compact 60px sticky header on scroll
 *   • Mobile responsive (full-width, no horizontal overflow)
 */
export function PythonHero() {
  const [isCompact, setIsCompact] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className={cn(
        "sticky top-14 z-10 -mx-4 w-[calc(100%+2rem)] overflow-hidden transition-all duration-300 ease-out",
        isCompact ? "py-3" : "py-8 sm:py-10"
      )}
      style={{
        background:
          "var(--hero-gradient, linear-gradient(135deg, #7c5cfc, #4c3acd, #1a1b2e))",
      }}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
    >
      <div className="mx-auto max-w-2xl px-6 flex items-center gap-4">
        {/* Python Logo SVG with glow pulse */}
        <div
          className={cn(
            "shrink-0 transition-all duration-300",
            isCompact ? "w-8 h-8" : "w-16 h-16 sm:w-20 sm:h-20"
          )}
        >
          <PythonLogoSVG />
        </div>

        <div className="flex-1 min-w-0">
          <h2
            className={cn(
              "font-bold text-white transition-all duration-300",
              isCompact
                ? "text-lg leading-tight"
                : "text-[clamp(2rem,6vw,3rem)] leading-tight"
            )}
            style={{ letterSpacing: "-0.02em", fontWeight: 700 }}
          >
            יסודות פייתון
          </h2>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isCompact ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
            )}
          >
            <p className="text-white/70 text-sm sm:text-base mt-2">
              8 מודולים · ~4 שעות · מתחילים
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Inline SVG of the Python two-snakes logo.
 * Uses white/light-purple gradients to match the hero's dark gradient BG.
 * The wrapper applies a glow-pulse CSS animation (defined in index.css).
 */
function PythonLogoSVG() {
  return (
    <div className="animate-glow-pulse">
      <svg
        viewBox="0 0 256 255"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Python"
      >
        <defs>
          <linearGradient id="heroLogoTop" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#c4b0ff" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient
            id="heroLogoBottom"
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="1"
          >
            <stop offset="0%" stopColor="#c4b0ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"
          fill="url(#heroLogoTop)"
        />
        <path
          d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.519 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"
          fill="url(#heroLogoBottom)"
        />
      </svg>
    </div>
  );
}
