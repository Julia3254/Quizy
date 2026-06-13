import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { QUESTIONS } from "@/data/questions";
import { getRanking, saveScore } from "@/lib/rankingStore";
import { validateNick } from "@/lib/nickValidation";

const submissions = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 1000;

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const history = submissions.get(clientId) || [];
  const recent = history.filter((t) => now - t < RATE_WINDOW);
  submissions.set(clientId, recent);
  return recent.length >= RATE_LIMIT;
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nick, questionId, answerText } = body;

    const nickValidation = validateNick(nick);
    if (!nickValidation.ok) {
      return NextResponse.json({ ok: false, message: "Invalid nick" }, { status: 400 });
    }

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown";
    if (isRateLimited(clientId)) {
      return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 });
    }

    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json({ ok: false, message: "Invalid question" }, { status: 400 });
    }

    if (!answerText || typeof answerText !== "string") {
      return NextResponse.json({ ok: false, message: "Invalid answer" }, { status: 400 });
    }

    const isCorrect = answerText === question.answers[question.correctIndex];

    const pointsEarned = isCorrect ? 10 : 0;

    const currentRanking = await getRanking(100);
    const userEntry = currentRanking.find((e) => e.nick === nick);
    const currentScore = userEntry?.score || 0;

    let newScore = currentScore;
    if (isCorrect) {
      newScore = currentScore + pointsEarned;
      await saveScore(nick, newScore);
    }

    const now = Date.now();
    const history = submissions.get(clientId) || [];
    history.push(now);
    submissions.set(clientId, history);

    return NextResponse.json({
      ok: true,
      isCorrect,
      pointsEarned,
      newScore,
      correctIndex: question.correctIndex,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
