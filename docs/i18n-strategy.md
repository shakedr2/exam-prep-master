# Multilingual Strategy (i18n)

## Overview

ExamPrep is transitioning from a Hebrew-only app to a multilingual platform. This document defines the i18n strategy: how locales are managed, how text direction is determined, how UI translation keys are structured, and how content translations work.

**Hebrew (`he`) is the default and current launch locale. English (`en`) is the first expansion target.**

---

## Locales

| Locale | Language | Direction | Status        |
|--------|----------|-----------|---------------|
| `he`   | Hebrew   | RTL       | Default, live |
| `en`   | English  | LTR       | Next target   |

The `Locale` type is defined in `src/types/curriculum.ts` and re-exported from `src/features/i18n`.

---

## Text Direction

Direction (`rtl` / `ltr`) is **locale-driven**, never hardcoded. The `getLocaleDirection` helper in `src/features/i18n/locales.ts` maps every locale to its direction.

```ts
import { getLocaleDirection } from "@/features/i18n";
const dir = getLocaleDirection("he"); // "rtl"
```

The `useLocale` hook (`src/features/i18n/hooks/useLocale.ts`) exposes the active locale and direction for use in React components:

```tsx
import { useLocale } from "@/features/i18n";
const { locale, direction } = useLocale();
// use `direction` on wrapper elements, e.g. <div dir={direction}>
```

**Do NOT** add `dir="rtl"` as a hardcoded string to new components. Always derive it from the locale.

---

## UI Translation Keys

All **new** UI text must use translation keys via `react-i18next`. **Do NOT refactor existing Hebrew-hardcoded components** — only apply this to new features going forward.

### Key naming convention

```
<feature>.<component>.<element>
```

Examples:
- `common.loading` → "טוען..."
- `auth.login.title` → "כניסה"
- `dashboard.topicCard.startButton` → "התחל"
- `practice.result.correct` → "נכון!"

### Adding a new key

1. Add the key and Hebrew value to `src/features/i18n/locales/he.ts`.
2. Add the matching key and English value to `src/features/i18n/locales/en.ts`.
3. Use the key in your component via `useTranslation`:

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <button>{t("common.submit")}</button>;
}
```

### Namespace strategy

Use a single default namespace (`translation`) for now. If the bundle grows significantly, split by feature (e.g. `practice`, `exam`).

---

## Content Translations

Curriculum content (tracks, phases, modules, lessons, questions) is **not** stored as i18next keys. Instead, it uses a **content-ID + translations table** pattern:

```
content_id (stable, locale-agnostic)  →  curriculum_translations (content_id, locale, fields jsonb)
```

### Content ID format

```
<entity-type>.<track-slug>.<entity-slug>
```

Examples:
- `module.python.variables-io`
- `lesson.python.variables-io.intro`
- `phase.python.fundamentals`

### Translation lookup algorithm

```
1. Look up curriculum_translations WHERE content_id = ? AND locale = user_locale
2. If found → use translated fields
3. Else → fall back to default_locale fields on the entity row (Hebrew)
```

The `ContentTranslation` interface is defined in `src/types/curriculum.ts`.

### Rules for content authors

- Every new content entity **must** have a stable `content_id` before shipping.
- Hebrew text is stored directly on the entity row as the default.
- English (and other) translations go into `curriculum_translations`.
- Do **NOT** mix UI translation keys with content translation IDs.

---

## i18next Bootstrap

The i18n system is bootstrapped in `src/features/i18n/config.ts` and imported once in `src/main.tsx` (a single side-effect import: `import "@/features/i18n/config"`).

The configuration:
- Hebrew as `defaultNS` and `fallbackLng`.
- Resources are bundled (no HTTP backend) — locale files live in `src/features/i18n/locales/`.
- `initReactI18next` is applied so all React components can use `useTranslation`.

---

## Migration Path for Existing Components

1. **Phase 0 (now):** Foundation only. No changes to existing Hebrew-hardcoded components.
2. **Phase 1 (English launch):** When adding English UI, extract hardcoded strings in the components you touch into i18next keys.
3. **Phase 2 (full i18n):** Systematic sweep of remaining hardcoded strings.

Never do a broad "replace all Hebrew strings" refactor in one shot. Migrate per-feature, per-PR.

---

## Directory Structure

```
src/features/i18n/
  config.ts            — i18next init (import once in main.tsx)
  locales.ts           — Locale constants, LOCALES map, getLocaleDirection()
  index.ts             — Public API re-exports
  hooks/
    useLocale.ts       — useLocale() React hook
  locales/
    he.ts              — Hebrew translation strings (new UI keys)
    en.ts              — English translation strings
```
