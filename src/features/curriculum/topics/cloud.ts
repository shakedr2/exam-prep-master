import { Cloud } from "lucide-react";
import type { Topic } from "../types";
import { cloudTutor } from "../prompts/cloud-tutor";

export const cloudTopic: Topic = {
  id: "cloud",
  slug: "cloud",
  name: "Cloud / ענן",
  description: "AWS-first cloud fundamentals, with GCP as a counterweight.",
  track: "devops",
  icon: Cloud,
  accent: {
    gradient: "from-amber-500 to-orange-500",
    text: "text-amber-600",
    ring: "ring-amber-500/30",
  },
  tutor: cloudTutor,
  modules: [
    {
      id: "cl-intro",
      title: "What is Cloud",
      emoji: "☁️",
      description: "IaaS, PaaS, SaaS and regions.",
      lessons: [
        {
          id: "cl-intro-01",
          level: "beginner",
          title: "Service models & regions",
          description: "Where your workload actually runs.",
          objectives: [
            "Distinguish IaaS, PaaS, SaaS with an example each",
            "Explain regions vs. availability zones",
            "Understand the shared-responsibility model",
          ],
          keyTerms: ["IaaS", "PaaS", "SaaS", "region", "AZ"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "cl-aws",
      title: "AWS Overview",
      emoji: "🟧",
      description: "Console, CLI, billing.",
      lessons: [
        {
          id: "cl-aws-01",
          level: "beginner",
          title: "Root vs. IAM user, AWS CLI",
          description: "Getting started without footguns.",
          objectives: [
            "Understand why not to use root for work",
            "Install and configure AWS CLI",
            "Read the billing dashboard",
          ],
          keyTerms: ["root", "IAM user", "aws configure", "free tier"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "cl-ec2",
      title: "EC2",
      emoji: "🖥️",
      description: "Virtual machines on demand.",
      lessons: [
        {
          id: "cl-ec2-01",
          level: "intermediate",
          title: "Launching an instance",
          description: "AMIs, types, key pairs, SGs.",
          objectives: [
            "Launch an EC2 from an Amazon Linux AMI",
            "SSH in with a key pair",
            "Configure a security group",
          ],
          keyTerms: ["EC2", "AMI", "t3.micro", "security group"],
          practiceQuestions: 4,
        },
        {
          id: "cl-ec2-02",
          level: "advanced",
          title: "Spot, reserved, savings plans",
          description: "Paying a lot less for the same compute.",
          objectives: [
            "Explain spot interruption behaviour",
            "Compare spot, reserved, on-demand",
            "Know when savings plans beat reserved",
          ],
          keyTerms: ["spot", "reserved", "savings plan"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "cl-s3",
      title: "S3",
      emoji: "🪣",
      description: "Object storage.",
      lessons: [
        {
          id: "cl-s3-01",
          level: "intermediate",
          title: "Buckets, objects, storage classes",
          description: "How S3 really works.",
          objectives: [
            "Create a bucket",
            "Upload and list objects",
            "Choose a storage class for a use case",
          ],
          keyTerms: ["bucket", "object", "Standard", "Glacier"],
          practiceQuestions: 4,
        },
        {
          id: "cl-s3-02",
          level: "advanced",
          title: "Versioning, lifecycle, policies",
          description: "Keeping S3 safe, cheap, and private.",
          objectives: [
            "Enable versioning",
            "Write a lifecycle rule",
            "Deny public access explicitly",
          ],
          keyTerms: ["versioning", "lifecycle", "bucket policy"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "cl-iam",
      title: "IAM",
      emoji: "🗝️",
      description: "Who can do what.",
      lessons: [
        {
          id: "cl-iam-01",
          level: "intermediate",
          title: "Users, roles, policies",
          description: "The identity model.",
          objectives: [
            "Distinguish users, groups, roles",
            "Read a JSON policy",
            "Apply least-privilege to a real example",
          ],
          keyTerms: ["user", "role", "policy", "least privilege"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "cl-vpc",
      title: "VPC",
      emoji: "🏘️",
      description: "Network isolation in the cloud.",
      lessons: [
        {
          id: "cl-vpc-01",
          level: "advanced",
          title: "Subnets, routes, gateways",
          description: "Building a VPC from scratch.",
          objectives: [
            "Design public vs. private subnets",
            "Attach IGW and NAT Gateway correctly",
            "Contrast SG with NACL",
          ],
          keyTerms: ["VPC", "subnet", "IGW", "NAT", "route table"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "cl-rds",
      title: "RDS",
      emoji: "🗄️",
      description: "Managed relational databases.",
      lessons: [
        {
          id: "cl-rds-01",
          level: "advanced",
          title: "Engines, Multi-AZ, backups",
          description: "Running Postgres without running Postgres.",
          objectives: [
            "Launch an RDS Postgres instance",
            "Enable Multi-AZ and understand its impact",
            "Configure automated backups / PITR",
          ],
          keyTerms: ["RDS", "Postgres", "Multi-AZ", "PITR"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "cl-gcp",
      title: "GCP Comparison",
      emoji: "🟦",
      description: "Same ideas, different names.",
      lessons: [
        {
          id: "cl-gcp-01",
          level: "advanced",
          title: "GCP equivalents",
          description: "Compute Engine, Cloud Storage, IAM, VPC.",
          objectives: [
            "Map AWS services to GCP equivalents",
            "Know GCP-native wins (BigQuery)",
            "Read a gcloud CLI command",
          ],
          keyTerms: ["Compute Engine", "Cloud Storage", "BigQuery", "gcloud"],
          practiceQuestions: 3,
        },
      ],
    },
  ],
};
