const FORBIDDEN_NICK_WORDS = [
  "ziolo",
  "zioło",
  "zielsko",
  "marycha",
  "marihuana",
  "marichuana",
  "marijuana",
  "weed",
  "ganja",
  "joint",
  "blant",
  "buch",
  "hasz",
  "haszysz",
  "skun",
  "skunx",
  "thc",
  "cbd",
  "heroina",
  "hera",
  "heroin",
  "kokaina",
  "koka",
  "cocaine",
  "amfetamina",
  "amfa",
  "meta",
  "meth",
  "mefedron",
  "mefa",
  "mdma",
  "ekstazy",
  "ecstasy",
  "lsd",
  "kwas",
  "grzyby",
  "grzybki",
  "narkotyk",
  "narkotyki",
  "dopalacz",
  "dopalacze",
  "ćpanie",
  "cpanie",
  "ćpun",
  "cpun",
  "kurwa",
  "kurw",
  "chuj",
  "huj",
  "pizda",
  "pizd",
  "jebac",
  "jeb",
  "pierdol",
  "spierdal",
  "wypierdal",
  "zapierdal",
  "popierdol",
  "sukinsyn",

  "kutas",
  "kutafon",
  "fiut",
  "penis",
  "cipa",
  "cipka",
  "cip",
  "cycki",
  "cycek",
  "cyc",
  "dupa",
  "dupek",
  "dupeczka",
  "ruchac",
  "rucha",
  "seks",
  "sex",
  "porno",
  "porn",
  "sperma",

  "fuck",
  "fucking",
  "shit",
  "bitch",
  "asshole",
  "dick",
  "pussy",
  "cunt",
  "cock",
  "cum"
];

const FORBIDDEN_NICK_EXACT = [
  "admin",
  "administrator",
  "moderator",
  "null",
  "undefined",
  "unknown",
  "braknazwy",
  "braknazw"
];

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function stripAccents(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/ß/g, "ss")
    .replace(/а/g, "a")
    .replace(/е/g, "e")
    .replace(/о/g, "o")
    .replace(/р/g, "p")
    .replace(/с/g, "c")
    .replace(/х/g, "x")
    .replace(/у/g, "y")
    .replace(/і/g, "i");
}

function compact(value: string) {
  return value.replace(/[^a-z0-9]/g, "");
}

function squashRepeatedLetters(value: string) {
  return value.replace(/([a-z0-9])\1+/g, "$1");
}

function normalizeNickVariants(value: string) {
  const base = stripAccents(value);

  const leetBase = base
    .replace(/[@4ą]/g, "a")
    .replace(/[ę3]/g, "e")
    .replace(/[!|1]/g, "i")
    .replace(/[ó0]/g, "o")
    .replace(/[ś5$]/g, "s")
    .replace(/[ć]/g, "c")
    .replace(/[żź2]/g, "z")
    .replace(/[ń]/g, "n")
    .replace(/[7+]/g, "t")
    .replace(/[8]/g, "b")
    .replace(/v/g, "u");

  const compactBase = compact(base);
  const compactLeet = compact(leetBase);

  const xAsZ = compactLeet.replace(/x/g, "z");
  const xAsS = compactLeet.replace(/x/g, "s");
  const xAsA = compactLeet.replace(/x/g, "a");
  const xAsU = compactLeet.replace(/x/g, "u");
  const xRemoved = compactLeet.replace(/x/g, "");

  return unique([
    compactBase,
    compactLeet,
    xAsZ,
    xAsS,
    xAsA,
    xAsU,
    xRemoved,
    squashRepeatedLetters(compactBase),
    squashRepeatedLetters(compactLeet),
    squashRepeatedLetters(xAsZ),
    squashRepeatedLetters(xAsS),
    squashRepeatedLetters(xAsA),
    squashRepeatedLetters(xAsU),
    squashRepeatedLetters(xRemoved)
  ]);
}

function levenshteinDistanceAtMost(a: string, b: string, maxDistance: number) {
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;

  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    let rowMin = current[0];

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost
      );
      rowMin = Math.min(rowMin, current[j]);
    }

    if (rowMin > maxDistance) return maxDistance + 1;

    for (let j = 0; j <= b.length; j++) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}

function containsForbiddenWordFuzzy(variant: string, word: string) {
  if (!variant || !word) return false;

  if (variant.includes(word)) return true;

  if (word.length < 4) return false;

  const maxDistance = word.length >= 5 ? 1 : 1;

  const minWindow = Math.max(3, word.length - maxDistance);
  const maxWindow = word.length + maxDistance;

  for (let length = minWindow; length <= maxWindow; length++) {
    if (length > variant.length) continue;

    for (let start = 0; start <= variant.length - length; start++) {
      const part = variant.slice(start, start + length);
      if (levenshteinDistanceAtMost(part, word, maxDistance) <= maxDistance) {
        return true;
      }
    }
  }

  return false;
}

function isForbiddenNick(clean: string) {
  const variants = normalizeNickVariants(clean);

  return variants.some((variant) => {
    if (FORBIDDEN_NICK_EXACT.includes(variant)) return true;

    return FORBIDDEN_NICK_WORDS.some((word) => {
      const normalizedWord = compact(stripAccents(word));
      return containsForbiddenWordFuzzy(variant, normalizedWord);
    });
  });
}

export function cleanNickValue(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 18);
}

export function validateNick(value: string) {
  const clean = cleanNickValue(value);
  const normalizedVariants = normalizeNickVariants(clean);

  if (!clean) {
    return { ok: false, clean, message: "Wpisz nick, żeby rozpocząć quiz." };
  }

  if (clean.length < 2) {
    return { ok: false, clean, message: "Nick musi mieć minimum 2 znaki." };
  }

  if (normalizedVariants.every((variant) => variant.length < 2)) {
    return { ok: false, clean, message: "Nick musi zawierać litery lub cyfry." };
  }

  if (normalizedVariants.some((variant) => /^\d+$/.test(variant))) {
    return { ok: false, clean, message: "Nick nie może składać się tylko z cyfr." };
  }

  if (isForbiddenNick(clean)) {
    return { ok: false, clean, message: "Ten nick jest niedozwolony. Wybierz inną nazwę." };
  }

  return { ok: true, clean, message: "" };
}

export function isNickAllowed(value: string) {
  return validateNick(value).ok;
}
