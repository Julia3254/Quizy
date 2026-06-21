import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { promises as dns } from "dns";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, message: "Brak adresu e-mail." });
    }

    const trimmed = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmed)) {
      return NextResponse.json({ ok: false, message: "Nieprawidłowy format adresu e-mail." });
    }

    const domain = trimmed.split("@")[1];

    try {
      const records = await dns.resolveMx(domain);
      if (!records || records.length === 0) {
        return NextResponse.json({ ok: false, message: "Domena e-mail nie obsługuje poczty." });
      }
    } catch {
      return NextResponse.json({ ok: false, message: "Nie można zweryfikować domeny e-mail. Sprawdź adres." });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Błąd serwera." }, { status: 500 });
  }
}
