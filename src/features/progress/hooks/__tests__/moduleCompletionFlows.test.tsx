import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

const authState = vi.hoisted(() => ({ user: null as null | { id: string } }));
const remoteRows = vi.hoisted(() => ({ data: [] as Array<{ topic_id: string }>, error: null as null | { message: string } }));
const upsertSpy = vi.fn();
const eqSpy = vi.fn();
const selectSpy = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authState,
}));

vi.mock("@/shared/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: (...args: unknown[]) => {
        selectSpy(...args);
        return {
          eq: (...eqArgs: unknown[]) => {
            eqSpy(...eqArgs);
            return Promise.resolve(remoteRows);
          },
        };
      },
      upsert: (...args: unknown[]) => {
        upsertSpy(...args);
        return Promise.resolve({ error: null });
      },
    }),
  },
}));

import { useTopicCompletion } from "@/hooks/useTopicCompletion";

describe("useTopicCompletion guest/authed flows", () => {
  beforeEach(() => {
    authState.user = null;
    remoteRows.data = [];
    remoteRows.error = null;
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("guest flow: marks completion locally and unlocks the next topic", async () => {
    const { result } = renderHook(() => useTopicCompletion());

    expect(result.current.isTopicUnlocked("variables_io")).toBe(true);
    expect(result.current.isTopicUnlocked("arithmetic")).toBe(false);

    await act(async () => {
      await result.current.markTopicComplete("variables_io");
    });

    expect(result.current.isTopicComplete("variables_io")).toBe(true);
    expect(result.current.isTopicUnlocked("arithmetic")).toBe(true);
    expect(upsertSpy).not.toHaveBeenCalled();
  });

  it("authed flow: merges remote completions and persists new completions remotely", async () => {
    authState.user = { id: "user-1" };
    remoteRows.data = [{ topic_id: "variables_io" }];

    const { result } = renderHook(() => useTopicCompletion());

    await waitFor(() => {
      expect(result.current.isTopicComplete("variables_io")).toBe(true);
    });

    await act(async () => {
      await result.current.markTopicComplete("arithmetic");
    });

    expect(upsertSpy).toHaveBeenCalledTimes(1);
    expect(upsertSpy).toHaveBeenCalledWith(
      { user_id: "user-1", topic_id: "arithmetic" },
      { onConflict: "user_id,topic_id" }
    );
    expect(result.current.isTopicUnlocked("conditions")).toBe(true);
  });
});
