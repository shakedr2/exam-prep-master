import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { translateAuthError } from "@/shared/lib/authErrors";
import { getLogicFlowThemeClass } from "@/pages/authTheme";
import "./AuthPages.css";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: resetError } = await resetPassword(email);
    setLoading(false);

    if (resetError) {
      setError(translateAuthError(resetError));
      return;
    }

    setSuccess(true);
  };

  return (
    <div className={`lf-theme${getLogicFlowThemeClass()}`} dir="rtl">
      <div className="auth-shell flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="auth-card">
            <CardHeader className="text-center space-y-2">
              <div className="auth-icon-wrap mx-auto flex h-14 w-14 items-center justify-center rounded-sm border">
                <KeyRound className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-bold">{t("auth.forgotPassword.title")}</CardTitle>
              <p className="auth-muted text-sm">{t("auth.forgotPassword.subtitle")}</p>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-emerald-600">{t("auth.forgotPassword.success")}</p>
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    {t("auth.forgotPassword.backToLogin")}
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      {t("auth.common.emailLabel")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.common.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      className="auth-input rounded-sm"
                    />
                  </div>

                  {error && <p className="auth-error text-sm text-center">{error}</p>}

                  <Button
                    type="submit"
                    className="auth-primary-btn w-full rounded-sm hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? t("auth.common.sending") : t("auth.forgotPassword.submit")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
