import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { QUESTIONS } from "@/data/questions";
import { validateNick } from "@/lib/nickValidation";

type Session = {
  nick: string;
  score: number;
  lives: number;
  questions: {
    id: number;
    text: string;
    answers: string[];
    correctIndex: number;
  }[];
  currentQuestionIndex: number;
  startTime: number;
  answeredCount: number;
};

const sessions = new Map<string, Session>();

const SESSION_TIMEOUT = 5 * 60 * 1000;
const MAX_SESSIONS = 500;

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function cleanupOldSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.startTime > SESSION_TIMEOUT) {
      sessions.delete(id);
    }
  }
}

function enforceMaxSessions() {
  if (sessions.size > MAX_SESSIONS) {
    const sorted = [...sessions.entries()].sort((a, b) => a[1].startTime - b[1].startTime);
    const toDelete = sorted.slice(0, sessions.size - MAX_SESSIONS);
    for (const [id] of toDelete) {
      sessions.delete(id);
    }
  }
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    cleanupOldSessions();
    enforceMaxSessions();
    
    const body = await request.json();
    const { nick } = body;

    const nickValidation = validateNick(nick);
    if (!nickValidation.ok) {
      return NextResponse.json({ ok: false, message: "Invalid nick" }, { status: 400 });
    }

    const sessionId = generateSessionId();
    const shuffledSource = shuffle(QUESTIONS).slice(0, 20);
    
    const questions = shuffledSource.map(q => {
      const shuffledAnswers = shuffle(q.answers.map((text, idx) => ({ text, idx })));
      return {
        id: q.id,
        text: q.question,
        answers: shuffledAnswers.map(a => a.text),
        correctIndex: shuffledAnswers.findIndex(a => a.idx === q.correctIndex),
      };
    });
    
    sessions.set(sessionId, {
      nick,
      score: 0,
      lives: 3,
      questions,
      currentQuestionIndex: 0,
      startTime: Date.now(),
      answeredCount: 0,
    });

    const firstQuestion = questions[0];

    return NextResponse.json({
      ok: true,
      sessionId,
      question: {
        id: firstQuestion.id,
        text: firstQuestion.text,
        answers: firstQuestion.answers,
      },
      timeLeft: 90,
      score: 0,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    cleanupOldSessions();
    const body = await request.json();
    const { sessionId, answerText } = body;

    const session = sessions.get(sessionId);
    if (!session) {
      return NextResponse.json({ ok: false, message: "Session not found" }, { status: 404 });
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) {
      return NextResponse.json({ ok: false, message: "Question not found" }, { status: 404 });
    }

    const isCorrect = answerText === currentQuestion.answers[currentQuestion.correctIndex];
    
    if (isCorrect) {
      session.score += 10;
    } else {
      session.lives -= 1;
    }
    
    session.answeredCount++;
    session.currentQuestionIndex++;

    const timeLeft = Math.max(0, 90 - Math.floor((Date.now() - session.startTime) / 1000));
    const gameOver = session.lives <= 0 || timeLeft <= 0 || session.currentQuestionIndex >= session.questions.length;

    if (gameOver) {
      sessions.delete(sessionId);
      return NextResponse.json({
        ok: true,
        isCorrect,
        score: session.score,
        gameOver: true,
        finalScore: session.score,
      });
    }

    const answeredQuestion = session.questions[session.currentQuestionIndex - 1];
    const nextQuestion = session.questions[session.currentQuestionIndex];

    return NextResponse.json({
      ok: true,
      isCorrect,
      score: session.score,
      lives: session.lives,
      correctIndex: answeredQuestion.correctIndex,
      gameOver: false,
      question: {
        id: nextQuestion.id,
        text: nextQuestion.text,
        answers: nextQuestion.answers,
      },
      timeLeft,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
