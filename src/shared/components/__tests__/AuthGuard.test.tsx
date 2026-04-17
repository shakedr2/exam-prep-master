import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthGuard } from "@/shared/components/AuthGuard";

const useAuthMock = vi.fn();
const useProgressMock = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => useProgressMock(),
}));

function renderProtectedRoute(initialPath: "/dashboard" | "/exam") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <div>Dashboard Content</div>
            </AuthGuard>
          }
        />
        <Route
          path="/exam"
          element={
            <AuthGuard>
              <div>Exam Content</div>
            </AuthGuard>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users away from /dashboard", () => {
    useAuthMock.mockReturnValue({ user: null, loading: false });
    useProgressMock.mockReturnValue({ progress: { username: "" } });

    renderProtectedRoute("/dashboard");

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users away from /exam", () => {
    useAuthMock.mockReturnValue({ user: null, loading: false });
    useProgressMock.mockReturnValue({ progress: { username: "" } });

    renderProtectedRoute("/exam");

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Exam Content")).not.toBeInTheDocument();
  });

  it("allows authenticated users to view protected pages", () => {
    useAuthMock.mockReturnValue({ user: { id: "u-1" }, loading: false });
    useProgressMock.mockReturnValue({ progress: { username: "" } });

    renderProtectedRoute("/dashboard");

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });
});
