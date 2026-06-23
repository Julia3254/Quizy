import { Redis } from "@upstash/redis";
import {
  getRankingKey,
  getSecondsUntilMidnightWarsaw,
  getSecondsUntilNextMondayMidnightWarsaw,
  getSecondsUntilNextMonthFirstMidnightWarsaw,
  getWarsawDateKey,
  getWarsawWeekKey,
  getWarsawMonthKey
} from "@/lib/date";
import type { RankingPeriod } from "@/lib/date";
import { cleanNickValue, isNickAllowed, validateNick } from "@/lib/nickValidation";

export type LeaderboardEntry = {
  nick: string;
  score: number;
};

type SaveScoreResult = {
  nick: string;
  submittedScore: number;
  bestScore: number;
  score: number;
  updated: boolean;
  date: string;
  storage: "redis" | "memory";
};

export type { RankingPeriod };

type MemoryStore = Record<string, Map<string, number>>;

const globalForMemory = globalThis as typeof globalThis & {
  __querionQuizMemoryStore?: MemoryStore;
};

const memoryStore: MemoryStore = globalForMemory.__querionQuizMemoryStore ?? {};
globalForMemory.__querionQuizMemoryStore = memoryStore;

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return new Redis({ url, token });
}

function sanitizeNick(input: unknown) {
  if (typeof input !== "string") return "";
  return cleanNickValue(input);
}

function normalizeScore(input: unknown) {
  const score = Number(input);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(9999, Math.floor(score)));
}

function normalizeExistingScore(input: unknown): number | null {
  if (input === null || input === undefined) return null;

  const score = Number(input);
  if (!Number.isFinite(score)) return null;

  return normalizeScore(score);
}

function sortLeaderboard(entries: LeaderboardEntry[]) {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.nick.localeCompare(b.nick, "pl");
  });
}

function normalizeZRangeRows(rows: unknown): LeaderboardEntry[] {
  if (!Array.isArray(rows)) return [];

  const entries: LeaderboardEntry[] = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];

    if (row && typeof row === "object" && !Array.isArray(row) && "member" in row && "score" in row) {
      const obj = row as { member: unknown; score: unknown };
      const nick = sanitizeNick(obj.member);
      const score = normalizeExistingScore(obj.score);
      if (nick && score !== null && isNickAllowed(nick)) entries.push({ nick, score });
      continue;
    }

    if (Array.isArray(row) && row.length >= 2) {
      const nick = sanitizeNick(row[0]);
      const score = normalizeExistingScore(row[1]);
      if (nick && score !== null && isNickAllowed(nick)) entries.push({ nick, score });
      continue;
    }

    if (typeof row === "string") {
      const nick = sanitizeNick(row);
      const score = normalizeExistingScore(rows[i + 1]);
      if (nick && score !== null && isNickAllowed(nick)) {
        entries.push({ nick, score });
        i += 1;
      }
    }
  }

  return sortLeaderboard(entries);
}

export async function saveScore(rawNick: unknown, rawScore: unknown, force = false): Promise<SaveScoreResult> {
  const nick = sanitizeNick(rawNick);
  const submittedScore = normalizeScore(rawScore);

  const validation = validateNick(nick);

  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const currentDate = getWarsawDateKey();
  const redis = getRedisClient();
  const dailyKey = getRankingKey(undefined, "daily");
  const weeklyKey = getRankingKey(undefined, "weekly");
  const monthlyKey = getRankingKey(undefined, "monthly");

  if (redis) {
    const current = normalizeExistingScore(await redis.zscore(dailyKey, nick));
    const bestScore = force ? submittedScore : Math.max(submittedScore, current ?? 0);
    const updated = force || current === null || submittedScore > current;

    if (updated) {
      await redis.zadd(dailyKey, { score: submittedScore, member: nick });
      await redis.zadd(weeklyKey, { score: submittedScore, member: nick });
      await redis.zadd(monthlyKey, { score: submittedScore, member: nick });
    }

    const dailyTtl = getSecondsUntilMidnightWarsaw() + 60 * 60;
    const weeklyTtl = getSecondsUntilNextMondayMidnightWarsaw() + 60 * 60;
    const monthlyTtl = getSecondsUntilNextMonthFirstMidnightWarsaw() + 60 * 60;
    await redis.expire(dailyKey, dailyTtl);
    await redis.expire(weeklyKey, weeklyTtl);
    await redis.expire(monthlyKey, monthlyTtl);

    return {
      nick,
      submittedScore,
      bestScore,
      score: bestScore,
      updated,
      date: currentDate,
      storage: "redis"
    };
  }

  const weekKey = `week:${getWarsawWeekKey()}`;
  const monthKey = `month:${getWarsawMonthKey()}`;

  const dailyMap = memoryStore[currentDate] ?? new Map<string, number>();
  memoryStore[currentDate] = dailyMap;
  const weeklyMap = memoryStore[weekKey] ?? new Map<string, number>();
  memoryStore[weekKey] = weeklyMap;
  const monthlyMap = memoryStore[monthKey] ?? new Map<string, number>();
  memoryStore[monthKey] = monthlyMap;

  const current = dailyMap.get(nick) ?? null;
  const bestScore = force ? submittedScore : Math.max(submittedScore, current ?? 0);
  const updated = force || current === null || submittedScore > current;

  if (updated) {
    dailyMap.set(nick, submittedScore);
    const weekCurrent = weeklyMap.get(nick) ?? 0;
    if (submittedScore > weekCurrent) weeklyMap.set(nick, submittedScore);
    const monthCurrent = monthlyMap.get(nick) ?? 0;
    if (submittedScore > monthCurrent) monthlyMap.set(nick, submittedScore);
  }

  return {
    nick,
    submittedScore,
    bestScore,
    score: bestScore,
    updated,
    date: currentDate,
    storage: "memory"
  };
}

export async function getRanking(limit = 10, period: RankingPeriod = "daily"): Promise<LeaderboardEntry[]> {
  const redis = getRedisClient();
  const key = getRankingKey(undefined, period);

  if (redis) {
    const fetchLimit = Math.max(limit * 5, 50);
    const rows = await redis.zrange(key, 0, fetchLimit - 1, {
      rev: true,
      withScores: true
    });

    return normalizeZRangeRows(rows).slice(0, limit);
  }

  let memKey: string;
  if (period === "weekly") memKey = `week:${getWarsawWeekKey()}`;
  else if (period === "monthly") memKey = `month:${getWarsawMonthKey()}`;
  else memKey = getWarsawDateKey();

  const map = memoryStore[memKey] ?? new Map<string, number>();
  return sortLeaderboard(
    [...map.entries()]
      .filter(([nick]) => isNickAllowed(nick))
      .map(([nick, score]) => ({ nick, score }))
  ).slice(0, limit);
}

export function isRedisConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
