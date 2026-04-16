/**
 * Centralized Design Tokens (Issue #216)
 *
 * Source of truth for colors, spacing, typography, shadows, radius,
 * and transitions used by Tailwind + runtime CSS variables.
 */

type HslToken = `${number} ${number}% ${number}%`;

export const tokens = {
  colors: {
    base: {
      background: { light: "228 33% 98%" as HslToken, dark: "236 28% 8%" as HslToken },
      foreground: { light: "239 32% 14%" as HslToken, dark: "220 25% 95%" as HslToken },
      surface: { light: "0 0% 100%" as HslToken, dark: "236 22% 12%" as HslToken },
      surfaceElevated: { light: "228 36% 96%" as HslToken, dark: "236 20% 16%" as HslToken },
      border: { light: "238 14% 88%" as HslToken, dark: "234 18% 24%" as HslToken },
      input: { light: "238 14% 88%" as HslToken, dark: "234 18% 24%" as HslToken },
      ring: { light: "254 87% 65%" as HslToken, dark: "255 92% 72%" as HslToken },
    },
    brand: {
      primary: { light: "254 87% 65%" as HslToken, dark: "255 92% 72%" as HslToken, foreground: "0 0% 100%" as HslToken },
      indigo: { light: "245 74% 62%" as HslToken, dark: "245 82% 70%" as HslToken, foreground: "0 0% 100%" as HslToken },
      accent: { light: "164 64% 45%" as HslToken, dark: "164 66% 52%" as HslToken, foreground: "0 0% 100%" as HslToken },
      xp: { light: "45 93% 47%" as HslToken, dark: "45 93% 55%" as HslToken, foreground: "0 0% 10%" as HslToken },
    },
    semantic: {
      muted: { light: "232 24% 95%" as HslToken, dark: "235 16% 20%" as HslToken },
      mutedForeground: { light: "236 12% 42%" as HslToken, dark: "233 14% 70%" as HslToken },
      destructive: { light: "0 84% 60%" as HslToken, dark: "0 84% 62%" as HslToken, foreground: "0 0% 100%" as HslToken },
      success: { light: "151 62% 44%" as HslToken, dark: "152 65% 52%" as HslToken, foreground: "0 0% 100%" as HslToken },
      warning: { light: "38 92% 50%" as HslToken, dark: "38 92% 54%" as HslToken, foreground: "0 0% 10%" as HslToken },
    },
  },
  spacing: {
    px: "1px",
    0: "0rem",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
  },
  typography: {
    fontFamily: {
      sans: ["Heebo", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    fontSize: {
      "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(10, 11, 16, 0.22)",
    md: "0 4px 10px rgba(10, 11, 16, 0.2)",
    lg: "0 12px 24px rgba(10, 11, 16, 0.24)",
    xl: "0 24px 40px rgba(10, 11, 16, 0.3)",
    card: "var(--shadow-card)",
    cardHover: "var(--shadow-card-hover)",
    glowPrimary: "0 0 24px hsl(var(--primary) / 0.35)",
    glowAccent: "0 0 24px hsl(var(--accent) / 0.3)",
    glowXp: "0 0 20px hsl(var(--xp) / 0.35)",
  },
  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) + 4px)",
    "2xl": "calc(var(--radius) + 8px)",
    "3xl": "calc(var(--radius) + 12px)",
  },
  transitions: {
    duration: {
      fast: "150ms",
      normal: "220ms",
      slow: "320ms",
    },
    timing: {
      standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    },
  },
} as const;

export const typography = tokens.typography;
export const shadows = {
  ...tokens.shadows,
  "glow-primary": tokens.shadows.glowPrimary,
  "glow-accent": tokens.shadows.glowAccent,
  "glow-xp": tokens.shadows.glowXp,
  premium: "var(--shadow-md)",
  "premium-sm": "var(--shadow-sm)",
  "premium-lg": "var(--shadow-lg)",
  "premium-xl": "var(--shadow-xl)",
  "card-hover": "var(--shadow-card-hover)",
} as const;

export const borderRadius = {
  ...tokens.radius,
  DEFAULT: tokens.radius.lg,
  full: "9999px",
} as const;

export const animation = {
  duration: {
    instant: "0ms",
    fast: "100ms",
    normal: "200ms",
    slow: "400ms",
    slower: "600ms",
    slowest: "1000ms",
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    bounce: "cubic-bezier(0.36, 0.07, 0.19, 0.97)",
  },
  keyframes: {
    "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
    "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
    "pulse-xp": { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.1)" } },
    "slide-up": { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
    "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
    "scale-in": { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
  },
  classes: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
    "pulse-xp": "pulse-xp 0.6s ease-in-out",
    "slide-up": "slide-up 0.4s ease-out",
    "fade-in": "fade-in 0.2s ease-out",
    "scale-in": "scale-in 0.2s ease-out",
  },
} as const;

export const gradients = {
  primary: "linear-gradient(135deg, hsl(255 92% 72%), hsl(275 78% 60%))",
  accent: "linear-gradient(135deg, hsl(164 66% 52%), hsl(180 70% 52%))",
  xp: "linear-gradient(135deg, hsl(38 92% 50%), hsl(45 93% 55%))",
  success: "linear-gradient(135deg, hsl(152 65% 52%), hsl(160 72% 50%))",
  streak: "linear-gradient(135deg, hsl(38 92% 50%), hsl(45 93% 55%), hsl(164 66% 52%))",
} as const;

export const syntaxClasses = {
  keyword: { light: "text-purple-700", dark: "dark:text-purple-400" },
  builtin: { light: "text-cyan-700", dark: "dark:text-cyan-400" },
  string: { light: "text-emerald-700", dark: "dark:text-emerald-400" },
  number: { light: "text-amber-700", dark: "dark:text-amber-400" },
  comment: { light: "text-slate-500", dark: "" },
  operator: { light: "text-pink-700", dark: "dark:text-pink-400" },
  function: { light: "text-yellow-700", dark: "dark:text-yellow-300" },
  param: { light: "text-orange-700", dark: "dark:text-orange-300" },
  text: { light: "text-slate-800", dark: "dark:text-slate-200" },
} as const;

export const zIndex = {
  0: "0",
  10: "10",
  20: "20",
  30: "30",
  40: "40",
  50: "50",
  dropdown: "1000",
  sticky: "1100",
  modal: "1300",
  popover: "1400",
  toast: "1500",
} as const;
