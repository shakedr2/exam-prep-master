import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const handleCallback = async () => {
      const code = searchParams.get("code");

      if (!code) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.session) {
          console.error("Auth callback error:", error?.message);
          navigate("/login", { replace: true });
          return;
        }

        const userId = data.session.user.id;

        // Check if profile exists (trigger should have created it, but be defensive)
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("id", userId)
          .single();

        if (!profile) {
          const user = data.session.user;
          await supabase.from("user_profiles").insert({
            id: userId,
            display_name:
              user.user_metadata?.full_name ??
              user.user_metadata?.name ??
              "",
            email: user.email ?? "",
          });
        }

        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Auth callback unexpected error:", err);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      dir="rtl"
    >
      <div className="text-muted-foreground text-lg">...מתחבר</div>
    </div>
  );
};

export default AuthCallbackPage;
