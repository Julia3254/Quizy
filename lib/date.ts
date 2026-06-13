export function getWarsawDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function getRankingKey(date = new Date()) {
  return `querion-ai-quiz:ranking:${getWarsawDateKey(date)}`;
}
