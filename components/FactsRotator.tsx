"use client";

import { useEffect, useState } from "react";
import { AI_FACTS } from "@/data/facts";

type Props = {
  compact?: boolean;
};

const FACT_CHANGE_MS = 15000;

export function FactsRotator({ compact = false }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % AI_FACTS.length);
        setVisible(true);
      }, 420);
    }, FACT_CHANGE_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <aside className="quiz-card rounded-[2rem] p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-2xl bg-querion-orange text-xl shadow-glow">✦</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">ciekawostka</p>
          <h3 className="text-xl font-black">AI fact</h3>
        </div>
      </div>
      <p
        className={`${compact ? "min-h-[78px] text-base md:text-lg" : "min-h-[92px] text-xl"} font-bold leading-snug text-white/88 transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {AI_FACTS[index]}
      </p>
    </aside>
  );
}
