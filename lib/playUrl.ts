export function getPublicPlayUrl(origin?: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const base = configured || origin || "";
  return `${base}/play`;
}
