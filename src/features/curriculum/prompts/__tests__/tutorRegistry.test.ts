import { describe, expect, it } from "vitest";

import { MODULES } from "@/data/modules";
import { topics as questionTopics } from "@/data/questions";
import {
  bashTutor,
  getTutorConfig,
  linuxTutor,
  networkingTutor,
  oopTutor,
  permissionsTutor,
  pythonTutor,
  tutorRegistry,
} from "../index";

/**
 * Coverage test for the tutor registry.
 *
 * Guarantees that every module slug declared in `src/data/modules.ts` resolves
 * to the correct tutor persona via {@link getTutorConfig}. Without this the
 * AI tutor silently falls back to `pythonTutor` for non-Python modules (the
 * regression behind #315 / EPIC #324).
 */
describe("tutorRegistry — module slug coverage", () => {
  const expectedByTrack: Record<string, typeof pythonTutor> = {
    "python-fundamentals": pythonTutor,
    "python-oop": oopTutor,
  };

  const expectedByModuleSlug: Record<string, typeof pythonTutor> = {
    linux_basics: linuxTutor,
    file_permissions: permissionsTutor,
    bash_scripting: bashTutor,
    networking_fundamentals: networkingTutor,
  };

  it.each(MODULES.map((m) => [m.id, m.track] as const))(
    "module slug %s (track %s) resolves to the correct tutor persona",
    (slug, track) => {
      const resolved = getTutorConfig(slug);
      const expected =
        expectedByModuleSlug[slug] ??
        expectedByTrack[track ?? "python-fundamentals"];
      expect(resolved).toBe(expected);
    },
  );

  it("OOP module slugs never fall back to pythonTutor", () => {
    const oopModules = MODULES.filter((m) => m.track === "python-oop");
    expect(oopModules.length).toBeGreaterThan(0);
    for (const m of oopModules) {
      expect(getTutorConfig(m.id)).not.toBe(pythonTutor);
      expect(getTutorConfig(m.id)).toBe(oopTutor);
    }
  });

  it("DevOps module slugs never fall back to pythonTutor", () => {
    const devopsModules = MODULES.filter((m) => m.track === "devops");
    expect(devopsModules.length).toBeGreaterThan(0);
    for (const m of devopsModules) {
      expect(getTutorConfig(m.id)).not.toBe(pythonTutor);
    }
  });

  it("direct registry lookup covers every DevOps + OOP module slug", () => {
    // The top-level pythonTutor fallback in getTutorConfig would mask a
    // missing entry. This test checks the registry itself, not the resolver.
    const nonPythonModules = MODULES.filter(
      (m) => m.track === "python-oop" || m.track === "devops",
    );
    for (const m of nonPythonModules) {
      expect(tutorRegistry).toHaveProperty(m.id);
    }
  });

  it("getTutorConfig falls back to pythonTutor for unknown ids", () => {
    expect(getTutorConfig(undefined)).toBe(pythonTutor);
    expect(getTutorConfig("not-a-real-topic")).toBe(pythonTutor);
  });

  it.each(questionTopics.map((t) => [t.id] as const))(
    "topic slug %s from questions.ts is wired to a tutor registry entry",
    (topicId) => {
      expect(tutorRegistry).toHaveProperty(topicId);
    },
  );
});
