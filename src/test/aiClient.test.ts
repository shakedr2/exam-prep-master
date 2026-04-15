import { describe, it, expect, vi, afterEach } from "vitest";
import {
  AiError,
  getHumanReadableError,
  callAIFunction,
  callAIFunctionStream,
} from "@/shared/lib/aiClient";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ─── AiError ────────────────────────────────────────────────────────────────

describe("AiError", () => {
  it("sets name and type correctly", () => {
    const err = new AiError("timeout", "timed out");
    expect(err.name).toBe("AiError");
    expect(err.type).toBe("timeout");
    expect(err.message).toBe("timed out");
  });

  it("stores optional statusCode", () => {
    const err = new AiError("server-error", "oops", 503);
    expect(err.statusCode).toBe(503);
  });
});

// ─── getHumanReadableError ───────────────────────────────────────────────────

describe("getHumanReadableError", () => {
  it("returns Hebrew message for AiError timeout", () => {
    const err = new AiError("timeout", "timed out");
    expect(getHumanReadableError(err)).toContain("ארכה יותר מדי");
  });

  it("returns Hebrew message for AiError rate-limit", () => {
    const err = new AiError("rate-limit", "429");
    expect(getHumanReadableError(err)).toContain("עמוס");
  });

  it("returns Hebrew message for AiError server-error", () => {
    const err = new AiError("server-error", "500");
    expect(getHumanReadableError(err)).toContain("שרת");
  });

  it("returns Hebrew message for AiError network", () => {
    const err = new AiError("network", "failed");
    expect(getHumanReadableError(err)).toContain("רשת");
  });

  it("treats AbortError as timeout", () => {
    const abort = new DOMException("Aborted", "AbortError");
    expect(getHumanReadableError(abort)).toContain("ארכה יותר מדי");
  });

  it("returns generic Hebrew message for unknown error", () => {
    expect(getHumanReadableError(new Error("unknown"))).toContain("שגיאה");
  });
});

// ─── callAIFunction ──────────────────────────────────────────────────────────

describe("callAIFunction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON on success", async () => {
    const mockFetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(makeJsonResponse({ answer: 42 }));

    const result = await callAIFunction<{ answer: number }>(
      "https://example.com/fn",
      { q: "test" },
      { "Content-Type": "application/json" },
    );

    expect(result).toEqual({ answer: 42 });
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("retries on 500 and succeeds on second attempt", async () => {
    const mockFetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(makeJsonResponse({ error: "oops" }, 500))
      .mockResolvedValueOnce(makeJsonResponse({ answer: 1 }));

    const result = await callAIFunction<{ answer: number }>(
      "https://example.com/fn",
      {},
      {},
      { maxRetries: 3, retryDelayMs: 0 },
    );

    expect(result).toEqual({ answer: 1 });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws AiError rate-limit immediately without retrying", async () => {
    const mockFetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(makeJsonResponse({ error: "rate" }, 429));

    await expect(
      callAIFunction("https://example.com/fn", {}, {}, {
        maxRetries: 3,
        retryDelayMs: 0,
      }),
    ).rejects.toMatchObject({ type: "rate-limit" });

    // Should NOT retry on rate-limit
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("throws after exhausting all retries", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      makeJsonResponse({ error: "fail" }, 500),
    );

    await expect(
      callAIFunction("https://example.com/fn", {}, {}, {
        maxRetries: 3,
        retryDelayMs: 0,
      }),
    ).rejects.toMatchObject({ type: "server-error" });
  });

  it("classifies network error as AiError network", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(
      callAIFunction("https://example.com/fn", {}, {}, {
        maxRetries: 1,
        retryDelayMs: 0,
      }),
    ).rejects.toMatchObject({ type: "network" });
  });

  it("retries the configured number of times on network errors", async () => {
    const mockFetch = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(makeJsonResponse({ ok: true }));

    const result = await callAIFunction<{ ok: boolean }>(
      "https://example.com/fn",
      {},
      {},
      { maxRetries: 3, retryDelayMs: 0 },
    );

    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});

// ─── callAIFunctionStream ────────────────────────────────────────────────────

describe("callAIFunctionStream", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns Response on success", async () => {
    const mockResponse = new Response("data: [DONE]", { status: 200 });
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockResponse);

    const abortController = new AbortController();
    const result = await callAIFunctionStream(
      "https://example.com/stream",
      {},
      {},
      abortController.signal,
    );

    expect(result.status).toBe(200);
  });

  it("retries on 500 and connects on second attempt", async () => {
    const mockFetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response("data: [DONE]", { status: 200 }));

    const abortController = new AbortController();
    const result = await callAIFunctionStream(
      "https://example.com/stream",
      {},
      {},
      abortController.signal,
      { maxRetries: 3, retryDelayMs: 0 },
    );

    expect(result.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("re-throws AbortError immediately when user cancels", async () => {
    const abortController = new AbortController();
    abortController.abort();

    await expect(
      callAIFunctionStream("https://example.com/stream", {}, {}, abortController.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("throws rate-limit without retrying", async () => {
    const mockFetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 429 }));

    const abortController = new AbortController();
    await expect(
      callAIFunctionStream("https://example.com/stream", {}, {}, abortController.signal, {
        maxRetries: 3,
        retryDelayMs: 0,
      }),
    ).rejects.toMatchObject({ type: "rate-limit" });

    expect(mockFetch).toHaveBeenCalledOnce();
  });
});
