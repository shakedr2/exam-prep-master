import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DashboardPage from "@/pages/DashboardPage";

/* ── Spies ───────────────────────────────────────────────────────────────── */
const trackModuleListSpy = vi.fn();
const useTrackProgressMock = vi.fn();

/* ── Module mocks ────────────────────────────────────────────────────────── */

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => ({
    progress: {
      username: "testuser",
      answeredQuestions: {},
      examHistory: [],
    },
    getTopicCompletion: () => 0,
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("@/hooks/useSupabaseTopics", () => ({
  useSupabaseTopics: () => ({
    loading: false,
    topics: [
      { id: "variables_io", name: "משתנים", icon: "🔢", description: "desc" },
      { id: "conditions", name: "תנאים", icon: "🔀", description: "desc" },
      { id: "loops", name: "לולאות", icon: "🔁", description: "desc" },
    ],
  }),
}));

vi.mock("@/hooks/useDashboardData", () => ({
  useDashboardData: () => ({
    learnMap: {},
    questionCounts: {
      variables_io: 15,
      arithmetic: 15,
      conditions: 15,
      loops: 15,
    },
    loading: false,
  }),
}));

vi.mock("@/hooks/useTopicCompletion", () => ({
  useTopicCompletion: () => ({
    isTopicUnlocked: () => true,
    isTopicComplete: () => false,
  }),
}));

vi.mock("@/features/gamification/hooks/useGamification", () => ({
  useGamification: () => ({
    xp: 120,
    level: 2,
    currentStreak: 3,
    longestStreak: 5,
  }),
}));

vi.mock("@/features/gamification/hooks/useDailyLogin", () => ({
  useDailyLogin: () => undefined,
}));

vi.mock("@/hooks/useDashboardStats", () => ({
  useDashboardStats: () => ({
    stats: {
      currentStreak: 3,
      longestStreak: 5,
      correctAnswers: 42,
      totalQuestionsAnswered: 60,
      lastActivityAt: null,
    },
  }),
}));

vi.mock("@/features/onboarding/hooks/useOnboarding", () => ({
  useOnboarding: () => ({
    state: { completed: true },
    loading: false,
  }),
}));

vi.mock("@/features/onboarding/components/OnboardingWizard", () => ({
  OnboardingWizard: () => null,
}));

vi.mock("@/features/gamification/components/StreakBadge", () => ({
  StreakBadge: () => <span data-testid="streak-badge" />,
}));

vi.mock("@/features/gamification/components/DashboardStatsSkeleton", () => ({
  DashboardStatsSkeleton: () => <div data-testid="stats-skeleton" />,
}));

vi.mock("@/components/XpBadge", () => ({
  XpBadge: () => <span data-testid="xp-badge" />,
}));

vi.mock("@/components/PythonHero", () => ({
  PythonHero: () => <div data-testid="python-hero" />,
}));

vi.mock("@/lib/analytics", () => ({
  trackDashboardViewed: vi.fn(),
}));

vi.mock("@/features/progress/hooks/useTrackProgress", () => ({
  useTrackProgress: (...args: unknown[]) => useTrackProgressMock(...args),
}));

vi.mock("@/components/TrackModuleList", () => ({
  TrackModuleList: (props: unknown) => {
    trackModuleListSpy(props);
    return <div data-testid="track-module-list" />;
  },
}));

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );
}

