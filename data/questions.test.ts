import { describe, expect, it } from "vitest";
import { QUESTIONS } from "./questions";

describe("QUESTIONS data", () => {
  it("contains at least one question", () => {
    expect(QUESTIONS.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every question has a non-empty text", () => {
    for (const q of QUESTIONS) {
      expect(q.question.trim().length).toBeGreaterThan(0);
    }
  });

  it("every question has at least two answers", () => {
    for (const q of QUESTIONS) {
      expect(q.answers.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every answer is non-empty", () => {
    for (const q of QUESTIONS) {
      for (const answer of q.answers) {
        expect(answer.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("correctIndex is within answer bounds", () => {
    for (const q of QUESTIONS) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.answers.length);
    }
  });

  it("answers are unique within each question", () => {
    for (const q of QUESTIONS) {
      expect(new Set(q.answers).size).toBe(q.answers.length);
    }
  });
});
