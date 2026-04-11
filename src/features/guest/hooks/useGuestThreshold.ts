import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "examprep_progress";
const GUEST_THRESHOLD = 5;
const DISMISSED_KEY = "examprep_signup_wall_dismissed";

interface GuestProgress {
  answeredQuestions?: Record<string, unknown>;
}

function countAnsweredQuestions(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as GuestProgress;
    return Object.keys(parsed.answeredQuestions ?? {}).length;
  } catch {
    return 0;
  }
}

/**
 * Returns whether the guest signup wall should be shown.
 * The wall appears once the guest has answered at least GUEST_THRESHOLD
 * questions and is not yet signed in.
 */
export function useGuestThreshold() {
  const { user } = useAuth();
  const [answeredCount, setAnsweredCount] = useState(0);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === "1"
  );

  useEffect(() => {
    setAnsweredCount(countAnsweredQuestions());
  }, []);

  const increment = () => {
    if (user) return;
    setAnsweredCount((c) => c + 1);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  const showWall =
    !user &&
    !dismissed &&
    answeredCount >= GUEST_THRESHOLD;

  return { showWall, answeredCount, increment, dismiss };
}
