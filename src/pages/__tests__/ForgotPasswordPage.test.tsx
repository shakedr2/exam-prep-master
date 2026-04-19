import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

const resetPasswordMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        "auth.forgotPassword.title": "Reset password",
        "auth.forgotPassword.subtitle": "Enter email",
        "auth.forgotPassword.submit": "Send reset link",
        "auth.forgotPassword.success": "Check your email — we sent you a password reset link",
        "auth.forgotPassword.backToLogin": "Back to sign in",
        "auth.common.emailLabel": "Email",
        "auth.common.emailPlaceholder": "email",
        "auth.common.sending": "Sending...",
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    resetPassword: resetPasswordMock,
  }),
}));

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPasswordMock.mockResolvedValue({ error: null });
  });

  it("requests reset email and shows success message", async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "user@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send reset link" }));

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith("user@example.com");
    });

    expect(screen.getByText("Check your email — we sent you a password reset link")).toBeInTheDocument();
  });
});
