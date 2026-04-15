import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * HeroFrame — Premium reusable hero component (Issue #146).
 *
 * A framed hero block with:
 *   • Subtle Python-themed gradient background
 *   • Optional grid / dot pattern overlay for visual identity
 *   • Optional glowing orbs for depth
 *   • Fade-up entrance (honors prefers-reduced-motion)
 *   • Flexible slot layout: eyebrow / title / subtitle / actions / media
 *
 * The frame works in RTL and LTR layouts identically — it uses only
 * vertical motion (y) for entrance, and its inner content is driven by
 * normal flow so `dir="rtl"` on the page root Just Works.
 *
 * Why a separate component vs. PythonHero:
 *   • PythonHero is opinionated about the Python track dashboard (sticky,
 *     scroll-shrink, snake-logo). HeroFrame is a neutral premium frame you
 *     can drop onto any landing/section — home page tracks, DevOps track,
 *     coming-soon placeholders, etc.
 */

export type HeroVariant = "python" | "violet" | "snake" | "minimal";

type HeroFrameProps = {
  variant?: HeroVariant;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
  /** Show a subtle grid pattern overlay (premium/technical feel). */
  pattern?: "grid" | "dots" | "none";
  className?: string;
  /** When true, reduces vertical padding — used for compact headers. */
  compact?: boolean;
};

const GRADIENT_MAP: Record<HeroVariant, string> = {
  python: "var(--hero-gradient-python)",
  violet: "var(--hero-gradient)",
  snake: "var(--hero-gradient-snake)",
  minimal: "transparent",
};

export function HeroFrame({
  variant = "python",
  eyebrow,
  title,
  subtitle,
  actions,
  media,
  pattern = "grid",
  className,
  compact = false,
}: HeroFrameProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMinimal = variant === "minimal";

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
      className={cn(
        "relative isolate overflow-hidden",
        "rounded-[var(--radius-2xl)] border",
        isMinimal
          ? "border-[var(--border-color)] bg-[var(--bg-surface)]"
          : "border-white/10",
        compact ? "px-6 py-8 sm:px-8 sm:py-10" : "px-6 py-10 sm:px-10 sm:py-14",
        className,
      )}
      style={{
        background: isMinimal ? undefined : GRADIENT_MAP[variant],
        boxShadow: isMinimal ? "var(--shadow-card)" : "var(--shadow-xl)",
      }}
    >
      {/* Pattern overlay — grid or dots, muted with mix-blend */}
      {pattern !== "none" && !isMinimal && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay",
            pattern === "grid" ? "bg-grid" : "bg-dots",
          )}
          style={{ color: "white" }}
          aria-hidden="true"
        />
      )}

      {/* Soft glow orbs — adds depth without being loud */}
      {!isMinimal && (
        <>
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{ background: "rgba(124, 92, 252, 0.5)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full opacity-30 blur-3xl"
            style={{ background: "rgba(61, 220, 132, 0.45)" }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content grid — 2 columns if media provided, otherwise single */}
      <div
        className={cn(
          "relative z-10 flex flex-col gap-8",
          media && "sm:flex-row sm:items-center sm:gap-10",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-4",
            media ? "flex-1 min-w-0" : "max-w-2xl",
          )}
        >
          {eyebrow && (
            <div
              className={cn(
                "font-mono text-xs tracking-wide",
                isMinimal ? "text-muted-foreground" : "text-white/70",
              )}
              dir="ltr"
            >
              {eyebrow}
            </div>
          )}

          <h1
            className={cn(
              "font-bold leading-tight tracking-tight",
              compact
                ? "text-2xl sm:text-3xl"
                : "text-[clamp(2rem,5vw,3rem)]",
              isMinimal ? "text-foreground" : "text-white",
            )}
            style={{ letterSpacing: "-0.025em" }}
          >
            {title}
          </h1>

          {subtitle && (
            <div
              className={cn(
                "text-sm leading-relaxed sm:text-base",
                isMinimal ? "text-muted-foreground" : "text-white/80",
              )}
            >
              {subtitle}
            </div>
          )}

          {actions && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {actions}
            </div>
          )}
        </div>

        {media && (
          <div className="relative shrink-0 sm:w-auto">{media}</div>
        )}
      </div>
    </motion.section>
  );
}
