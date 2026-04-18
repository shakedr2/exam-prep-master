import { describe, expect, it } from "vitest";
import {
  calcModuleProgress,
  calcResumeTarget,
  calcTopicProgress,
  calcTrackProgress,
  normalizeTopicId,
  type AnsweredMap,
} from "../progressSelectors";
import type { ModuleProgress, TopicProgress } from "../progressTypes";

describe("calcTopicProgress", () => {
  it("computes normal completion percentage", () => {
    const answered: AnsweredMap = { loops: { correct: 5, attempted: 8 } };
    const result = calcTopicProgress("loops", answered, 8, 10);
    expect(result).toEqual({
      topicId: "loops",
      correct: 5,
      attempted: 8,
      totalQuestions: 10,
      completionPct: 50,
    });
  });

  it("uses max(remote, static) for totalQuestions", () => {
    const answered: AnsweredMap = { loops: { correct: 3, attempted: 3 } };
    const remoteBigger = calcTopicProgress("loops", answered, 15, 10);
    expect(remoteBigger.totalQuestions).toBe(15);
    expect(remoteBigger.completionPct).toBe(20);

    const staticBigger = calcTopicProgress("loops", answered, 5, 12);
    expect(staticBigger.totalQuestions).toBe(12);
    expect(staticBigger.completionPct).toBe(25);
  });

  it("guards zero-total (no NaN, completionPct = 0)", () => {
    const answered: AnsweredMap = {};
    const result = calcTopicProgress("empty", answered, 0, 0);
    expect(result.totalQuestions).toBe(0);
    expect(result.completionPct).toBe(0);
    expect(Number.isNaN(result.completionPct)).toBe(false);
  });

  it("clamps completionPct at 100 when correct exceeds total", () => {
    const answered: AnsweredMap = { loops: { correct: 50, attempted: 50 } };
    const result = calcTopicProgress("loops", answered, 10, 10);
    expect(result.completionPct).toBe(100);
  });

  it("clamps completionPct at 0 when correct is negative", () => {
    const answered: AnsweredMap = { loops: { correct: -5, attempted: 2 } };
    const result = calcTopicProgress("loops", answered, 10, 10);
    expect(result.correct).toBe(0);
    expect(result.completionPct).toBe(0);
  });

  it("returns zeros when topicId has no entry in answeredMap", () => {
    const result = calcTopicProgress("missing", {}, 5, 5);
    expect(result.correct).toBe(0);
    expect(result.attempted).toBe(0);
    expect(result.completionPct).toBe(0);
  });
});

describe("normalizeTopicId", () => {
  it("maps UUID to slug when present in slugMap", () => {
    const slugMap: Record<string, string> = {
      "11111111-aaaa-bbbb-cccc-222222222222": "loops",
      "33333333-dddd-eeee-ffff-444444444444": "functions",
    };
    expect(
      normalizeTopicId("11111111-aaaa-bbbb-cccc-222222222222", slugMap)
    ).toBe("loops");
    expect(
      normalizeTopicId("33333333-dddd-eeee-ffff-444444444444", slugMap)
    ).toBe("functions");
  });

  it("passes through when id is already a slug", () => {
    const slugMap: Record<string, string> = {
      "11111111-aaaa-bbbb-cccc-222222222222": "loops",
    };
    expect(normalizeTopicId("loops", slugMap)).toBe("loops");
    expect(normalizeTopicId("variables_io", slugMap)).toBe("variables_io");
  });

  it("passes through when slugMap is empty", () => {
    expect(normalizeTopicId("any-id", {})).toBe("any-id");
  });
});

