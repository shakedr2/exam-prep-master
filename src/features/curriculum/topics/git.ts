import { GitBranch } from "lucide-react";
import type { Topic } from "../types";
import { gitTutor } from "../prompts/git-tutor";

export const gitTopic: Topic = {
  id: "git",
  slug: "git",
  name: "Git / ניהול גרסאות",
  description: "Version control from zero to confident GitHub collaborator.",
  track: "devops",
  icon: GitBranch,
  accent: {
    gradient: "from-orange-500 to-red-500",
    text: "text-orange-600",
    ring: "ring-orange-500/30",
  },
  tutor: gitTutor,
  modules: [
    {
      id: "git-intro",
      title: "What is VCS",
      emoji: "🕰️",
      description: "Why version control exists.",
      lessons: [
        {
          id: "git-intro-01",
          level: "beginner",
          title: "Version control, explained",
          description: "Local vs. centralised vs. distributed.",
          objectives: [
            "Explain why teams need VCS",
            "Compare SVN and Git",
            "Grasp Git's snapshot model",
          ],
          keyTerms: ["VCS", "commit", "snapshot", "distributed"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "git-init",
      title: "Init & Clone",
      emoji: "🎬",
      description: "Creating and copying repositories.",
      lessons: [
        {
          id: "git-init-01",
          level: "beginner",
          title: "git init vs. git clone",
          description: "Two ways to get a repo.",
          objectives: [
            "Init a new repo",
            "Clone an existing repo",
            "Understand the .git directory",
          ],
          keyTerms: ["git init", "git clone", ".git", "origin"],
          practiceQuestions: 3,
        },
        {
          id: "git-init-02",
          level: "beginner",
          title: "Configuration",
          description: "user.name, user.email, aliases.",
          objectives: [
            "Set your identity",
            "Use --global vs. local config",
            "Create a simple alias",
          ],
          keyTerms: ["git config", "user.name", "alias"],
          practiceQuestions: 2,
        },
      ],
    },
    {
      id: "git-commit",
      title: "Add & Commit",
      emoji: "💾",
      description: "The basic workflow.",
      lessons: [
        {
          id: "git-commit-01",
          level: "beginner",
          title: "The three trees",
          description: "Working tree, index, HEAD.",
          objectives: [
            "Trace a file from edit to committed",
            "Read `git status` output",
            "Use `git diff` and `git diff --cached`",
          ],
          keyTerms: ["working tree", "index", "HEAD", "git status"],
          practiceQuestions: 5,
        },
        {
          id: "git-commit-02",
          level: "beginner",
          title: "Writing good commits",
          description: "Messages, -p partial stages, amend.",
          objectives: [
            "Write a conventional-commit style message",
            "Stage parts of a file with -p",
            "Amend the last commit safely",
          ],
          keyTerms: ["commit -m", "git add -p", "git commit --amend"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "git-branch",
      title: "Branches",
      emoji: "🌿",
      description: "Parallel lines of development.",
      lessons: [
        {
          id: "git-branch-01",
          level: "intermediate",
          title: "Branches are pointers",
          description: "What a branch actually is.",
          objectives: [
            "Create and switch branches",
            "Understand HEAD and detached HEAD",
            "Delete a branch safely",
          ],
          keyTerms: ["git branch", "git switch", "HEAD", "detached HEAD"],
          practiceQuestions: 5,
        },
      ],
    },
    {
      id: "git-merge",
      title: "Merge & Rebase",
      emoji: "🔀",
      description: "Bringing branches together.",
      lessons: [
        {
          id: "git-merge-01",
          level: "intermediate",
          title: "Merge vs. rebase",
          description: "Three-way merge, fast-forward, linear history.",
          objectives: [
            "Fast-forward merge a branch",
            "Resolve a 3-way merge conflict",
            "Know when to prefer rebase",
          ],
          keyTerms: ["merge", "rebase", "fast-forward", "conflict"],
          practiceQuestions: 5,
        },
        {
          id: "git-merge-02",
          level: "advanced",
          title: "Interactive rebase",
          description: "Editing history before pushing.",
          objectives: [
            "Squash commits with rebase -i",
            "Reword commit messages",
            "Reorder commits safely",
          ],
          keyTerms: ["rebase -i", "squash", "fixup", "reword"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "git-remote",
      title: "Remote",
      emoji: "🌍",
      description: "Pushing and pulling with others.",
      lessons: [
        {
          id: "git-remote-01",
          level: "intermediate",
          title: "fetch, pull, push",
          description: "Moving commits across machines.",
          objectives: [
            "Distinguish fetch from pull",
            "Push to an existing branch",
            "Set upstream with -u",
          ],
          keyTerms: ["origin", "fetch", "pull", "push", "-u"],
          practiceQuestions: 4,
        },
      ],
    },
    {
      id: "git-github",
      title: "GitHub Workflow",
      emoji: "🐙",
      description: "Pull requests and collaboration.",
      lessons: [
        {
          id: "git-gh-01",
          level: "intermediate",
          title: "Fork, PR, review",
          description: "The open-source loop.",
          objectives: [
            "Fork a repo",
            "Open a pull request",
            "Address review comments",
          ],
          keyTerms: ["fork", "pull request", "review", "squash merge"],
          practiceQuestions: 3,
        },
      ],
    },
    {
      id: "git-advanced",
      title: "Advanced",
      emoji: "🧠",
      description: "cherry-pick, bisect, reflog, stash.",
      lessons: [
        {
          id: "git-adv-01",
          level: "advanced",
          title: "cherry-pick & stash",
          description: "Surgical moves and saving work-in-progress.",
          objectives: [
            "Cherry-pick a commit onto another branch",
            "Stash dirty work and restore it",
            "Apply a specific stash",
          ],
          keyTerms: ["cherry-pick", "stash", "stash pop"],
          practiceQuestions: 3,
        },
        {
          id: "git-adv-02",
          level: "advanced",
          title: "bisect & reflog",
          description: "Finding bad commits, recovering lost ones.",
          objectives: [
            "Run a git bisect session",
            "Recover a commit with reflog",
            "Understand why nothing is ever truly lost in Git",
          ],
          keyTerms: ["bisect", "reflog", "lost commit"],
          practiceQuestions: 3,
        },
      ],
    },
  ],
};
