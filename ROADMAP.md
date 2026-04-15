# Exam Prep Master — Product Roadmap

## Active Phases

### Phase 1–9 (Previous)
See commit history and closed issues for completed work.

---

## Phase 10 — DevOps, Security, and Reliability Foundations
**Status:** Planning
**Priority:** P0

### Goals
- Eliminate all P0 production crashes (Practice route, Learn dynamic import)
- Establish repo governance (branch protection, templates, execution rules)
- Add foundational observability and error monitoring
- Ensure CI/CD pipeline enforces quality gates

### Issues / Tasks
| # | Title | Severity | Status |
|---|-------|----------|--------|
| TBD | Practice route crash (`dr` init error) | P0 | Open |
| TBD | Learn route dynamic import failure | P0 | Open |
| TBD | Branch protection on main | P1 | Planned |
| TBD | Issue/PR templates | P2 | Done ✅ |
| TBD | EXECUTION_RULES + AGENTS docs | P2 | Done ✅ |

### Constraints
- No broad refactors
- No unrelated design work
- All changes in small, reviewable PRs
- Preserve working flows

### Phase 10 Exit Criteria
- [ ] Zero P0 Sentry errors on practice and learn routes
- [ ] main is branch-protected
- [ ] CI runs on every PR
- [ ] All agents follow defined ownership in AGENTS.md

---

## Phases 11+ (Future)
- Phase 11: Gamification system (#148)
- Phase 12: Premium design system overhaul (#146)
- Phase 13: Pedagogy-First Learning Flow (#138)
- Phase 14: Production-readiness hardening (#147)
