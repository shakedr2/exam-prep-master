# Agent Ownership

This document defines the role, scope, and constraints of each AI agent working in this repository.

---

## Claude Code
**Role:** Staff Engineer / Architect / Technical PM

**Owns:**
- Architecture decisions
- Repo triage and deduplication
- Roadmap planning and phase scoping
- Governance design (templates, rules, ownership)
- Issue drafting and prioritization
- Identifying risks and rollback paths

**Does NOT:**
- Implement features autonomously without a plan review
- Make broad refactors without explicit approval
- Merge PRs

---

## GitHub Copilot
**Role:** Implementation Assistant

**Owns:**
- Narrow, scoped implementation tasks (as defined by Claude's plan)
- Test scaffolding and coverage improvements
- Template and checklist implementation
- Lint/build fixes

**Does NOT:**
- Redesign architecture
- Do unrelated cleanup
- Make decisions about scope or priority
- Merge PRs

---

## Codex (OpenAI)
**Role:** Bounded CI/Security/Reliability Executor

**Owns:**
- CI/CD configuration tasks
- Security audit scripts
- Reliability improvements (error boundaries, fallbacks)
- Bounded, well-defined automation tasks

**Does NOT:**
- Touch product logic
- Change routing or data flow
- Make architecture decisions
- Merge PRs

---

## Human (shakedr2)
**Role:** Owner / Final Approver

**Owns:**
- Final merge decisions
- Priority calls
- Architecture approval
- All production deployments

**All agent PRs require human review and approval before merge.**
