import { Redis } from "@upstash/redis";
import { getRankingKey, getWarsawDateKey } from "@/lib/date";
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
  const key = getRankingKey();

  if (redis) {
    const current = normalizeExistingScore(await redis.zscore(key, nick));
    const bestScore = force ? submittedScore : Math.max(submittedScore, current ?? 0);
    const updated = force || current === null || submittedScore > current;

    if (updated) {
      await redis.zadd(key, { score: submittedScore, member: nick });
    }

    await redis.expire(key, 60 * 60 * 36);

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

  const dailyMap = memoryStore[currentDate] ?? new Map<string, number>();
  memoryStore[currentDate] = dailyMap;

  const current = dailyMap.get(nick) ?? null;
  const bestScore = force ? submittedScore : Math.max(submittedScore, current ?? 0);
  const updated = force || current === null || submittedScore > current;

  if (updated) dailyMap.set(nick, submittedScore);

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

export async function getRanking(limit = 10): Promise<LeaderboardEntry[]> {
  const redis = getRedisClient();
  const key = getRankingKey();

  if (redis) {
    const fetchLimit = Math.max(limit * 5, 50);
    const rows = await redis.zrange(key, 0, fetchLimit - 1, {
      rev: true,
      withScores: true
    });

    return normalizeZRangeRows(rows).slice(0, limit);
  }

  const dailyMap = memoryStore[getWarsawDateKey()] ?? new Map<string, number>();
  return sortLeaderboard(
    [...dailyMap.entries()]
      .filter(([nick]) => isNickAllowed(nick))
      .map(([nick, score]) => ({ nick, score }))
  ).slice(0, limit);
}

export function isRedisConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
