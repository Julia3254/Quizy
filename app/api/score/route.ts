import { NextResponse } from "next/server";
import { getRanking, saveScore } from "@/lib/rankingStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveScore(body.nick, body.score);
    const ranking = await getRanking(10);

    return NextResponse.json(
      {
        ok: true,
        ...result,
        ranking
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udało się zapisać wyniku.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
