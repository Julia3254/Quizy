export function getWarsawDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function getWarsawWeekKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const d = new Date(get("year"), get("month") - 1, get("day"));
  const day = d.getDay() === 0 ? 7 : d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  return `${fmt(monday)}_${fmt(sunday)}`;
}

export function getSecondsUntilNextMondayMidnightWarsaw(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const year = get("year");
  const month = get("month") - 1;
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  const nowWarsaw = new Date(year, month, day, hour, minute, second);
  const dayOfWeek = nowWarsaw.getDay();
  const daysUntilNextMonday = dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7;
  const nextMondayMidnight = new Date(year, month, day + daysUntilNextMonday, 0, 0, 0);

  return Math.max(0, Math.floor((nextMondayMidnight.getTime() - nowWarsaw.getTime()) / 1000));
}

export function getSecondsUntilNextMonthFirstMidnightWarsaw(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const year = get("year");
  const month = get("month") - 1;
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  const nowWarsaw = new Date(year, month, day, hour, minute, second);
  const nextMonthFirstMidnight = new Date(year, month + 1, 1, 0, 0, 0);

  return Math.max(0, Math.floor((nextMonthFirstMidnight.getTime() - nowWarsaw.getTime()) / 1000));
}

export function getWarsawMonthKey(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit"
  }).format(date);
}

export type RankingPeriod = "daily" | "weekly" | "monthly";

export function getSecondsUntilMidnightWarsaw(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const year = get("year");
  const month = get("month") - 1;
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  const nowWarsaw = new Date(year, month, day, hour, minute, second);
  const nextMidnightWarsaw = new Date(year, month, day + 1, 0, 0, 0);

  return Math.max(0, Math.floor((nextMidnightWarsaw.getTime() - nowWarsaw.getTime()) / 1000));
}

export function getRankingKey(date = new Date(), period: RankingPeriod = "daily") {
  if (period === "weekly") return `querion-ai-quiz:ranking:week:${getWarsawWeekKey(date)}`;
  if (period === "monthly") return `querion-ai-quiz:ranking:month:${getWarsawMonthKey(date)}`;
  return `querion-ai-quiz:ranking:${getWarsawDateKey(date)}`;
}
