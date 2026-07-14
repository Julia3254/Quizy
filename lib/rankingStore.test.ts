import { describe, expect, it, beforeEach } from "vitest";
import { saveScore, getRanking, resetRankingStore } from "./rankingStore";

describe("rankingStore", () => {
  beforeEach(() => {
    resetRankingStore();
  });

  it("saves score to all periods", async () => {
    await saveScore("Alice", 50);

    const daily = await getRanking(10, "daily");
    const weekly = await getRanking(10, "weekly");
    const monthly = await getRanking(10, "monthly");

    expect(daily).toEqual([{ nick: "Alice", score: 50 }]);
    expect(weekly).toEqual([{ nick: "Alice", score: 50 }]);
    expect(monthly).toEqual([{ nick: "Alice", score: 50 }]);
  });

  it("keeps the best score when a lower score is submitted", async () => {
    await saveScore("Bob", 80);
    await saveScore("Bob", 30);

    const ranking = await getRanking(10, "daily");
    expect(ranking).toEqual([{ nick: "Bob", score: 80 }]);
  });

  it("updates score when a higher score is submitted", async () => {
    await saveScore("Charlie", 40);
    await saveScore("Charlie", 90);

    const ranking = await getRanking(10, "daily");
    expect(ranking).toEqual([{ nick: "Charlie", score: 90 }]);
  });

  it("sorts ranking by score descending and nick ascending", async () => {
    await saveScore("Dave", 60);
    await saveScore("Anna", 80);
    await saveScore("Bob", 80);

    const ranking = await getRanking(10, "daily");
    expect(ranking).toEqual([
      { nick: "Anna", score: 80 },
      { nick: "Bob", score: 80 },
      { nick: "Dave", score: 60 },
    ]);
  });

  it("respects the limit", async () => {
    await saveScore("First", 100);
    await saveScore("Second", 90);
    await saveScore("Third", 80);

    const ranking = await getRanking(2, "daily");
    expect(ranking).toHaveLength(2);
  });

  it("does not save invalid nick", async () => {
    await expect(saveScore("", 10)).rejects.toThrow();
  });

  it("overwrites score with lower value when force is true", async () => {
    await saveScore("Forced", 100);
    await saveScore("Forced", 20, true);

    const ranking = await getRanking(10, "daily");
    expect(ranking).toEqual([{ nick: "Forced", score: 20 }]);
  });

  it("stores the same nick in daily, weekly and monthly rankings", async () => {
    await saveScore("Periods", 55);

    const daily = await getRanking(10, "daily");
    const weekly = await getRanking(10, "weekly");
    const monthly = await getRanking(10, "monthly");

    expect(daily[0].nick).toBe("Periods");
    expect(weekly[0].nick).toBe("Periods");
    expect(monthly[0].nick).toBe("Periods");
  });
});
