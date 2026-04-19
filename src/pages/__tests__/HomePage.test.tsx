import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import HomePage from "@/pages/HomePage";

const navigateSpy = vi.fn();
const useTrackProgressMock = vi.fn();
const useResumeTargetMock = vi.fn();
const useModuleProgressMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: { name?: string; topic?: string }) => {
      if (key === "home.greeting") return `Hello, ${params?.name}`;
      if (key === "home.resumeTitle")
        return `Continue practicing: ${params?.topic}`;
      const dict: Record<string, string> = {
        "home.welcome": "Welcome",
        "home.heroEyebrow": "Eyebrow",
        "home.heroPractice": "Practice",
        "home.heroSubtitle": "Subtitle",
        "home.questionsSolved": "questions solved",
        "home.outOf": "out of",
        "home.readyToStart": "ready",
        "home.learningPaths": "Learning Paths",
        "home.pythonName": "Python Fundamentals",
        "home.pythonDescription": "Python desc",
        "home.oopName": "Object-Oriented Programming",
        "home.oopDescription": "OOP desc",
        "home.devopsName": "DevOps Engineer",
        "home.devopsDescription": "DevOps desc",
        "home.resumeEyebrow": "Pick up where you left off",
        "home.resumeCta": "Resume practice",
        "common.progress": "Progress",
        "common.modules": "modules",
        "common.termsOfService": "Terms",
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => ({
    progress: { username: "tester", answeredQuestions: {}, examHistory: [] },
    totalCorrect: 10,
    totalAnswered: 20,
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("@/features/progress/hooks/useTrackProgress", () => ({
  useTrackProgress: (...args: unknown[]) => useTrackProgressMock(...args),
  useResumeTarget: (...args: unknown[]) => useResumeTargetMock(...args),
}));

vi.mock("@/features/progress/hooks/useModuleProgress", () => ({
  useModuleProgress: (...args: unknown[]) => useModuleProgressMock(...args),
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useTrackProgressMock.mockImplementation((trackId: string) => {
      if (trackId === "python-fundamentals") {
        return { completionPct: 61, modules: [{}, {}, {}, {}, {}, {}] };
      }
      if (trackId === "python-oop") {
        return { completionPct: 75, modules: [{}, {}, {}, {}] };
      }
      return { completionPct: 33, modules: [{}, {}, {}, {}] };
    });

    useModuleProgressMock.mockReturnValue({ completionPct: 42 });

    useResumeTargetMock.mockImplementation((trackId: string) => {
      if (trackId === "python-fundamentals") {
        return { topicId: "loops" };
      }
      if (trackId === "python-oop") {
        return { topicId: "inheritance" };
      }
      return { topicId: "linux_basics" };
    });
  });

  it("renders OOP card with completion from useModuleProgress", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Object-Oriented Programming" })).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
    expect(useModuleProgressMock).toHaveBeenCalledWith("classes_objects");
  });

  it("navigates to resume topic from useResumeTarget when Python card is clicked", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Python Fundamentals" }));

    expect(navigateSpy).toHaveBeenCalledWith("/practice/loops");
  });

  it("renders track-level progress percentages from useTrackProgress", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("61%")).toBeInTheDocument();
    expect(screen.getByText("33%")).toBeInTheDocument();
    expect(useTrackProgressMock).toHaveBeenCalledWith("python-fundamentals");
    expect(useTrackProgressMock).toHaveBeenCalledWith("devops");
  });

  it("renders resume banner for authed user with progress and deep-links to /practice/:topicId", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    const banner = screen.getByTestId("resume-banner");
    expect(banner).toBeInTheDocument();
    expect(banner.getAttribute("data-resume-topic-id")).toBe("loops");
    expect(screen.getByText(/Continue practicing: לולאות/)).toBeInTheDocument();

    fireEvent.click(banner);
    expect(navigateSpy).toHaveBeenCalledWith("/practice/loops");
  });

  it("hides resume banner when no track has progress", () => {
    useResumeTargetMock.mockReturnValue(null);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("resume-banner")).not.toBeInTheDocument();
  });
});
