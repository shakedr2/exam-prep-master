/**
 * Phase 4 PR1 — RootRoute + chrome gating for `/`.
 *
 * The app route `/` is dual-purpose:
 *   • unauthenticated visitors  → Logic Flow landing (src/features/welcome)
 *   • authenticated users       → in-app HomePage  (src/pages/HomePage)
 *
 * The shared app chrome (Navbar, BottomNav, AppFooter) must be hidden when
 * an unauthenticated visitor is on `/` — the landing has its own nav/footer
 * and stacking would duplicate controls.
 *
 * We don't pull in the real App (too many providers); we re-implement the
 * gate logic against mocked primitives and assert behavior.
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

/* ── Mocks ────────────────────────────────────────────────────────────────── */

const useAuthMock = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

/* ── Harness mirrors the RootRoute + AppChrome behavior in App.tsx ────────── */

function HomePageStub() {
  return <div data-testid="home-page">HomePage</div>;
}

function LandingStub() {
  return <div data-testid="landing-page">Landing</div>;
}

function NavbarStub() {
  return <nav data-testid="shared-navbar">Navbar</nav>;
}

function BottomNavStub() {
  return <nav data-testid="shared-bottom-nav">BottomNav</nav>;
}

function AppFooterStub() {
  return <footer data-testid="shared-footer">Footer</footer>;
}

function RootRoute() {
  const { user, loading } = useAuthMock();
  if (loading) return <div>loading</div>;
  return user ? <HomePageStub /> : <LandingStub />;
}

function AppChrome() {
  const { user, loading } = useAuthMock();
  const { pathname } = useLocation();
  const hideForLanding = pathname === "/" && !loading && !user;

  return (
    <>
      {!hideForLanding && <NavbarStub />}
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
      {!hideForLanding && <AppFooterStub />}
      {!hideForLanding && <BottomNavStub />}
    </>
  );
}

function renderAt(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <AppChrome />
    </MemoryRouter>,
  );
}

/* ── Tests ────────────────────────────────────────────────────────────────── */

describe("RootRoute + chrome gating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unauthenticated visitor on / sees the Landing page without shared chrome", () => {
    useAuthMock.mockReturnValue({ user: null, loading: false });

    renderAt("/");

    expect(screen.getByTestId("landing-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).toBeNull();
    expect(screen.queryByTestId("shared-navbar")).toBeNull();
    expect(screen.queryByTestId("shared-bottom-nav")).toBeNull();
    expect(screen.queryByTestId("shared-footer")).toBeNull();
  });

  it("authenticated user on / sees the HomePage *with* shared chrome", () => {
    useAuthMock.mockReturnValue({ user: { id: "u1" }, loading: false });

    renderAt("/");

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("landing-page")).toBeNull();
    expect(screen.getByTestId("shared-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("shared-bottom-nav")).toBeInTheDocument();
    expect(screen.getByTestId("shared-footer")).toBeInTheDocument();
  });

  it("unauthenticated visitor on a non-root route still sees shared chrome", () => {
    useAuthMock.mockReturnValue({ user: null, loading: false });

    renderAt("/dashboard");

    expect(screen.getByTestId("shared-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("shared-footer")).toBeInTheDocument();
    expect(screen.getByTestId("shared-bottom-nav")).toBeInTheDocument();
  });

  it("while auth session is still loading, chrome stays visible (safe default)", () => {
    useAuthMock.mockReturnValue({ user: null, loading: true });

    renderAt("/");

    expect(screen.getByTestId("shared-navbar")).toBeInTheDocument();
  });
});
