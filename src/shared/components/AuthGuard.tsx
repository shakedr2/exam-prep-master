import { Navigate } from "react-router-dom";
import { useProgress } from "@/features/progress/hooks/useProgress";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { progress } = useProgress();
  if (!progress.username) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
