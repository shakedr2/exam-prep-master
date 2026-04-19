import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ResetPasswordPage from "@/pages/ResetPasswordPage";

const navigateSpy = vi.fn();
const updatePasswordMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: { min?: number }) => {
      if (key === "auth.validation.passwordMin") return `Password must be at least ${params?.min} characters`;
      if (key === "auth.validation.passwordMinHint") return `At least ${params?.min} characters`;
      const dict: Record<string, string> = {
        "auth.resetPassword.title": "Choose a new password",
        "auth.resetPassword.subtitle": "Set password",
        "auth.resetPassword.confirmPasswordLabel": "Confirm new password",
        "auth.resetPassword.confirmPasswordPlaceholder": "Confirm password",
        "auth.resetPassword.submit": "Save new password",
        "auth.common.newPasswordLabel": "New password",
        "auth.common.saving": "Saving...",
        "auth.validation.passwordMismatch": "Passwords do not match",
        "auth.passwordStrength.label": "Password strength",
        "auth.passwordStrength.weak": "Weak",
        "auth.passwordStrength.medium": "Medium",
        "auth.passwordStrength.strong": "Strong",
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    updatePassword: updatePasswordMock,
  }),
}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updatePasswordMock.mockResolvedValue({ error: null });
  });

  it("updates password and navigates to dashboard", async () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("New password"), { target: { value: "NewPass123" } });
    fireEvent.change(screen.getByLabelText("Confirm new password"), { target: { value: "NewPass123" } });
    fireEvent.click(screen.getByRole("button", { name: "Save new password" }));

    await waitFor(() => {
      expect(updatePasswordMock).toHaveBeenCalledWith("NewPass123");
    });
    expect(navigateSpy).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("shows mismatch validation and does not submit", async () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("New password"), { target: { value: "NewPass123" } });
    fireEvent.change(screen.getByLabelText("Confirm new password"), { target: { value: "Different123" } });
    fireEvent.click(screen.getByRole("button", { name: "Save new password" }));

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
    expect(updatePasswordMock).not.toHaveBeenCalled();
  });
});
