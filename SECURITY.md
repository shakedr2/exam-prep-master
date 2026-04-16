# Security — Supabase RLS Policy Reference

This document is the authoritative record of every Row Level Security policy on every table in the `public` schema.

> **Last updated:** 2026-04-16 (migration `20260416000007_enforce_rls_all_tables.sql`)

---

## Policy Matrix

| Table | RLS Enabled | Role | Operation | Policy |
|---|---|---|---|---|
| `topics` | ✅ | anon, authenticated | SELECT | `using (true)` — public read |
| `questions` | ✅ | anon, authenticated | SELECT | `using (true)` — public read |
| `questions` | ✅ | authenticated | INSERT | `auth.role() = 'authenticated'` |
| `questions` | ✅ | authenticated | UPDATE | `auth.role() = 'authenticated'` |
| `questions` | ✅ | authenticated | DELETE | `auth.role() = 'authenticated'` |
| `user_profiles` | ✅ | authenticated | SELECT | `auth.uid() = id` |
| `user_profiles` | ✅ | authenticated | INSERT | `auth.uid() = id` |
| `user_profiles` | ✅ | authenticated | UPDATE | `auth.uid() = id` |
| `user_progress` | ✅ | anon | SELECT / INSERT / UPDATE | `using (true)` — anonymous learners |
| `user_progress` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `user_progress` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `user_progress` | ✅ | authenticated | UPDATE | `auth.uid() = user_id` |
| `user_progress` | ✅ | authenticated | DELETE | `auth.uid() = user_id` |
| `user_learning_progress` | ✅ | authenticated | ALL | `auth.uid()::text = user_id` |
| `user_learning_progress` | ✅ | anon | ALL | `using (true)` — anonymous learners |
| `user_topic_completions` | ✅ | authenticated | ALL | `auth.uid()::text = user_id` |
| `user_topic_completions` | ✅ | anon | ALL | `using (true)` — anonymous learners |
| `topic_progress` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `topic_progress` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `topic_progress` | ✅ | authenticated | UPDATE | `auth.uid() = user_id` |
| `topic_progress` | ✅ | authenticated | DELETE | `auth.uid() = user_id` |
| `user_xp` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `user_xp` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `user_xp` | ✅ | authenticated | UPDATE | `auth.uid() = user_id` |
| `user_xp_events` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `user_xp_events` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `user_streaks` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `user_streaks` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `user_streaks` | ✅ | authenticated | UPDATE | `auth.uid() = user_id` |
| `user_milestones` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `user_milestones` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `user_onboarding` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `user_onboarding` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `user_onboarding` | ✅ | authenticated | UPDATE | `auth.uid() = user_id` |
| `exam_results` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `exam_results` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `curriculum_question_attempts` | ✅ | authenticated | SELECT | `auth.uid() = user_id` |
| `curriculum_question_attempts` | ✅ | authenticated | INSERT | `auth.uid() = user_id` |
| `question_candidates` | ✅ | anon, authenticated | SELECT | `using (true)` — public read |
| `question_candidates` | ✅ | — | INSERT / UPDATE / DELETE | service role only (no policy = deny) |
| `ai_explanation_cache` | ✅ | authenticated | SELECT | `using (true)` — shared read cache |
| `ai_explanation_cache` | ✅ | — | INSERT / UPDATE / DELETE | service role only (no policy = deny) |
| `curriculum_tracks` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_phases` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_modules` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_lessons` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_concepts` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_practices` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_quizzes` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_translations` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_track_enrolments` | ✅ | — | ALL | no user policies — service role only |
| `curriculum_module_progress` | ✅ | — | ALL | no user policies — service role only |

---

## Design Decisions

### Anonymous learner support (`user_learning_progress`, `user_topic_completions`)

These two tables use a `TEXT` `user_id` column (instead of `UUID`) to support both:

- **Authenticated users** — their Supabase auth UUID, cast to text
- **Anonymous learners** — a client-generated UUID from `getAnonUserId()` stored in `localStorage`

Because `auth.uid()` returns `UUID` and the column is `TEXT`, the authenticated policy uses the cast `auth.uid()::text = user_id`. Anonymous learners (who have no auth identity to check against) get a permissive policy scoped to the `anon` role; the application layer is responsible for always filtering queries with its own `user_id`.

### Append-only tables

`exam_results` and `curriculum_question_attempts` intentionally have no `UPDATE` or `DELETE` policies — historical records must not be tampered with. Deletes can only be triggered by a cascaded `auth.users` row deletion.

### Service-role-only writes

`question_candidates`, `ai_explanation_cache`, and all `curriculum_*` content tables have no write policies for `anon` or `authenticated`. All writes go through Edge Functions running with the service role, which bypasses RLS by design.

---

## Verification

To confirm all user-data tables have RLS enabled and no cross-user leakage is possible, run the following queries in the Supabase SQL editor:

```sql
-- List all tables with RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- List all active RLS policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Cross-user access test

1. Log in as **User A** and note their `user_id`
2. Log in as **User B** in an incognito window
3. In User B's session, attempt:

```typescript
const { data } = await supabase
  .from('user_learning_progress')
  .select('*')
  .eq('user_id', USER_A_ID);

// Expected: data === [] (RLS blocks User B from seeing User A's rows)
```

4. Repeat for `user_progress`, `user_profiles`, `user_topic_completions`, and `exam_results`

---

## Migration History

| Migration | Tables / Changes |
|---|---|
| `20260325000001_create_questions_and_progress.sql` | RLS on `topics`, `questions`, `user_progress` |
| `20260411000001_user_profiles.sql` | RLS on `user_profiles` |
| `20260413000001_user_topic_completions.sql` | RLS on `user_topic_completions` (permissive — later tightened) |
| `20260415000001_db_indexes_rls_rpc.sql` | RLS on `user_learning_progress` (permissive — later tightened) |
| `20260415000002_harden_rls_policies.sql` | Tightened `user_progress`; RLS on all curriculum tables, `exam_results`, `ai_explanation_cache`, `question_candidates` |
| `20260415000003_gamification_xp_streaks.sql` | RLS on `user_xp`, `user_xp_events`, `user_streaks`, `user_milestones`, `user_onboarding` |
| `20260415000010_topic_progress.sql` | RLS on `topic_progress` |
| `20260416000007_enforce_rls_all_tables.sql` | **Tightened `user_learning_progress` and `user_topic_completions`** — replaced permissive `using (true)` with role-split authenticated/anon policies |
