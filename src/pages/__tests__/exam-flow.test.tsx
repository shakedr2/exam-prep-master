import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import ExamMode from "@/pages/ExamMode";

const answerQuestionMock = vi.fn();
const addExamResultMock = vi.fn();
const saveAnswerMock = vi.fn();
const awardXpMock = vi.fn();
const claimMilestoneMock = vi.fn();
const posthogCaptureMock = vi.fn();

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => posthogCaptureMock(...args),
  },
}));

vi.mock("@/lib/analytics", () => ({
  trackExamStarted: vi.fn(),
  trackQuestionCompleted: vi.fn(),
}));

vi.mock("@/features/gamification/components/Celebration", () => ({
  celebrateLevelUp: vi.fn(),
  celebrateMilestone: vi.fn(),
}));

vi.mock("@/components/FloatingAIButton", () => ({
  FloatingAIButton: () => null,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    button: ({ children, ...props }: { children: ReactNode }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  useReducedMotion: () => true,
}));

vi.mock("@/hooks/useSupabaseQuestions", () => ({
  useSupabaseExamQuestions: () => ({
    loading: false,
    questions: [
      {
        id: "q-1",
        topic: "linux_basics",
        type: "mcq",
        difficulty: "easy",
        patternFamily: "basics",
        commonMistake: "none",
      },
    ],
  }),
}));

vi.mock("@/hooks/useSupabaseTopics", () => ({
  useSupabaseTopics: () => ({
    topics: [{ id: "linux_basics", name: "Linux", icon: "🐧" }],
  }),
}));

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => ({
    answerQuestion: (...args: unknown[]) => answerQuestionMock(...args),
    addExamResult: (...args: unknown[]) => addExamResultMock(...args),
    progress: { examHistory: [], username: "tester", answeredQuestions: {} },
  }),
}));

vi.mock("@/hooks/useSaveAnswer", () => ({
  useSaveAnswer: () => ({
    saveAnswer: (...args: unknown[]) => saveAnswerMock(...args),
  }),
}));

vi.mock("@/features/gamification/hooks/useGamification", () => ({
  useGamification: () => ({
    awardXp: (...args: unknown[]) => awardXpMock(...args),
    claimMilestone: (...args: unknown[]) => claimMilestoneMock(...args),
  }),
}));

vi.mock("@/components/exam/ExamReviewScreen", () => ({
  ExamReviewScreen: () => <div>Review</div>,
}));

vi.mock("@/components/exam/ExamQuestionRenderer", () => ({
  ExamQuestionRenderer: ({ onAnswer }: { onAnswer: (answer: string, correct: boolean) => void }) => (
    <div>
      <button onClick={() => onAnswer("A", true)}>answer-correct</button>
    </div>
  ),
}));

describe("ExamMode flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    awardXpMock.mockResolvedValue({ leveledUp: false, level: 1 });
    claimMilestoneMock.mockResolvedValue(false);
  });

  it("allows answering, submitting, and persists exam results via saveAnswer", async () => {
    render(
      <MemoryRouter>
        <ExamMode />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "התחל מבחן" }));
    fireEvent.click(screen.getByRole("button", { name: "answer-correct" }));
    fireEvent.click(screen.getByRole("button", { name: "סיום מבחן" }));
    fireEvent.click(await screen.findByRole("button", { name: "כן, סיים מבחן" }));

    await waitFor(() => {
      expect(screen.getByText("סיום מבחן!")).toBeInTheDocument();
    });

    expect(addExamResultMock).toHaveBeenCalledWith(110, 110);
    expect(answerQuestionMock).toHaveBeenCalledWith("q-1", "linux_basics", true);
    expect(saveAnswerMock).toHaveBeenCalledWith("q-1", "linux_basics", true, "basics", "none");
    expect(posthogCaptureMock).toHaveBeenCalledWith(
      "exam_completion",
      expect.objectContaining({ earned_points: 110, total_points: 110 })
    );
  });
});
