import { FileCode2 } from "lucide-react";
import type { Topic } from "../types";
import { iacTutor } from "../prompts/iac-tutor";

export const iacTopic: Topic = {
  id: "iac",
  slug: "iac",
  name: "IaC / Terraform",
  description: "Describe infrastructure as code, apply it with confidence.",
  track: "devops",
  icon: FileCode2,
  accent: {
    gradient: "from-violet-500 to-purple-600",
    text: "text-violet-600",
    ring: "ring-violet-500/30",
  },
  tutor: iacTutor,
  modules: [
    {
      id: "iac-intro",
      title: "What is IaC",
      emoji: "📝",
      description: "Declarative vs. imperative, drift, tools.",
      lessons: [
        {
          id: "iac-intro-01",
          level: "beginner",
          title: "IaC 101",
          description: "Why click-ops doesn't scale.",
          objectives: [
            "Define IaC",
            "Distinguish declarative from imperative",
            "Compare Terraform, Pulumi, CDK, Ansible",
          ],
          keyTerms: ["IaC", "declarative", "drift", "idempotent"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "iac-tf-basics",
      title: "Terraform Basics",
      emoji: "🌍",
      description: "init, plan, apply, destroy.",
      lessons: [
        {
          id: "iac-bs-01",
          level: "beginner",
          title: "The core loop",
          description: "Your first working .tf file.",
          objectives: [
            "Run init, plan, apply",
            "Read a plan output",
            "Run destroy safely",
          ],
          keyTerms: ["terraform init", "plan", "apply", "destroy"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "iac-providers",
      title: "Providers",
      emoji: "🔌",
      description: "Connecting Terraform to a cloud.",
      lessons: [
        {
          id: "iac-pr-01",
          level: "intermediate",
          title: "required_providers & auth",
          description: "Pinning versions and logging in.",
          objectives: [
            "Pin a provider version",
            "Authenticate to AWS / GCP",
            "Use provider aliases",
          ],
          keyTerms: ["required_providers", "provider", "alias"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "iac-resources",
      title: "Resources",
      emoji: "🧱",
      description: "The building blocks.",
      lessons: [
        {
          id: "iac-rs-01",
          level: "intermediate",
          title: "Writing resources",
          description: "resource blocks, attributes, references.",
          objectives: [
            "Create a simple S3 bucket resource",
            "Reference attributes between resources",
            "Use for_each and count",
          ],
          keyTerms: ["resource", "attribute", "for_each", "count"],
          practiceQuestions: 5,
        },
      ],
    },
    {
      id: "iac-vars",
      title: "Variables & Outputs",
      emoji: "📥",
      description: "Parametrizing your config.",
      lessons: [
        {
          id: "iac-vr-01",
          level: "intermediate",
          title: "variable, locals, output",
          description: "Inputs, intermediate values, exports.",
          objectives: [
            "Define a typed variable with default",
            "Use locals for repeated expressions",
            "Output a value for consumers",
          ],
          keyTerms: ["variable", "locals", "output", "tfvars"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "iac-state",
      title: "State",
      emoji: "🗺️",
      description: "The most important mental model.",
      lessons: [
        {
          id: "iac-st-01",
          level: "advanced",
          title: "Local vs. remote state",
          description: "Why you need a backend.",
          objectives: [
            "Explain what terraform.tfstate holds",
            "Configure S3 + DynamoDB backend",
            "Never commit state to git",
          ],
          keyTerms: ["tfstate", "backend", "S3", "DynamoDB lock"],
          practiceQuestions: 4,
        },
        {
          id: "iac-st-02",
          level: "advanced",
          title: "terraform state commands",
          description: "Safe state surgery.",
          objectives: [
            "List resources in state",
            "Move a resource in state",
            "Import an existing resource",
          ],
          keyTerms: ["state list", "state mv", "import", "moved"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "iac-modules",
      title: "Modules",
      emoji: "🧩",
      description: "Reusable units of infra.",
      lessons: [
        {
          id: "iac-md-01",
          level: "advanced",
          title: "Writing a module",
          description: "Inputs, outputs, source =.",
          objectives: [
            "Extract repeated resources into a module",
            "Pass variables in, read outputs out",
            "Version a module from git / registry",
          ],
          keyTerms: ["module", "source", "registry", "outputs"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "iac-real",
      title: "Real-world Patterns",
      emoji: "🏗️",
      description: "How teams actually use Terraform.",
      lessons: [
        {
          id: "iac-rl-01",
          level: "advanced",
          title: "Environments, CI, secrets",
          description: "Production-grade Terraform.",
          objectives: [
            "Separate state per environment",
            "Run Terraform in CI with plan/apply gates",
            "Keep secrets out of .tf files",
          ],
          keyTerms: ["workspace", "CI", "Vault", "SSM"],
          practiceQuestions: 3,
        },
      ],
    },
  ],
};
