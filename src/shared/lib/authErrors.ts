export const MIN_PASSWORD_LENGTH = 6;

export function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) return "אימייל או סיסמה שגויים";
  if (message.includes("Email not confirmed")) return "יש לאשר את האימייל לפני ההתחברות";
  if (message.includes("already registered")) return "האימייל הזה כבר רשום במערכת";
  if (message.includes("valid email")) return "כתובת אימייל לא תקינה";
  if (message.includes("Password should be at least")) return `הסיסמה חייבת להכיל לפחות ${MIN_PASSWORD_LENGTH} תווים`;
  if (message.includes("Too many requests")) return "יותר מדי ניסיונות, נסה שוב מאוחר יותר";
  return "שגיאה, נסה שוב";
}
