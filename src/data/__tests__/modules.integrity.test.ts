import { describe, expect, it } from "vitest";

import { MODULES, getModulesByTrack } from "@/data/modules";
import { questions } from "@/data/questions";
import { resolveTopicId } from "@/data/topicTutorials";

const HEBREW_RE = /[\u0590-\u05FF]/;

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

    expect(pythonBasics.length).toBe(6);
    expect(oop.length).toBe(4);
    expect(devops.length).toBe(4);

    for (const trackModules of [pythonBasics, oop, devops]) {
      for (let i = 1; i < trackModules.length; i += 1) {
        expect(trackModules[i].order).toBeGreaterThan(trackModules[i - 1].order);
      }
    }
  });
});
