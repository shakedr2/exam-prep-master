import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import posthog from "posthog-js";
import * as Sentry from "@sentry/react";
import { mergeGuestProgress } from "@/features/guest/lib/mergeProgress";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let initialSessionReceived = false;

    // Use onAuthStateChange as the single source of truth for session state.
    // It fires an INITIAL_SESSION event on setup, eliminating the need for a
    // separate getSession() call that would race for the same Navigator Lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, s) => {
        initialSessionReceived = true;
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);

        if (s?.user) {
          posthog.identify(s.user.id, { email: s.user.email });
          Sentry.setUser({ id: s.user.id, email: s.user.email });

          if (event === "SIGNED_IN") {
            mergeGuestProgress(s.user.id).catch((err) => {
              console.error("mergeGuestProgress failed:", err);
            });
          }
        } else {
          posthog.reset();
          Sentry.setUser(null);
        }
      }
    );

    // Safety timeout: if INITIAL_SESSION never fires (e.g. lock timeout),
    // proceed as unauthenticated so the app doesn't hang on the loading screen.
    const safetyTimeout = setTimeout(() => {
      if (!initialSessionReceived) {
        console.warn("Auth: INITIAL_SESSION not received within 5 s — proceeding as guest");
        Sentry.captureMessage("Auth lock timeout: INITIAL_SESSION not received within 5s", "warning");
        setLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      Sentry.captureException(err);
      return { error: err instanceof Error ? err.message : "Sign-up failed" };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      Sentry.captureException(err);
      return { error: err instanceof Error ? err.message : "Sign-in failed" };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      Sentry.captureException(err);
      return { error: err instanceof Error ? err.message : "Google sign-in failed" };
    }
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      Sentry.captureException(err);
      return { error: err instanceof Error ? err.message : "Magic-link sign-in failed" };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      Sentry.captureException(err);
      return { error: err instanceof Error ? err.message : "Reset password failed" };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      Sentry.captureException(err);
      return { error: err instanceof Error ? err.message : "Update password failed" };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      Sentry.captureException(err);
      // Clear local state even if signOut fails due to lock timeout,
      // so the user isn't stuck in a broken authenticated state.
      setSession(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithMagicLink,
        resetPassword,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
