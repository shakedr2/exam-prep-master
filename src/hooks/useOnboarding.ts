/**
 * Issue #306: Public re-export for the WelcomePage onboarding hook.
 *
 * Import from "@/hooks/useOnboarding" in WelcomePage and related tests.
 * Implementation lives in useWelcomeOnboarding.ts.
 */

export { useWelcomeOnboarding } from "./useWelcomeOnboarding";
export type { WelcomeOnboardingState } from "./useWelcomeOnboarding";
