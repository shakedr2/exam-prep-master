export type PasswordStrength = "weak" | "medium" | "strong";

const MIN_LENGTH_SCORE_THRESHOLD = 8;
const MEDIUM_SCORE_THRESHOLD = 2;
const STRONG_SCORE_THRESHOLD = 3;

export function getPasswordStrengthLevel(password: string): number {
  let score = 0;

  if (password.length >= MIN_LENGTH_SCORE_THRESHOLD) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  return score;
}

export function getPasswordStrength(password: string): PasswordStrength {
  const score = getPasswordStrengthLevel(password);

  if (score >= STRONG_SCORE_THRESHOLD) return "strong";
  if (score >= MEDIUM_SCORE_THRESHOLD) return "medium";
  return "weak";
}
