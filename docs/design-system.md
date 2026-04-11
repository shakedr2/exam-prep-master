# Design System — Exam Prep Master

**Version:** 1.0 (Phase 10.1 foundation)
**Last updated:** April 2026

---

## Overview

This document is the reference for all design tokens used across the app.
All values originate from `src/styles/tokens.ts` and are surfaced to Tailwind
via `tailwind.config.ts` and to CSS components via `src/index.css`.

The token architecture follows this chain:

```
tokens.ts  →  tailwind.config.ts  →  CSS class utilities
              ↓
           index.css  →  CSS custom properties  →  hsl(var(--x)) references
```

---

## Color Tokens

All semantic colors are driven by CSS custom properties. Both light and dark
values are defined; dark-mode values activate when the `dark` class is on `<html>`.

### Semantic palette

| Token | CSS variable | Light value (HSL) | Dark value (HSL) | Usage |
|-------|-------------|-------------------|-----------------|-------|
| `primary` | `--primary` | 262 83% 58% (violet) | 239 84% 59% (indigo) | Primary actions, links, focus rings |
| `primary-foreground` | `--primary-foreground` | 0 0% 100% | 0 0% 100% | Text on primary backgrounds |
| `secondary` | `--secondary` | 220 14% 92% | 228 15% 20% | Secondary buttons, chips |
| `secondary-foreground` | `--secondary-foreground` | 220 25% 10% | 220 14% 95% | Text on secondary |
| `accent` | `--accent` | 174 72% 46% (teal) | 174 72% 50% | Highlights, learning badges |
| `accent-foreground` | `--accent-foreground` | 0 0% 100% | 0 0% 100% | Text on accent |
| `background` | `--background` | 220 20% 97% | 240 10% 4% | Page background |
| `foreground` | `--foreground` | 220 25% 10% | 220 14% 95% | Body text |
| `card` | `--card` | 0 0% 100% | 240 10% 9% | Card surfaces |
| `card-foreground` | `--card-foreground` | 220 25% 10% | 220 14% 95% | Text on cards |
| `muted` | `--muted` | 220 14% 95% | 228 15% 18% | Disabled, placeholder areas |
| `muted-foreground` | `--muted-foreground` | 220 10% 46% | 220 10% 55% | Placeholder/hint text |
| `popover` | `--popover` | 0 0% 100% | 228 20% 14% | Dropdowns, tooltips |
| `border` | `--border` | 220 14% 89% | 228 15% 22% | Dividers, input borders |
| `input` | `--input` | 220 14% 89% | 228 15% 22% | Input field borders |
| `ring` | `--ring` | 262 83% 58% | 262 83% 62% | Focus ring color |

### Status colors

| Token | CSS variable | Light value (HSL) | Dark value (HSL) | Usage |
|-------|-------------|-------------------|-----------------|-------|
| `success` | `--success` | 142 71% 45% (green) | 142 71% 50% | Correct answers, completion |
| `success-foreground` | `--success-foreground` | 0 0% 100% | 0 0% 100% | Text on success |
| `warning` | `--warning` | 38 92% 50% (amber) | 38 92% 55% | Hints, caution messages |
| `warning-foreground` | `--warning-foreground` | 0 0% 100% | 0 0% 10% | Text on warning |
| `destructive` | `--destructive` | 0 84% 60% (red) | 0 62% 50% | Errors, wrong answers, destructive actions |
| `destructive-foreground` | `--destructive-foreground` | 0 0% 100% | 0 0% 100% | Text on destructive |
| `xp` | `--xp` | 45 93% 47% (gold) | 45 93% 55% | XP points, gamification elements |
| `xp-foreground` | `--xp-foreground` | 0 0% 10% | 0 0% 10% | Text on xp badges |

### Sidebar tokens

