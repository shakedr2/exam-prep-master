# Exam Prep Master — Product Roadmap

## Active Phases

### Phase 1–9 (Previous)
See commit history and closed issues for completed work.

---

## Phase 10 — DevOps, Security, and Reliability Foundations
**Status:** Active
**Priority:** P0
**Window:** Next 2 weeks (P0 incidents first, then governance + minimal hardening)

### Goals
- Eliminate both P0 production crashes (Practice TDZ + Learn dynamic import)
- Land repo governance (branch protection on `main`, CI required checks)
- Ship the smallest high-value reliability primitives: fast PR CI, error boundary fallback, Dependabot
- Do **not** do broad refactors, design work, or speculative optimization in this phase

### In-scope issues
| # | Title | Severity | Status |
|---|-------|----------|--------|
| #151 | [P0] Practice route crash — `ReferenceError: Cannot access 'dr' before initialization` | P0 | Open |
| #152 | [P0] Learn route crash — `Failed to fetch dynamically imported module` | P0 | Open |
| #162 | Split CI into fast PR checks + full main pipeline | P1 | Open (PR #181 WIP) |
| #169 | Dependabot + secrets management (narrow subset: enable Dependabot + CODEOWNERS only) | P1 | Open (PR #188 WIP) |
| #171 | CSP / security headers (narrow subset: `vercel.json` headers only, no CSP enforcement yet) | P2 | Open (PR #190 WIP) |
| — | Branch protection on `main` (manual, no issue; see Immediate Next Steps) | P1 | Planned |
| — | Issue/PR templates | P2 | Done ✅ |
| — | EXECUTION_RULES + AGENTS docs | P2 | Done ✅ |

### Deferred from Phase 10 (do **not** merge yet — see "Deferred" section below)
#153, #154, #155, #156, #157, #158, #159, #160, #161, #163, #164, #165, #166, #167, #168, #170

### Phase 10 Exit Criteria
- [ ] Zero P0 Sentry errors on `/practice/:id` and `/learn/:id` for 7 consecutive days
- [ ] `main` is branch-protected (required reviews, required CI, no force push)
- [ ] Fast PR CI (#162) runs on every PR and is a required check
- [ ] Error boundary catches chunk-load failures and offers a reload action
- [ ] Dependabot configured (even if PRs are queued, not auto-merged)

---

## Phase 11 — Performance & Data Optimization
Runs after Phase 10 exits. Each item is a small standalone PR, no bundled refactors.

| # | Title |
|---|-------|
| #153 | Route-based code splitting and lazy loading |
| #154 | Tree-shake heavy dependencies + bundle budget |
| #155 | `React.memo` / `useCallback` / `useMemo` where profiler shows waste |
| #156 | PWA service worker caching strategies |
| #160 | Indexes + combined reads on Supabase |
| #161 | Precomputed dashboard stats (materialized view or trigger) |

## Phase 12 — AI Reliability
| # | Title |
|---|-------|
| #157 | Cache AI explanations per question ID |
| #158 | Debounce AI tutor + concurrency lock |
| #159 | Centralize AI client with retry/timeout |

## Phase 13 — Observability & Test Foundation
| # | Title |
|---|-------|
| #163 | Vitest coverage for core features |
| #167 | Production monitoring (Sentry alerts, PostHog dashboards, uptime) |
| #170 | Harden Supabase RLS policies (full audit — after #160 ships) |
| #171 | Full CSP + XSS hardening (after initial headers in Phase 10) |

## Phase 14 — Environment & Infra
| # | Title |
|---|-------|
| #168 | Staging env + preview deployments + DB branching |
| #166 | Terraform IaC |
| #169 | Full secrets management audit |

## Phase 15 — Architecture (explicitly deferred)
Broad refactors. Do **not** start without explicit owner approval and a gap analysis.
| # | Title |
|---|-------|
| #164 | Feature-based module boundaries |
| #165 | Strict TS types for domain entities |

---

## Feature Phases (unchanged)
- Phase 16: Gamification system (#148)
- Phase 17: Premium design system overhaul (#146 — partially landed in PRs #140/#150, remainder deferred)
- Phase 18: Pedagogy-First Learning Flow (#138 — most sub-issues already done; epic tracks remaining)
- Phase 19: Production-readiness hardening epic (#147 — umbrella, fanned out into #148/#146/#153–171)

---

## Constraints (apply to every phase)
- No broad refactors
- No unrelated design work
- Small, reviewable PRs (<400 LOC)
- Preserve working flows; rollback path mandatory
- Every PR links to one issue; issues without a PR don't get a branch
