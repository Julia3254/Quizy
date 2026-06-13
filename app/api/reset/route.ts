import { NextResponse } from "next/server";
import { saveScore } from "@/lib/rankingStore";
import { validateNick } from "@/lib/nickValidation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nick } = body;

    const nickValidation = validateNick(nick);
    if (!nickValidation.ok) {
      return NextResponse.json({ ok: false, message: "Invalid nick" }, { status: 400 });
    }

    await saveScore(nick, 0, true);

    return NextResponse.json({ ok: true, message: "Score reset" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