| Token | CSS variable | Usage |
|-------|-------------|-------|
| `sidebar` | `--sidebar-background` | Sidebar panel background |
| `sidebar-foreground` | `--sidebar-foreground` | Sidebar text |
| `sidebar-primary` | `--sidebar-primary` | Active nav item |
| `sidebar-accent` | `--sidebar-accent` | Hover state on nav items |
| `sidebar-border` | `--sidebar-border` | Sidebar border |
| `sidebar-ring` | `--sidebar-ring` | Sidebar focus ring |

### Tailwind class usage

Use semantic color utilities — **never use hardcoded Tailwind color classes** like `text-slate-600`:

```tsx
// ✅ Correct — uses semantic token
<p className="text-muted-foreground">Hint text</p>
<div className="bg-success/10 text-success">Correct!</div>

// ❌ Wrong — hardcoded color class
<p className="text-slate-500">Hint text</p>
```

**Exception:** Syntax highlighting in `PythonCodeBlock` uses Tailwind color classes
intentionally, as these are code-display colors (purple for keywords, teal for builtins, etc.)
that don't change with the app theme.

---

## Gradients

Gradient utility classes are defined in `src/index.css` `@layer utilities`:

| Class | Description | Usage |
|-------|-------------|-------|
| `.gradient-primary` | Violet → purple | Primary CTAs, hero sections |
| `.gradient-accent` | Teal → cyan | Accent highlights |
| `.gradient-xp` | Amber → gold | XP/gamification elements |
| `.gradient-success` | Green → emerald | Success states |
| `.gradient-streak` | Amber → gold → green | Streak indicators |
| `.text-gradient-primary` | Text clip with primary gradient | Hero headings |

---

## Typography

Fonts are loaded from Google Fonts in `src/index.css`.

### Font families

| Token | CSS class | Font | Used for |
|-------|-----------|------|---------|
| `font-heebo` | `font-family: Heebo` | Body text, UI | All Hebrew + general UI text |
| `font-mono` | `font-family: JetBrains Mono` | Code | Code blocks, monospace display |

### Font weights loaded

`300` light, `400` normal, `500` medium, `600` semibold, `700` bold, `800` extrabold, `900` black

### Extra font size token

| Token | Size | Line height | Usage |
|-------|------|------------|-------|
| `text-2xs` | 0.625rem (10px) | 0.875rem | Tiny labels, badges |

(Standard Tailwind scale `text-xs` through `text-5xl` is unchanged.)

---

## Border Radius

Base radius variable: `--radius: 0.25rem` (4px)

| Tailwind class | Value | Pixels |
|----------------|-------|--------|
| `rounded-sm` | `max(0px, calc(var(--radius) - 4px))` | 0px (clamped) |
| `rounded-md` | `calc(var(--radius) - 2px)` | 2px |
| `rounded` / `rounded-lg` | `var(--radius)` | 4px |
| `rounded-xl` | `calc(var(--radius) + 4px)` | 8px |
| `rounded-2xl` | `calc(var(--radius) + 8px)` | 12px |
| `rounded-3xl` | `calc(var(--radius) + 12px)` | 16px |
| `rounded-full` | `9999px` | pill shape |

---

## Shadows

Standard Tailwind shadow utilities plus app-specific glow variants:

| Tailwind class | Usage |
|----------------|-------|
| `shadow-sm` | Subtle card elevation |
| `shadow` / `shadow-md` | Default card/panel |
| `shadow-lg` | Elevated modals, popovers |
| `shadow-xl` | Highest elevation |
| `shadow-glow-primary` | Hover glow for primary elements |
| `shadow-glow-accent` | Hover glow for accent elements |
| `shadow-glow-xp` | Hover glow for XP elements |

---

## Animations

All animation durations and keyframes are defined in `tokens.ts → animation`
and surfaced to Tailwind via `tailwind.config.ts`.

### Duration scale

