import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { translateAuthError } from "@/shared/lib/authErrors";
import { getLogicFlowThemeClass } from "@/pages/authTheme";
import "./AuthPages.css";

const MAGIC_LINK_COOLDOWN_SECONDS = 60;

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const LoginPage = () => {
  const { t } = useTranslation();
  const { signIn, signInWithGoogle, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSuccess, setMagicLinkSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = window.setTimeout(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(translateAuthError(signInError));
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMagicLinkSuccess(null);
    setMagicLinkLoading(true);

    const { error: magicLinkError } = await signInWithMagicLink(email);
    setMagicLinkLoading(false);

    if (magicLinkError) {
      setError(translateAuthError(magicLinkError));
      return;
    }

    setMagicLinkSuccess(t("auth.magicLink.success"));
    setCooldownSeconds(MAGIC_LINK_COOLDOWN_SECONDS);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(translateAuthError(googleError));
      }
    } finally {
      setGoogleLoading(false);
    }
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
                <LogIn className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-bold">{t("auth.login.title")}</CardTitle>
              <p className="auth-muted text-sm">{t("auth.login.subtitle")}</p>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-sm gap-2 mb-4 auth-input"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading || magicLinkLoading}
                aria-label={t("auth.login.googleCta")}
              >
                <GoogleIcon />
                {googleLoading ? t("auth.login.loading") : t("auth.login.googleCta")}
              </Button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="auth-separator-line w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 auth-muted">{t("auth.login.or")}</span>
                </div>
              </div>

              {mode === "password" ? (
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

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      {t("auth.common.passwordLabel")}
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("auth.common.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      dir="ltr"
                      className="auth-input rounded-sm"
                    />
                    <div className="text-left">
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        {t("auth.login.forgotPassword")}
                      </Link>
                    </div>
                  </div>

                  {error && <p className="auth-error text-sm text-center">{error}</p>}

                  <Button
                    type="submit"
                    className="auth-primary-btn w-full rounded-sm hover:opacity-90"
                    disabled={loading || googleLoading || magicLinkLoading}
                  >
                    {loading ? t("auth.login.loading") : t("auth.login.submit")}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="magic-link-email" className="text-sm font-medium text-foreground">
                      {t("auth.magicLink.emailLabel")}
                    </label>
                    <Input
                      id="magic-link-email"
                      type="email"
                      placeholder={t("auth.common.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      className="auth-input rounded-sm"
                    />
                    <p className="auth-muted text-xs">{t("auth.magicLink.description")}</p>
                  </div>

                  {error && <p className="auth-error text-sm text-center">{error}</p>}
                  {magicLinkSuccess && <p className="text-sm text-center text-emerald-600">{magicLinkSuccess}</p>}

                  <Button
                    type="submit"
                    className="auth-primary-btn w-full rounded-sm hover:opacity-90"
                    disabled={magicLinkLoading || loading || googleLoading || cooldownSeconds > 0}
                  >
                    {magicLinkLoading
                      ? t("auth.login.loading")
                      : cooldownSeconds > 0
                        ? t("auth.magicLink.resendIn", { seconds: cooldownSeconds })
                        : t("auth.magicLink.submit")}
                  </Button>
                </form>
              )}

              <div className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setMode((prev) => (prev === "password" ? "magic-link" : "password"));
                    setError(null);
                    setMagicLinkSuccess(null);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {mode === "password" ? t("auth.login.magicLinkCta") : t("auth.magicLink.backToPassword")}
                </button>
              </div>

              <div className="auth-muted mt-4 text-center text-sm">
                {t("auth.login.noAccount")}{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  {t("auth.login.register")}
                </Link>
              </div>

              <div className="mt-3 text-center">
                <Link to="/dashboard" className="auth-muted text-xs hover:text-foreground transition-colors">
                  {t("auth.login.continueAsGuest")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
