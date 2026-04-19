import { describe, expect, it } from "vitest";

import { MODULES, getModulesByTrack } from "@/data/modules";
import { questions } from "@/data/questions";
import { resolveTopicId } from "@/data/topicTutorials";

const HEBREW_RE = /[\u0590-\u05FF]/;

/**
 * Question counts per topic slug in the static catalog. Kept in sync with
 * `src/components/TrackModuleList.tsx:217` which uses the same source.
 */
function countStaticQuestionsBySlug(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of questions) counts[q.topic] = (counts[q.topic] ?? 0) + 1;
  return counts;
}

describe("modules.ts data integrity", () => {
  it("defines structurally valid modules with Hebrew metadata", () => {
    const seenIds = new Set<string>();
    const seenOrders = new Set<number>();

    for (const module of MODULES) {
      expect(module.id).toBeTruthy();
      expect(module.topicIds.length).toBeGreaterThan(0);
      expect(module.icon).toBeTruthy();
      expect(module.track).toBeTruthy();

      expect(HEBREW_RE.test(module.title)).toBe(true);
      expect(HEBREW_RE.test(module.description)).toBe(true);

      expect(seenIds.has(module.id)).toBe(false);
      seenIds.add(module.id);

      expect(seenOrders.has(module.order)).toBe(false);
      seenOrders.add(module.order);
    }
  });

  it("keeps module topic links valid and question entries well-formed", () => {
    for (const module of MODULES) {
      for (const topicId of module.topicIds) {
        const topicQuestions = questions.filter((q) => q.topic === topicId);
        const resolved = resolveTopicId(topicId);
        expect(resolved !== null || topicQuestions.length > 0).toBe(true);
        for (const q of topicQuestions) {
          expect(q.id).toBeTruthy();
          expect(q.topic).toBe(topicId);
          expect(q.type).toBeTruthy();
          expect(q.difficulty).toBeTruthy();

          if (q.type === "quiz" || q.type === "tracing") {
            expect(q.question).toBeTruthy();
          } else {
            expect(q.title).toBeTruthy();
            expect(q.description).toBeTruthy();
          }
        }
      }
    }
  });

  it("returns sorted modules for each track", () => {
    const pythonBasics = getModulesByTrack("python-fundamentals");
    const oop = getModulesByTrack("python-oop");
    const devops = getModulesByTrack("devops");

    expect(pythonBasics.length).toBe(5);
    expect(oop.length).toBe(4);
    expect(devops.length).toBe(4);

    for (const trackModules of [pythonBasics, oop, devops]) {
      for (let i = 1; i < trackModules.length; i += 1) {
        expect(trackModules[i].order).toBeGreaterThan(trackModules[i - 1].order);
      }
    }
  });

  // Regression for #314: the Python Fundamentals track was rendering
  // "מעקב קוד" twice because the `code_tracing` module listed two legacy
  // topic slugs (`tracing`, `math`) that both fell through to the synthesised
  // render path in `TrackModuleList.ModuleSection` — producing two cards
  // whose (title, description) were both taken from the module itself.
  //
  // Slugs that resolve to a UUID (via `resolveTopicId`) render their real
  // per-topic display data from the DB `topics` row (Path A in
  // `TrackModuleList`), so they can't collide with each other. Slugs that
  // have neither a UUID mapping nor static questions are filtered out
  // entirely. The only way to get duplicate rows is to have **more than
  // one unresolved-but-static-backed slug in the same module**.
  it("does not own more than one synthesised-fallback slug per module", () => {
    const staticCounts = countStaticQuestionsBySlug();
    for (const module of MODULES) {
      const synthesisedSlugs = module.topicIds.filter((slug) => {
        const resolved = resolveTopicId(slug);
        const staticCount = staticCounts[slug] ?? 0;
        return resolved === null && staticCount > 0;
      });
      expect(
        synthesisedSlugs.length,
        `Module "${module.id}" owns ${synthesisedSlugs.length} synthesised-fallback slugs (${synthesisedSlugs.join(", ")}); ` +
          "they will render as identical duplicate cards under the module header. " +
          "Either give each slug a UUID mapping in topicTutorials.ts, or fold them into a single canonical slug.",
      ).toBeLessThanOrEqual(1);
    }
  });

  // Regression for #314 part 2: every module in every track must be able to
  // serve at least one question. A module with zero seeded questions and no
  // slug→UUID mapping is a broken tile ("0 questions" card).
  it("every module owns at least one slug that resolves or has static questions", () => {
    const staticCounts = countStaticQuestionsBySlug();
    for (const module of MODULES) {
      const hasSomething = module.topicIds.some((slug) => {
        const resolved = resolveTopicId(slug);
        return (resolved !== null) || (staticCounts[slug] ?? 0) > 0;
      });
      expect(hasSomething, `Module "${module.id}" has no resolvable slug and no static questions`).toBe(true);
    }
  });
});

