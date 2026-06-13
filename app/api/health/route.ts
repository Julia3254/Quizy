import { NextResponse } from "next/server";
import { isRedisConfigured } from "@/lib/rankingStore";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "AI Quiz MVP",
    redisConfigured: isRedisConfigured()
  });
}
