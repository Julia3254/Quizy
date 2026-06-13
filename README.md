# Querion AI Quiz

Aplikacja quizowa Next.js przeznaczona do pracy na dwóch ekranach:

- `/tv` — widok ekranu głównego z rankingiem, ciekawostką i kodem QR,
- `/play` — widok mobilny dla uczestników quizu,
- `/api/session` — serwerowa sesja gry,
- `/api/score` — zapis najlepszego wyniku gracza,
- `/api/ranking` — pobieranie dziennego rankingu,
- `/api/network` — sprawdzanie dostępu do sieci WiFi,
- `/api/health` — podstawowy status aplikacji.

## Funkcje

- quiz z limitem czasu,
- system żyć,
- serwerowe liczenie wyniku,
- losowa kolejność odpowiedzi,
- geofencing - ograniczenie dostępu do sieci WiFi,
- zapis najlepszego wyniku danego nicku w danym dniu,
- ranking dzienny liczony według strefy `Europe/Warsaw`,
- filtrowanie niedozwolonych nicków przy zapisie i przy odczycie rankingu,
- obsługa Upstash Redis na produkcji,
- lokalny fallback w pamięci procesu, gdy Redis nie jest skonfigurowany.

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
- Maksymalnie 500 aktywnych sesji w pamięci (auto-czyszczenie),
- Odpowiedzi tasowane są raz na sesję (nie da się podejrzeć poprawnej).

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
│   ├── session/      serwerowa sesja gry (POST=start, PATCH=odpowiedź)
│   ├── score/        zapis najlepszego wyniku
│   ├── ranking/      dzienny ranking
│   └── network/      sprawdzanie dostępu sieciowego
components/   komponenty interfejsu
data/         pytania i ciekawostki
lib/          logika pomocnicza, ranking i walidacja nicków
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
