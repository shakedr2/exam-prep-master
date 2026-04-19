import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginPage from "@/pages/LoginPage";

const navigateSpy = vi.fn();
const signInMock = vi.fn();
const signInWithMagicLinkMock = vi.fn();
const signInWithGoogleMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: { seconds?: number }) => {
      if (key === "auth.magicLink.resendIn") return `Resend in ${params?.seconds} seconds`;
      const dict: Record<string, string> = {
        "auth.login.title": "Sign in",
        "auth.login.subtitle": "Sign in to save your progress",
        "auth.login.googleCta": "Sign in with Google",
        "auth.login.or": "or",
        "auth.login.loading": "Signing in...",
        "auth.login.submit": "Sign in",
        "auth.login.forgotPassword": "Forgot password?",
        "auth.login.magicLinkCta": "Sign in with a one-time link",
        "auth.login.noAccount": "No account?",
        "auth.login.register": "Register",
        "auth.login.continueAsGuest": "Continue as guest",
        "auth.common.emailLabel": "Email",
        "auth.common.emailPlaceholder": "email",
        "auth.common.passwordLabel": "Password",
        "auth.common.passwordPlaceholder": "password",
        "auth.magicLink.emailLabel": "Magic link email",
        "auth.magicLink.description": "Magic link description",
        "auth.magicLink.submit": "Send sign-in link",
        "auth.magicLink.success": "Check your email — we sent you a sign-in link",
        "auth.magicLink.backToPassword": "Back to password sign-in",
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    signIn: signInMock,
    signInWithMagicLink: signInWithMagicLinkMock,
    signInWithGoogle: signInWithGoogleMock,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signInMock.mockResolvedValue({ error: null });
    signInWithMagicLinkMock.mockResolvedValue({ error: null });
    signInWithGoogleMock.mockResolvedValue({ error: null });
  });

  it("submits email/password and navigates to dashboard on success", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("user@example.com", "secret123");
    });
    expect(navigateSpy).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("submits magic link, shows confirmation, and enforces resend cooldown", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in with a one-time link" }));
    fireEvent.change(screen.getByLabelText("Magic link email"), { target: { value: "user@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send sign-in link" }));

    await waitFor(() => {
      expect(signInWithMagicLinkMock).toHaveBeenCalledWith("user@example.com");
    });

    expect(screen.getByText("Check your email — we sent you a sign-in link")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resend in 60 seconds" })).toBeDisabled();
  });
});
