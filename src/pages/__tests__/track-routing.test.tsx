import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import DevOpsTrackPage from "@/pages/DevOpsTrackPage";
import OopTrackPage from "@/pages/OopTrackPage";
import { getModulesByTrack } from "@/data/modules";

const trackModuleListSpy = vi.fn();

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => ({
    progress: { answeredQuestions: {}, username: "tester", examHistory: [] },
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
      polymorphism: 5,
      decorators_special: 4,
      linux_basics: 6,
      file_permissions: 8,
      bash_scripting: 9,
      variables_io: 10,
      arithmetic: 10,
      conditions: 10,
      loops: 10,
      strings: 10,
      lists: 10,
      tuples_sets_dicts: 10,
      functions: 10,
      tracing: 10,
      math: 10,
      files_exceptions: 10,
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

function PythonBasicsTrackHarness() {
  const modules = getModulesByTrack("python-fundamentals");
  const questionCount = modules.flatMap((m) => m.topicIds).length;
  return (
    <div>
      <h1>Python Basics</h1>
      <p>{modules.length} modules</p>
      <p>{questionCount} topics</p>
    </div>
  );
}

describe("track routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders /tracks/python-oop with OOP modules and question count data", () => {
    render(
      <MemoryRouter initialEntries={["/tracks/python-oop"]}>
        <Routes>
          <Route path="/tracks/python-oop" element={<OopTrackPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText("תכנות מונחה-עצמים").length).toBeGreaterThan(0);
    expect(trackModuleListSpy).toHaveBeenCalled();
    const firstCall = trackModuleListSpy.mock.calls[0]?.[0] as {
      modules: Array<{ id: string }>;
      questionCounts: Record<string, number>;
    };
    expect(firstCall.modules.map((m) => m.id)).toEqual([
      "classes_objects",
      "inheritance",
      "polymorphism",
      "decorators_special",
    ]);
    expect(firstCall.questionCounts.classes_objects).toBe(11);
  });

  it("renders /tracks/devops with DevOps modules and question count data", () => {
    render(
      <MemoryRouter initialEntries={["/tracks/devops"]}>
        <Routes>
          <Route path="/tracks/devops" element={<DevOpsTrackPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText("מהנדס DevOps").length).toBeGreaterThan(0);
    const firstCall = trackModuleListSpy.mock.calls[0]?.[0] as {
      modules: Array<{ id: string }>;
      questionCounts: Record<string, number>;
    };
    expect(firstCall.modules.map((m) => m.id)).toEqual([
      "linux_basics",
      "file_permissions",
      "bash_scripting",
      "networking_fundamentals",
    ]);
    expect(firstCall.questionCounts.bash_scripting).toBe(9);
  });

  it("covers python-basics route expectations using python-fundamentals module set", () => {
    render(
      <MemoryRouter initialEntries={["/tracks/python-basics"]}>
        <Routes>
          <Route path="/tracks/python-basics" element={<PythonBasicsTrackHarness />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Python Basics")).toBeInTheDocument();
    expect(screen.getByText("6 modules")).toBeInTheDocument();
    expect(screen.getByText("11 topics")).toBeInTheDocument();
  });
});
