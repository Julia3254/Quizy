import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { RankingPeriod } from "@/lib/date";
import { seedRankingEntry } from "@/lib/rankingStore";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const body = await request.json();
    const rawPeriod = body.period ?? "daily";
    const period: RankingPeriod = ["daily", "weekly", "monthly"].includes(rawPeriod)
      ? rawPeriod
      : "daily";
    const daysAgo = Math.max(0, Number(body.daysAgo ?? 0));

    const result = await seedRankingEntry(body.nick, body.score, period, daysAgo);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
