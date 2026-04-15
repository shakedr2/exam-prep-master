import { GitMerge } from "lucide-react";
import type { Topic } from "../types";
import { cicdTutor } from "../prompts/cicd-tutor";

export const cicdTopic: Topic = {
  id: "cicd",
  slug: "cicd",
  name: "CI/CD / אוטומציה",
  description: "Automate build, test and deploy with GitHub Actions & Jenkins.",
  track: "devops",
  icon: GitMerge,
  accent: {
    gradient: "from-fuchsia-500 to-rose-500",
    text: "text-fuchsia-600",
    ring: "ring-fuchsia-500/30",
  },
  tutor: cicdTutor,
  modules: [
    {
      id: "ci-intro",
      title: "What is CI/CD",
      emoji: "🚦",
      description: "Why automate at all?",
      lessons: [
        {
          id: "ci-intro-01",
          level: "beginner",
          title: "CI vs. CD vs. Continuous Deployment",
          description: "Three overlapping ideas.",
          objectives: [
            "Define CI, CD, Continuous Deployment",
            "Explain trunk-based development",
            "List the pains automation solves",
          ],
          keyTerms: ["CI", "CD", "deploy", "trunk"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "ci-actions",
      title: "GitHub Actions Basics",
      emoji: "🎬",
      description: "Your first workflow.",
      lessons: [
        {
          id: "ci-act-01",
          level: "beginner",
          title: "Workflows folder",
          description: ".github/workflows and triggers.",
          objectives: [
            "Create a minimal workflow file",
            "Trigger on push and pull_request",
            "Run a hello-world job",
          ],
          keyTerms: [".github/workflows", "on:", "jobs:", "runs-on"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "ci-workflows",
      title: "Workflows",
      emoji: "🗂️",
      description: "YAML structure, reuse, matrix.",
      lessons: [
        {
          id: "ci-wf-01",
          level: "intermediate",
          title: "Matrix & reusable workflows",
          description: "DRY across versions and repos.",
          objectives: [
            "Build a matrix for Node 18/20",
            "Call a reusable workflow with `uses:`",
            "Set concurrency and cancel-in-progress",
          ],
          keyTerms: ["matrix", "reusable", "uses:", "concurrency"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "ci-jobs",
      title: "Jobs & Steps",
      emoji: "🧱",
      description: "Structure a pipeline.",
      lessons: [
        {
          id: "ci-jb-01",
          level: "intermediate",
          title: "needs, outputs, artifacts",
          description: "Passing data between jobs.",
          objectives: [
            "Chain jobs with `needs:`",
            "Publish and consume an artifact",
            "Use a step output in a later job",
          ],
          keyTerms: ["needs:", "outputs", "upload-artifact", "download-artifact"],
          practiceQuestions: 4,
        },
        {
          id: "ci-jb-02",
          level: "intermediate",
          title: "Secrets & env",
          description: "Handle credentials safely.",
          objectives: [
            "Reference `secrets.*` in a step",
            "Set `env:` at job vs. step level",
            "Avoid leaking secrets in logs",
          ],
          keyTerms: ["secrets", "env:", "masked"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "ci-test",
      title: "Testing in CI",
      emoji: "🧪",
      description: "Fast, deterministic, informative.",
      lessons: [
        {
          id: "ci-tst-01",
          level: "intermediate",
          title: "Caching & parallelisation",
          description: "Make CI fast enough to trust.",
          objectives: [
            "Cache npm / pip / Maven deps",
            "Split tests across matrix shards",
            "Upload a coverage report",
          ],
          keyTerms: ["actions/cache", "shard", "coverage"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "ci-deploy",
      title: "Deploy Pipelines",
      emoji: "🚀",
      description: "From merge to production.",
      lessons: [
        {
          id: "ci-dp-01",
          level: "advanced",
          title: "Environments & approvals",
          description: "Gating production deploys.",
          objectives: [
            "Define staging and production environments",
            "Require manual approval",
            "Roll back on failure",
          ],
          keyTerms: ["environment", "approval", "rollback"],
          practiceQuestions: 3,
        },
        {
          id: "ci-dp-02",
          level: "advanced",
          title: "Blue/green & canary",
          description: "Safer release patterns.",
          objectives: [
            "Contrast blue/green and canary",
            "Design a 5% canary rollout",
            "Monitor a deploy with SLOs",
          ],
          keyTerms: ["blue/green", "canary", "SLO"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "ci-jenkins",
      title: "Jenkins Intro",
      emoji: "🛠️",
      description: "The long-standing workhorse.",
      lessons: [
        {
          id: "ci-jk-01",
          level: "advanced",
          title: "Jenkinsfile basics",
          description: "Declarative pipeline syntax.",
          objectives: [
            "Write a minimal declarative pipeline",
            "Use stages and steps",
            "Parameterise a build",
          ],
          keyTerms: ["Jenkinsfile", "pipeline", "stages", "agent"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "ci-adv",
      title: "Advanced Patterns",
      emoji: "🧠",
      description: "Monorepos, GitOps, supply-chain.",
      lessons: [
        {
          id: "ci-adv-01",
          level: "advanced",
          title: "Monorepo & path filtering",
          description: "Only rebuild what changed.",
          objectives: [
            "Use `paths:` filters",
            "Compute changed services in a job",
            "Scale a pipeline across many services",
          ],
          keyTerms: ["paths", "monorepo", "dorny/paths-filter"],
          practiceQuestions: 3,
        },
      ],
    },
  ],
};
