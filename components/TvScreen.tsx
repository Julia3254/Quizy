"use client";

import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FactsRotator } from "@/components/FactsRotator";
import { Leaderboard } from "@/components/Leaderboard";
import type { LeaderboardEntry } from "@/lib/rankingStore";
import type { RankingPeriod } from "@/lib/date";

type RankingResponse = {
  ok: boolean;
  date?: string;
  ranking?: LeaderboardEntry[];
  storage?: "redis" | "memory";
};

const PERIODS: RankingPeriod[] = ["daily", "weekly", "monthly"];
const PERIOD_LABELS: Record<RankingPeriod, string> = {
  daily: "Dzisiaj",
  weekly: "Tygodniowo",
  monthly: "Miesięcznie",
};
const PERIOD_INTERVALS: Record<RankingPeriod, number> = {
  daily: 60000,
  weekly: 10000,
  monthly: 10000,
};

export function TvScreen() {
  const [ranking, setRanking] = useState<LeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [periodIndex, setPeriodIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const currentPeriod = PERIODS[periodIndex];

  useEffect(() => {
    setMounted(true);
  }, []);

  const playUrl = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    if (configured) return `${configured}/play`;
    if (mounted) return `${window.location.origin}/play`;
    return "";
  }, [mounted]);

  const refreshRanking = useCallback(async (period: RankingPeriod) => {
    try {
      const response = await fetch(`/api/ranking?period=${period}`, { cache: "no-store" });
      const data = (await response.json()) as RankingResponse;
      if (data.ok) setRanking(data.ranking ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void refreshRanking(currentPeriod);
    const dataInterval = window.setInterval(() => void refreshRanking(currentPeriod), 5000);
    return () => window.clearInterval(dataInterval);
  }, [refreshRanking, currentPeriod]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimating(true);
      window.setTimeout(() => {
        setPeriodIndex((i) => (i + 1) % PERIODS.length);
        setAnimating(false);
      }, 400);
    }, PERIOD_INTERVALS[currentPeriod]);
    return () => window.clearTimeout(timer);
  }, [currentPeriod]);

  return (
    <main className="querion-bg querion-grain tv-aspect relative overflow-hidden px-6 py-6 text-white">
      <div className="pointer-events-none absolute -right-28 top-24 size-72 rounded-full bg-querion-orange/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-16 size-80 rounded-full bg-querion-red/25 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-48px)] w-full max-w-[680px] flex-col gap-4">
        <header className="shrink-0">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/45">AI Quiz</p>
          <h1 className="text-4xl font-black leading-none">Zagraj w quiz</h1>
        </header>

        <section className="shrink-0">
          <FactsRotator compact />
        </section>

        <section className="quiz-card min-h-0 flex-1 overflow-hidden rounded-[2.2rem] p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              {PERIODS.map((p, i) => (
                <div
                  key={p}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === periodIndex ? "w-8 bg-querion-orange" : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white/40">
              {PERIOD_LABELS[currentPeriod]}
            </span>
          </div>
          <div
            className="transition-opacity duration-400"
            style={{ opacity: animating ? 0 : 1 }}
          >
            <Leaderboard ranking={ranking} variant="tv" period={currentPeriod} />
          </div>
        </section>

        <section className="quiz-card shrink-0 rounded-[2.2rem] p-5">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <h2 className="text-3xl font-black leading-tight">Skanuj QR</h2>
              <p className="mt-2 text-base font-semibold text-white/65">Dołącz na telefonie i wpisz nick.</p>
            </div>

            <div className="rounded-[1.8rem] bg-white p-3 shadow-glowStrong">
              {mounted && playUrl ? (
                <QRCodeSVG
                  value={playUrl}
                  size={150}
                  fgColor="#ff4b1f"
                  bgColor="#ffffff"
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <div style={{ width: 150, height: 150 }} />
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
