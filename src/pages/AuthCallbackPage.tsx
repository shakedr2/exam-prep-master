import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    async function handleCallback() {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session?.user) {
        navigate("/login", { replace: true });
        return;
      }

      const user = session.user;

      // Always invoke the Edge Function — it performs an idempotency check
      // via user_profiles.welcome_email_sent and is a no-op for returning users.
      try {
        await supabase.functions.invoke("send-welcome-email", {
          body: {
            userId: user.id,
            email: user.email ?? "",
            displayName:
              user.user_metadata?.full_name ??
              user.user_metadata?.name ??
              (user.email ?? "").split("@")[0],
          },
        });
      } catch (err) {
        console.error("send-welcome-email failed (non-fatal):", err);
      }

      navigate("/dashboard", { replace: true });
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen" dir="rtl">
      <div className="text-muted-foreground">מתחבר...</div>
    </div>
  );
};

export default AuthCallbackPage;
