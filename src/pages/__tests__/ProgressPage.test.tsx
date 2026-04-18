import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProgressPage from "@/pages/ProgressPage";

/* ── Spies ────────────────────────────────────────────────────────────── */
const useTrackProgressMock = vi.fn();
const useProgressMock = vi.fn();

/* ── Module mocks ─────────────────────────────────────────────────────── */

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("@/features/progress/hooks/useTrackProgress", () => ({
  useTrackProgress: (...args: unknown[]) => useTrackProgressMock(...args),
}));

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => useProgressMock(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("@/hooks/useSupabaseTopics", () => ({
  useSupabaseTopics: () => ({
    loading: false,
    topics: [
      { id: "classes_objects", name: "מחלקות ואובייקטים", icon: "📦" },
      { id: "linux_basics", name: "יסודות לינוקס", icon: "🐧" },
      { id: "variables_io", name: "משתנים וקלט/פלט", icon: "🔢" },
    ],
  }),
}));

vi.mock("@/hooks/useAllLearningProgress", () => ({
  useAllLearningProgress: () => ({ learnMap: {}, loading: false }),
}));

vi.mock("@/hooks/useWeakPatterns", () => ({
  useWeakPatterns: () => ({
    weak: [],
    inProgress: [],
    mastered: [],
    loading: false,
    refetch: vi.fn(),
  }),
}));

/* ── Helpers ──────────────────────────────────────────────────────────── */

function renderPage() {
  return render(
    <MemoryRouter>
      <ProgressPage />
    </MemoryRouter>,
  );
}

/* ── Tests ────────────────────────────────────────────────────────────── */

describe("ProgressPage — consumes progress hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useProgressMock.mockReturnValue({
      progress: { examHistory: [] },
      getIncorrectQuestions: () => [],
      totalCorrect: 42,
      totalAnswered: 60,
      isLoading: false,
    });

    // Per-track totals sum to the overall "coverage" displayed on the page.
    useTrackProgressMock.mockImplementation((trackId: string) => {
      if (trackId === "python-fundamentals") {
        return {
          trackId: "python",
          totalQuestions: 100,
          correct: 50,
          completionPct: 50,
          modules: [],
        };
      }
      if (trackId === "python-oop") {
        return {
          trackId: "oop",
          totalQuestions: 40,
          correct: 10,
          completionPct: 25,
          modules: [],
        };
      }
      if (trackId === "devops") {
        return {
          trackId: "devops",
          totalQuestions: 60,
          correct: 30,
          completionPct: 50,
          modules: [],
        };
      }
      return { totalQuestions: 0, correct: 0, completionPct: 0, modules: [] };
    });
  });

  it("renders the Hebrew heading", () => {
    renderPage();
    expect(screen.getByText("התקדמות")).toBeInTheDocument();
  });

  it("calls useTrackProgress once per track — python, oop, devops", () => {
    renderPage();
    expect(useTrackProgressMock).toHaveBeenCalledWith("python-fundamentals");
    expect(useTrackProgressMock).toHaveBeenCalledWith("python-oop");
    expect(useTrackProgressMock).toHaveBeenCalledWith("devops");
  });

  it("renders overall coverage using the Σ formula across all three tracks", () => {
    // Σ correct / Σ totalQuestions = (50+10+30) / (100+40+60) = 90/200 = 45 %.
    // Not the avg of per-track % (50+25+50)/3 = 41 %.
    renderPage();
    expect(screen.getByText("45%")).toBeInTheDocument();
    expect(screen.getByText(/90 נכונות מתוך 200 שאלות/)).toBeInTheDocument();
  });

  it("renders total answered / correct / accuracy from useProgress hook", () => {
    renderPage();
    expect(screen.getByText("60")).toBeInTheDocument(); // totalAnswered
    expect(screen.getByText("42")).toBeInTheDocument(); // totalCorrect
    expect(screen.getByText("70%")).toBeInTheDocument(); // accuracy = 42/60
  });

  it("clamps overall coverage to 0 when all tracks are empty (zero-total guard)", () => {
    useTrackProgressMock.mockReturnValue({
      totalQuestions: 0,
      correct: 0,
      completionPct: 0,
      modules: [],
    });
    renderPage();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("shows skeleton while useProgress is loading", () => {
    useProgressMock.mockReturnValue({
      progress: { examHistory: [] },
      getIncorrectQuestions: () => [],
      totalCorrect: 0,
      totalAnswered: 0,
      isLoading: true,
    });
    const { container } = renderPage();
    expect(container.querySelector("h1")).toBeNull();
  });

  it("does not compute progress with local math — consumes hook values directly", () => {
    // Assert that the page's displayed overall correct count matches the sum
    // of per-track .correct values emitted by useTrackProgress (not some
    // other count derived from local data).
    renderPage();
    expect(screen.getByText(/90 נכונות/)).toBeInTheDocument();
  });

  it("renders DevOps track values consistent with useTrackProgress('devops')", () => {
    // Epic #290 exit criterion: Home / Dashboard / Track / Progress all show
    // identical counts for DevOps. The Progress page consumes the same hook,
    // so whatever completionPct the hook returns for 'devops' is what the
    // page surfaces.
    useTrackProgressMock.mockImplementation((trackId: string) => {
      if (trackId === "devops") {
        return {
          totalQuestions: 50,
          correct: 40,
          completionPct: 80,
          modules: [],
        };
      }
      return { totalQuestions: 0, correct: 0, completionPct: 0, modules: [] };
    });
    renderPage();
    // Overall = 40/50 = 80 % since the other two tracks return 0/0.
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("renders a topic row from the modules/topics produced by useTrackProgress", () => {
    // Flatten one module → one topic into the hook output and assert the
    // page flattens the same structure.
    useTrackProgressMock.mockImplementation((trackId: string) => {
      if (trackId === "devops") {
        return {
          totalQuestions: 10,
          correct: 5,
          completionPct: 50,
          modules: [
            {
              moduleId: "linux_basics",
              totalQuestions: 10,
              correct: 5,
              completionPct: 50,
              topics: [
                {
                  topicId: "linux_basics",
                  correct: 5,
                  attempted: 7,
                  totalQuestions: 10,
                  completionPct: 50,
                },
              ],
            },
          ],
        };
      }
      return { totalQuestions: 0, correct: 0, completionPct: 0, modules: [] };
    });
    renderPage();
    expect(screen.getByText("יסודות לינוקס")).toBeInTheDocument();
    // attempted / totalQuestions shown as 7/10
    expect(screen.getByText("7/10")).toBeInTheDocument();
  });
});
