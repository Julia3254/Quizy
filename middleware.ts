import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isIpAllowed } from "@/lib/network";

export function middleware(request: NextRequest) {
  const wifiLock = process.env.QUIZ_WIFI_LOCK !== "false";

  const allowedNetworks = process.env.QUIZ_ALLOWED_NETWORKS
    ? process.env.QUIZ_ALLOWED_NETWORKS.split(",").map((s) => s.trim())
    : ["192.168.0.0/16", "10.0.0.0/8", "172.16.0.0/12"];

  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const realIp = request.headers.get("x-real-ip") || "";
  const clientIp = forwardedFor.split(",")[0]?.trim() || realIp || "unknown";

  const isAllowed = !wifiLock || isIpAllowed(clientIp, allowedNetworks, true);

  const response = NextResponse.next();
  response.headers.set("x-quiz-network-allowed", isAllowed ? "true" : "false");

  return response;
}

export const config = {
  matcher: ["/", "/play/:path*"],
};
