#  Dokumentacja konfiguracji trybów gry

##  Wspólne ustawienia
| Pole                      | Typ       | Opis                                                                 |
| ------------------------- | --------- | -------------------------------------------------------------------- |
| `totalDurationMinutes`    | `Int`     | Całkowity czas trwania gry (w minutach). Musi być dodatni.           |
| `endImmediatelyAfterTime` | `Boolean` | Czy gra kończy się automatycznie po upływie czasu (`true`), czy nie. |
| `questionFilePath`        | `String`  | Ścieżka do pliku z pytaniami (np. CSV lub JSON). Nie może być pusta. |
| `questionDurationSeconds` | `Int`     | Maksymalny czas na odpowiedź na jedno pytanie (w sekundach).         |

---

##  Sprawdzian 

| Pole                       | Typ                         | Opis                                                                               |
| -------------------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| `requiredQuestionCount`    | `Int`                       | Liczba pytań, na które musi odpowiedzieć uczeń.                                    |
| `randomizeQuestions`       | `Boolean`                   | Czy pytania mają być losowane z dostępnej puli.                                    |
| `enforceDifficultyBalance` | `Boolean`                   | Czy losowane pytania powinny być równomiernie rozłożone według poziomów trudności. |
| `selectedQuestionIds`      | `List<Int>`                 | Lista ID pytań wybranych ręcznie (tylko jeśli `randomizeQuestions = false`).       |
| `zeroPointsOnCheating`     | `Boolean`                   | Czy uczeń otrzymuje 0 punktów za próbę ściągania.                                  |
| `markQuestionOnCheating`   | `Boolean`                   | Czy oznaczyć pytanie jako "podejrzane" przy wykryciu ściągania.                    |
| `notifyTeacherOnCheating`  | `Boolean`                   | Czy powiadomić nauczyciela o próbie ściągania.                                     |
| `pointsPerDifficulty`      | `Map<DifficultyLevel, Int>` | Liczba punktów za pytania w zależności od trudności (`EASY`, `MEDIUM`, `HARD`).    |
| `allowGoingBack`           | `Boolean`                   | Czy uczeń może wracać do poprzednich pytań.                                        |
| ``                           |                             |                                                                                    |

---

##  Plansza 

| Pole                    | Typ                         | Opis                                                                                 |
| ----------------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| `pointsPerDifficulty`   | `Map<DifficultyLevel, Int>` | Punkty za pytania w zależności od trudności.                                         |
| `rankingPromotionRules` | `Map<String, Int>`          | Liczba poprawnych odpowiedzi potrzebnych do awansu w danej kategorii (`nazwa -> N`). |

---

##  Quiz

 Używa wyłącznie wspólnych pól.


---

##  Poziomy trudności 

```
EASY
MEDIUM
HARD
```

---
