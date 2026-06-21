export function getWarsawDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function getWarsawWeekKey(date = new Date()) {
  const warsawStr = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
  const d = new Date(warsawStr);
  const day = d.getDay() === 0 ? 7 : d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  return `${fmt(monday)}_${fmt(sunday)}`;
}

export function getWarsawMonthKey(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit"
  }).format(date);
}

export type RankingPeriod = "daily" | "weekly" | "monthly";

export function getRankingKey(date = new Date(), period: RankingPeriod = "daily") {
  if (period === "weekly") return `querion-ai-quiz:ranking:week:${getWarsawWeekKey(date)}`;
  if (period === "monthly") return `querion-ai-quiz:ranking:month:${getWarsawMonthKey(date)}`;
  return `querion-ai-quiz:ranking:${getWarsawDateKey(date)}`;
}
