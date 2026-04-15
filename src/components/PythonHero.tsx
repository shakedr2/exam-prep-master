import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 140;

/**
 * PythonHero — Premium hero section for the Python dashboard.
 *
 * Phase 10.4 (Issue #146) upgrades:
 *   • Python two-color logo — top fang tinted snake green, bottom tinted
 *     Python yellow — to ground the brand identity.
 *   • Layered ambient glows (violet + snake green) add depth without
 *     feeling busy.
 *   • Subtle grid pattern overlay reinforces the "programming education"
 *     identity (mix-blend-overlay so it reads on any gradient).
 *   • Spring-eased scroll-shrink for a premium tactile feel.
 *
 * Features:
 *   • Inline SVG Python logo with glow-pulse animation
 *   • Gradient background (--hero-gradient-python, dark-mode aware)
 *   • Framer Motion entrance: fade-in + slide-up (0.6s, easeOut)
 *   • Scroll-shrink: collapses to a compact 60px sticky header on scroll
 *   • Mobile responsive (full-width, no horizontal overflow)
 *   • Reduced-motion: entrance skipped, scroll-shrink still works (CSS-only)
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
        "sticky top-14 z-10 -mx-4 w-[calc(100%+2rem)] overflow-hidden",
        "transition-all duration-300 ease-out",
        "rounded-b-[var(--radius-xl)] border-b border-white/10",
        isCompact ? "py-3 shadow-premium" : "py-8 sm:py-10 shadow-premium-xl"
      )}
      style={{
        background:
          "var(--hero-gradient-python, linear-gradient(135deg, #4B8BBE, #7c5cfc, #3DDC84))",
      }}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
    >
      {/* Grid pattern overlay — reinforces programming identity */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay bg-grid"
        style={{ color: "white" }}
        aria-hidden="true"
      />

      {/* Ambient glow orbs */}
      <div
        className="pointer-events-none absolute -top-16 right-8 h-40 w-40 rounded-full opacity-50 blur-3xl"
        style={{ background: "rgba(61, 220, 132, 0.45)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 left-8 h-32 w-32 rounded-full opacity-40 blur-3xl"
        style={{ background: "rgba(124, 92, 252, 0.5)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 flex items-center gap-4">
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
          <p
            className={cn(
              "font-mono text-[11px] tracking-wide text-white/70 transition-all duration-300",
              isCompact ? "hidden" : "mb-1"
            )}
            dir="ltr"
          >
            // track.python-fundamentals
          </p>
          <h2
            className={cn(
              "font-bold text-white transition-all duration-300",
              isCompact
                ? "text-lg leading-tight"
                : "text-[clamp(2rem,6vw,3rem)] leading-tight"
            )}
            style={{ letterSpacing: "-0.025em", fontWeight: 700 }}
          >
            יסודות פייתון
          </h2>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isCompact ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
            )}
          >
            <p className="text-white/80 text-sm sm:text-base mt-2">
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
 * Top fang: snake green → white gradient.
 * Bottom fang: Python yellow → white gradient.
 * Together they evoke the official Python mark while fitting the hero's
 * violet-leaning gradient background.
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
            <stop offset="100%" stopColor="#5FE89D" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient
            id="heroLogoBottom"
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="1"
          >
            <stop offset="0%" stopColor="#FFE873" stopOpacity="0.9" />
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
