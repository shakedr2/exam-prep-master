import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";

import { useDashboardStats } from "@/hooks/useDashboardStats";

const rpcMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: (...args: unknown[]) => rpcMock(...args),
  },
}));

const useAuthMock = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useDashboardStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads dynamic stats via Supabase RPC (no hardcoded totals)", async () => {
    useAuthMock.mockReturnValue({ user: { id: "user-123" } });
    rpcMock.mockResolvedValue({
      data: {
        total_questions_answered: 12,
        correct_answers: 9,
        total_practice_time_seconds: 1800,
        current_streak: 4,
        longest_streak: 7,
        last_activity_at: "2026-04-16T10:00:00.000Z",
      },
      error: null,
    });

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(rpcMock).toHaveBeenCalledWith("get_dashboard_stats", {
      p_user_id: "user-123",
    });
    expect(result.current.stats).toEqual({
      totalQuestionsAnswered: 12,
      correctAnswers: 9,
      totalPracticeTimeSeconds: 1800,
      currentStreak: 4,
      longestStreak: 7,
      lastActivityAt: "2026-04-16T10:00:00.000Z",
    });
  });

  it("maps streak and answer counters from RPC payload", async () => {
    useAuthMock.mockReturnValue({ user: { id: "user-abc" } });
    rpcMock.mockResolvedValue({
      data: {
        total_questions_answered: 31,
        correct_answers: 19,
        total_practice_time_seconds: 5400,
        current_streak: 10,
        longest_streak: 21,
        last_activity_at: "2026-04-17T06:30:00.000Z",
      },
      error: null,
    });

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.stats?.totalQuestionsAnswered).toBe(31);
    });

    expect(result.current.stats?.correctAnswers).toBe(19);
    expect(result.current.stats?.currentStreak).toBe(10);
    expect(result.current.stats?.longestStreak).toBe(21);
  });

  it("does not query when user is unauthenticated", async () => {
    useAuthMock.mockReturnValue({ user: null });

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(rpcMock).not.toHaveBeenCalled();
    expect(result.current.stats).toBeNull();
  });
});
