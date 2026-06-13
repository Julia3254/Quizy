"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import { QUESTIONS, type QuizQuestion } from "@/data/questions";
import { cleanNickValue, validateNick } from "@/lib/nickValidation";
import type { LeaderboardEntry } from "@/lib/rankingStore";

type Phase = "intro" | "join" | "quiz" | "finish" | "ranking";

type Option = {
  text: string;
  isCorrect: boolean;
};

type PlayQuestion = QuizQuestion & {
  options: Option[];
};

type RankingResponse = {
  ok: boolean;
  ranking?: LeaderboardEntry[];
};

type ScoreResponse = {
  ok: boolean;
  ranking?: LeaderboardEntry[];
  message?: string;
};

const GAME_SECONDS = 90;
const POINTS_FOR_CORRECT = 10;
const LIVES_START = 3;

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createPlayQuestion(previousId?: number): PlayQuestion {
  const pool = QUESTIONS.length > 1 ? QUESTIONS.filter((question) => question.id !== previousId) : QUESTIONS;
  const question = pool[Math.floor(Math.random() * pool.length)] ?? QUESTIONS[0];
  const options = shuffle(
    question.answers.map((text, index) => ({
      text,
      isCorrect: index === question.correctIndex
    }))
  );

  return { ...question, options };
}

