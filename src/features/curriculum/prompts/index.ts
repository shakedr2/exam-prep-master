/**
 * Tutor prompt registry.
 *
 * Maps topic / module IDs to their corresponding TutorConfig.
 * Used by the practice view (FloatingAIButton) to show the correct
 * AI agent name and personality for the current topic.
 *
 * Two kinds of IDs are handled:
 *  - Old exam-prep Python topic slugs (variables_io, arithmetic, …)
 *  - New curriculum topic IDs (python, linux, git, …)
 */

import type { TutorConfig } from "../types";
import { resolveTopicId } from "@/data/topicTutorials";

export { pythonTutor } from "./python-tutor";
export { linuxTutor } from "./linux-tutor";
export { bashTutor } from "./bash-tutor";
export { permissionsTutor } from "./permissions-tutor";
export { oopTutor } from "./oop-tutor";
export { gitTutor } from "./git-tutor";
export { networkingTutor } from "./networking-tutor";
export { dockerTutor } from "./docker-tutor";
export { cicdTutor } from "./cicd-tutor";
export { cloudTutor } from "./cloud-tutor";
export { iacTutor } from "./iac-tutor";

import { pythonTutor } from "./python-tutor";
import { linuxTutor } from "./linux-tutor";
import { bashTutor } from "./bash-tutor";
import { permissionsTutor } from "./permissions-tutor";
import { oopTutor } from "./oop-tutor";
import { gitTutor } from "./git-tutor";
import { networkingTutor } from "./networking-tutor";
import { dockerTutor } from "./docker-tutor";
import { cicdTutor } from "./cicd-tutor";
import { cloudTutor } from "./cloud-tutor";
import { iacTutor } from "./iac-tutor";

/**
 * Registry mapping every known topic / module ID to its TutorConfig.
 *
 * Covers both:
 * - Old exam-prep Python slugs (variables_io, arithmetic, …)
 * - New curriculum topic IDs (python, linux, git, …) and module slugs
 */
export const tutorRegistry: Record<string, TutorConfig> = {
  // ── Old Python exam-prep topic slugs ───────────────────────────────────
  variables_io: pythonTutor,
  arithmetic: pythonTutor,
  conditions: pythonTutor,
  loops: pythonTutor,
  functions: pythonTutor,
  strings: pythonTutor,
  lists: pythonTutor,
  tuples_sets_dicts: pythonTutor,
  tracing: pythonTutor,

  // ── Python OOP module slugs ────────────────────────────────────────────
  classes_objects: oopTutor,
  inheritance: oopTutor,
  polymorphism: oopTutor,
  decorators_special: oopTutor,
  python_oop: oopTutor,

  // ── DevOps module slugs ────────────────────────────────────────────────
  linux_basics: linuxTutor,
  bash_scripting: bashTutor,
  file_permissions: permissionsTutor,
  networking_fundamentals: networkingTutor,

  // ── New curriculum topic IDs ────────────────────────────────────────────
  python: pythonTutor,
  linux: linuxTutor,
  bash: bashTutor,
  permissions: permissionsTutor,
  oop: oopTutor,
  git: gitTutor,
  networking: networkingTutor,
  docker: dockerTutor,
  cicd: cicdTutor,
  cloud: cloudTutor,
  iac: iacTutor,
};

/**
 * Look up the TutorConfig for a given topic or module ID.
 *
 * Accepts either the slug form (`classes_objects`, `linux_basics`) used in
 * code/URLs or the UUID form (`11111111-0009-…`) used by the Supabase data
 * layer — the UUID is normalised back to its slug before the lookup so both
 * forms resolve to the same persona.
 *
 * Falls back to pythonTutor when the ID is unknown.
 */
export function getTutorConfig(topicId: string | undefined): TutorConfig {
  if (!topicId) return pythonTutor;
  const direct = tutorRegistry[topicId];
  if (direct) return direct;
  const resolved = resolveTopicId(topicId);
  if (resolved && tutorRegistry[resolved.slug]) {
    return tutorRegistry[resolved.slug];
  }
  return pythonTutor;
}
