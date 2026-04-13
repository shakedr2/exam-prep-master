/**
 * Design Tokens — Premium Minimalist Theme
 *
 * Hex-based design tokens for the ExamPrep premium design system.
 * These complement the HSL-based tokens in tokens.ts and drive the
 * new CSS custom properties (--bg-primary, --bg-surface, etc.).
 *
 * Usage:
 *   • CSS: properties are defined in index.css under :root / .dark
 *   • JS:  call applyDesignTokens(theme) to set them at runtime
 */

export const darkTheme = {
  '--bg-primary': '#0f0f13',
  '--bg-surface': '#1a1b2e',
  '--bg-surface-hover': '#22233a',
  '--color-primary': '#7c5cfc',
  '--color-primary-light': '#9b7fff',
  '--color-success': '#2dd4a8',
  '--color-warning': '#f59e0b',
  '--color-error': '#ef4444',
  '--text-primary': '#f0f0f5',
  '--text-secondary': '#8b8b9e',
  '--text-muted': '#55566a',
  '--border-color': 'rgba(255,255,255,0.06)',
  '--shadow-card': '0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
  '--shadow-card-hover': '0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
  '--glow-primary': '0 0 20px rgba(124, 92, 252, 0.3)',
  '--hero-gradient': 'linear-gradient(135deg, #7c5cfc, #4c3acd, #1a1b2e)',
} as const;

export const lightTheme = {
  '--bg-primary': '#fafafa',
  '--bg-surface': '#ffffff',
  '--bg-surface-hover': '#f0f0f5',
  '--color-primary': '#6d4cdc',
  '--color-primary-light': '#8b6cf7',
  '--color-success': '#22b893',
  '--color-warning': '#e8930a',
  '--color-error': '#dc3545',
  '--text-primary': '#1a1a2e',
  '--text-secondary': '#55566a',
  '--text-muted': '#8b8b9e',
  '--border-color': 'rgba(0,0,0,0.08)',
  '--shadow-card': '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
  '--shadow-card-hover': '0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
  '--glow-primary': '0 0 20px rgba(109, 76, 220, 0.2)',
  '--hero-gradient': 'linear-gradient(135deg, #7c5cfc, #9b7fff, #e8e0ff)',
} as const;

export type DesignTokens = typeof darkTheme;

/** Shared radius tokens — identical in both themes. */
export const radiusTokens = {
  '--radius-sm': '6px',
  '--radius-md': '8px',
  '--radius-lg': '12px',
  '--radius-xl': '16px',
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
