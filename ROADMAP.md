# Exam Prep Master — Product Roadmap

## Active Phases

### Phase 1–9 (Previous)
See commit history and closed issues for completed work.

---

## Phase 4 — Welcome & Onboarding

### PR1 — Landing + RootRoute gating
**Status:** Shipped ✅ (#310 / #311, merged)

### PR2 — Welcome Email via Resend + Auth Webhook
**Status:** In Progress 🚧
**Tracking:** #320 (spec), closes #319 (bug/infra)

- Edge Function `supabase/functions/send-welcome-email` refactored to be
  Supabase Auth Hook driven (Bearer `SUPABASE_WEBHOOK_SECRET`).
- New `public.email_events` audit table with RLS.
- Vitest unit tests for the handler.
- `scripts/smoke-welcome-email.sh` for staging smoke verification.
- Dashboard hook registration instructions in the function README.

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
| #152 | [P0] Learn route crash — `Failed to fetch dynamically imported module` | P0 | **Fixed ✅** (PR #194 merged) |
| #162 | Split CI into fast PR checks + full main pipeline | P1 | Open (PR #181 draft) |
| #169 | Dependabot + secrets management | P1 | Open (PR #188 draft) |
| #171 | CSP / security headers (vercel.json headers) | P2 | **Partial ✅** (PR #192 merged — headers shipped; PR #190 draft for full CSP) |
| — | Branch protection on `main` | P1 | **Done ✅** |
| — | Issue/PR templates | P2 | Done ✅ |
| — | EXECUTION_RULES + AGENTS docs | P2 | Done ✅ |
| — | PostHog SPA pageview tracking fix | P2 | **Done ✅** (PR #193 merged) |
| — | Security headers + cache-control on index.html | P2 | **Done ✅** (PR #192 merged) |

### Phase 10 Exit Criteria
- [ ] Zero P0 Sentry errors on `/practice/:id` and `/learn/:id` for 7 consecutive days
- [x] `main` is branch-protected (required reviews, required CI, no force push)
- [ ] Fast PR CI (#162) runs on every PR and is a required check
- [x] Error boundary catches chunk-load failures and offers a reload action (PR #194)
- [ ] Dependabot configured (even if PRs are queued, not auto-merged)

---

## DevOps Work Plan

### Immediate (Phase 10)
| # | Task | Owner | Status |
|---|------|-------|--------|
| #162 | Split CI — fast PR checks + full main pipeline | Copilot (PR #181 draft) | In Review |
| #169 | Dependabot + CODEOWNERS + npm audit gate | Copilot (PR #188 draft) | In Review |
| — | Branch protection rules on `main` | Manual | Done ✅ |

### Short-term (Phase 11–13)
| # | Task | Priority |
|---|------|----------|
| #163 | Vitest coverage for core features | P2 |
| #167 | Production monitoring — Sentry alerts, PostHog dashboards, uptime checks | P2 |
| #153 | Route-based code splitting and lazy loading | P2 |

### Medium-term (Phase 14)
| # | Task | Priority |
|---|------|----------|
| #168 | Staging environment + preview deployments + DB branching | P3 |
| #166 | Terraform IaC for Vercel, Supabase, DNS | P3 |

### Integrations Status
| Service | Status | Notes |
|---------|--------|-------|
| **Sentry** | ✅ Active | browserTracing + replay, 20% traces, 100% error replay |
| **PostHog** | ✅ Active | SPA pageview tracking fixed (PR #193), dashboards configured |
| **Vercel** | ✅ Active | Security headers deployed (PR #192), preview deployments working |
| **GitHub Actions** | ✅ Active | CI runs on PRs, branch protection enabled |

---

## Security Work Plan

### Immediate (Phase 10)
| # | Task | Owner | Status |
|---|------|-------|--------|
| #171 | CSP headers + XSS protection (vercel.json) | Claude Code (PR #192) | **Partial ✅** |
| #169 | Dependabot + secrets scanning + CODEOWNERS | Copilot (PR #188 draft) | In Review |
| — | Security headers (X-Frame, HSTS, nosniff, referrer) | Claude Code | **Done ✅** (PR #192) |

### Short-term (Phase 13)
| # | Task | Priority |
|---|------|----------|
| #170 | Harden Supabase RLS policies + auth flow audit | P2 |
| #171 | Full CSP enforcement + XSS hardening (PR #190 draft) | P2 |

### Medium-term (Phase 14)
| # | Task | Priority |
|---|------|----------|
| #169 | Full secrets management audit | P3 |
| #160 | DB indexes + tighten RLS + optimize queries | P2 |

### Security Posture Summary
| Area | Status | Details |
|------|--------|---------||
| **HTTP Headers** | ✅ Shipped | X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy |
| **Cache Control** | ✅ Shipped | no-cache on index.html, hashed assets cached |
| **Dependency Scanning** | 🟡 In Progress | PR #188 adds Dependabot + npm audit gate |
| **CSP** | 🟡 In Progress | PR #190 adds CSP headers (draft) |
| **RLS Policies** | 🟠 Planned | #170 — full Supabase RLS audit |
| **Secret Scanning** | 🟡 In Progress | PR #188 adds TruffleHog |
| **Error Monitoring** | ✅ Active | Sentry captures P0 bugs in real-time |

---

## Phase 11 — Performance & Data Optimization
Runs after Phase 10 exits. Each item is a small standalone PR.

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
| #170 | Harden Supabase RLS policies (full audit) |
| #171 | Full CSP + XSS hardening |

## Phase 14 — Environment & Infra
| # | Title |
|---|-------|
| #168 | Staging env + preview deployments + DB branching |
| #166 | Terraform IaC |
| #169 | Full secrets management audit |

## Phase 15 — Architecture (explicitly deferred)
Broad refactors. Do **not** start without explicit owner approval.

| # | Title |
|---|-------|
| #164 | Feature-based module boundaries |
| #165 | Strict TS types for domain entities |

## Feature Phases (unchanged)
- Phase 16: Gamification system (#148)
- Phase 17: Premium design system overhaul (#146)
- Phase 18: Pedagogy-First Learning Flow (#138)
- Phase 19: Production-readiness hardening epic (#147)

---

## Constraints (apply to every phase)
- No broad refactors
- No unrelated design work
- Small, reviewable PRs (<400 LOC)
- Preserve working flows; rollback path mandatory
- Every PR links to one issue; issues without a PR don't get a branch
