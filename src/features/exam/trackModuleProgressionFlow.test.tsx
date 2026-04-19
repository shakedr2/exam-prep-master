import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";

const progressState = vi.hoisted(() => ({ completionPct: 0, correct: 0 }));

vi.mock("@/features/progress/hooks/useTopicProgress", () => ({
  useTopicProgress: () => ({
    topicId: "variables_io",
    completionPct: progressState.completionPct,
    correct: progressState.correct,
    attempted: progressState.correct,
    totalQuestions: 10,
  }),
}));

vi.mock("@/features/progress/hooks/useModuleProgress", () => ({
  useModuleProgress: () => ({ moduleId: "getting_started", completionPct: 0, correct: 0, totalQuestions: 10, topics: [] }),
}));

vi.mock("@/data/topicTutorials", async () => {
  const actual = await vi.importActual<typeof import("@/data/topicTutorials")>("@/data/topicTutorials");
  return {
    ...actual,
    getTutorialByTopicId: () => ({ concepts: [{ id: "c1" }, { id: "c2" }] }),
  };
});

import { TopicCard } from "@/components/TrackModuleList";

describe("track -> module progression happy path", () => {
  beforeEach(() => {
    progressState.completionPct = 0;
    progressState.correct = 0;
  });

  it("starts with learn CTA and advances to practice CTA once learn+practice progress exists", async () => {
    const onLearn = vi.fn();
    const onPractice = vi.fn();

    const topic = { id: "variables_io", name: "משתנים", icon: "📦", description: "desc" };

    const { rerender } = render(
      <TopicCard
        topic={topic}
        questionCount={19}
        learnMap={{}}
        isTopicUnlocked={() => true}
        isTopicComplete={() => false}
        onLearn={onLearn}
        onPractice={onPractice}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "התחל ללמוד" }));
    expect(onLearn).toHaveBeenCalledWith("variables_io");

    progressState.correct = 3;
    rerender(
      <TopicCard
        topic={topic}
        questionCount={19}
        learnMap={{ variables_io: [0, 1] }}
        isTopicUnlocked={() => true}
        isTopicComplete={() => false}
        onLearn={onLearn}
        onPractice={onPractice}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /המשך לתרגל/i }));
    expect(onPractice).toHaveBeenCalledWith("variables_io");
  });
});
