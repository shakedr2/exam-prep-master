import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold font-mono text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">הדף לא נמצא</p>
        <a href="/dashboard" className="inline-block rounded-sm border border-foreground/20 px-4 py-2 text-foreground hover:bg-foreground/5 transition-colors font-mono text-sm">
          חזרה לדף הראשי
        </a>
      </div>
    </div>
  );
};

export default NotFound;
