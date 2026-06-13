import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function ipToLong(ip: string): number {
  const parts = ip.split(".").map(Number);
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function isIpInCidr(ip: string, cidr: string): boolean {
  const [network, bits] = cidr.split("/");
  const mask = -1 << (32 - parseInt(bits || "32", 10));
  const ipLong = ipToLong(ip);
  const networkLong = ipToLong(network);
  return (ipLong & mask) === (networkLong & mask);
}

function isIpAllowed(ip: string, allowedNetworks: string[]): boolean {
  if (ip === "127.0.0.1" || ip === "::1" || ip.includes("localhost")) {
    return true;
  }
  return allowedNetworks.some((network) => {
    if (network.includes("/")) {
      return isIpInCidr(ip, network);
    }
    return ip.startsWith(network.replace(/\*/g, ""));
  });
}

export function middleware(request: NextRequest) {
  const wifiLock = process.env.QUIZ_WIFI_LOCK !== "false";

  const allowedNetworks = process.env.QUIZ_ALLOWED_NETWORKS
    ? process.env.QUIZ_ALLOWED_NETWORKS.split(",").map((s) => s.trim())
    : ["192.168.0.0/16", "10.0.0.0/8", "172.16.0.0/12"];

  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const realIp = request.headers.get("x-real-ip") || "";
  const clientIp = forwardedFor.split(",")[0]?.trim() || realIp || "unknown";

  const isAllowed = !wifiLock || isIpAllowed(clientIp, allowedNetworks);

  const response = NextResponse.next();
  response.headers.set("x-quiz-network-allowed", isAllowed ? "true" : "false");

  return response;
}

export const config = {
  matcher: ["/", "/play/:path*"],
};
