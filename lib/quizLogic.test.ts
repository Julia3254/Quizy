import { describe, expect, it } from "vitest";
import { shuffle, evaluateAnswer } from "./quizLogic";

describe("shuffle", () => {
  it("returns the same elements", () => {
    const source = [1, 2, 3, 4, 5];
    const shuffled = shuffle(source);
    expect(shuffled).toHaveLength(source.length);
    expect(shuffled.sort()).toEqual(source.sort());
  });

  it("does not contain duplicates", () => {
    const shuffled = shuffle(["a", "b", "c"]);
    expect(new Set(shuffled).size).toBe(shuffled.length);
  });

  it("produces a different order most of the time", () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let different = false;
    for (let i = 0; i < 20; i++) {
      if (shuffle(source).join(",") !== source.join(",")) {
        different = true;
        break;
      }
    }
    expect(different).toBe(true);
  });
});

describe("evaluateAnswer", () => {
  const baseSession = {
    score: 0,
    lives: 3,
    answeredCount: 0,
    currentQuestionIndex: 0,
    startTime: Date.now(),
    questions: [
      { id: 1, text: "Pytanie", answers: ["A", "B", "C"], correctIndex: 1 },
      { id: 2, text: "Pytanie 2", answers: ["X", "Y", "Z"], correctIndex: 2 },
    ],
  };

  it("adds 10 points for correct answer and keeps lives", () => {
    const result = evaluateAnswer(baseSession, "B");
    expect(result).toMatchObject({
      isCorrect: true,
      score: 10,
      lives: 3,
      answeredCount: 1,
      currentQuestionIndex: 1,
      gameOver: false,
      correctIndex: 1,
    });
  });

  it("does not add points for wrong answer and subtracts a life", () => {
    const result = evaluateAnswer(baseSession, "A");
    expect(result).toMatchObject({
      isCorrect: false,
      score: 0,
      lives: 2,
      answeredCount: 1,
      currentQuestionIndex: 1,
      gameOver: false,
      correctIndex: 1,
    });
  });

  it("ends game when lives reach zero", () => {
    const session = { ...baseSession, lives: 1 };
    const result = evaluateAnswer(session, "A");
    expect(result?.gameOver).toBe(true);
    expect(result?.lives).toBe(0);
  });

  it("ends game after the last question", () => {
    const session = { ...baseSession, currentQuestionIndex: 1 };
    const result = evaluateAnswer(session, "Y");
    expect(result?.gameOver).toBe(true);
  });

  it("returns null when there is no current question", () => {
    const session = { ...baseSession, currentQuestionIndex: 99 };
    const result = evaluateAnswer(session, "A");
    expect(result).toBeNull();
  });

  it("ends game when time runs out", () => {
    const now = baseSession.startTime + 95 * 1000;
    const result = evaluateAnswer(baseSession, "B", now);
    expect(result?.gameOver).toBe(true);
    expect(result?.timeLeft).toBe(0);
  });
});
