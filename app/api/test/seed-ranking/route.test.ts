// @vitest-environment node
import { describe, expect, it, vi, afterEach } from "vitest";
import { POST } from "./route";
import { resetRankingStore } from "@/lib/rankingStore";

function jsonRequest(body: object) {
  return new Request("http://localhost:3000/api/test/seed-ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("seed-ranking API", () => {
  afterEach(() => {
    resetRankingStore();
    vi.unstubAllEnvs();
  });

  it("returns 404 outside development", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const response = await POST(jsonRequest({ nick: "Test", score: 100, period: "daily" }) as any);
    expect(response.status).toBe(404);
  });

  it("seeds ranking in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const response = await POST(jsonRequest({ nick: "DevTest", score: 42, period: "daily" }) as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.nick).toBe("DevTest");
    expect(data.score).toBe(42);
  });

  it("rejects invalid nick", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const response = await POST(jsonRequest({ nick: "x", score: 10, period: "daily" }) as any);
    expect(response.status).toBe(400);
  });
});
