# API Dokumentacja

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

### 13. Utworzenie gry Board

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

### 14. Próba parsowania pliku z pytaniami

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

### 13. Dołączenie do gry Quiz

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

### 5. Ranking graczy

`GET /games/board/ranking`

**Response (200)** – [`PlayerDto[]`](#playerdto)

```json
[
  { "index": 0, "nickname": "Ola" },
  { "index": 1, "nickname": "Jan" }
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
- `new-ranking-state`, dane: [`PlayerDto[]`](#playerdto)

---

## Quiz
### Licznik odpowiedzi

`GET /sse/quiz/answer-counter` *(Content-Type: text/event-stream)*

---

## Board
### Nowy stan planszy

`GET /sse/board/new-state (Content-Type: text/event-stream)`, dane: [`SimpleBoardStateDto`](#simpleboardstatedto)


---

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
