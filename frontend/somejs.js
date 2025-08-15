
fetch("http://localhost:8080/manage/quiz", {
  method: "POST",
  body: 
    {
      "name": "Quiz testowy 1",
      "config": {
        "numberOfQuestions": 1
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

}).then((res) => console.log(res.json))