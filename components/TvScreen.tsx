"use client";

import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FactsRotator } from "@/components/FactsRotator";
import { Leaderboard } from "@/components/Leaderboard";
import type { LeaderboardEntry } from "@/lib/rankingStore";

type RankingResponse = {
  ok: boolean;
  date?: string;
  ranking?: LeaderboardEntry[];
  storage?: "redis" | "memory";
};

function getBrowserOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function TvScreen() {
  const [ranking, setRanking] = useState<LeaderboardEntry[]>([]);
  const [origin, setOrigin] = useState(getBrowserOrigin);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const playUrl = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    return `${configured || origin || "https://querion-ai-quiz-mvp-ready.vercel.app"}/play`;
  }, [origin]);

  const refreshRanking = useCallback(async () => {
    try {
      const response = await fetch("/api/ranking", { cache: "no-store" });
      const data = (await response.json()) as RankingResponse;
      if (data.ok) setRanking(data.ranking ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void refreshRanking();
    const interval = window.setInterval(() => void refreshRanking(), 1500);
    return () => window.clearInterval(interval);
  }, [refreshRanking]);

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
          <Leaderboard ranking={ranking} variant="tv" />
        </section>

        <section className="quiz-card shrink-0 rounded-[2.2rem] p-5">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <h2 className="text-3xl font-black leading-tight">Skanuj QR</h2>
              <p className="mt-2 text-base font-semibold text-white/65">Dołącz na telefonie i wpisz nick.</p>
            </div>

            <div className="rounded-[1.8rem] bg-white p-3 shadow-glowStrong">
              <QRCodeSVG
                value={playUrl}
                size={150}
                fgColor="#ff4b1f"
                bgColor="#ffffff"
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
