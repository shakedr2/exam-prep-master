import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { getModulesByTrack } from "@/data/modules";
import { resolveTopicId } from "@/data/topicTutorials";

// ---------------------------------------------------------------------------
// Phase 3 regression test (count slice of #242).
//
// Guards the canonical-source contract from docs/questions-source-of-truth.md:
// every DevOps module topic declared in modules.ts MUST have a matching
// Supabase seed migration. If this test fails, the UI will advertise a
// question count (via the static fallback) that Practice cannot deliver.
// ---------------------------------------------------------------------------

const MIGRATIONS_DIR = path.resolve(__dirname, "../../../supabase/migrations");

function collectQuestionInsertsByTopic(): Map<string, number> {
  const counts = new Map<string, number>();
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));

  for (const file of files) {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");

    // Matches an INSERT INTO questions statement and captures its VALUES block.
    // We do not try to parse full SQL — we only need the topic_id referenced
    // on each row. The migrations use one VALUES tuple per INSERT, so counting
    // INSERT statements with a specific topic UUID is sufficient.
    const insertBlocks = sql.split(/INSERT\s+INTO\s+questions\b/i).slice(1);
    for (const block of insertBlocks) {
      const uuidMatch = block.match(
        /'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'/i,
      );
      if (!uuidMatch) continue;
      // The first UUID inside an INSERT INTO questions (…) VALUES (…) block is
      // either the question id (when `id` is listed first) or the topic_id
      // (when `id` is omitted and `topic_id` leads). Check both positions:
      // grab up to the first two UUIDs and classify.
      const uuids = [...block.matchAll(/'([0-9a-f-]{36})'/gi)].slice(0, 2);
      const topicUuid = uuids.length === 2 ? uuids[1][1] : uuids[0][1];
      counts.set(topicUuid, (counts.get(topicUuid) ?? 0) + 1);
    }
  }
  return counts;
}

describe("DevOps question counts — migration coverage (Phase 3, #298)", () => {
  const seededCounts = collectQuestionInsertsByTopic();
  const devopsModules = getModulesByTrack("devops");

  it("covers every DevOps module with a Supabase seed migration", () => {
    const missing: string[] = [];
    for (const module of devopsModules) {
      for (const slug of module.topicIds) {
        const resolved = resolveTopicId(slug);
        expect(resolved, `DevOps topic ${slug} has no UUID mapping`).not.toBeNull();
        const count = seededCounts.get(resolved!.uuid) ?? 0;
        if (count === 0) missing.push(`${module.id}/${slug} (${resolved!.uuid})`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("seeds at least 5 questions for each DevOps topic (parity with content plan)", () => {
    for (const module of devopsModules) {
      for (const slug of module.topicIds) {
        const uuid = resolveTopicId(slug)!.uuid;
        const count = seededCounts.get(uuid) ?? 0;
        expect(
          count,
          `DevOps topic ${slug} (${uuid}) has only ${count} Supabase-seeded questions (expected ≥ 5)`,
        ).toBeGreaterThanOrEqual(5);
      }
    }
  });
});
