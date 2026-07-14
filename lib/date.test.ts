import { describe, expect, it } from "vitest";
import {
  getWarsawDateKey,
  getWarsawWeekKey,
  getWarsawMonthKey,
  getRankingKey,
  getSecondsUntilMidnightWarsaw,
  getSecondsUntilNextMondayMidnightWarsaw,
  getSecondsUntilNextMonthFirstMidnightWarsaw,
} from "./date";

describe("getWarsawDateKey", () => {
  it("returns YYYY-MM-DD format", () => {
    const date = new Date(2026, 6, 14);
    expect(getWarsawDateKey(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getWarsawWeekKey", () => {
  it("returns monday_sunday format", () => {
    const date = new Date(2026, 6, 14);
    const key = getWarsawWeekKey(date);
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}_\d{4}-\d{2}-\d{2}$/);
  });

  it("covers a 7-day range", () => {
    const monday = new Date(2026, 6, 13);
    const key = getWarsawWeekKey(monday);
    const [start, end] = key.split("_");
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    expect(diff).toBe(6);
    expect(startDate.getDay()).toBe(1);
    expect(endDate.getDay()).toBe(0);
  });
});

describe("getWarsawMonthKey", () => {
  it("returns YYYY-MM format", () => {
    const date = new Date(2026, 6, 14);
    expect(getWarsawMonthKey(date)).toBe("2026-07");
  });
});

describe("getRankingKey", () => {
  it("prefixes daily key correctly", () => {
    const date = new Date(2026, 6, 14);
    expect(getRankingKey(date, "daily")).toContain("querion-ai-quiz:ranking:");
  });

  it("prefixes weekly key correctly", () => {
    const date = new Date(2026, 6, 14);
    expect(getRankingKey(date, "weekly")).toContain("querion-ai-quiz:ranking:week:");
  });

  it("prefixes monthly key correctly", () => {
    const date = new Date(2026, 6, 14);
    expect(getRankingKey(date, "monthly")).toContain("querion-ai-quiz:ranking:month:");
  });
});

describe("getSecondsUntilNextMondayMidnightWarsaw", () => {
  it("returns roughly a week at monday midnight", () => {
    const date = new Date(2026, 6, 13, 0, 0, 1);
    const seconds = getSecondsUntilNextMondayMidnightWarsaw(date);
    expect(seconds).toBeGreaterThan(6 * 24 * 60 * 60);
    expect(seconds).toBeLessThan(7 * 24 * 60 * 60);
  });

  it("returns small value just before next monday", () => {
    const date = new Date(2026, 6, 19, 23, 59, 59);
    expect(getSecondsUntilNextMondayMidnightWarsaw(date)).toBeLessThanOrEqual(1);
  });

  it("returns positive value before next monday", () => {
    const date = new Date(2026, 6, 14, 12, 0, 0);
    expect(getSecondsUntilNextMondayMidnightWarsaw(date)).toBeGreaterThan(0);
  });
});

describe("getSecondsUntilNextMonthFirstMidnightWarsaw", () => {
  it("returns positive value before first day of next month", () => {
    const date = new Date(2026, 6, 14, 12, 0, 0);
    expect(getSecondsUntilNextMonthFirstMidnightWarsaw(date)).toBeGreaterThan(0);
  });

  it("returns remaining seconds on last day of month", () => {
    const date = new Date(2026, 6, 31, 23, 59, 0);
    expect(getSecondsUntilNextMonthFirstMidnightWarsaw(date)).toBeLessThanOrEqual(60);
  });
});

describe("getSecondsUntilMidnightWarsaw", () => {
  it("returns full day seconds exactly at midnight", () => {
    const date = new Date(2026, 6, 14, 0, 0, 0);
    expect(getSecondsUntilMidnightWarsaw(date)).toBe(24 * 60 * 60);
  });

  it("returns zero just before next midnight", () => {
    const date = new Date(2026, 6, 14, 23, 59, 59);
    expect(getSecondsUntilMidnightWarsaw(date)).toBe(1);
  });

  it("returns positive value before midnight", () => {
    const date = new Date(2026, 6, 14, 12, 0, 0);
    const seconds = getSecondsUntilMidnightWarsaw(date);
    expect(seconds).toBeGreaterThan(0);
    expect(seconds).toBeLessThanOrEqual(12 * 60 * 60);
  });
});
