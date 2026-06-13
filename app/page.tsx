import Link from "next/link";

export default function HomePage() {
  return (
    <main className="querion-bg min-h-dvh px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-4xl flex-col items-center justify-center text-center">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 px-5 py-2 text-sm uppercase tracking-[0.28em] text-white/70">
          AI Quiz MVP
        </div>
        <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-7xl">
          Jeden projekt, dwa widoki.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-white/70 md:text-xl">
          Otwórz widok TV na ekranie pionowym, a użytkownicy dołączają przez QR na telefonie.
        </p>
        <div className="mt-10 grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <Link href="/tv" className="orange-button rounded-3xl px-6 py-5 text-lg font-extrabold">
            Widok TV
          </Link>
          <Link href="/play" className="rounded-3xl border border-white/15 bg-white/10 px-6 py-5 text-lg font-extrabold backdrop-blur">
            Widok telefonu
          </Link>
        </div>
      </section>
    </main>
  );
}
