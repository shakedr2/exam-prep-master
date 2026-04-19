import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AuthCallbackPage from "@/pages/AuthCallbackPage";

const navigateSpy = vi.fn();
const getSessionMock = vi.fn();
const invokeMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

vi.mock("@/shared/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
    },
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
  },
}));

describe("AuthCallbackPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue({
      data: { session: { user: { id: "u1", email: "user@example.com", user_metadata: {} } } },
      error: null,
    });
    invokeMock.mockResolvedValue({ data: {}, error: null });
    window.history.replaceState({}, "", "/auth/callback");
  });

  it("routes to reset-password when callback type is recovery", async () => {
    window.history.replaceState({}, "", "/auth/callback?type=recovery");

    render(<AuthCallbackPage />);

    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith("/reset-password", { replace: true });
    });
  });

  it("routes to dashboard for non-recovery callbacks", async () => {
    render(<AuthCallbackPage />);

    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });
});
