/**
 * Design Tokens — Premium Minimalist Theme (Issue #146)
 *
 * Hex-based design tokens for the ExamPrep premium design system.
 * These complement the HSL-based tokens in tokens.ts and drive the
 * new CSS custom properties (--bg-primary, --bg-surface, etc.).
 *
 * Design direction — Phase 10.4:
 *   • Python-branded: snake green as a new secondary accent
 *     (`--color-snake` / `--color-snake-light`) pairs with the existing
 *     violet primary to evoke the two-snake Python logo.
 *   • Minimalist dark: deeper true-black surfaces with a blue-tinted hue
 *     (`#0a0b10` / `#13141c`) — less colorful, more premium.
 *   • Production-grade shadows: layered ambient + directional pairs
 *     (`--shadow-sm/md/lg/xl`) for card elevation.
 *   • Elevated surfaces: `--bg-surface-2` and `--bg-surface-3` step up
 *     the brightness ladder for nested content.
 *
 * Usage:
 *   • CSS: properties are defined in index.css under :root / .dark
 *   • JS:  call applyDesignTokens(theme) to set them at runtime
 */

export const darkTheme = {
  // Surfaces — deeper true-black ladder with subtle blue hue
  '--bg-primary': '#0a0b10',
  '--bg-surface': '#13141c',
  '--bg-surface-hover': '#1a1c27',
  '--bg-surface-2': '#1a1c27',
  '--bg-surface-3': '#22243340',

  // Primary — violet (unchanged, matches existing HSL tokens)
  '--color-primary': '#7c5cfc',
  '--color-primary-light': '#9b7fff',

  // Python snake green — new secondary accent for Python branding
  '--color-snake': '#3DDC84',
  '--color-snake-light': '#5FE89D',
  '--color-snake-dark': '#2BA968',

  // Python yellow — small accent only (for snake-head highlights)
  '--color-python-yellow': '#FFD43B',

  // Semantic
  '--color-success': '#3DDC84',
  '--color-warning': '#f59e0b',
  '--color-error': '#ef4444',

  // Text ladder — softer whites to reduce eye strain on pure black bg
  '--text-primary': '#f0f0f5',
  '--text-secondary': '#a8a9b8',
  '--text-muted': '#6b6c7a',

  // Borders — whisper-thin for minimalist feel
  '--border-color': 'rgba(255,255,255,0.06)',
  '--border-color-strong': 'rgba(255,255,255,0.12)',

  // Shadows — production-grade, layered (ambient + directional)
  '--shadow-sm':
    '0 1px 2px rgba(0,0,0,0.4)',
  '--shadow-card':
    '0 1px 2px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.35)',
  '--shadow-card-hover':
    '0 2px 4px rgba(0,0,0,0.35), 0 16px 32px -4px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
  '--shadow-md':
    '0 4px 6px -1px rgba(0,0,0,0.35), 0 2px 4px -2px rgba(0,0,0,0.25)',
  '--shadow-lg':
    '0 10px 15px -3px rgba(0,0,0,0.45), 0 4px 6px -4px rgba(0,0,0,0.3)',
  '--shadow-xl':
    '0 20px 40px -8px rgba(0,0,0,0.55), 0 8px 16px -6px rgba(0,0,0,0.4)',

  // Glows — for focus/hover emphasis
  '--glow-primary': '0 0 24px rgba(124, 92, 252, 0.35)',
  '--glow-snake': '0 0 24px rgba(61, 220, 132, 0.3)',

  // Hero gradient — premium Python-themed (violet → snake green whisper)
  '--hero-gradient':
    'linear-gradient(135deg, #7c5cfc 0%, #4c3acd 45%, #1a1c27 100%)',
  '--hero-gradient-snake':
    'linear-gradient(135deg, #3DDC84 0%, #2BA968 50%, #13141c 100%)',
  '--hero-gradient-python':
    'linear-gradient(135deg, #4B8BBE 0%, #7c5cfc 50%, #3DDC84 100%)',
} as const;

export const lightTheme = {
  // Surfaces
  '--bg-primary': '#fafafa',
  '--bg-surface': '#ffffff',
  '--bg-surface-hover': '#f4f5f8',
  '--bg-surface-2': '#f4f5f8',
  '--bg-surface-3': '#edeef2',

  // Primary
  '--color-primary': '#6d4cdc',
  '--color-primary-light': '#8b6cf7',

  // Snake green
  '--color-snake': '#22b873',
  '--color-snake-light': '#3DDC84',
  '--color-snake-dark': '#189157',

  // Python yellow
  '--color-python-yellow': '#E8B30A',

  // Semantic
  '--color-success': '#22b873',
  '--color-warning': '#e8930a',
  '--color-error': '#dc3545',

  // Text ladder
  '--text-primary': '#1a1a2e',
  '--text-secondary': '#4a4b5e',
  '--text-muted': '#8b8b9e',

  // Borders
  '--border-color': 'rgba(0,0,0,0.07)',
  '--border-color-strong': 'rgba(0,0,0,0.14)',

  // Shadows — softer in light mode
  '--shadow-sm':
    '0 1px 2px rgba(0,0,0,0.04)',
  '--shadow-card':
    '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)',
  '--shadow-card-hover':
    '0 2px 6px rgba(0,0,0,0.08), 0 20px 32px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
  '--shadow-md':
    '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06)',
  '--shadow-lg':
    '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.08)',
  '--shadow-xl':
    '0 20px 40px -8px rgba(0,0,0,0.15), 0 8px 16px -6px rgba(0,0,0,0.1)',

  // Glows
  '--glow-primary': '0 0 20px rgba(109, 76, 220, 0.2)',
  '--glow-snake': '0 0 20px rgba(34, 184, 115, 0.2)',

  // Hero gradient
  '--hero-gradient':
    'linear-gradient(135deg, #7c5cfc 0%, #9b7fff 50%, #e8e0ff 100%)',
  '--hero-gradient-snake':
    'linear-gradient(135deg, #3DDC84 0%, #22b873 50%, #e6f9f0 100%)',
  '--hero-gradient-python':
    'linear-gradient(135deg, #4B8BBE 0%, #7c5cfc 50%, #22b873 100%)',
} as const;

export type DesignTokens = typeof darkTheme;

/** Shared radius tokens — identical in both themes. */
export const radiusTokens = {
  '--radius-sm': '6px',
  '--radius-md': '8px',
  '--radius-lg': '12px',
  '--radius-xl': '16px',
  '--radius-2xl': '20px',
} as const;

/**
 * Apply design tokens as CSS custom properties on the document root.
 * Called by ThemeContext whenever the theme changes.
 */
export function applyDesignTokens(theme: 'dark' | 'light'): void {
  const tokens = theme === 'dark' ? darkTheme : lightTheme;
  const root = document.documentElement;

  for (const [property, value] of Object.entries(tokens)) {
    root.style.setProperty(property, value);
  }
  for (const [property, value] of Object.entries(radiusTokens)) {
    root.style.setProperty(property, value);
  }
}