| Token | Value | Usage |
|-------|-------|-------|
| `instant` | 0ms | Immediate state changes |
| `fast` | 100ms | Micro-interactions |
| `normal` | 200ms | Standard transitions (default) |
| `slow` | 400ms | Page transitions |
| `slower` | 600ms | Complex animations |
| `slowest` | 1000ms | Loading states |

### Tailwind animation classes

| Class | Description |
|-------|-------------|
| `animate-accordion-down` | Accordion open (0.2s) |
| `animate-accordion-up` | Accordion close (0.2s) |
| `animate-pulse-xp` | XP badge pulse (0.6s) |
| `animate-slide-up` | Slide in from below (0.4s) |
| `animate-fade-in` | Opacity fade in (0.2s) |
| `animate-scale-in` | Scale + fade in (0.2s) |

---

## Spacing Scale

Uses Tailwind's default 4px base grid. No custom overrides — use standard
`p-1` (4px), `p-2` (8px), `p-4` (16px), etc.

Common patterns in the app:

| Context | Spacing |
|---------|---------|
| Card padding | `p-4` to `p-6` |
| Section gap | `gap-4` to `gap-6` |
| Stack spacing | `space-y-2` to `space-y-4` |
| Page padding | `px-4` to `px-6`, `py-6` to `py-8` |

---

## RTL Support

The app is **Hebrew-first, RTL** by default:

- `direction: rtl` is set on `<html>` in `index.css`
- Use `ms-*` / `me-*` (margin-start / margin-end) instead of `ml-*` / `mr-*`
- Use `ps-*` / `pe-*` (padding-start / padding-end) instead of `pl-*` / `pr-*`
- Use `start-*` / `end-*` instead of `left-*` / `right-*` for positioned elements
- Code blocks use `dir="ltr"` explicitly since Python code is LTR

---

## Theme (Dark / Light)

Theme is toggled by adding/removing the `dark` class on `<html>`.

- Stored in `localStorage` under key `examprep_theme`
- Default: `dark`
- Managed by `useTheme` hook (`src/hooks/useTheme.ts`)
- Toggle UI: `ThemeToggle` component (`src/shared/components/ThemeToggle.tsx`)

No `ThemeProvider` wrapper is required — the hook applies the class directly
to `document.documentElement`.

---

## Hardcoded Color Exceptions

The following hardcoded colors are **intentional** and should remain:

| Location | Color | Reason |
|----------|-------|--------|
| `SignupWall.tsx`, `LoginPage.tsx` | `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335` | Google brand logo SVG colors — must not change |
| `PythonCodeBlock.tsx` | `bg-[#1a1b2e]` | VS Code-style dark background for syntax highlighting |
| `FillBlankView.tsx` | `bg-[#1e1e2e]` | Same as above |
| `App.css` | Various | Legacy Vite boilerplate — unused by the app |

---

## Adding New Tokens

1. Add the value to the appropriate section in `src/styles/tokens.ts`
2. If it's a color: add a CSS custom property in `src/index.css` under `:root` and `.dark`
3. If it's a Tailwind utility: reference the CSS var in `tailwind.config.ts`
4. Update this document

---

## Audit Summary (April 2026)

### Style inventory

**CSS custom properties (index.css):**
- 12 semantic color pairs (light + dark)
- 8 sidebar-specific tokens
- 1 border radius variable (`--radius: 0.25rem`)

**Tailwind extensions:**
- 12 semantic color utilities + sidebar group
- 3 border radius utilities (sm, md, lg)
- 2 font family utilities (heebo, mono)
- 6 animation classes + keyframes

**Inconsistencies found:**
- `PythonCodeBlock` uses 9 hardcoded Tailwind color classes (intentional — syntax highlight palette)
- Difficulty badges in `PracticePage` / `ExamMode` use raw `green-*`, `red-*`, `yellow-*` classes (acceptable, status-specific UI)
- `App.css` contains unused Vite boilerplate with hardcoded hex values (not imported by app components)
