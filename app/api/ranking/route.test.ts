// @vitest-environment node
import { describe, expect, it, beforeEach } from "vitest";
import { GET } from "./route";
import { saveScore, resetRankingStore } from "@/lib/rankingStore";

describe("ranking API", () => {
  beforeEach(() => {
    resetRankingStore();
  });

  it("returns daily ranking", async () => {
    await saveScore("Daily", 50);

    const request = new Request("http://localhost:3000/api/ranking?period=daily");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.period).toBe("daily");
    expect(data.ranking).toEqual([{ nick: "Daily", score: 50 }]);
  });

  it("returns weekly ranking", async () => {
    await saveScore("Weekly", 70);

    const request = new Request("http://localhost:3000/api/ranking?period=weekly");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.period).toBe("weekly");
    expect(data.ranking).toEqual([{ nick: "Weekly", score: 70 }]);
  });

  it("defaults to daily for invalid period", async () => {
    await saveScore("Default", 30);

    const request = new Request("http://localhost:3000/api/ranking?period=invalid");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.period).toBe("daily");
  });
});
