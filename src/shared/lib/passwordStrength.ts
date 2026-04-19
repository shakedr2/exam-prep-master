export type PasswordStrength = "weak" | "medium" | "strong";

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 3) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}
