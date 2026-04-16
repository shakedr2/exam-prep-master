import { Container } from "lucide-react";
import type { Topic } from "../types";
import { dockerTutor } from "../prompts/docker-tutor";

export const dockerTopic: Topic = {
  id: "docker",
  slug: "docker",
  name: "Docker / קונטיינרים",
  description: "Containerize any app, then orchestrate stacks with Compose.",
  track: "devops",
  icon: Container,
  accent: {
    gradient: "from-sky-500 to-indigo-500",
    text: "text-sky-600",
    ring: "ring-sky-500/30",
  },
  tutor: dockerTutor,
  modules: [
    {
      id: "dk-intro",
      title: "What is Containerization",
      emoji: "📦",
      description: "VMs vs. containers, namespaces, cgroups.",
      lessons: [
        {
          id: "dk-intro-01",
          level: "beginner",
          title: "Containers 101",
          description: "The \"works on my machine\" problem.",
          objectives: [
            "Contrast VMs and containers",
            "Explain namespaces at a high level",
            "State why Docker won the market",
          ],
          keyTerms: ["container", "VM", "namespace", "cgroup"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "dk-install",
      title: "Install Docker",
      emoji: "🧰",
      description: "Getting Docker running locally.",
      lessons: [
        {
          id: "dk-inst-01",
          level: "beginner",
          title: "Docker Desktop & verify",
          description: "Install, then `docker run hello-world`.",
          objectives: [
            "Install Docker Desktop or Engine",
            "Verify with hello-world",
            "Understand the daemon/CLI split",
          ],
          keyTerms: ["Docker Desktop", "daemon", "CLI"],
          practiceQuestions: 2,
        },
      ],
    },
    {
      id: "dk-images",
      title: "Images",
      emoji: "🎨",
      description: "Layered, immutable artifacts.",
      lessons: [
        {
          id: "dk-img-01",
          level: "beginner",
          title: "Images & tags",
          description: "docker pull, tags, digests.",
          objectives: [
            "Pull an image by tag and by digest",
            "Inspect image layers",
            "Distinguish tag from digest",
          ],
          keyTerms: ["image", "tag", "digest", "layer"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "dk-containers",
      title: "Containers",
      emoji: "🧱",
      description: "Running instances of an image.",
      lessons: [
        {
          id: "dk-cn-01",
          level: "beginner",
          title: "docker run flags",
          description: "-it, -d, --rm, -p, --name.",
          objectives: [
            "Run an interactive shell with -it",
            "Publish ports with -p",
            "Remove a container automatically with --rm",
          ],
          keyTerms: ["-it", "-d", "--rm", "-p", "--name"],
          practiceQuestions: 5,
        },
        {
          id: "dk-cn-02",
          level: "beginner",
          title: "ps, exec, logs",
          description: "Inspecting running containers.",
          objectives: [
            "List running & stopped containers",
            "Exec into a running container",
            "Read container logs",
          ],
          keyTerms: ["docker ps", "exec", "logs", "stop"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "dk-dockerfile",
      title: "Dockerfile",
      emoji: "📜",
      description: "Building your own images.",
      lessons: [
        {
          id: "dk-df-01",
          level: "intermediate",
          title: "Dockerfile basics",
          description: "FROM, RUN, COPY, WORKDIR, CMD.",
          objectives: [
            "Write a Dockerfile for a Python app",
            "Know CMD vs. ENTRYPOINT",
            "Use .dockerignore",
          ],
          keyTerms: ["FROM", "RUN", "COPY", "CMD", "ENTRYPOINT"],
          practiceQuestions: 5,
        },
        {
          id: "dk-df-02",
          level: "advanced",
          title: "Layer caching & multi-stage",
          description: "Smaller, faster images.",
          objectives: [
            "Order Dockerfile lines for cache hits",
            "Write a multi-stage build",
            "Audit image size",
          ],
          keyTerms: ["cache", "multi-stage", "AS builder", "scratch"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "dk-volumes",
      title: "Volumes",
      emoji: "💽",
      description: "Persistent state outside the container.",
      lessons: [
        {
          id: "dk-vol-01",
          level: "intermediate",
          title: "Named volumes & bind mounts",
          description: "When to use which.",
          objectives: [
            "Create and use a named volume",
            "Bind-mount a host directory",
            "Back up volume contents",
          ],
          keyTerms: ["volume", "bind mount", "tmpfs"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "dk-net",
      title: "Networking",
      emoji: "🔌",
      description: "Container-to-container communication.",
      lessons: [
        {
          id: "dk-net-01",
          level: "advanced",
          title: "Bridge, host, none",
          description: "Docker's built-in network drivers.",
          objectives: [
            "Create a user-defined bridge",
            "Resolve one container from another by name",
            "Publish vs. expose a port",
          ],
          keyTerms: ["bridge", "host", "none", "publish"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "dk-compose",
      title: "Docker Compose",
      emoji: "🎼",
      description: "Multi-service stacks.",
      lessons: [
        {
          id: "dk-cmp-01",
          level: "advanced",
          title: "docker-compose.yml",
          description: "Services, networks, volumes.",
          objectives: [
            "Write a Compose file for web + DB",
            "Use depends_on and healthchecks",
            "Scale a service",
          ],
          keyTerms: ["compose", "services", "depends_on", "healthcheck"],
          practiceQuestions: 4,
        },
      ],
    },
  ],
};
