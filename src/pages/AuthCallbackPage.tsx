import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    async function handleCallback() {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session?.user) {
        navigate("/login", { replace: true });
        return;
      }

      const user = session.user;
      const isNewUser =
        user.created_at &&
        Math.abs(Date.now() - new Date(user.created_at).getTime()) < 30_000;

      if (isNewUser) {
        try {
          await supabase.functions.invoke("send-welcome-email", {
            body: {
              userId: user.id,
              email: user.email ?? "",
              displayName:
                user.user_metadata?.full_name ??
                user.user_metadata?.name ??
                user.email?.split("@")[0] ??
                "",
            },
          });
        } catch (err) {
          console.error("send-welcome-email failed (non-fatal):", err);
        }
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
