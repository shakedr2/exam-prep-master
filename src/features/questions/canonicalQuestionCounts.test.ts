import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { resolveTopicId } from "@/data/topicTutorials";

const REPO_ROOT = process.cwd();
const DOC_PATH = path.join(REPO_ROOT, "docs/questions-source-of-truth.md");
const MIGRATIONS_DIR = path.join(REPO_ROOT, "supabase/migrations");

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
        const resolved = resolveTopicId(uuidRaw.toLowerCase());
        if (!resolved) continue;
        out[resolved.slug] = (out[resolved.slug] ?? 0) + 1;
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