describe("calcModuleProgress", () => {
  it("uses Σ formula, never average of topic percentages (3/10 + 7/10 = 50%)", () => {
    const topics: TopicProgress[] = [
      {
        topicId: "a",
        correct: 3,
        attempted: 3,
        totalQuestions: 10,
        completionPct: 30,
      },
      {
        topicId: "b",
        correct: 7,
        attempted: 7,
        totalQuestions: 10,
        completionPct: 70,
      },
    ];
    const mod = calcModuleProgress("mod-1", topics);
    expect(mod.correct).toBe(10);
    expect(mod.totalQuestions).toBe(20);
    expect(mod.completionPct).toBe(50);
  });

  it("Σ formula diverges from avg-of-% when denominators differ", () => {
    const topics: TopicProgress[] = [
      {
        topicId: "a",
        correct: 1,
        attempted: 1,
        totalQuestions: 2,
        completionPct: 50,
      },
      {
        topicId: "b",
        correct: 10,
        attempted: 10,
        totalQuestions: 100,
        completionPct: 10,
      },
    ];
    const mod = calcModuleProgress("mod-asym", topics);
    const avgOfPct = Math.round((50 + 10) / 2); // 30
    const sigmaPct = Math.round((11 / 102) * 100); // 11
    expect(avgOfPct).toBe(30);
    expect(sigmaPct).toBe(11);
    expect(mod.completionPct).toBe(sigmaPct);
    expect(mod.completionPct).not.toBe(avgOfPct);
  });

  it("returns 0 completionPct when no topics", () => {
    const mod = calcModuleProgress("empty", []);
    expect(mod.totalQuestions).toBe(0);
    expect(mod.correct).toBe(0);
    expect(mod.completionPct).toBe(0);
  });
});

describe("calcTrackProgress", () => {
  const topic = (
    id: string,
    correct: number,
    total: number
  ): TopicProgress => ({
    topicId: id,
    correct,
    attempted: correct,
    totalQuestions: total,
    completionPct: total === 0 ? 0 : Math.round((correct / total) * 100),
  });

  it("uses Σ formula across modules, not avg-of-modules", () => {
    const modA = calcModuleProgress("m-a", [topic("a1", 50, 100)]);
    const modB = calcModuleProgress("m-b", [topic("b1", 20, 20)]);
    expect(modA.completionPct).toBe(50);
    expect(modB.completionPct).toBe(100);

    const track = calcTrackProgress("python", [modA, modB]);

    const avgOfModules = Math.round((50 + 100) / 2); // 75
    const sigmaPct = Math.round((70 / 120) * 100); // 58
    expect(avgOfModules).toBe(75);
    expect(sigmaPct).toBe(58);
    expect(track.correct).toBe(70);
    expect(track.totalQuestions).toBe(120);
    expect(track.completionPct).toBe(sigmaPct);
    expect(track.completionPct).not.toBe(avgOfModules);
  });

  it("returns 0 when track has no modules", () => {
    const track = calcTrackProgress("devops", []);
    expect(track.totalQuestions).toBe(0);
    expect(track.correct).toBe(0);
    expect(track.completionPct).toBe(0);
  });
});

describe("calcResumeTarget", () => {
  const topic = (id: string, completionPct: number): TopicProgress => ({
    topicId: id,
    correct: completionPct,
    attempted: completionPct,
    totalQuestions: 100,
    completionPct,
  });

  const mkModule = (id: string, topics: TopicProgress[]): ModuleProgress => ({
    moduleId: id,
    topics,
    totalQuestions: topics.reduce((s, t) => s + t.totalQuestions, 0),
    correct: topics.reduce((s, t) => s + t.correct, 0),
    completionPct: 0,
  });

  it("returns the first incomplete topic in module order", () => {
    const modA = mkModule("m-a", [topic("a1", 100), topic("a2", 100)]);
    const modB = mkModule("m-b", [topic("b1", 40), topic("b2", 0)]);
    const track = calcTrackProgress("python", [modA, modB]);

    const target = calcResumeTarget(track);
    expect(target).toEqual({
      trackId: "python",
      moduleId: "m-b",
      topicId: "b1",
    });
  });

  it("returns null when track is 100%", () => {
    const modA = mkModule("m-a", [topic("a1", 100), topic("a2", 100)]);
    const modB = mkModule("m-b", [topic("b1", 100)]);
    const track = calcTrackProgress("python", [modA, modB]);

    const target = calcResumeTarget(track);
    expect(target).toBeNull();
  });

  it("returns the very first topic when nothing has been started", () => {
    const modA = mkModule("m-a", [topic("a1", 0), topic("a2", 0)]);
    const track = calcTrackProgress("python", [modA]);

    const target = calcResumeTarget(track);
    expect(target).toEqual({
      trackId: "python",
      moduleId: "m-a",
      topicId: "a1",
    });
  });
});
