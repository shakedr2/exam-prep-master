import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();
const DOC_PATH = path.join(REPO_ROOT, "docs/questions-source-of-truth.md");
const MIGRATIONS_DIR = path.join(REPO_ROOT, "supabase/migrations");

// Canonical UUID → slug map for every topic seeded by Supabase migrations.
// Kept local to this test on purpose: the product's SLUG_TO_UUID map in
// `src/data/topicTutorials.ts` tracks only slugs that are actively wired into
// the UI (e.g. `files_exceptions` was dropped from Python Fundamentals in
// PR #330), so using it here would under-count rows that are still seeded in
// `supabase/migrations/`. The doc itself (docs/questions-source-of-truth.md)
// is the canonical source of per-topic counts and lists every topic below.
const MIGRATION_UUID_TO_SLUG: Record<string, string> = {
  "11111111-0001-0000-0000-000000000000": "variables_io",
  "11111111-0002-0000-0000-000000000000": "arithmetic",
  "11111111-0003-0000-0000-000000000000": "conditions",
  "11111111-0004-0000-0000-000000000000": "loops",
  "11111111-0005-0000-0000-000000000000": "functions",
  "11111111-0006-0000-0000-000000000000": "strings",
  "11111111-0007-0000-0000-000000000000": "lists",
  "11111111-0008-0000-0000-000000000000": "tuples_sets_dicts",
  "11111111-0009-0000-0000-000000000000": "classes_objects",
  "11111111-000a-0000-0000-000000000000": "inheritance",
  "11111111-000b-0000-0000-000000000000": "polymorphism",
  "11111111-000c-0000-0000-000000000000": "files_exceptions",
  "11111111-000d-0000-0000-000000000000": "decorators_special",
  "22222222-0001-0000-0000-000000000000": "linux_basics",
  "22222222-0002-0000-0000-000000000000": "bash_scripting",
  "22222222-0003-0000-0000-000000000000": "file_permissions",
  "22222222-0004-0000-0000-000000000000": "networking_fundamentals",
};

function parseSupabaseCount(cell: string): number {
  const matches = cell.match(/\d+/g);
  if (!matches?.length) return 0;
  return Number(matches[matches.length - 1]);
}

function parseCanonicalCountsFromDoc(): Record<string, number> {
  const doc = fs.readFileSync(DOC_PATH, "utf8");
  const out: Record<string, number> = {};

  for (const line of doc.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cols = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

    // Interested only in the audit tables where column order is:
    // Module | Topic ID | Supabase seeded | Static
    if (cols.length !== 4) continue;

    const topic = cols[1].replaceAll("`", "");
    const supabaseCell = cols[2];
    if (!/^[a-z][a-z0-9_]*$/.test(topic)) continue;

    out[topic] = parseSupabaseCount(supabaseCell);
  }

  return out;
}

function parseQuestionInsertsByTopicFromMigrations(): Record<string, number> {
  const out: Record<string, number> = {};
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    const lines = sql.split("\n");
    let inQuestionInsert = false;

    for (const line of lines) {
      if (/INSERT\s+INTO\s+questions/i.test(line)) {
        inQuestionInsert = true;
      }
      if (!inQuestionInsert) continue;

      const uuids = line.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi) ?? [];
      for (const uuidRaw of uuids) {
        const slug = MIGRATION_UUID_TO_SLUG[uuidRaw.toLowerCase()];
        if (!slug) continue;
        out[slug] = (out[slug] ?? 0) + 1;
      }

      if (line.includes(";")) {
        inQuestionInsert = false;
      }
    }
  }

  return out;
}

describe("questions canonical count regression", () => {
  it("matches per-topic Supabase seeded counts documented in docs/questions-source-of-truth.md", () => {
    const docCounts = parseCanonicalCountsFromDoc();
    const migrationCounts = parseQuestionInsertsByTopicFromMigrations();

    const topicsInDoc = Object.keys(docCounts);
    expect(topicsInDoc.length).toBeGreaterThan(0);

    for (const topic of topicsInDoc) {
      expect(migrationCounts[topic] ?? 0).toBe(docCounts[topic]);
    }
  });
});
