// @vitest-environment node
import { describe, expect, it, beforeEach } from "vitest";
import { POST, PATCH, DELETE, resetSessions } from "./route";
import { saveScore, resetRankingStore } from "@/lib/rankingStore";
import { QUESTIONS } from "@/data/questions";

function jsonRequest(method: string, url: string, body?: object) {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("session API", () => {
  beforeEach(() => {
    resetSessions();
    resetRankingStore();
  });

  it("creates a session for a valid nick", async () => {
    const request = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "Tester" });
    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.sessionId).toBeDefined();
    expect(data.question).toBeDefined();
  });

  it("rejects an invalid nick", async () => {
    const request = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "a" });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it("rejects a duplicate active session nick", async () => {
    const request = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "Duplicate" });
    await POST(request as any);

    const second = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "Duplicate" });
    const response = await POST(second as any);
    expect(response.status).toBe(409);
  });

  it("rejects a nick already in any ranking", async () => {
    await saveScore("RankedPlayer", 100);

    const request = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "RankedPlayer" });
    const response = await POST(request as any);
    expect(response.status).toBe(409);
  });

  it("allows replay for a ranked nick", async () => {
    await saveScore("ReplayPlayer", 100);

    const request = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "ReplayPlayer", isReplay: true });
    const response = await POST(request as any);
    expect(response.status).toBe(200);
  });

  it("updates score for a correct answer", async () => {
    const create = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "Correct" });
    const createResponse = await POST(create as any);
    const { sessionId, question } = await createResponse.json();

    const sourceQuestion = QUESTIONS.find((q) => q.id === question.id)!;
    const correctAnswer = sourceQuestion.answers[sourceQuestion.correctIndex];
    const answer = jsonRequest("PATCH", "http://localhost:3000/api/session", { sessionId, answerText: correctAnswer });
    const answerResponse = await PATCH(answer as any);
    const data = await answerResponse.json();

    expect(answerResponse.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.isCorrect).toBe(true);
    expect(data.score).toBe(10);
    expect(data.lives).toBe(3);
  });

  it("decreases lives for a wrong answer", async () => {
    const create = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "Wrong" });
    const createResponse = await POST(create as any);
    const { sessionId, question } = await createResponse.json();

    const sourceQuestion = QUESTIONS.find((q) => q.id === question.id)!;
    const correctAnswer = sourceQuestion.answers[sourceQuestion.correctIndex];
    const wrongAnswer = question.answers.find((a: string) => a !== correctAnswer);
    const answer = jsonRequest("PATCH", "http://localhost:3000/api/session", { sessionId, answerText: wrongAnswer });
    const answerResponse = await PATCH(answer as any);
    const data = await answerResponse.json();

    expect(answerResponse.status).toBe(200);
    expect(data.isCorrect).toBe(false);
    expect(data.lives).toBe(2);
  });

  it("saves score and ends session on game over", async () => {
    const create = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "GameOver" });
    const createResponse = await POST(create as any);
    const { sessionId } = await createResponse.json();

    const finish = jsonRequest("DELETE", `http://localhost:3000/api/session?sessionId=${sessionId}&saveScore=true`);
    const response = await DELETE(finish as any);
    expect(response.status).toBe(200);

    const { getRanking } = await import("@/lib/rankingStore");
    const ranking = await getRanking(10, "daily");
    expect(ranking).toEqual([{ nick: "GameOver", score: 0 }]);
  });

  it("ends game after losing all lives", async () => {
    const create = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "Lives" });
    const createResponse = await POST(create as any);
    let { sessionId, question } = await createResponse.json();

    for (let i = 0; i < 3; i++) {
      const sourceQuestion = QUESTIONS.find((q) => q.id === question.id)!;
      const correctAnswer = sourceQuestion.answers[sourceQuestion.correctIndex];
      const wrongAnswer = question.answers.find((a: string) => a !== correctAnswer);
      const answer = jsonRequest("PATCH", "http://localhost:3000/api/session", { sessionId, answerText: wrongAnswer });
      const response = await PATCH(answer as any);
      const data = await response.json();

      if (i === 2) {
        expect(data.gameOver).toBe(true);
        expect(data.lives).toBe(0);
      } else {
        question = data.question;
      }
    }
  });

  it("saves final score to ranking after game over", async () => {
    const create = jsonRequest("POST", "http://localhost:3000/api/session", { nick: "FullFlow" });
    const createResponse = await POST(create as any);
    let { sessionId, question } = await createResponse.json();

    const sourceQuestion = QUESTIONS.find((q) => q.id === question.id)!;
    const correctAnswer = sourceQuestion.answers[sourceQuestion.correctIndex];
    const answer = jsonRequest("PATCH", "http://localhost:3000/api/session", { sessionId, answerText: correctAnswer });
    const answerResponse = await PATCH(answer as any);
    expect((await answerResponse.json()).score).toBe(10);

    const finish = jsonRequest("DELETE", `http://localhost:3000/api/session?sessionId=${sessionId}&saveScore=true`);
    await DELETE(finish as any);

    const { getRanking } = await import("@/lib/rankingStore");
    const ranking = await getRanking(10, "daily");
    expect(ranking).toEqual([{ nick: "FullFlow", score: 10 }]);
  });
});
