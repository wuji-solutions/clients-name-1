# API Dokumentacja
# Config
## 🛠 Endpoints administratora - config
### 1. Odczytanie istniejącego pliku z konfiguracją

`GET /config/{type}/{config_name}`

**Response (200)** – [`GameConfigDto`](#GameConfigDto)

```json
{
	"type": "QUIZ",
	"totalDurationMinutes": 15,
	"questionFilePath": "/questions/quiz_questions.json",
	"questionDurationSeconds": 10,
	"endImmediatelyAfterTime": true
}
```

### 2. Tworzenie nowego pliku z konfiguracją

`POST /config/{type}/{config_name}`

**Body** – [`GameConfigDto`](#GameConfigDto)
```json
{
  "type": "QUIZ",
  "totalDurationMinutes": 15,
  "questionFilePath": "/questions/quiz_questions.json",
  "questionDurationSeconds": 10,
  "endImmediatelyAfterTime": true
}
```

**Response (200)**

```json
Config test utworzony pomyślnie
```

### 3. Listowanie plików konfiguracyjnych danego typu

`GET /config/list/{type}`

**Response (200)**
```json
[
  "konfiguracja1",
  "konfiguracja2",
  "konfiguracja3"
]
```

### 4. Usuwanie pliku z konfiguracją

`DELETE /config/{type}/{config_name}`

**Response (200)**
```json
true
```
# Quiz
## Endpoints gracza

### 1. Pobranie aktualnego pytania

`GET /games/quiz/questions/current`

**Response (200)** – [`QuestionDto`](#questiondto)

```json
{
  "id": 1,
  "category": "Matematyka",
  "type": "TEXT",
  "task": "2 + 2 =",
  "answers": [
    {
      "id": 0,
      "text": "1"
    },
    {
      "id": 1,
      "text": "4"
    },
    {
      "id": 2,
      "text": "7"
    },
    {
      "id": 3,
      "text": "15"
    }
  ],
  "difficultyLevel": "EASY"
}
```

---

### 2. Odpowiedź na pytanie

`POST /games/quiz/questions/answer`

**Body** – [`AnswerQuestionRequestDto`](#answerquestionrequestdto)

```json
{
  "answerIds": [1]
}
```

**Response (200)**

```json
true
```

---

### 3. Sprawdzenie czy gracz odpowiedział już na pytanie

`GET /games/quiz/questions/{questionId}/already-answered`

**Response (200)** – [`QuestionAlreadyAnsweredResponseDto`](#questionalreadyansweredresponsedto)

```json
{
  "alreadyAnswered": true,
  "answerIds": [1,2]
}
```

---

## Endpoints administratora – pytania

### 4. Przejście do następnego pytania

`POST /games/quiz/questions/next` *(wymaga roli Admin)*

**Response (200)** – [`QuestionDto`](#questiondto)

---

### 5. Zakończenie pytania i pobranie statystyk odpowiedzi

`POST /games/quiz/questions/end` *(wymaga roli Admin)*

**Response (200)** – [`AnswersPerQuestionDto`](#answersperquestiondto)

```json
{
  "answers": [
    {
      "answer": {
        "id": 0,
        "text": "1",
        "isCorrect": false
      },
      "count": 0
    },
    {
      "answer": {
        "id": 1,
        "text": "4",
        "isCorrect": true
      },
      "count": 1
    }
  ]
}
```

---

## Endpoints gry (Admin)

### 6. Utworzenie gry Quiz

`POST /manage/quiz`

**Body** – [`QuizGameCreateRequestDto`](#quizgamecreaterequestdto)

```json
{
  "name": "Quiz testowy 1",
  "config": {
  },
  "questions": [
    {
      "id": 1,
      "category": "Matematyka",
      "type": "TEXT",
      "task": "2 + 2 =",
      "answers": [
        { "id": 0, "text": "1" },
        { "id": 1, "text": "4" },
        { "id": 2, "text": "7" },
        { "id": 3, "text": "15" }
      ],
      "correctAnswerIds": [1]
    }
  ]
}

```

---

### 7. Lista graczy

`GET /manage/players`

**Response (200)** – `PlayerDto[]`

```json
[
  { "index": 0, "nickname": "Jan" },
  { "index": 1, "nickname": "Ola" }
]
```

---

### 8. Start gry

`POST /manage/start`

---

### 9. Pauza gry

`POST /manage/pause`

---

### 10. Wznowienie gry

`POST /manage/resume`

---

### 11. Zakończenie gry

`POST /manage/finish`

---

### 12. Wyrzucenie gracza

`POST /manage/player/kick?playerIndex={int}`

---

### 13. Konfiuracja aktualnej rozgrywki

`GET /manage/config`

**Response (200)**

```json
JSON z konfiguracją gry zależny od typu gry
```
---

### 14. Utworzenie gry Board

`POST /manage/board`

**Body** – [`BoardGameCreateRequestDto`](#boardgamecreaterequestdto)

```json
{
  "name": "Board testowy 1",
  "config": {
    "type": "BOARD",
    "totalDurationMinutes": 10,
    "endImmediatelyAfterTime": false,
    "questionFilePath": "questions.json",
    "questionDurationSeconds": 30,
    "pointsPerDifficulty":{
      "EASY":1,
      "MEDIUM":2,
      "HARD":3
    },
    "rankingPromotionRules":{
      "$course$/Sample Quiz Category": 2
    }
  },
  "questionsFilePath": "D:\\PROJEKTY\\clients-name-1\\backend\\src\\test\\resources\\sample_moodle_xml_1.xml",
  "numberOfTiles": 12
}

```
---
### 15. Utworzenie gry Exam

`POST /manage/exam`

**Body** – [`ExamGameCreateRequestDto`](#boardgamecreaterequestdto)

```json
{
  "name": "Board testowy 1",
  "config": {
    "type": "EXAM",
//    ... ExamConfig
  }
}

```
---

### 16. Próba parsowania pliku z pytaniami

`GET /manage/parse-questions?questionsFilePath={path}`

**Response (200)**

```json
{
	"categories": [
		"$course$/Sample Quiz Category"
	],
	"numOfQuestions": 2
}
```

## Endpoints gracza – dołączanie do gry

### 17. Dołączenie do gry Quiz

`POST /games/quiz/join`

**Body** – [`JoinGameRequestDto`](#joingamerequestdto)

```json
{
  "index": 0
}
```

**Response (200)**

```json
"Ola"
```

---

# Board

## Endpoints gracza

### 1. Dołączenie do gry Board

`POST /games/board/join`

**Body** – [`JoinGameRequestDto`](#joingamerequestdto)

```json
{
  "index": 0
}
```

**Response (200)**

```json
"Ola"
```

---

### 2. Pobranie danych gracza

`GET /games/board/player`

**Response (200)** – [`PlayerDto`](#playerdto)

```json
{
  "index": 0,
  "nickname": "Ola"
}
```

---

### 3. Pobranie stanu planszy

`GET /games/board/state`

**Response (200)** – [`BoardStateDto`](#boardstatedto)

```json
{
  "tileStates": [
    {
      "players": [
        { "index": 0, "nickname": "Ola" },
        { "index": 1, "nickname": "Jan" }
      ],
      "tileIndex": 2,
      "category": "Matematyka"
    },
    ...
  ]
}
```

---

### 4. Ruch gracza

`POST /games/board/player/move`

**Response (200)** – [`MovePlayerResponseDto`](#moveplayerresponsedto)

```json
{
  "diceRoll": 5,
  "newPosition": 2
}
```

---

### 5. Ranking graczy (Leaderboard)

`GET /games/board/leaderboard`

**Response (200)** – [`LeaderboardPlayerDto[]`](#leaderboardplayerdto)

```json
[
  {
    "index": 0,
    "nickname": "Ola",
    "points": 10
  },
  {
    "index": 1,
    "nickname": "Jan",
    "points": 8
  }
]
```

---

### 6. Ruch gracza

`GET /games/board/questions/current`

**Response (200)** – [`QuestionDto`](#questiondto)

```json
{
  "id": 1,
  "category": "Matematyka",
  "type": "TEXT",
  "task": "2 + 2 =",
  "answers": [
    {
      "id": 0,
      "text": "1"
    },
    {
      "id": 1,
      "text": "4"
    },
    {
      "id": 2,
      "text": "7"
    },
    {
      "id": 3,
      "text": "15"
    }
  ],
  "difficultyLevel": "EASY"
}
```


---

### 7. Odpowiedź na pytanie gracza

`POST /games/board/questions/answer`

**Response (200)** – [`AnswerQuestionRequestDto`](#answerquestionrequestdto)

```json
{
  "answerIds": [1]
}
```

---

# Exam

## Endpoints gracza

### 1. Dołączenie do gry Board

`POST /games/exam/join`

**Body** – [`JoinGameRequestDto`](#joingamerequestdto)

```json
{
  "index": 0
}
```

**Response (200)**

```json
"Ola"
```

---

### 2. Pobranie danych gracza

`GET /games/exam/player`

**Response (200)** – [`ExamPlayerDto`](#examplayerdto)

```json
{
  "index": 0,
  "nickname": "Ola",
  "points": 12
}
```
---


### 3. Pobieranie czasu pozostałego do zaplanowanego końca rozgrywki

`GET /games/exam/time-left`

**Response (200)** – [`TimeUntilGameFinishDto`](#TimeUntilGameFinishDto)

```json
{
  "minutes": 0,
  "seconds": 420
}
```
---

nie chce mi sie rozpisywać każdych endpointów do pytań, analogicznie jak do poprzednich trybów, ale tutaj mamy:
- `/games/exam/questions/current`
- `/games/exam/questions/previous`
- `/games/exam/questions/next`
- `/games/exam/questions/answer`



tyle, że endpointy z dostawaniem pytania zwracają DTO `ExtendedQuestionDto`, wyglądające tak:

```json
{
  "id": "number",
  "category": "string",
  "type": "QuestionType",
  "task": "string",
  "answers": [
    // lista <AnswerDto>
  ],
  "difficultyLevel": "DifficultyLevel",
  "questionNumber": "number",
  "totalBaseQuestions": "number",
  "allowGoingBack": "boolean",
  "playerAlreadyAnswered": "boolean",
  "playerAnswerDto": "PlayerAnswerDto" || null
}
```
`PlayerAnswerDto`:
```json
    "selectedIds": "number[]"
```
A przy odpowiadaniu mamy dodatkowe pole `playerCheated` będące `boolem`.

Jeżeli dojdziemy do końca pytań lub będziemy się chcieli cofnąć przed pierwszy element, response to 404 z wiadomością "Nie ma więcej pytań"


### 4. Zakończenie podejścia

`GET /games/exam/complete`

**Response (200)** – [`CompleteExamResponseDto`](#CompleteExamResponseDto)

UWAGA: Pole questionsAnswered może być nullem, jeżeli `showDetailedFinishFeedback` jest ustawione na false

```json
{
  "totalPointsEarned": 85,
  "questionsAnswered": [
    {
      "question": {
        "id": 1,
        "category": "Biologia",
        "type": "TEXT",
        "task": "Które z poniższych zwierząt jest ssakiem?",
        "answers": [
          { "id": 1, "text": "Żaba" },
          { "id": 2, "text": "Delfin" },
          { "id": 3, "text": "Papuga" }
        ],
        "difficultyLevel": "EASY"
      },
      "selectedAnswerIds": [2],
      "isCorrect": true,
      "pointsEarned": 10
    },
    {
      "question": {
        "id": 2,
        "category": "Matematyka",
        "type": "TEXT",
        "task": "Ile wynosi pierwiastek kwadratowy z 64?",
        "answers": [
          { "id": 1, "text": "6" },
          { "id": 2, "text": "8" },
          { "id": 3, "text": "10" }
        ],
        "difficultyLevel": "EASY"
      },
      "selectedAnswerIds": [2],
      "isCorrect": true,
      "pointsEarned": 5
    },
    {
      "question": {
        "id": 3,
        "category": "Geografia",
        "type": "SINGLE_CHOICE",
        "task": "Stolica Francji to:",
        "answers": [
          { "id": 1, "text": "Paryż" },
          { "id": 2, "text": "Londyn" },
          { "id": 3, "text": "Berlin" }
        ],
        "difficultyLevel": "EASY"
      },
      "selectedAnswerIds": [1],
      "isCorrect": true,
      "pointsEarned": 5
    },
    {
      "question": {
        "id": 4,
        "category": "Historia",
        "type": "MULTIPLE_CHOICE",
        "task": "Które z poniższych wydarzeń miały miejsce w XX wieku?",
        "answers": [
          { "id": 1, "text": "II wojna światowa" },
          { "id": 2, "text": "Bitwa pod Grunwaldem" },
          { "id": 3, "text": "Lądowanie na Księżycu" },
          { "id": 4, "text": "Reformacja" }
        ],
        "difficultyLevel": "MEDIUM"
      },
      "selectedAnswerIds": [1, 3],
      "isCorrect": true,
      "pointsEarned": 15
    }
  ]
}


```
---

# SSE – Strumieniowanie zdarzeń

## Wydarzenia

`GET /sse/events` *(Content-Type: text/event-stream)*

Typy wydarzeń wspólnych:
- `game-start`, dane: `{}`
- `game-finish`, dane: `{}`
- `player-kicked`, dane: [`PlayerDto`](#playerdto)

Typy wydarzeń dla quizu:
- `next-question`, dane: `{}`
- `end-question`, dane: `{}`

Typy wydarzeń dla boardgame:
- `new-leaderboard-state`, dane: [`PlayerDto[]`](#playerdto)

---

## Quiz
### Licznik odpowiedzi

`GET /sse/quiz/answer-counter` *(Content-Type: text/event-stream)*

---

## Board
### Nowy stan planszy

`GET /sse/board/new-state (Content-Type: text/event-stream)`, dane: [`SimpleBoardStateDto`](#simpleboardstatedto)


---

## Exam
### Wydarzenia
`GET /sse/exam/admin-events` *(Content-Type: text/event-stream)*
Typy wydarzeń:
- `player-cheated`, dane: [`PlayerCheatedDto`]
- `new-exam-state`, dane: [`NewExamStateDto`]

# Schematy DTO

## `QuestionDto`

```json
{
  "id": "number",
  "category": "string",
  "type": "TEXT",
  "task": "string",
  "answers": [
    {
      "id": "number",
      "text": "string"
    }
  ]
}
```

---

## `AnswerQuestionRequestDto`

```json
{
  "answerIds": ["number"]
}
```

---

## `QuestionAlreadyAnsweredRequestDto`

```json
{
  "questionId": "number"
}
```

---

## `QuestionAlreadyAnsweredResponseDto`

```json
{
  "alreadyAnswered": "boolean",
  "answerIds": ["number"]
}
```

---

## `AnswersPerQuestionDto`

```json
{
  "answers": [
    {
      "answer": {
        "id": "number",
        "text": "text",
        "isCorrect": "boolean"
      },
      "count": "number"
    }
  ]
}
```

---

## `QuizGameCreateRequestDto`

```json
{
  "name": "string",
  "config": {
    /* pola konfiguracji quizu */
  },
  "questions": [
    /* Question[] */
  ]
}
```

---
## `BoardGameCreateRequestDto`

```json
{
  "name": "string",
  "config": {
    /* pola konfiguracji boardu */
  },
  "questionsFilePath": "string",
  "numberOfTiles": "number"
}
```

---

## `PlayerDto`

```json
{
  "index": "number",
  "nickname": "string"
}
```

---

## `JoinGameRequestDto`

```json
{
  "index": "number"
}
```

---
### `BoardStateDto`

```json
{
  "tileStates": [
    {
      "players": /* PlayerDto[] */,
      "tileIndex": "number",
      "category": "string"
    },
    ...
  ]
}
```

---

### `MovePlayerResponseDto`

```json
{
  "diceRoll": "number",
  "newPosition": "number"
}
```
---

### `SimpleBoardStateDto`

```json
{
  "tileStates": [
    {
      "players": /* PlayerDto[] */,
      "tileIndex": "number"
    },
    ...
  ]
}
```
### `GameConfigDto`

#### `QuizConfigDto`

```json
{
  "type": /* string QUIZ/EXAM/BOARD */,
  "totalDurationMinutes": "number",
  "questionFilePath": /* string path to the question file */,
  "questionDurationSeconds": "number",
  "endImmediatelyAfterTime": "boolean"
}
```

#### `ExamConfigDto`

```json
{
  "type": /* string QUIZ/EXAM/BOARD */,
  "totalDurationMinutes": "number",
  "questionFilePath": /* string path to the question file */,
  "questionDurationSeconds": "number",
  "endImmediatelyAfterTime": "boolean",
  "requiredQuestionCount": "number",
  "randomizeQuestions": "boolean",
  "enforceDifficultyBalance": "boolean",
  "selectedQuestionIds": "List(number)",
  "zeroPointsOnCheating": "boolean",
  "markQuestionOnCheating": "boolean",
  "notifyTeacherOnCheating": "boolean",
  "pointsPerDifficulty": {
    "EASY": "number",
    "MEDIUM": "number",
    "HARD": "number"
  },
  "allowGoingBack": "boolean"
}
```

#### `BoardConfigDto`

```json
{
  "type": /* string QUIZ/EXAM/BOARD */,
  "totalDurationMinutes": "number",
  "questionFilePath": /* string path to the question file */,
  "questionDurationSeconds": "number",
  "endImmediatelyAfterTime": "boolean",
  "pointsPerDifficulty": {
    "EASY": "number",
    "MEDIUM": "number",
    "HARD": "number"
  },
  "rankingPromotionRules": {
    "string": "number"
    ...
  }
}
```
#### `LeaderboardPlayerDto`
```json
{
    "index": "number",
    "nickname": "string",
    "points": "number"
  }
```


### `PlayerCheatedDto`
```json
{
  "nickname": "string",
  "index": "number",
  "question": {
    //QuestionDto
  }
}
```


### `NewExamStateDto`
```json
{
  "requiredQuestionCount": "number",
  "playerState": [
    {
      "index": "number",
      "nickname": "string",
      "points": "number",
      "correctAnswers": "number",
      "incorrectAnswers": "number"
    },
    //...
  ]
}
```

### `ExamPlayerDto`
```json
{
  "nickname": "string",
  "index": "number",
  "points": "number"
}
```

### `TimeUntilGameFinishDto`
```json
{
  "minutes": "number",
  "seconds": "number"
}
```

### `CompleteExamResponseDto`

```json
{
  "totalPointsEarned": "number",
  "questionsAnswered": "DetailedPlayerAnswerDto[] | null"
}

```

### `DetailedPlayerAnswerDto`
```json
{
  "question": "QuestionDto",
  "selectedAnswerIds": "number[]",
  "isCorrect": "boolean",
  "pointsEarned": "number"
}
```