import { NextResponse } from "next/server";
import { getWarsawDateKey } from "@/lib/date";
import { getRanking, isRedisConfigured } from "@/lib/rankingStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ranking = await getRanking(10);

    return NextResponse.json(
      {
        ok: true,
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
