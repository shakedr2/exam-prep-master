import { Component, ErrorInfo, ReactNode } from "react";
import { clearRetryLazyFlag } from "@/lib/retryLazy";

interface LazyRouteBoundaryProps {
  children: ReactNode;
}

interface LazyRouteBoundaryState {
  error: Error | null;
}

/**
 * Route-level error boundary for lazy-loaded routes.
 *
 * `retryLazy` already attempts a single hard reload when a dynamic import
 * fails. If that reload still can't fetch the chunk (e.g. the CDN really
 * doesn't have the asset any more, or the user is offline), the import will
 * throw and land here. We render a Hebrew RTL recovery screen with a refresh
 * button instead of letting the top-level Sentry boundary take over — the
 * top-level boundary swaps out the whole shell, which is worse UX for a
 * transient per-route failure.
 *
 * Refreshing clears the retryLazy sentinel so the next navigation gets a
 * clean retry budget.
 */
export class LazyRouteBoundary extends Component<
  LazyRouteBoundaryProps,
  LazyRouteBoundaryState
> {
  state: LazyRouteBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): LazyRouteBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Leave a breadcrumb for Sentry / console without swallowing the error.
    if (typeof console !== "undefined") {
      console.error("LazyRouteBoundary caught error:", error, info);
    }
  }

  handleRefresh = (): void => {
    clearRetryLazyFlag();
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          dir="rtl"
          className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        >
          <h2 className="text-xl font-bold mb-2">טעינת הדף נכשלה</h2>
          <p className="text-muted-foreground mb-4">
            לא הצלחנו לטעון את העמוד. ייתכן שהאפליקציה עודכנה — נסה לרענן.
          </p>
          <button
            type="button"
            onClick={this.handleRefresh}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            רענן
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
