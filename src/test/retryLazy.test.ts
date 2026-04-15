import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearRetryLazyFlag, retryLazy } from "@/lib/retryLazy";

const RETRY_FLAG_KEY = "retryLazy:reloaded";

describe("retryLazy", () => {
  let reloadSpy: ReturnType<typeof vi.fn>;
  let originalLocation: Location;

  beforeEach(() => {
    window.sessionStorage.clear();
    clearRetryLazyFlag();

    // jsdom's location.reload is a real function we can't reassign directly,
    // so redefine the location object with a spy reload.
    originalLocation = window.location;
    reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, reload: reloadSpy },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    window.sessionStorage.clear();
  });

  it("resolves with the module when the factory succeeds", async () => {
    const mod = { default: "ok" };
    const factory = vi.fn().mockResolvedValue(mod);

    const wrapped = retryLazy(factory);
    await expect(wrapped()).resolves.toBe(mod);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it("clears the retry flag after a successful load", async () => {
    window.sessionStorage.setItem(RETRY_FLAG_KEY, "1");
    const factory = vi.fn().mockResolvedValue({ default: "ok" });

    await retryLazy(factory)();

    expect(window.sessionStorage.getItem(RETRY_FLAG_KEY)).toBeNull();
  });

  it("reloads once on a dynamic import failure and sets the sentinel", async () => {
    const err = new TypeError(
      "Failed to fetch dynamically imported module: /assets/LearnPage.js",
    );
    const factory = vi.fn().mockRejectedValue(err);

    const wrapped = retryLazy(factory);
    // The wrapped promise never resolves after reload is triggered; race it
    // against a microtask so the test doesn't hang.
    const pending = wrapped();
    await Promise.resolve();
    await Promise.resolve();

    expect(reloadSpy).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem(RETRY_FLAG_KEY)).toBe("1");
    // Drop the dangling promise so vitest doesn't complain.
    void pending;
  });

  it("does not reload a second time; re-throws to the caller", async () => {
    window.sessionStorage.setItem(RETRY_FLAG_KEY, "1");
    const err = new Error("Loading chunk 42 failed");
    const factory = vi.fn().mockRejectedValue(err);

    await expect(retryLazy(factory)()).rejects.toBe(err);
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it("re-throws non-chunk-load errors without reloading", async () => {
    const err = new Error("some runtime error inside the module");
    const factory = vi.fn().mockRejectedValue(err);

    await expect(retryLazy(factory)()).rejects.toBe(err);
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem(RETRY_FLAG_KEY)).toBeNull();
  });

  it("recognizes the 'Importing a module script failed' Safari wording", async () => {
    const err = new Error("Importing a module script failed.");
    const factory = vi.fn().mockRejectedValue(err);

    const pending = retryLazy(factory)();
    await Promise.resolve();
    await Promise.resolve();

    expect(reloadSpy).toHaveBeenCalledTimes(1);
    void pending;
  });
});

describe("clearRetryLazyFlag", () => {
  it("removes the sentinel", () => {
    window.sessionStorage.setItem(RETRY_FLAG_KEY, "1");
    clearRetryLazyFlag();
    expect(window.sessionStorage.getItem(RETRY_FLAG_KEY)).toBeNull();
  });

  it("is a no-op when the sentinel is absent", () => {
    expect(() => clearRetryLazyFlag()).not.toThrow();
  });
});
