import { describe, it, expect } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALES,
  getLocaleDirection,
  isRTL,
} from "@/features/i18n";

describe("i18n locale helpers", () => {
  it("default locale is Hebrew", () => {
    expect(DEFAULT_LOCALE).toBe("he");
  });

  it("LOCALES contains he and en", () => {
    expect(Object.keys(LOCALES)).toEqual(expect.arrayContaining(["he", "en"]));
  });

  it("Hebrew direction is rtl", () => {
    expect(getLocaleDirection("he")).toBe("rtl");
  });

  it("English direction is ltr", () => {
    expect(getLocaleDirection("en")).toBe("ltr");
  });

  it("isRTL returns true for Hebrew", () => {
    expect(isRTL("he")).toBe(true);
  });

  it("isRTL returns false for English", () => {
    expect(isRTL("en")).toBe(false);
  });

  it("LOCALES entries have code, label, direction", () => {
    for (const config of Object.values(LOCALES)) {
      expect(config).toHaveProperty("code");
      expect(config).toHaveProperty("label");
      expect(config).toHaveProperty("direction");
    }
  });
});
