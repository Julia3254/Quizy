import type { LeaderboardEntry } from "@/lib/rankingStore";

type Props = {
  ranking: LeaderboardEntry[];
  variant?: "tv" | "mobile";
};

function sortRanking(ranking: LeaderboardEntry[]) {
  return [...ranking]
    .filter((entry) => entry.nick && Number.isFinite(Number(entry.score)))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.nick.localeCompare(b.nick, "pl");
    });
}

export function Leaderboard({ ranking, variant = "tv" }: Props) {
  const sortedRanking = sortRanking(ranking);
  const top = sortedRanking.slice(0, 3);
  const rest = sortedRanking.slice(3, 10);
  const podiumOrder = [top[1], top[0], top[2]];

  const heights = variant === "tv" ? [96, 136, 84] : [92, 130, 82];
  const fontSize = variant === "tv" ? "text-4xl" : "text-4xl";

  return (
    <section className="w-full">
      <div className="mb-4 text-center">
        <h2 className={variant === "tv" ? "text-4xl font-black" : "text-4xl font-black"}>Top wyników</h2>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.28em] text-white/45">dzisiaj</p>
      </div>

      <div className="mx-auto flex w-full max-w-xl items-end justify-center gap-2 px-1">
        {podiumOrder.map((entry, index) => {
          const place = index === 0 ? 2 : index === 1 ? 1 : 3;
          return (
            <div key={`${place}-${entry?.nick ?? "empty"}`} className="flex w-1/3 flex-col items-center">
              <div className="mb-2 min-h-10 text-center">
                {entry ? (
                  <>
                    <div className="mx-auto mb-1 w-fit rounded-full bg-white px-2.5 py-1 text-xs font-black text-querion-dark">
                      {entry.score} pkt
                    </div>
                    <div className="max-w-[112px] truncate text-sm font-bold text-white/85">{entry.nick}</div>
                  </>
                ) : (
                  <div className="text-xs text-white/30">czeka</div>
                )}
              </div>
              <div
                className="flex w-full flex-col items-center justify-center rounded-t-[2rem] bg-gradient-to-b from-querion-orange to-querion-red px-2 shadow-glow"
                style={{ height: heights[index] }}
              >
                <div className={`${fontSize} font-black leading-none`}>#{place}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-2">
        {rest.length > 0 ? (
          rest.map((entry, index) => (
            <div
              key={`${entry.nick}-${entry.score}-${index}`}
              className="grid grid-cols-[64px_1fr_auto] items-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"
            >
              <div className="text-2xl font-black text-white/60">#{index + 4}</div>
              <div className="truncate text-lg font-extrabold">{entry.nick}</div>
              <div className="rounded-full bg-white px-3 py-1 text-sm font-black text-querion-dark">{entry.score} pkt</div>
            </div>
          ))
        ) : sortedRanking.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-center text-white/50">
            Jeszcze nikt nie zagrał. Zeskanuj QR i rozpocznij quiz.
          </div>
        ) : null}
      </div>
    </section>
  );
}
