export type QuizQuestion = {
  id: number;
  question: string;
  answers: string[];
  correctIndex: number;
};

export const QUESTIONS: QuizQuestion[] = [
  {
    "id": 1,
    "question": "Czym jest sztuczna inteligencja?",
    "answers": [
      "Tylko sprzęt do budowy robotów",
      "Metody, które uczą systemy analizy",
      "Baza danych do pracy w laboratorium"
    ],
    "correctIndex": 1
  },
  {
    "id": 2,
    "question": "Kto zaproponował test Turinga?",
    "answers": [
      "Alan Turing",
      "John McCarthy",
      "Marvin Minsky"
    ],
    "correctIndex": 0
  },
  {
    "id": 3,
    "question": "Co sprawdza test Turinga?",
    "answers": [
      "Czy komputer liczy szybciej od ludzi",
      "Czy robot dobrze chodzi po pokoju",
      "Czy rozmowę z maszyną trudno odróżnić"
    ],
    "correctIndex": 2
  },
  {
    "id": 4,
    "question": "Z jakim wydarzeniem najczęściej łączy się symboliczny początek AI jako dziedziny?",
    "answers": [
      "Startem pierwszej wyszukiwarki",
      "Konferencją w Dartmouth",
      "Premierą mikroprocesora"
    ],
    "correctIndex": 1
  },
  {
    "id": 5,
    "question": "Kto jest najczęściej wskazywany jako osoba, która spopularyzowała termin „Artificial Intelligence”?",
    "answers": [
      "John McCarthy",
      "Geoffrey Hinton",
      "Claude Shannon"
    ],
    "correctIndex": 0
  },
  {
    "id": 6,
    "question": "Co najlepiej opisuje uczenie maszynowe?",
    "answers": [
      "Ręczne reguły dla każdej sytuacji",
      "Szybsze przesyłanie danych w sieci",
      "Uczenie systemu na przykładach"
    ],
    "correctIndex": 2
  },
  {
    "id": 7,
    "question": "Co jest najważniejszym „paliwem” dla wielu systemów AI?",
    "answers": [
      "Dane i przykłady",
      "Grafika 3D i filtry",
      "Chłodzenie serwerów"
    ],
    "correctIndex": 0
  },
  {
    "id": 8,
    "question": "Czym jest model AI?",
    "answers": [
      "Ekran aplikacji korzystającej z AI",
      "System uczący się zależności w danych",
      "Urządzenie sieciowe w firmie"
    ],
    "correctIndex": 1
  },
  {
    "id": 9,
    "question": "Co oznacza trenowanie modelu AI?",
    "answers": [
      "Instalowanie modelu na komputerze",
      "Mierzenie szybkości odpowiedzi",
      "Uczenie modelu na danych zadania"
    ],
    "correctIndex": 2
  },
  {
    "id": 10,
    "question": "Co to jest algorytm?",
    "answers": [
      "Zestaw kroków do rozwiązania problemu",
      "Zbiór danych do szkolenia modelu",
      "Wygląd aplikacji dla użytkownika"
    ],
    "correctIndex": 0
  },
  {
    "id": 11,
    "question": "Po co dzieli się dane na treningowe i testowe?",
    "answers": [
      "Żeby zmniejszyć rozmiar plików w bazie",
      "Żeby sprawdzić działanie na nowych danych",
      "Żeby przyspieszyć domowy internet"
    ],
    "correctIndex": 1
  },
  {
    "id": 12,
    "question": "Co oznacza overfitting?",
    "answers": [
      "Zbyt wolne działanie modelu",
      "Za mała liczba danych w bazie",
      "Nadmierne dopasowanie do treningu"
    ],
    "correctIndex": 2
  },
  {
    "id": 13,
    "question": "Co to jest klasyfikacja w uczeniu maszynowym?",
    "answers": [
      "Przypisywanie danych do kategorii",
      "Sortowanie rekordów według daty",
      "Zmniejszanie rozmiaru danych"
    ],
    "correctIndex": 0
  },
  {
    "id": 14,
    "question": "Co to jest regresja w uczeniu maszynowym?",
    "answers": [
      "Szukanie podobnych rekordów",
      "Przewidywanie wartości liczbowej",
      "Grupowanie danych bez etykiet"
    ],
    "correctIndex": 1
  },
  {
    "id": 15,
    "question": "Czym jest „cecha” (feature) w modelu AI?",
    "answers": [
      "Końcowy wynik pracy modelu",
      "Ustawienie modelu po wdrożeniu",
      "Dane wejściowe używane w analizie"
    ],
    "correctIndex": 2
  },
  {
    "id": 16,
    "question": "Co oznaczają dane oznaczone?",
    "answers": [
      "Dane zaszyfrowane przed analizą",
      "Dane z przypisanymi etykietami",
      "Dane zapisane wyłącznie w chmurze"
    ],
    "correctIndex": 1
  },
  {
    "id": 17,
    "question": "Co zwykle robi uczenie nienadzorowane?",
    "answers": [
      "Szuka ukrytych wzorców bez etykiet",
      "Zawsze przewiduje jedną liczbę",
      "Wymaga opisania każdego przykładu"
    ],
    "correctIndex": 0
  },
  {
    "id": 18,
    "question": "Co to jest klasteryzacja?",
    "answers": [
      "Zamiana obrazu na tekst",
      "Łączenie kilku modeli razem",
      "Grupowanie podobnych danych"
    ],
    "correctIndex": 2
  },
  {
    "id": 19,
    "question": "Co najlepiej charakteryzuje sieć neuronową?",
    "answers": [
      "Zbiór prostych reguł jeśli-to",
      "Model inspirowany neuronami",
      "Magazyn do przechowywania zdjęć"
    ],
    "correctIndex": 1
  },
  {
    "id": 20,
    "question": "Co najczęściej wyróżnia deep learning?",
    "answers": [
      "Wiele warstw wykrywa złożone wzorce",
      "Model działa bez żadnych danych",
      "Technika używana tylko w robotach"
    ],
    "correctIndex": 0
  },
  {
    "id": 21,
    "question": "Co oznacza inferencja w AI?",
    "answers": [
      "Czyszczenie danych do treningu",
      "Aktualizacja sterowników grafiki",
      "Użycie wytrenowanego modelu"
    ],
    "correctIndex": 2
  },
  {
    "id": 22,
    "question": "Co to jest generatywna AI?",
    "answers": [
      "AI robiąca wyłącznie wykresy",
      "AI tworząca nowe treści",
      "AI tylko do klasyfikacji danych"
    ],
    "correctIndex": 1
  },
  {
    "id": 23,
    "question": "Co oznacza skrót LLM?",
    "answers": [
      "Large Language Model",
      "Local Logic Machine",
      "Linked Learning Module"
    ],
    "correctIndex": 0
  },
  {
    "id": 24,
    "question": "Czym zajmuje się NLP?",
    "answers": [
      "Projektowaniem baz danych",
      "Analizą danych z GPS",
      "Analizą języka ludzi"
    ],
    "correctIndex": 2
  },
  {
    "id": 25,
    "question": "Co to jest prompt?",
    "answers": [
      "Zbiór danych testowych",
      "Polecenie wpisane do modelu",
      "Model rozpoznający obrazy"
    ],
    "correctIndex": 1
  },
  {
    "id": 26,
    "question": "Po co stosuje się embeddingi?",
    "answers": [
      "Zamieniają znaczenie danych na wektory",
      "Szyfrują wszystkie odpowiedzi modelu",
      "Zmniejszają ekran aplikacji mobilnej"
    ],
    "correctIndex": 0
  },
  {
    "id": 27,
    "question": "Co to jest token w modelu językowym?",
    "answers": [
      "Zawsze całe zdanie",
      "Parametr w bazie danych",
      "Mały fragment tekstu"
    ],
    "correctIndex": 2
  },
  {
    "id": 28,
    "question": "Co zwykle daje fine-tuning modelu?",
    "answers": [
      "Zmniejsza każdy model o połowę",
      "Dostosowuje model do zadania",
      "Zamienia tekst w grafikę"
    ],
    "correctIndex": 1
  },
  {
    "id": 29,
    "question": "Co oznacza RAG w systemach AI?",
    "answers": [
      "Łączy model z dodatkowym kontekstem",
      "Trenuje model tylko na historii",
      "Kompresuje odpowiedzi modelu"
    ],
    "correctIndex": 0
  },
  {
    "id": 30,
    "question": "Co to jest halucynacja modelu?",
    "answers": [
      "Krótka awaria sprzętu w systemie",
      "Odpowiedź zbyt długa i chaotyczna",
      "Fałszywa, lecz pewnie brzmiąca treść"
    ],
    "correctIndex": 2
  },
  {
    "id": 31,
    "question": "Co zwykle poprawia dobrze napisany prompt?",
    "answers": [
      "Temperaturę procesora",
      "Trafność odpowiedzi modelu",
      "Szybkość internetu"
    ],
    "correctIndex": 1
  },
  {
    "id": 32,
    "question": "Do czego służy system prompt?",
    "answers": [
      "Ustawia rolę i zasady modelu",
      "Trenuje model od zera",
      "Robi kopię zapasową rozmowy"
    ],
    "correctIndex": 0
  },
  {
    "id": 33,
    "question": "Co potrafi model text-to-image?",
    "answers": [
      "Tłumaczy zdjęcie na język",
      "Porządkuje obrazy w folderach",
      "Tworzy obraz z opisu tekstowego"
    ],
    "correctIndex": 2
  },
  {
    "id": 34,
    "question": "Czym różni się tłumaczenie maszynowe od streszczania?",
    "answers": [
      "Tłumaczenie tylko skraca tekst",
      "Zmienia język, a streszczenie skraca",
      "Oba zadania robią dokładnie to samo"
    ],
    "correctIndex": 1
  },
  {
    "id": 35,
    "question": "Co oznacza zero-shot w AI?",
    "answers": [
      "Zadanie bez przykładów w promptcie",
      "Zatrzymanie modelu po epoce zero",
      "Praca bez danych wejściowych"
    ],
    "correctIndex": 0
  },
  {
    "id": 36,
    "question": "Co oznacza, że model jest multimodalny?",
    "answers": [
      "Działa tylko na jednym typie danych",
      "Używa wyłącznie danych liczbowych",
      "Obsługuje różne typy danych"
    ],
    "correctIndex": 2
  },
  {
    "id": 37,
    "question": "Co to jest synteza mowy (TTS)?",
    "answers": [
      "Zamiana tekstu na mowę",
      "Zamiana obrazu na tekst",
      "Analiza emocji w głosie"
    ],
    "correctIndex": 0
  },
  {
    "id": 38,
    "question": "Co to jest rozpoznawanie mowy (ASR)?",
    "answers": [
      "Przekształcanie mowy w obraz",
      "Zamiana mowy na tekst",
      "Tworzenie głosu z próbki"
    ],
    "correctIndex": 1
  },
  {
    "id": 39,
    "question": "Co oznacza OCR?",
    "answers": [
      "Kompresja plików graficznych",
      "Tłumaczenie nagrań audio",
      "Odczyt tekstu z obrazu"
    ],
    "correctIndex": 2
  },
  {
    "id": 40,
    "question": "Co robi system rekomendacyjny?",
    "answers": [
      "Projektuje wygląd aplikacji mobilnej",
      "Podpowiada treści na podstawie danych",
      "Sprawdza poprawność kodu strony"
    ],
    "correctIndex": 1
  },
  {
    "id": 41,
    "question": "Co może zrobić model computer vision?",
    "answers": [
      "Analizuje obrazy i wykrywa obiekty",
      "Generuje wyłącznie tekst w rozmowie",
      "Zastępuje bazę danych aplikacji"
    ],
    "correctIndex": 0
  },
  {
    "id": 42,
    "question": "Co oznacza detekcja obiektów?",
    "answers": [
      "Nadanie zdjęciu jednej etykiety",
      "Zmiana rozdzielczości obrazu",
      "Wskazanie obiektów na obrazie"
    ],
    "correctIndex": 2
  },
  {
    "id": 43,
    "question": "Czym różni się detekcja obiektów od klasyfikacji obrazu?",
    "answers": [
      "Klasyfikacja zawsze jest szybsza",
      "Detekcja wskazuje położenie obiektu",
      "Klasyfikacja działa tylko w czerni"
    ],
    "correctIndex": 1
  },
  {
    "id": 44,
    "question": "Do czego służy segmentacja obrazu?",
    "answers": [
      "Oznacza obszary obrazu według klas",
      "Archiwizuje zdjęcia w folderach",
      "Poprawia jakość mikrofonu"
    ],
    "correctIndex": 0
  },
  {
    "id": 45,
    "question": "Co jest przykładem użycia AI w fotografii smartfonowej?",
    "answers": [
      "Ręczne ustawienie jasności zdjęcia",
      "Wymiana obiektywu w telefonie",
      "Tryb nocny i rozpoznawanie scen"
    ],
    "correctIndex": 2
  },
  {
    "id": 46,
    "question": "Co zwykle analizuje chatbot oparty na AI?",
    "answers": [
      "Wyłącznie pliki graficzne",
      "Pytanie i kontekst rozmowy",
      "Tylko adres IP użytkownika"
    ],
    "correctIndex": 1
  },
  {
    "id": 47,
    "question": "Po co firmom analiza sentymentu?",
    "answers": [
      "Ocenia ton wypowiedzi klientów",
      "Szyfruje bazę produktów",
      "Tworzy kopie serwera"
    ],
    "correctIndex": 0
  },
  {
    "id": 48,
    "question": "Co potrafi model wykrywający spam?",
    "answers": [
      "Mierzy tylko długość wiadomości",
      "Sprawdza szybkość skrzynki",
      "Wykrywa wiadomości niechciane"
    ],
    "correctIndex": 2
  },
  {
    "id": 49,
    "question": "Czym jest personalizacja treści?",
    "answers": [
      "Pokazywanie wszystkim tego samego",
      "Dopasowanie treści do użytkownika",
      "Losowy układ strony głównej"
    ],
    "correctIndex": 1
  },
  {
    "id": 50,
    "question": "Gdzie często spotykamy AI, nawet tego nie zauważając?",
    "answers": [
      "Autouzupełnianie, spam i sugestie",
      "Wyłącznie laboratoria badawcze",
      "Tylko pojazdy autonomiczne"
    ],
    "correctIndex": 0
  },
  {
    "id": 51,
    "question": "Jak AI pomaga w wyszukiwarkach?",
    "answers": [
      "Ustawia zawsze tę samą kolejność",
      "Zastępuje internet katalogiem",
      "Dopasowuje wyniki do intencji"
    ],
    "correctIndex": 2
  },
  {
    "id": 52,
    "question": "Do czego banki używają AI?",
    "answers": [
      "Wykrywanie podejrzanych transakcji",
      "Projektowanie wyglądu kart płatniczych",
      "Archiwizowanie papierów w oddziale"
    ],
    "correctIndex": 0
  },
  {
    "id": 53,
    "question": "Jak AI pomaga w logistyce?",
    "answers": [
      "Wyłącznie drukuje etykiety",
      "Optymalizuje trasy i dostawy",
      "Liczy paczki ręcznie"
    ],
    "correctIndex": 1
  },
  {
    "id": 54,
    "question": "Do czego AI może służyć w medycynie?",
    "answers": [
      "Do samodzielnego leczenia",
      "Do wyboru koloru recepty",
      "Do wsparcia analizy badań"
    ],
    "correctIndex": 2
  },
  {
    "id": 55,
    "question": "Jak AI może wspierać lekarza radiologa?",
    "answers": [
      "Do zmiany kontrastu monitora",
      "Do wykrywania podejrzanych zmian",
      "Do układania grafiku szpitala"
    ],
    "correctIndex": 1
  },
  {
    "id": 56,
    "question": "Jak AI może pomagać w edukacji?",
    "answers": [
      "Tworzy ćwiczenia dla ucznia",
      "Zastępuje szkołę bez nauczycieli",
      "Wyłącza sprawdzanie postępów"
    ],
    "correctIndex": 0
  },
  {
    "id": 57,
    "question": "Do czego AI bywa używana w przemyśle?",
    "answers": [
      "Do drukowania ulotek firmowych",
      "Do kontroli jakości i awarii maszyn",
      "Do ręcznego liczenia pracowników"
    ],
    "correctIndex": 1
  },
  {
    "id": 58,
    "question": "Jak AI pomaga w rolnictwie?",
    "answers": [
      "Może analizować stan upraw",
      "Może tylko podlewać rośliny",
      "Może projektować opakowania"
    ],
    "correctIndex": 0
  },
  {
    "id": 59,
    "question": "Co może robić AI w cyberbezpieczeństwie?",
    "answers": [
      "Wykrywa anomalie i próby ataku",
      "Zawsze usuwa wszystkie hasła",
      "Zmienia wygląd strony firmy"
    ],
    "correctIndex": 0
  },
  {
    "id": 60,
    "question": "Do czego służą systemy wykrywania anomalii?",
    "answers": [
      "Do szukania nietypowych zdarzeń",
      "Do zmiany języka aplikacji",
      "Do skracania nazw plików"
    ],
    "correctIndex": 0
  },
  {
    "id": 61,
    "question": "Które zadania AI automatyzuje zwykle najłatwiej?",
    "answers": [
      "Kreatywne decyzje bez danych",
      "Powtarzalne zadania z regułami",
      "Spory wymagające empatii"
    ],
    "correctIndex": 1
  },
  {
    "id": 62,
    "question": "Co oznacza, że AI wspiera decyzje?",
    "answers": [
      "Daje analizę do oceny człowieka",
      "Sam podpisuje każdą umowę",
      "Ukrywa dane przed użytkownikiem"
    ],
    "correctIndex": 0
  },
  {
    "id": 63,
    "question": "Dlaczego AI nie powinna samodzielnie podejmować każdej ważnej decyzji?",
    "answers": [
      "Bo może się mylić i wymagać nadzoru",
      "Bo zawsze działa bez żadnych danych",
      "Bo nie pokazuje żadnych wyników"
    ],
    "correctIndex": 0
  },
  {
    "id": 64,
    "question": "Co to jest stronniczość modelu AI (bias)?",
    "answers": [
      "Szybsze działanie na nowym sprzęcie",
      "Zmiana koloru interfejsu modelu",
      "Nierówne wyniki wobec części grup"
    ],
    "correctIndex": 2
  },
  {
    "id": 65,
    "question": "Skąd często bierze się stronniczość AI?",
    "answers": [
      "Z wyłącznie zbyt szybkiego internetu",
      "Z niepełnych lub nierównych danych",
      "Z nazwy modelu w dokumentacji"
    ],
    "correctIndex": 1
  },
  {
    "id": 66,
    "question": "Co oznacza wyjaśnialność modelu?",
    "answers": [
      "Model działa tylko po polsku",
      "Kod zawsze jest publiczny",
      "Można częściowo zrozumieć wynik"
    ],
    "correctIndex": 2
  },
  {
    "id": 67,
    "question": "Dlaczego prywatność danych jest ważna w AI?",
    "answers": [
      "Modele nie potrzebują pamięci",
      "Dane mogą dotyczyć konkretnych osób",
      "Prywatność zmienia kolor aplikacji"
    ],
    "correctIndex": 1
  },
  {
    "id": 68,
    "question": "Co powinno się zrobić przed użyciem cudzych danych do trenowania modelu?",
    "answers": [
      "Sprawdzić zgodę i podstawę prawną",
      "Pominąć prawa do danych źródłowych",
      "Wysłać dane bez opisu projektu"
    ],
    "correctIndex": 0
  },
  {
    "id": 69,
    "question": "Co to jest deepfake?",
    "answers": [
      "Zwykły filtr czarno-biały",
      "Kopia zapasowa nagrania",
      "Realistyczna przeróbka osoby"
    ],
    "correctIndex": 2
  },
  {
    "id": 70,
    "question": "Dlaczego deepfake jest ryzykowny?",
    "answers": [
      "Może wprowadzać ludzi w błąd",
      "Zawsze poprawia jakość obrazu",
      "Działa tylko bez internetu"
    ],
    "correctIndex": 0
  },
  {
    "id": 71,
    "question": "Co oznacza znakowanie lub watermarking treści tworzonych przez AI?",
    "answers": [
      "Usunięcie każdego pliku",
      "Dodanie oznaczeń pochodzenia",
      "Zwiększenie jasności ekranu"
    ],
    "correctIndex": 1
  },
  {
    "id": 72,
    "question": "Co warto robić z odpowiedziami AI w ważnych sprawach?",
    "answers": [
      "Uznać je od razu za prawdę",
      "Sprawdzić je w zaufanych źródłach",
      "Usunąć bez czytania odpowiedzi"
    ],
    "correctIndex": 1
  },
  {
    "id": 73,
    "question": "Czy obecne AI ma świadomość jak człowiek?",
    "answers": [
      "Tak, dokładnie jak człowiek",
      "Nie ma na to dowodów",
      "Tylko w małych aplikacjach"
    ],
    "correctIndex": 1
  },
  {
    "id": 74,
    "question": "Co oznacza „human in the loop”?",
    "answers": [
      "Model działa bez żadnego nadzoru",
      "Człowiek ocenia lub zatwierdza wynik",
      "System nie przyjmuje danych"
    ],
    "correctIndex": 1
  },
  {
    "id": 75,
    "question": "Dlaczego model generatywny może dawać różne odpowiedzi na bardzo podobne pytania?",
    "answers": [
      "Zawsze losuje odpowiedź z bazy",
      "Zależy od promptu i kontekstu",
      "Nie korzysta z żadnych danych"
    ],
    "correctIndex": 1
  },
  {
    "id": 76,
    "question": "Co oznacza autonomia systemu AI?",
    "answers": [
      "Liczba kolorów w interfejsie systemu",
      "Stopień działania bez ciągłych instrukcji",
      "Sposób zapisu plików w chmurze firmy"
    ],
    "correctIndex": 1
  },
  {
    "id": 77,
    "question": "Czy każda automatyzacja to AI?",
    "answers": [
      "Tak, każda reguła to AI",
      "Nie, wiele działa bez uczenia",
      "Tylko roboty są automatyzacją"
    ],
    "correctIndex": 1
  },
  {
    "id": 78,
    "question": "Co zwykle odróżnia AI od prostego programu regułowego?",
    "answers": [
      "Zawsze działa bez internetu",
      "Uczy się z danych i wzorców",
      "Ma wyłącznie ręczne reguły"
    ],
    "correctIndex": 1
  },
  {
    "id": 79,
    "question": "Co zwykle jest rozsądniejszym podejściem w firmie?",
    "answers": [
      "AI jako jedyny decydent",
      "AI jako wsparcie pracy ludzi",
      "AI bez mierzenia efektów"
    ],
    "correctIndex": 1
  },
  {
    "id": 80,
    "question": "Co to jest drift modelu?",
    "answers": [
      "Szybsze ładowanie modelu",
      "Spadek jakości przy zmianie danych",
      "Zmiana nazwy wersji programu"
    ],
    "correctIndex": 1
  },
  {
    "id": 81,
    "question": "Dlaczego modele AI trzeba monitorować po wdrożeniu?",
    "answers": [
      "Monitor zawsze zmienia wynik",
      "Dane i zachowania mogą się zmieniać",
      "Model nie zapisuje ustawień"
    ],
    "correctIndex": 1
  },
  {
    "id": 82,
    "question": "Co oznacza, że model jest open source?",
    "answers": [
      "Model działa tylko offline",
      "Kod lub wagi są publiczne",
      "Wyniki są zawsze darmowe"
    ],
    "correctIndex": 1
  },
  {
    "id": 83,
    "question": "Po co robi się benchmark modeli AI?",
    "answers": [
      "Ukrywa błędy modelu przed testami",
      "Porównuje modele na tych samych zadaniach",
      "Zmienia prompt na krótszy tekst"
    ],
    "correctIndex": 1
  },
  {
    "id": 84,
    "question": "Co może oznaczać wysoka precyzja modelu klasyfikacyjnego?",
    "answers": [
      "Wskazane pozytywy często są trafne",
      "Model znajduje wszystkie przypadki",
      "Model zawsze pracuje szybciej"
    ],
    "correctIndex": 0
  },
  {
    "id": 85,
    "question": "Co zwykle oznacza wysoki recall?",
    "answers": [
      "Model ma bardzo krótką nazwę",
      "Model znajduje wiele pozytywów",
      "Model ignoruje dobre przykłady"
    ],
    "correctIndex": 1
  },
  {
    "id": 86,
    "question": "Dlaczego mniejsze modele bywają atrakcyjne w praktyce?",
    "answers": [
      "Są tańsze i szybsze w użyciu",
      "Zawsze są mądrzejsze od dużych",
      "Nie wymagają żadnych danych"
    ],
    "correctIndex": 0
  },
  {
    "id": 87,
    "question": "Czym jest agent AI?",
    "answers": [
      "Tylko przechowuje pliki",
      "Planuje kroki i używa narzędzi",
      "Jest zwykłym kolorem aplikacji"
    ],
    "correctIndex": 1
  },
  {
    "id": 88,
    "question": "Co to są guardrails w systemie AI?",
    "answers": [
      "Dodatkowe przyciski na ekranie",
      "Zabezpieczenia ograniczające ryzyko",
      "Sposób liczenia pamięci RAM"
    ],
    "correctIndex": 1
  },
  {
    "id": 89,
    "question": "Co oznacza red teaming w AI?",
    "answers": [
      "Zmiana koloru interfejsu na czerwony",
      "Celowe testowanie błędów i luk",
      "Tworzenie reklamy dla modelu"
    ],
    "correctIndex": 1
  },
  {
    "id": 90,
    "question": "Jakie pytanie warto zadać przed wdrożeniem AI w procesie?",
    "answers": [
      "Czy ma najdłuższą nazwę projektu",
      "Czy rozwiązuje mierzalny problem",
      "Czy działa tylko nocą w serwerowni"
    ],
    "correctIndex": 1
  },
  {
    "id": 91,
    "question": "Kiedy AI daje zwykle największą wartość?",
    "answers": [
      "Gdy nie ma żadnych danych",
      "Gdy ma dane i jasny cel",
      "Gdy nikt nie sprawdza wyników"
    ],
    "correctIndex": 1
  },
  {
    "id": 92,
    "question": "Co może być oznaką, że zadanie nie nadaje się dobrze do pełnej automatyzacji AI?",
    "answers": [
      "Jest powtarzalne i dobrze opisane",
      "Wymaga empatii i odpowiedzialności",
      "Ma jasne dane oraz reguły"
    ],
    "correctIndex": 1
  },
  {
    "id": 93,
    "question": "Jak AI może pomagać programistom?",
    "answers": [
      "Zawsze sam wdraża aplikację",
      "Sugeruje kod, testy i wyjaśnienia",
      "Usuwa potrzebę sprawdzania kodu"
    ],
    "correctIndex": 1
  },
  {
    "id": 94,
    "question": "Jak AI może wspierać obsługę klienta?",
    "answers": [
      "Zamyka każdą reklamację",
      "Odpowiada na typowe pytania",
      "Ukrywa trudne sprawy"
    ],
    "correctIndex": 1
  },
  {
    "id": 95,
    "question": "Co jest rozsądną rolą AI w pracy twórczej?",
    "answers": [
      "Zawsze wybiera finalną wersję",
      "Wspiera szkice i warianty",
      "Służy tylko do ortografii"
    ],
    "correctIndex": 1
  },
  {
    "id": 96,
    "question": "Czego AI zwykle nie ma w ludzkim sensie?",
    "answers": [
      "Możliwości generowania tekstu",
      "Dostępu do danych wejściowych",
      "Własnych intencji i świadomości"
    ],
    "correctIndex": 2
  },
  {
    "id": 97,
    "question": "Co najlepiej opisuje obecny stan AI?",
    "answers": [
      "Pełne zastąpienie ludzi w pracy",
      "Moda bez praktycznych zastosowań",
      "Duże możliwości i ważne ograniczenia"
    ],
    "correctIndex": 2
  },
  {
    "id": 98,
    "question": "Jak najbezpieczniej traktować wynik modelu generatywnego?",
    "answers": [
      "Jako zawsze prawdziwy wynik",
      "Jako propozycję do sprawdzenia",
      "Jako tekst bez żadnej wartości"
    ],
    "correctIndex": 1
  },
  {
    "id": 99,
    "question": "Co najbardziej zwiększa zaufanie do systemu AI?",
    "answers": [
      "Bardzo długa nazwa systemu",
      "Największy możliwy model",
      "Testy, przejrzystość i nadzór"
    ],
    "correctIndex": 2
  },
  {
    "id": 100,
    "question": "Jakie podejście do AI jest najbardziej dojrzałe?",
    "answers": [
      "Bezgraniczna wiara w odpowiedzi",
      "Odrzucanie AI bez analizy",
      "Świadome użycie z oceną ryzyka"
    ],
    "correctIndex": 2
  }
];
