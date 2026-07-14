import { describe, expect, it } from "vitest";
import { cleanNickValue, validateNick, isNickAllowed } from "./nickValidation";

describe("cleanNickValue", () => {
  it("trims whitespace and collapses spaces", () => {
    expect(cleanNickValue("  Jan  Kowalski  ")).toBe("Jan Kowalski");
  });

  it("cuts nick to 18 characters", () => {
    expect(cleanNickValue("a".repeat(30))).toBe("a".repeat(18));
  });

  it("returns empty string for whitespace only", () => {
    expect(cleanNickValue("   ")).toBe("");
  });
});

describe("validateNick", () => {
  it("accepts a valid nick", () => {
    const result = validateNick("Michał123");
    expect(result.ok).toBe(true);
    expect(result.clean).toBe("Michał123");
  });

  it("rejects empty nick", () => {
    const result = validateNick("");
    expect(result.ok).toBe(false);
  });

  it("rejects nick shorter than 2 characters", () => {
    const result = validateNick("x");
    expect(result.ok).toBe(false);
  });

  it("rejects nick containing only digits", () => {
    const result = validateNick("12345");
    expect(result.ok).toBe(false);
  });

  it("rejects nick with only special characters", () => {
    const result = validateNick("!!!");
    expect(result.ok).toBe(false);
  });

  it("rejects forbidden exact nick", () => {
    const result = validateNick("admin");
    expect(result.ok).toBe(false);
  });

  it("rejects forbidden word", () => {
    const result = validateNick("kurwaa");
    expect(result.ok).toBe(false);
  });

  it("rejects forbidden word with leet substitutions", () => {
    const result = validateNick("kvrw4");
    expect(result.ok).toBe(false);
  });

  it("rejects nick with dangerous HTML", () => {
    const result = validateNick("<script>alert(1)</script>");
    expect(result.ok).toBe(false);
  });

  it("rejects nick with javascript scheme", () => {
    const result = validateNick("javascript:alert(1)");
    expect(result.ok).toBe(false);
  });

  it("accepts nick with Polish characters", () => {
    const result = validateNick("Łukasz");
    expect(result.ok).toBe(true);
  });

  it("accepts nick with letters and digits", () => {
    const result = validateNick("Player123");
    expect(result.ok).toBe(true);
  });

  it("accepts nick with mixed case", () => {
    const result = validateNick("MiXeD");
    expect(result.ok).toBe(true);
  });

  it("rejects nick with only spaces", () => {
    const result = validateNick("     ");
    expect(result.ok).toBe(false);
  });

  it("rejects forbidden word with leet and accents", () => {
    const result = validateNick("kút4s");
    expect(result.ok).toBe(false);
  });

  it("rejects event handler pattern in nick", () => {
    const result = validateNick("onclick=alert(1)");
    expect(result.ok).toBe(false);
  });

  it("rejects data URI scheme in nick", () => {
    const result = validateNick("data:text/html,<script>alert(1)</script>");
    expect(result.ok).toBe(false);
  });

  it("rejects forbidden exact nick with different case", () => {
    const result = validateNick("Admin");
    expect(result.ok).toBe(false);
  });

  it("accepts nick exactly 18 characters long", () => {
    const result = validateNick("a".repeat(18));
    expect(result.ok).toBe(true);
  });
});

describe("isNickAllowed", () => {
  it("returns true for allowed nick", () => {
    expect(isNickAllowed("PlayerOne")).toBe(true);
  });

  it("returns false for forbidden nick", () => {
    expect(isNickAllowed("admin")).toBe(false);
  });
});
