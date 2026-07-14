import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getWarsawDateKey } from "@/lib/date";
import type { RankingPeriod } from "@/lib/date";
import { getRanking, isRedisConfigured } from "@/lib/rankingStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = searchParams.get("period") ?? "daily";
    const period: RankingPeriod = ["daily", "weekly", "monthly"].includes(raw)
      ? (raw as RankingPeriod)
      : "daily";

    const ranking = await getRanking(10, period);

    return NextResponse.json(
      {
        ok: true,
        period,
        date: getWarsawDateKey(),
        ranking,
        storage: isRedisConfigured() ? "redis" : "memory"
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "Nie udało się pobrać rankingu." },
      { status: 500 }
    );
  }
}