async function sendScore(nick: string, score: number): Promise<ScoreResponse | null> {
  if (!nick.trim()) return null;

  try {
    const response = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ nick, score })
    });

    const data = (await response.json()) as ScoreResponse;

    if (!response.ok || !data.ok) {
      console.error(data.message ?? "Nie udało się zapisać wyniku.");
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function MobileQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [nick, setNick] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<PlayQuestion>(() => createPlayQuestion());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [ranking, setRanking] = useState<LeaderboardEntry[]>([]);
  const [nickTouched, setNickTouched] = useState(false);
  const [lives, setLives] = useState(LIVES_START);

  const progress = useMemo(() => Math.max(0, Math.min(100, (timeLeft / GAME_SECONDS) * 100)), [timeLeft]);
  const cleanNick = cleanNickValue(nick);
  const nickValidation = useMemo(() => validateNick(nick), [nick]);
  const canStart = nickValidation.ok;

  const refreshRanking = useCallback(async () => {
    try {
      const response = await fetch("/api/ranking", { cache: "no-store" });
      const data = (await response.json()) as RankingResponse;
      if (data.ok) setRanking(data.ranking ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const finishQuiz = useCallback(async () => {
    setPhase("finish");

    const result = await sendScore(cleanNick, score);
    if (result?.ranking) {
      setRanking(result.ranking);
      return;
    }

    await refreshRanking();
  }, [cleanNick, refreshRanking, score]);

  useEffect(() => {
    if (phase !== "quiz") return;
    if (timeLeft <= 0) {
      void finishQuiz();
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [finishQuiz, phase, timeLeft]);

  useEffect(() => {
    if (phase === "ranking") {
      void refreshRanking();
    }
  }, [phase, refreshRanking]);

  function startGame(event?: FormEvent) {
    event?.preventDefault();
    setNickTouched(true);
    if (!canStart) return;

    const firstQuestion = createPlayQuestion();
    setScore(0);
    setAnsweredCount(0);
    setTimeLeft(GAME_SECONDS);
    setCurrentQuestion(firstQuestion);
    setSelectedIndex(null);
    setLives(LIVES_START);
    setPhase("quiz");
  }

  function answer(index: number) {
    if (selectedIndex !== null || phase !== "quiz") return;

    setSelectedIndex(index);
    const selected = currentQuestion.options[index];
    const nextScore = selected?.isCorrect ? score + POINTS_FOR_CORRECT : score;

    if (selected?.isCorrect) {
      setScore(nextScore);
      void sendScore(cleanNick, nextScore);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(40);
    }

    setAnsweredCount((current) => current + 1);

    if (!selected?.isCorrect) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        window.setTimeout(() => void finishQuiz(), 800);
        return;
      }
    }

    window.setTimeout(() => {
      setCurrentQuestion((previous) => createPlayQuestion(previous.id));
      setSelectedIndex(null);
    }, 580);
  }

  function optionClass(option: Option, index: number) {
    if (selectedIndex === null) return "answer-button";
    if (option.isCorrect) return "answer-correct";
    if (selectedIndex === index && !option.isCorrect) return "answer-wrong";
    return "answer-button opacity-45";
  }

  return (
    <main className="querion-bg querion-grain relative min-h-dvh overflow-hidden text-white">
      <div className="pointer-events-none absolute -right-28 top-20 size-80 rounded-full bg-querion-orange/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-20 size-80 rounded-full bg-querion-red/25 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 py-5">
        {phase === "intro" && (
          <div className="flex min-h-[calc(100dvh-40px)] flex-col justify-between">
            <header className="pt-2 text-sm font-black uppercase tracking-[0.25em] text-white/45">AI Quiz</header>
            <div className="pb-4">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-white/45">AI Quiz</p>
              <h1 className="text-6xl font-black leading-[0.96] tracking-[-0.06em]">Gotowy na quiz?</h1>
              <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-lg font-bold leading-snug text-white/72">
                  Masz 90 sekund i 3 życia. Za każdą dobrą odpowiedź dostajesz 10 punktów, a za złą tracisz jedno życie.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPhase("join")}
              className="orange-button mx-auto mb-3 grid size-20 place-items-center rounded-[1.6rem] text-3xl font-black"
              aria-label="Start"
            >
              »
            </button>
          </div>
        )}

        {phase === "join" && (
          <form onSubmit={startGame} className="flex min-h-[calc(100dvh-40px)] flex-col justify-between">
            <header className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => setPhase("intro")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                Wróć
              </button>
              <span className="text-sm font-black uppercase tracking-[0.25em] text-white/45">AI Quiz</span>
            </header>

            <div className="relative pb-32">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-white/45">Dołącz do gry</p>
              <h1 className="relative z-10 text-6xl font-black leading-[0.96] tracking-[-0.06em]">Dołącz do quizu</h1>

              <label className="relative z-10 mt-10 block">
                <span className="sr-only">Wpisz nick</span>
                <input
                  value={nick}
                  onBlur={() => setNickTouched(true)}
                  onChange={(event) => {
                    setNick(event.target.value);
                    if (!nickTouched) setNickTouched(true);
                  }}
                  placeholder="Wpisz nick"
                  maxLength={18}
                  className={`w-full rounded-full border bg-white/10 px-6 py-5 text-base font-bold text-white outline-none placeholder:text-white/35 focus:ring-4 ${
                    nickTouched && !nickValidation.ok
                      ? "border-red-400 focus:border-red-400 focus:ring-red-500/20"
                      : "border-white/10 focus:border-querion-orange focus:ring-querion-orange/20"
                  }`}
                />
              </label>

              {nickTouched && !nickValidation.ok ? (
                <p className="relative z-10 mt-3 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
                  {nickValidation.message}
                </p>
              ) : (
                <p className="relative z-10 mt-3 px-2 text-sm text-white/45">Nick pojawi się na rankingu TV. Nie ma logowania.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canStart}
              className="orange-button mx-auto mb-3 grid size-20 place-items-center rounded-[1.6rem] text-3xl font-black disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Rozpocznij quiz"
            >
              »
            </button>
          </form>
        )}

        {phase === "quiz" && (
          <div className="flex min-h-[calc(100dvh-40px)] flex-col">
            <header className="pt-2 text-center">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-white/80">AI Quiz</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: LIVES_START }).map((_, index) => (
                    <span
                      key={index}
                      className={`text-xl ${index < lives ? "text-querion-red" : "text-white/20"}`}
                    >
                      ♥
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="w-12 text-left text-xs font-black text-white/70">{GAME_SECONDS - timeLeft}s</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-querion-orange shadow-glow transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="w-12 text-right text-xs font-black text-white/70">90s</span>
              </div>
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {Array.from({ length: Math.min(10, Math.max(5, answeredCount + 1)) }).map((_, index) => (
                  <span
                    key={index}
                    className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${
                      index === answeredCount ? "bg-querion-orange shadow-glow" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>
            </header>

            <section className="mt-auto pb-6 pt-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="max-w-[300px] text-4xl font-black leading-[1.02] tracking-[-0.05em]">{currentQuestion.question}</h2>
                <div className="rounded-2xl bg-white px-3 py-2 text-center text-querion-dark">
                  <div className="text-2xl font-black">{score}</div>
                  <div className="text-[10px] font-black uppercase">pkt</div>
                </div>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={`${currentQuestion.id}-${option.text}`}
                    type="button"
                    onClick={() => answer(index)}
                    className={`${optionClass(option, index)} flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-lg font-extrabold transition-all duration-200`}
                  >
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-white" />
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => void finishQuiz()}
                className="mt-5 w-full rounded-full border border-white/10 bg-white/10 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white/55"
              >
                zakończ wcześniej
              </button>
            </section>
          </div>
        )}

        {phase === "finish" && (
          <div className="flex min-h-[calc(100dvh-40px)] flex-col justify-between text-center">
            <header className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => setPhase("ranking")} className="orange-button rounded-full px-4 py-2 text-sm font-black">
                Zobacz ranking
              </button>
              <button type="button" onClick={() => setPhase("intro")} className="grid size-12 place-items-center rounded-full bg-black/45 text-3xl font-light">
                ×
              </button>
            </header>

            <section className="relative py-8">
              <p className="mx-auto mb-5 max-w-[300px] text-4xl font-black leading-[1.05] tracking-[-0.05em]">
                Gratulacje ukończyłeś nasz quiz o AI
              </p>
              <p className="mt-6 text-sm font-black text-white/80">Twój wynik</p>
              <div className="relative z-10 mt-4 text-7xl font-black tracking-[-0.08em] text-querion-orange drop-shadow-[0_0_34px_rgba(255,75,31,.65)]">
                {score}pkt
              </div>
              <p className="mx-auto mt-8 max-w-xs text-lg leading-snug text-white/55">W dziennym rankingu zostaje zapisany Twój najlepszy wynik.</p>
            </section>

            <footer className="grid grid-cols-3 gap-4 pb-3">
              <button type="button" onClick={() => setPhase("intro")} className="orange-button grid h-16 place-items-center rounded-2xl text-3xl font-black">
                ⌂
              </button>
              <button type="button" onClick={() => startGame()} className="orange-button grid h-16 place-items-center rounded-2xl text-3xl font-black">
                ↻
              </button>
              <button type="button" onClick={() => setPhase("ranking")} className="orange-button grid h-16 place-items-center rounded-2xl text-3xl font-black">
                ↗
              </button>
            </footer>
          </div>
        )}

        {phase === "ranking" && (
          <div className="flex min-h-[calc(100dvh-40px)] flex-col">
            <header className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => setPhase("finish")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                Wróć
              </button>
              <span className="text-sm font-black uppercase tracking-[0.25em] text-white/45">AI Quiz</span>
            </header>
            <section className="mt-8 flex-1 overflow-y-auto pb-6 no-scrollbar">
              <Leaderboard ranking={ranking} variant="mobile" />
            </section>
            <button type="button" onClick={() => startGame()} className="orange-button mb-3 rounded-3xl px-6 py-5 text-lg font-black">
              Zagraj jeszcze raz
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
