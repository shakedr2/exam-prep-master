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
 * Falls back to pythonTutor when the ID is unknown.
 */
export function getTutorConfig(topicId: string | undefined): TutorConfig {
  if (!topicId) return pythonTutor;
  return tutorRegistry[topicId] ?? pythonTutor;
}
