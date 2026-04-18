import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import OopTrackPage from "@/pages/OopTrackPage";
import DevOpsTrackPage from "@/pages/DevOpsTrackPage";

/* ── Spies ────────────────────────────────────────────────────────────────── */
const useTrackProgressMock = vi.fn();
const trackModuleListSpy = vi.fn();

/* ── Module mocks ─────────────────────────────────────────────────────────── */

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("@/features/progress/hooks/useTrackProgress", () => ({
  useTrackProgress: (...args: unknown[]) => useTrackProgressMock(...args),
  useResumeTarget: () => null,
}));

// Hook mocks so TrackModuleList renders without hitting Supabase
vi.mock("@/features/progress/hooks/useModuleProgress", () => ({
  useModuleProgress: () => ({ completionPct: 0, correct: 0, totalQuestions: 0, moduleId: "" }),
}));

vi.mock("@/features/progress/hooks/useTopicProgress", () => ({
  useTopicProgress: () => ({ completionPct: 0, correct: 0, totalQuestions: 0, topicId: "" }),
}));

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => ({
    progress: { answeredQuestions: {}, username: "tester", examHistory: [] },
    getTopicCompletion: () => 0,
  }),
}));

vi.mock("@/hooks/useSupabaseTopics", () => ({
  useSupabaseTopics: () => ({
    loading: false,
    topics: [
      { id: "classes_objects", name: "מחלקות ואובייקטים", icon: "📦", description: "desc" },
      { id: "inheritance", name: "ירושה", icon: "🌳", description: "desc" },
      { id: "linux_basics", name: "יסודות לינוקס", icon: "🐧", description: "desc" },
      { id: "file_permissions", name: "הרשאות קבצים", icon: "🔐", description: "desc" },
      { id: "bash_scripting", name: "תכנות Bash", icon: "💻", description: "desc" },
    ],
  }),
}));

vi.mock("@/hooks/useDashboardData", () => ({
  useDashboardData: () => ({
    learnMap: {},
    questionCounts: {
      classes_objects: 11,
      inheritance: 7,
      linux_basics: 6,
      file_permissions: 8,
      bash_scripting: 9,
    },
  }),
}));

vi.mock("@/hooks/useTopicCompletion", () => ({
  useTopicCompletion: () => ({
    isTopicUnlocked: () => true,
    isTopicComplete: () => false,
  }),
}));

vi.mock("@/components/TrackModuleList", () => ({
  TrackModuleList: (props: unknown) => {
    trackModuleListSpy(props);
    return <div data-testid="track-module-list" />;
  },
}));

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function renderRoute(path: string, element: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>
  );
}

/* ── Tests ────────────────────────────────────────────────────────────────── */

describe("OopTrackPage — consumes useTrackProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTrackProgressMock.mockImplementation((trackId: string) => {
      if (trackId === "python-oop") {
        return { completionPct: 55, modules: [{}, {}, {}, {}] };
      }
      return { completionPct: 0, modules: [] };
    });
  });

  it("renders the OOP hero heading", () => {
    renderRoute("/tracks/python-oop", <OopTrackPage />);
    expect(screen.getAllByText("תכנות מונחה-עצמים").length).toBeGreaterThan(0);
  });

  it("displays completionPct from useTrackProgress('python-oop')", () => {
    renderRoute("/tracks/python-oop", <OopTrackPage />);
    expect(screen.getByText("55%")).toBeInTheDocument();
  });

  it("displays module count from useTrackProgress modules array", () => {
    renderRoute("/tracks/python-oop", <OopTrackPage />);
    expect(screen.getByText("4 מודולים")).toBeInTheDocument();
  });

  it("calls useTrackProgress with 'python-oop'", () => {
    renderRoute("/tracks/python-oop", <OopTrackPage />);
    expect(useTrackProgressMock).toHaveBeenCalledWith("python-oop");
  });

  it("preserves the OOP pedagogy description text", () => {
    renderRoute("/tracks/python-oop", <OopTrackPage />);
    expect(
      screen.getByText(/מחלקות, אובייקטים, ירושה, פולימורפיזם ודקורטורים/i)
    ).toBeInTheDocument();
  });

  it("renders TrackModuleList", () => {
    renderRoute("/tracks/python-oop", <OopTrackPage />);
    expect(screen.getByTestId("track-module-list")).toBeInTheDocument();
  });
});

describe("DevOpsTrackPage — consumes useTrackProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTrackProgressMock.mockImplementation((trackId: string) => {
      if (trackId === "devops") {
        return { completionPct: 30, modules: [{}, {}, {}] };
      }
      return { completionPct: 0, modules: [] };
    });
  });

  it("renders the DevOps hero heading", () => {
    renderRoute("/tracks/devops", <DevOpsTrackPage />);
    expect(screen.getAllByText("מהנדס DevOps").length).toBeGreaterThan(0);
  });

  it("displays completionPct from useTrackProgress('devops')", () => {
    renderRoute("/tracks/devops", <DevOpsTrackPage />);
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("displays module count from useTrackProgress modules array", () => {
    renderRoute("/tracks/devops", <DevOpsTrackPage />);
    expect(screen.getByText("3 מודולים")).toBeInTheDocument();
  });

  it("calls useTrackProgress with 'devops'", () => {
    renderRoute("/tracks/devops", <DevOpsTrackPage />);
    expect(useTrackProgressMock).toHaveBeenCalledWith("devops");
  });

  it("renders TrackModuleList", () => {
    renderRoute("/tracks/devops", <DevOpsTrackPage />);
    expect(screen.getByTestId("track-module-list")).toBeInTheDocument();
  });
});

describe("Cross-track invariant — Python/OOP/DevOps show DISTINCT progress values", () => {
  it("useTrackProgress is called with distinct track IDs for OOP and DevOps pages", () => {
    // OOP page uses "python-oop"
    useTrackProgressMock.mockReturnValue({ completionPct: 0, modules: [] });
    renderRoute("/tracks/python-oop", <OopTrackPage />);
    const oopCall = useTrackProgressMock.mock.calls.find(
      (c) => c[0] === "python-oop"
    );
    expect(oopCall).toBeDefined();

    vi.clearAllMocks();
    useTrackProgressMock.mockReturnValue({ completionPct: 0, modules: [] });

    // DevOps page uses "devops"
    renderRoute("/tracks/devops", <DevOpsTrackPage />);
    const devopsCall = useTrackProgressMock.mock.calls.find(
      (c) => c[0] === "devops"
    );
    expect(devopsCall).toBeDefined();
  });

  it("OOP and DevOps pages render distinct % values when given different progress data", () => {
    // Render OOP with 75%
    useTrackProgressMock.mockImplementation((id: string) => ({
      completionPct: id === "python-oop" ? 75 : 25,
      modules: [{}],
    }));
    const { unmount } = renderRoute("/tracks/python-oop", <OopTrackPage />);
    expect(screen.getByText("75%")).toBeInTheDocument();
    unmount();

    vi.clearAllMocks();

    // Render DevOps with 25%
    useTrackProgressMock.mockImplementation((id: string) => ({
      completionPct: id === "devops" ? 25 : 75,
      modules: [{}],
    }));
    renderRoute("/tracks/devops", <DevOpsTrackPage />);
    expect(screen.getByText("25%")).toBeInTheDocument();
  });
});