/* ── Tests ───────────────────────────────────────────────────────────────── */

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: python-fundamentals track at 55 %, 6 modules.
    // modules array contains module-count stubs used only for .length;
    // the actual Module objects passed to TrackModuleList come from
    // getModulesByTrack("python-fundamentals") inside DashboardPage.
    useTrackProgressMock.mockImplementation((trackId: string) => {
      if (trackId === "python-fundamentals") {
        return {
          completionPct: 55,
          modules: [{}, {}, {}, {}, {}, {}],
          totalQuestions: 90,
          correct: 49,
          // "python" is the internal TrackId used by progressTypes.ts
          trackId: "python" as const,
        };
      }
      return { completionPct: 0, modules: [], totalQuestions: 0, correct: 0, trackId: "python" as const };
    });
  });

  /* ── Track-level progress from useTrackProgress ─────────────────────── */

  it("renders track-level completion % from useTrackProgress", () => {
    renderDashboard();
    expect(screen.getByText(/55%/)).toBeInTheDocument();
    expect(useTrackProgressMock).toHaveBeenCalledWith("python-fundamentals");
  });

  it("renders module count from useTrackProgress", () => {
    renderDashboard();
    expect(screen.getByText(/6 מודולים/)).toBeInTheDocument();
  });

  it("renders a progress bar driven by useTrackProgress.completionPct", () => {
    renderDashboard();
    const bar = screen.getByRole("progressbar", { name: "התקדמות כוללת יסודות פייתון" });
    expect(bar).toBeInTheDocument();
  });

  it("updates displayed % when useTrackProgress returns a different value", () => {
    useTrackProgressMock.mockImplementation(() => ({
      completionPct: 80,
      // Stubs used only to derive modules.length (3) in the section header
      modules: [{}, {}, {}],
      totalQuestions: 45,
      correct: 36,
      trackId: "python" as const,
    }));
    renderDashboard();
    expect(screen.getByText(/80%/)).toBeInTheDocument();
    expect(screen.getByText(/3 מודולים/)).toBeInTheDocument();
  });

  /* ── Module cards rendered via TrackModuleList ───────────────────────── */

  it("renders TrackModuleList for module cards", () => {
    renderDashboard();
    expect(screen.getByTestId("track-module-list")).toBeInTheDocument();
    expect(trackModuleListSpy).toHaveBeenCalled();
  });

  it("passes question counts from useDashboardData to TrackModuleList", () => {
    renderDashboard();
    const props = trackModuleListSpy.mock.calls[0]?.[0] as {
      questionCounts: Record<string, number>;
    };
    expect(props.questionCounts.variables_io).toBe(15);
    expect(props.questionCounts.loops).toBe(15);
  });

  it("passes learnMap from useDashboardData to TrackModuleList", () => {
    renderDashboard();
    const props = trackModuleListSpy.mock.calls[0]?.[0] as {
      learnMap: Record<string, number[]>;
    };
    expect(props.learnMap).toBeDefined();
  });

  /* ── Topic-level progress is delegated to TrackModuleList hooks ─────── */

  it("does not pass legacy getTopicCompletion prop to TrackModuleList", () => {
    renderDashboard();
    const props = trackModuleListSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(props.getTopicCompletion).toBeUndefined();
  });

  it("passes python-fundamentals modules to TrackModuleList", () => {
    renderDashboard();
    const props = trackModuleListSpy.mock.calls[0]?.[0] as {
      modules: Array<{ id: string; track?: string }>;
    };
    // `modules` prop comes from getModulesByTrack("python-fundamentals") inside
    // DashboardPage — real Module objects, not the hook's progress stubs.
    expect(props.modules.length).toBeGreaterThan(0);
    for (const mod of props.modules) {
      expect(mod.track).toBe("python-fundamentals");
    }
  });

  /* ── OOP pedagogy note (practice tip banner) preserved ──────────────── */

  it("still renders the practice tip banner when hasPracticed and !hasLearnedAny", () => {
    // The stats hook is already mocked at module level with totalQuestionsAnswered: 60.
    // learnMap is {} (no concepts learned). So hasPracticed=true, hasLearnedAny=false.
    // The practice tip should be visible (tipDismissed defaults to false in tests).
    renderDashboard();
    expect(
      screen.getByText(/נסה להתחיל עם למידת המושגים/),
    ).toBeInTheDocument();
  });

  /* ── No OOP modules appear in the Python track list ─────────────────── */

  it("does not pass OOP-track modules to the Python module list", () => {
    renderDashboard();
    const props = trackModuleListSpy.mock.calls[0]?.[0] as {
      modules: Array<{ track?: string }>;
    };
    const oopModules = props.modules.filter((m) => m.track === "python-oop");
    expect(oopModules).toHaveLength(0);
  });
});
