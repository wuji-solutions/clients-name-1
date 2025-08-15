# API Dokumentacja – Quiz

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
      "content": "1"
    },
    {
      "id": 1,
      "content": "4"
    },
    {
      "id": 2,
      "content": "7"
    },
    {
      "id": 3,
      "content": "15"
    }
  ]
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

`GET /games/quiz/questions/already-answered` *(uwaga: nietypowo z body, do poprawy xd, prawdopodobnie jako query parameter)*

**Body** – [`QuestionAlreadyAnsweredRequestDto`](#questionalreadyansweredrequestdto)

```json
{
  "questionId": 1
}
```

**Response (200)** – [`QuestionAlreadyAnsweredResponseDto`](#questionalreadyansweredresponsedto)

```json
{
  "alreadyAnswered": true,
  "answerIds": [1,2]
}
```

---

## 🛠 Endpoints administratora – pytania

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
        "content": "1",
        "isCorrect": false
      },
      "count": 0
    },
    {
      "answer": {
        "id": 1,
        "content": "4",
        "isCorrect": true
      },
      "count": 1
    }
  ]
}
```

---

## 🎮 Endpoints gry (Admin)

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
        { "id": 0, "content": "1" },
        { "id": 1, "content": "4" },
        { "id": 2, "content": "7" },
        { "id": 3, "content": "15" }
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

`POST /manage/kick?playerIndex={int}`

---

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

## SSE – Strumieniowanie zdarzeń

### 14. Licznik odpowiedzi (SSE)

`GET /sse/quiz/answer-counter` *(Content-Type: text/event-stream)*

---

### 15. Wydarzenia (SSE)

`GET /sse/events` *(Content-Type: text/event-stream)*

Typy wydarzeń wspólnych:
- `game-start`, dane: `{}`
- `game-finish`, dane: `{}`
- `player-kicked`, dane: [`PlayerDto`](#playerdto)

Typy wydarzeń dla quizu:
- `next-question`, dane: `{}` 
- `end-question`, dane: `{}`

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
      "content": "string"
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
        "content": "text",
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

