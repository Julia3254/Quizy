# Querion AI Quiz

Aplikacja quizowa Next.js przeznaczona do pracy na dwóch ekranach:

- `/tv` — widok ekranu głównego z rankingiem, ciekawostką i kodem QR,
- `/play` — widok mobilny dla uczestników quizu,
- `/api/session` — serwerowa sesja gry (start, odpowiedź, zakończenie, zapis wyniku),
- `/api/ranking` — pobieranie rankingu dziennego, tygodniowego lub miesięcznego,
- `/api/validate-email` — walidacja adresu e-mail (format + rekord MX),
- `/api/network` — sprawdzanie dostępu do sieci WiFi,
- `/api/health` — podstawowy status aplikacji.
- `/regulamin` — regulamin quizu,
- `/polityka_prywatnosci` — polityka prywatności.

## Funkcje

- quiz z limitem czasu (90 sekund),
- 100 pytań w losowej kolejności (nie powtarzają się w trakcie gry),
- system żyć (3 życia, strata przy błędnej odpowiedzi),
- serwerowe liczenie wyniku,
- unikalne nicki (nie można użyć nicku już obecnego w rankingu),
- powtórka gry możliwa na tym samym nicku po przegranej,
- licznik pytań (przesuwany: poprzednie | aktualne | następne),
- pulsujący czerwony pasek przy ostatnich 15 sekundach,
- efekty wizualne: konfetti przy dobrej odpowiedzi, shake przy złej,
- statystyki na koniec gry: poprawne odpowiedzi, najdłuższa seria, czas,
- losowa kolejność odpowiedzi,
- geofencing - ograniczenie dostępu do sieci WiFi,
- zapis najlepszego wyniku danego nicku do rankingu dziennego, tygodniowego i miesięcznego,
- rankingi dzienny, tygodniowy i miesięczny liczone według strefy `Europe/Warsaw` i resetowane o północy (odpowiednio: codziennie, w poniedziałek, 1. dnia miesiąca),
- dynamiczne TTL w Redis wyrównane do końca okresu rankingowego, aby rankingi nie znikały przedwcześnie w ciągu dnia,
- zakładki do przełączania rankingów w widoku mobilnym,
- automatyczne cykliczne przełączanie rankingów na ekranie TV (dzienny 60s, tygodniowy 10s, miesięczny 10s),
- walidacja e-maila po stronie klienta i serwera (format + rekord MX),
- regulamin i polityka prywatności z linkami w formularzu zgody,
- zgoda marketingowa z klauzulą RODO,
- filtrowanie niedozwolonych nicków przy zapisie i przy odczycie rankingu,
- obsługa Upstash Redis na produkcji (wymagane do niezawodnego resetu rankingów o północy),
- lokalny fallback w pamięci procesu — tylko do developmentu; nie gwarantuje trwałości danych na Vercel.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Adresy lokalne:

```txt
http://localhost:3000/tv
http://localhost:3000/play
```

Do testu na telefonie w tej samej sieci można uruchomić serwer na wszystkich interfejsach:

```bash
npm run dev:host
```

Następnie należy użyć adresu IP komputera, np.:

```txt
http://192.168.1.20:3000/tv
```

## Zmienne środowiskowe

Plik `.env.example` zawiera wymagane nazwy zmiennych:

```txt
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=

# Zabezpieczenie sieciowe (true = tylko sieć Querion, false = dostęp dla wszystkich)
QUIZ_WIFI_LOCK=false

# Lista dozwolonych sieci (CIDR lub prefixy IP oddzielone przecinkami)
QUIZ_ALLOWED_NETWORKS=192.168.0.0/24,10.0.0
```

Na produkcji `NEXT_PUBLIC_APP_URL` powinien wskazywać publiczny adres aplikacji, np.:

```txt
https://querion-ai-quiz-mvp-ready.vercel.app
```

## Bezpieczeństwo

Aplikacja implementuje serwerowe sesje gry, które uniemożliwiają oszukiwanie:

- Wynik liczony jest wyłącznie po stronie serwera,
- Klient wysyła tylko wybraną odpowiedź (tekst),
- Serwer sprawdza poprawność i przyznaje punkty,
- Sesja przechowuje stan gry (wynik, życia, pytania),
- Zapis do rankingu następuje tylko przy usuwaniu istniejącej sesji (`gameOver` lub `saveScore=true` przy wcześniejszym zakończeniu),
- Nie ma osobnego publicznego endpointu do zapisywania wyników — wynik podlega walidacji sesji,
- Maksymalnie 500 aktywnych sesji w pamięci (auto-czyszczenie),
- Odpowiedzi tasowane są raz na sesję (nie da się podejrzeć poprawnej).

## Reset rankingów

Rankingi resetują się automatycznie o północy w strefie czasowej `Europe/Warsaw`:

- **dzienny** — co północ,
- **tygodniowy** — w poniedziałek o północy (tydzień: poniedziałek–niedziela),
- **miesięczny** — 1. dnia miesiąca o północy.

Klucze Redis mają dynamiczne TTL wyrównane do tych granic, więc dane nie znikają przed końcem okresu. Do niezawodnego działania na produkcji wymagana jest konfiguracja Redis (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`). Fallback w pamięci procesu działa tylko lokalnie i może gubić dane po restarcie instancji Vercel.

## Deploy

```bash
npm run build
npx vercel --prod
```

Po deployu główny alias projektu powinien wskazywać na:

```txt
https://querion-ai-quiz-mvp-ready.vercel.app
```

## Struktura projektu

```txt
app/          trasy Next.js i endpointy API
├── api/
│   ├── session/      serwerowa sesja gry (POST=start, PATCH=odpowiedź, DELETE=zakończenie)
│   ├── ranking/      ranking dzienny/tygodniowy/miesięczny
│   ├── validate-email/  walidacja e-maila
│   └── network/      sprawdzanie dostępu sieciowego
├── regulamin/        strona regulaminu
└── polityka_prywatnosci/  strona polityki prywatności
components/   komponenty interfejsu
data/         pytania i ciekawostki
lib/          logika pomocnicza, ranking, daty i walidacja nicków
middleware.ts geofencing (sprawdzanie IP przy wejściu)
```

## Edycja treści

Pytania quizowe znajdują się w pliku:

```txt
data/questions.ts
```

Ciekawostki na ekranie TV znajdują się w pliku:

```txt
data/facts.ts
```

Walidacja nicków znajduje się w pliku:

```txt
lib/nickValidation.ts
```
