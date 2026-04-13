/**
 * Design Tokens — Exam Prep Master
 *
 * Single source of truth for all design decisions.
 * These values drive both the CSS custom properties in index.css
 * and the Tailwind config extension.
 *
 * Format: HSL components (H S% L%) — consumed by Tailwind as `hsl(var(--token))`
 */

// ---------------------------------------------------------------------------
// Color Palette — raw HSL component strings (no "hsl()" wrapper)
// ---------------------------------------------------------------------------

export const colorPalette = {
  // Primary — purple/violet, used for interactive elements
  primary: {
    light: "258 72% 58%",  // hsl(258, 72%, 58%) — #6d4cdc light mode
    dark:  "252 96% 67%",  // hsl(252, 96%, 67%) — #7c5cfc dark mode
    foreground: "0 0% 100%",
  },

  // Secondary — neutral gray
  secondary: {
    light: "240 6% 93%",
    dark:  "238 26% 18%",
    foreground: {
      light: "240 28% 14%",
      dark:  "240 20% 95%",
    },
  },

  // Accent — teal/emerald, used for highlights and secondary actions
  accent: {
    light: "164 58% 45%",
    dark:  "164 66% 50%",
    foreground: "0 0% 100%",
  },

  // Background surfaces
  background: {
    light: "0 0% 98%",      // #fafafa
    dark:  "240 12% 7%",    // #0f0f13
  },
  foreground: {
    light: "240 28% 14%",   // #1a1a2e
    dark:  "240 20% 95%",   // #f0f0f5
  },
  card: {
    light: "0 0% 100%",     // #ffffff
    dark:  "237 28% 14%",   // #1a1b2e
    foreground: {
      light: "240 28% 14%",
      dark:  "240 20% 95%",
    },
  },
  popover: {
    light: "0 0% 100%",
    dark:  "237 28% 14%",
    foreground: {
      light: "240 28% 14%",
      dark:  "240 20% 95%",
    },
  },

  // Muted — subtle backgrounds for non-interactive regions
  muted: {
    light: "240 6% 95%",
    dark:  "238 26% 18%",    // #22233a
    foreground: {
      light: "237 11% 37%", // #55566a
      dark:  "240 9% 58%",  // #8b8b9e
    },
  },

  // Semantic status colors
  destructive: {
    light: "0 84% 60%",     // #ef4444
    dark:  "0 84% 60%",
    foreground: "0 0% 100%",
  },
  success: {
    light: "164 58% 45%",   // #2dd4a8-ish
    dark:  "164 66% 50%",   // #2dd4a8
    foreground: "0 0% 100%",
  },
  warning: {
    light: "38 92% 50%",    // #f59e0b
    dark:  "38 92% 50%",
    foreground: {
      light: "0 0% 100%",
      dark:  "0 0% 10%",
    },
  },

  // XP / gamification gold
  xp: {
    light: "45 93% 47%",
    dark:  "45 93% 55%",
    foreground: "0 0% 10%",
  },

  // Borders & inputs
  border: {
    light: "240 6% 90%",
    dark:  "237 15% 20%",
  },
  input: {
    light: "240 6% 90%",
    dark:  "237 15% 20%",
  },
  ring: {
    light: "258 72% 58%",
    dark:  "252 96% 67%",
  },

  // Sidebar
  sidebar: {
    background: {
      light: "0 0% 98%",
      dark:  "237 28% 10%",
    },
    foreground: {
      light: "240 5.3% 26.1%",
      dark:  "240 20% 95%",
    },
    primary: {
      light: "240 5.9% 10%",
      dark:  "252 96% 67%",
      foreground: {
        light: "0 0% 98%",
        dark:  "0 0% 100%",
      },
    },
    accent: {
      light: "240 4.8% 95.9%",
      dark:  "238 26% 16%",
      foreground: {
        light: "240 5.9% 10%",
        dark:  "240 20% 95%",
      },
    },
    border: {
      light: "240 6% 91%",
      dark:  "237 15% 18%",
    },
    ring: {
      light: "258 72% 58%",
      dark:  "252 96% 67%",
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Gradient definitions (used in index.css @layer utilities)
// ---------------------------------------------------------------------------

export const gradients = {
  primary:  "linear-gradient(135deg, hsl(252 96% 67%), hsl(280 80% 55%))",
  accent:   "linear-gradient(135deg, hsl(164 66% 50%), hsl(180 70% 50%))",
  xp:       "linear-gradient(135deg, hsl(38 92% 50%), hsl(45 93% 55%))",
  success:  "linear-gradient(135deg, hsl(164 66% 50%), hsl(160 72% 50%))",
  streak:   "linear-gradient(135deg, hsl(38 92% 50%), hsl(45 93% 55%), hsl(164 66% 50%))",
} as const;

// ---------------------------------------------------------------------------
// Syntax-highlight token classes (used only in PythonCodeBlock).
// These are Tailwind class name strings, not raw color values.
// ---------------------------------------------------------------------------

export const syntaxClasses = {
  keyword:  { light: "text-purple-700", dark: "dark:text-purple-400" },
  builtin:  { light: "text-cyan-700",   dark: "dark:text-cyan-400" },
  string:   { light: "text-emerald-700",dark: "dark:text-emerald-400" },
  number:   { light: "text-amber-700",  dark: "dark:text-amber-400" },
  comment:  { light: "text-slate-500",  dark: "" },
  operator: { light: "text-pink-700",   dark: "dark:text-pink-400" },
  function: { light: "text-yellow-700", dark: "dark:text-yellow-300" },
  param:    { light: "text-orange-700", dark: "dark:text-orange-300" },
  text:     { light: "text-slate-800",  dark: "dark:text-slate-200" },
} as const;

// ---------------------------------------------------------------------------
// Typography scale
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: {
    sans: ["Heebo", "sans-serif"],
    mono: ["JetBrains Mono", "monospace"],
  },

  // Font size scale (rem) — maps to Tailwind's text-* utilities
  fontSize: {
    "2xs": ["0.625rem", { lineHeight: "0.875rem" }],  // 10px
    xs:    ["0.75rem",  { lineHeight: "1rem" }],       // 12px
    sm:    ["0.875rem", { lineHeight: "1.25rem" }],    // 14px
    base:  ["1rem",     { lineHeight: "1.5rem" }],     // 16px
    lg:    ["1.125rem", { lineHeight: "1.75rem" }],    // 18px
    xl:    ["1.25rem",  { lineHeight: "1.75rem" }],    // 20px
    "2xl": ["1.5rem",   { lineHeight: "2rem" }],       // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],    // 30px
    "4xl": ["2.25rem",  { lineHeight: "2.5rem" }],     // 36px
    "5xl": ["3rem",     { lineHeight: "1" }],          // 48px
  },

  fontWeight: {
    light:    "300",
    normal:   "400",
    medium:   "500",
    semibold: "600",
    bold:     "700",
    extrabold: "800",
    black:    "900",
  },

  lineHeight: {
    none:    "1",
    tight:   "1.25",
    snug:    "1.375",
    normal:  "1.5",
    relaxed: "1.625",
    loose:   "2",
  },
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------

export const borderRadius = {
  none: "0",
  sm:   "max(0px, calc(var(--radius) - 4px))",  // 0px with default --radius of 0.25rem; max() prevents negative values
  md:   "calc(var(--radius) - 2px)",  // 2px
  DEFAULT: "var(--radius)",           // 4px (0.25rem)
  lg:   "var(--radius)",              // same as default; alias
  xl:   "calc(var(--radius) + 4px)",  // 8px
  "2xl":"calc(var(--radius) + 8px)",  // 12px
  "3xl":"calc(var(--radius) + 12px)", // 16px
  full: "9999px",
} as const;

// ---------------------------------------------------------------------------
// Box shadows
// ---------------------------------------------------------------------------

export const shadows = {
  none: "none",
  xs:   "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm:   "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  DEFAULT:"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  md:   "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg:   "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl:   "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl":"0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner:"inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  // Glow variants for interactive states
  "glow-primary": "0 0 20px hsl(252 96% 67% / 0.35)",
  "glow-accent":  "0 0 20px hsl(164 66% 50% / 0.35)",
  "glow-xp":      "0 0 20px hsl(45 93% 47% / 0.35)",
} as const;

// ---------------------------------------------------------------------------
// Animation durations & easings
// ---------------------------------------------------------------------------

export const animation = {
  duration: {
    instant: "0ms",
    fast:    "100ms",
    normal:  "200ms",
    slow:    "400ms",
    slower:  "600ms",
    slowest: "1000ms",
  },

  easing: {
    linear:   "linear",
    easeIn:   "cubic-bezier(0.4, 0, 1, 1)",
    easeOut:  "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut:"cubic-bezier(0.4, 0, 0.2, 1)",
    spring:   "cubic-bezier(0.34, 1.56, 0.64, 1)",  // gentle overshoot — spring-like settle
    bounce:   "cubic-bezier(0.36, 0.07, 0.19, 0.97)", // aggressive bounce, no overshoot
  },

  // Named animations used in Tailwind keyframes
  keyframes: {
    "accordion-down": {
      from: { height: "0" },
      to:   { height: "var(--radix-accordion-content-height)" },
    },
    "accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to:   { height: "0" },
    },
    "pulse-xp": {
      "0%, 100%": { transform: "scale(1)" },
      "50%":      { transform: "scale(1.1)" },
    },
    "slide-up": {
      from: { opacity: "0", transform: "translateY(20px)" },
      to:   { opacity: "1", transform: "translateY(0)" },
    },
    "fade-in": {
      from: { opacity: "0" },
      to:   { opacity: "1" },
    },
    "scale-in": {
      from: { opacity: "0", transform: "scale(0.95)" },
      to:   { opacity: "1", transform: "scale(1)" },
    },
  },

  classes: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up":   "accordion-up 0.2s ease-out",
    "pulse-xp":       "pulse-xp 0.6s ease-in-out",
    "slide-up":       "slide-up 0.4s ease-out",
    "fade-in":        "fade-in 0.2s ease-out",
    "scale-in":       "scale-in 0.2s ease-out",
  },
} as const;

// ---------------------------------------------------------------------------
// Z-index scale
// ---------------------------------------------------------------------------

export const zIndex = {
  0:       "0",
  10:      "10",
  20:      "20",
  30:      "30",
  40:      "40",
  50:      "50",
  dropdown: "1000",
  sticky:   "1100",
  modal:    "1300",
  popover:  "1400",
  toast:    "1500",
} as const;
