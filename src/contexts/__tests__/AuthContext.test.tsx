import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const signInWithOtpMock = vi.fn();
const resetPasswordForEmailMock = vi.fn();
const updateUserMock = vi.fn();
const onAuthStateChangeMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
      signInWithOtp: (...args: unknown[]) => signInWithOtpMock(...args),
      resetPasswordForEmail: (...args: unknown[]) => resetPasswordForEmailMock(...args),
      updateUser: (...args: unknown[]) => updateUserMock(...args),
    },
  },
}));

vi.mock("posthog-js", () => ({
  default: { identify: vi.fn(), reset: vi.fn() },
}));

vi.mock("@sentry/react", () => ({
  setUser: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

vi.mock("@/features/guest/lib/mergeProgress", () => ({
  mergeGuestProgress: vi.fn(),
}));

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onAuthStateChangeMock.mockImplementation((cb: (event: string, session: unknown) => void) => {
      cb("INITIAL_SESSION", null);
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    });
    signInWithOtpMock.mockResolvedValue({ error: null });
    resetPasswordForEmailMock.mockResolvedValue({ error: null });
    updateUserMock.mockResolvedValue({ error: null });
  });

  it("signInWithMagicLink calls supabase.auth.signInWithOtp with callback redirect", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signInWithMagicLink("user@example.com");

    expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: "user@example.com",
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  });

  it("resetPassword calls supabase.auth.resetPasswordForEmail with recovery redirect", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.resetPassword("user@example.com");

    expect(resetPasswordForEmailMock).toHaveBeenCalledWith("user@example.com", {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
  });

  it("updatePassword calls supabase.auth.updateUser", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.updatePassword("NewPass123");

    expect(updateUserMock).toHaveBeenCalledWith({ password: "NewPass123" });
  });
});
