export const TEST_QUIZ = {
  name: 'Quiz testowy 1',
  config: {
    totalDurationMinutes: 10,
    endImmediatelyAfterTime: false,
    questionFilePath: 'questions.json',
    questionDurationSeconds: 30,
  },
  questions: [
    {
      id: 1,
      category: 'Matematyka',
      type: 'TEXT',
      task: '2 + 2 =',
      answers: [
        { id: 0, content: '1' },
        { id: 1, content: '4' },
        { id: 2, content: '7' },
        { id: 3, content: '15' },
      ],
      correctAnswerIds: [1],
      difficultyLevel: 'EASY',
    },
    {
      id: 2,
      category: 'M2tematyka',
      type: 'TEXT',
      task: '2 + 3 =',
      answers: [
        { id: 0, content: '5' },
        { id: 1, content: '-5' },
        { id: 2, content: '∫5x^18' },
        { id: 3, content: 'whatever man' },
      ],
      correctAnswerIds: [0],
      difficultyLevel: 'EASY',
    },
  ],
};

export const TEST_GAME = {
  name: 'Quiz testowy 1',
  config: {
    totalDurationMinutes: 10,
    endImmediatelyAfterTime: false,
    questionFilePath: 'questions.json',
    questionDurationSeconds: 30,
    pointsPerDifficulty: {
      EASY: 1,
      MEDIUM: 2,
      HARD: 3,
    },
    rankingPromotionRules: {
      Matematyka: 2,
    },
  },
  questions: [
    {
      id: 1,
      category: 'Matematyka',
      type: 'TEXT',
      task: '2 + 2 =',
      answers: [
        { id: 0, content: '1' },
        { id: 1, content: '4' },
        { id: 2, content: '7' },
        { id: 3, content: '15' },
      ],
      correctAnswerIds: [1],
      difficultyLevel: 'EASY',
    },
    {
      id: 2,
      category: 'Matematyka',
      type: 'TEXT',
      task: '2 + 3 =',
      answers: [
        { id: 0, content: '1' },
        { id: 1, content: '4' },
        { id: 2, content: '7' },
        { id: 3, content: '15' },
      ],
      correctAnswerIds: [1],
      difficultyLevel: 'EASY',
    },
  ],
  categories: ['Matematyka'],
  tiles: [
    {
      category: 'Matematyka',
      index: 0,
    },
    {
      category: 'Matematyka',
      index: 1,
    },
    {
      category: 'Matematyka',
      index: 2,
    },
    {
      category: 'Matematyka',
      index: 3,
    },
    {
      category: 'Matematyka',
      index: 4,
    },
    {
      category: 'Matematyka',
      index: 5,
    },
    {
      category: 'Matematyka',
      index: 6,
    },
    {
      category: 'Matematyka',
      index: 7,
    },
    {
      category: 'Matematyka',
      index: 8,
    },
    {
      category: 'Matematyka',
      index: 9,
    },
  ],
};

export const TEST_GAME_2 = {
  "name": "Quiz wiedzy ogólnej",
  "config": {
    "totalDurationMinutes": 15,
    "endImmediatelyAfterTime": false,
    "questionFilePath": "questions.json",
    "questionDurationSeconds": 30,
    "pointsPerDifficulty": {
      "EASY": 1,
      "MEDIUM": 2,
      "HARD": 3
    },
    "rankingPromotionRules": {
      "Matematyka": 2,
      "Język polski": 2,
      "Historia": 2,
      "Geografia": 1,
      "Biologia": 2,
      "Chemia": 2,
      "Sport": 2,
      "Muzyka": 2,
      "Film": 2
    }
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
      "correctAnswerIds": [1],
      "difficultyLevel": "EASY"
    },
    {
      "id": 2,
      "category": "Matematyka",
      "type": "TEXT",
      "task": "Ile wynosi pierwiastek kwadratowy z 81?",
      "answers": [
        { "id": 0, "content": "7" },
        { "id": 1, "content": "8" },
        { "id": 2, "content": "9" },
        { "id": 3, "content": "10" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "EASY"
    },
    {
      "id": 3,
      "category": "Język polski",
      "type": "TEXT",
      "task": "Kto jest autorem \"Pana Tadeusza\"?",
      "answers": [
        { "id": 0, "content": "Juliusz Słowacki" },
        { "id": 1, "content": "Adam Mickiewicz" },
        { "id": 2, "content": "Henryk Sienkiewicz" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "EASY"
    },
    {
      "id": 4,
      "category": "Język polski",
      "type": "TEXT",
      "task": "\"W Szczebrzeszynie chrząszcz brzmi w trzcinie\" to przykład:",
      "answers": [
        { "id": 0, "content": "Palindromu" },
        { "id": 1, "content": "Anagramu" },
        { "id": 2, "content": "Łamańca językowego" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "EASY"
    },
    {
      "id": 5,
      "category": "Język polski",
      "type": "TEXT",
      "task": "Która z postaci nie pochodzi z twórczości Henryka Sienkiewicza?",
      "answers": [
        { "id": 0, "content": "Andrzej Kmicic" },
        { "id": 1, "content": "Stanisław Wokulski" },
        { "id": 2, "content": "Jan Skrzetuski" },
        { "id": 3, "content": "Longinus Podbipięta" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 6,
      "category": "Język polski",
      "type": "TEXT",
      "task": "W której epoce literackiej tworzył Jan Kochanowski?",
      "answers": [
        { "id": 0, "content": "Średniowiecze" },
        { "id": 1, "content": "Barok" },
        { "id": 2, "content": "Renesans" },
        { "id": 3, "content": "Oświecenie" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 7,
      "category": "Język polski",
      "type": "TEXT",
      "task": "Jak nazywa się artystyczny środek stylistyczny polegający na przypisaniu cech ludzkich zwierzętom lub przedmiotom?",
      "answers": [
        { "id": 0, "content": "Metafora" },
        { "id": 1, "content": "Porównanie" },
        { "id": 2, "content": "Personifikacja" },
        { "id": 3, "content": "Epitet" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "HARD"
    },
    {
      "id": 8,
      "category": "Historia",
      "type": "TEXT",
      "task": "W którym roku odbył się chrzest Polski?",
      "answers": [
        { "id": 0, "content": "1025" },
        { "id": 1, "content": "1410" },
        { "id": 2, "content": "966" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "EASY"
    },
    {
      "id": 9,
      "category": "Historia",
      "type": "TEXT",
      "task": "Kto był pierwszym królem Polski?",
      "answers": [
        { "id": 0, "content": "Mieszko I" },
        { "id": 1, "content": "Bolesław Chrobry" },
        { "id": 2, "content": "Kazimierz Wielki" },
        { "id": 3, "content": "Władysław Łokietek" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "EASY"
    },
    {
      "id": 10,
      "category": "Historia",
      "type": "TEXT",
      "task": "W którym roku wybuchło Powstanie Warszawskie?",
      "answers": [
        { "id": 0, "content": "1939" },
        { "id": 1, "content": "1943" },
        { "id": 2, "content": "1944" },
        { "id": 3, "content": "1945" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 11,
      "category": "Historia",
      "type": "TEXT",
      "task": "Która bitwa jest uznawana za jedną z największych bitew średniowiecznej Europy?",
      "answers": [
        { "id": 0, "content": "Bitwa pod Cedynią" },
        { "id": 1, "content": "Bitwa pod Grunwaldem" },
        { "id": 2, "content": "Bitwa pod Wiedniem" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 12,
      "category": "Historia",
      "type": "TEXT",
      "task": "Słynne słowa \"Veni, vidi, vici\" wypowiedział:",
      "answers": [
        { "id": 0, "content": "Oktawian August" },
        { "id": 1, "content": "Neron" },
        { "id": 2, "content": "Juliusz Cezar" },
        { "id": 3, "content": "Aleksander Wielki" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "HARD"
    },
    {
      "id": 13,
      "category": "Geografia",
      "type": "TEXT",
      "task": "Jaka jest stolica Australii?",
      "answers": [
        { "id": 0, "content": "Sydney" },
        { "id": 1, "content": "Melbourne" },
        { "id": 2, "content": "Canberra" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "EASY"
    },
    {
      "id": 14,
      "category": "Geografia",
      "type": "TEXT",
      "task": "Która rzeka jest najdłuższa na świecie?",
      "answers": [
        { "id": 0, "content": "Amazonka" },
        { "id": 1, "content": "Nil" },
        { "id": 2, "content": "Jangcy" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "EASY"
    },
    {
      "id": 15,
      "category": "Geografia",
      "type": "TEXT",
      "task": "Jak nazywa się najwyższy szczyt Ziemi?",
      "answers": [
        { "id": 0, "content": "K2" },
        { "id": 1, "content": "Mount Everest" },
        { "id": 2, "content": "Mont Blanc" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 16,
      "category": "Geografia",
      "type": "TEXT",
      "task": "W którym państwie znajduje się Wielki Kanion?",
      "answers": [
        { "id": 0, "content": "Kanada" },
        { "id": 1, "content": "Meksyk" },
        { "id": 2, "content": "USA" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 17,
      "category": "Geografia",
      "type": "TEXT",
      "task": "Które z wymienionych państw nie ma dostępu do morza?",
      "answers": [
        { "id": 0, "content": "Węgry" },
        { "id": 1, "content": "Rumunia" },
        { "id": 2, "content": "Chorwacja" },
        { "id": 3, "content": "Bułgaria" }
      ],
      "correctAnswerIds": [0],
      "difficultyLevel": "HARD"
    },
    {
      "id": 18,
      "category": "Biologia",
      "type": "TEXT",
      "task": "Jak nazywa się proces, w którym rośliny przekształcają światło słoneczne w energię?",
      "answers": [
        { "id": 0, "content": "Oddychanie" },
        { "id": 1, "content": "Transpiracja" },
        { "id": 2, "content": "Fotosynteza" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "EASY"
    },
    {
      "id": 19,
      "category": "Biologia",
      "type": "TEXT",
      "task": "Który narząd jest odpowiedzialny za pompowanie krwi?",
      "answers": [
        { "id": 0, "content": "Płuca" },
        { "id": 1, "content": "Serce" },
        { "id": 2, "content": "Wątroba" },
        { "id": 3, "content": "Mózg" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "EASY"
    },
    {
      "id": 20,
      "category": "Biologia",
      "type": "TEXT",
      "task": "Co jest nośnikiem informacji genetycznej w komórkach?",
      "answers": [
        { "id": 0, "content": "RNA" },
        { "id": 1, "content": "Białko" },
        { "id": 2, "content": "DNA" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 21,
      "category": "Biologia",
      "type": "TEXT",
      "task": "Które z poniższych zwierząt jest ssakiem?",
      "answers": [
        { "id": 0, "content": "Pingwin" },
        { "id": 1, "content": "Wieloryb" },
        { "id": 2, "content": "Rekin" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 22,
      "category": "Biologia",
      "type": "TEXT",
      "task": "Jak nazywają się organelle komórkowe odpowiedzialne za produkcję energii (ATP)?",
      "answers": [
        { "id": 0, "content": "Rybosomy" },
        { "id": 1, "content": "Mitochondria" },
        { "id": 2, "content": "Aparat Golgiego" },
        { "id": 3, "content": "Jądro komórkowe" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "HARD"
    },
    {
      "id": 23,
      "category": "Chemia",
      "type": "TEXT",
      "task": "Jaki jest chemiczny symbol wody?",
      "answers": [
        { "id": 0, "content": "O2" },
        { "id": 1, "content": "H2O" },
        { "id": 2, "content": "CO2" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "EASY"
    },
    {
      "id": 24,
      "category": "Chemia",
      "type": "TEXT",
      "task": "Z jakich pierwiastków składa się sól kuchenna (NaCl)?",
      "answers": [
        { "id": 0, "content": "Sód i chlor" },
        { "id": 1, "content": "Wodór i tlen" },
        { "id": 2, "content": "Węgiel i tlen" }
      ],
      "correctAnswerIds": [0],
      "difficultyLevel": "EASY"
    },
    {
      "id": 25,
      "category": "Chemia",
      "type": "TEXT",
      "task": "Jaki gaz jest najobficiej występującym w atmosferze ziemskiej?",
      "answers": [
        { "id": 0, "content": "Tlen" },
        { "id": 1, "content": "Azot" },
        { "id": 2, "content": "Dwutlenek węgla" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 26,
      "category": "Chemia",
      "type": "TEXT",
      "task": "Który pierwiastek chemiczny ma symbol 'Au'?",
      "answers": [
        { "id": 0, "content": "Srebro" },
        { "id": 1, "content": "Miedź" },
        { "id": 2, "content": "Złoto" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "HARD"
    },
    {
      "id": 27,
      "category": "Sport",
      "type": "TEXT",
      "task": "Ile zawodników liczy drużyna piłkarska na boisku?",
      "answers": [
        { "id": 0, "content": "9" },
        { "id": 1, "content": "11" },
        { "id": 2, "content": "13" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "EASY"
    },
    {
      "id": 28,
      "category": "Sport",
      "type": "TEXT",
      "task": "W jakiej dyscyplinie sportowej medale zdobywa Iga Świątek?",
      "answers": [
        { "id": 0, "content": "Pływanie" },
        { "id": 1, "content": "Tenis" },
        { "id": 2, "content": "Siatkówka" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "EASY"
    },
    {
      "id": 29,
      "category": "Sport",
      "type": "TEXT",
      "task": "Co ile lat odbywają się letnie Igrzyska Olimpijskie?",
      "answers": [
        { "id": 0, "content": "Co 2 lata" },
        { "id": 1, "content": "Co 4 lata" },
        { "id": 2, "content": "Co 5 lat" }
      ],
      "correctAnswerIds": [1],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 30,
      "category": "Sport",
      "type": "TEXT",
      "task": "Jaki dystans ma bieg maratoński?",
      "answers": [
        { "id": 0, "content": "21,0975 km" },
        { "id": 1, "content": "30 km" },
        { "id": 2, "content": "42,195 km" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "HARD"
    },
    {
      "id": 31,
      "category": "Muzyka",
      "type": "TEXT",
      "task": "Kto skomponował \"Cztery pory roku\"?",
      "answers": [
        { "id": 0, "content": "Wolfgang Amadeus Mozart" },
        { "id": 1, "content": "Ludwig van Beethoven" },
        { "id": 2, "content": "Antonio Vivaldi" },
        { "id": 3, "content": "Jan Sebastian Bach" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "MEDIUM"
    },
    {
      "id": 32,
      "category": "Film",
      "type": "TEXT",
      "task": "Kto wyreżyserował film \"Pulp Fiction\"?",
      "answers": [
        { "id": 0, "content": "Steven Spielberg" },
        { "id": 1, "content": "Martin Scorsese" },
        { "id": 2, "content": "Quentin Tarantino" }
      ],
      "correctAnswerIds": [2],
      "difficultyLevel": "MEDIUM"
    }
  ],
  "categories": [
    "Matematyka",
    "Język polski",
    "Historia",
    "Geografia",
    "Biologia",
    "Chemia",
    "Sport",
    "Muzyka",
    "Film"
  ],
  "tiles": [
    { "category": "Matematyka", "index": 0 },
    { "category": "Język polski", "index": 1 },
    { "category": "Historia", "index": 2 },
    { "category": "Geografia", "index": 3 },
    { "category": "Biologia", "index": 4 },
    { "category": "Chemia", "index": 5 },
    { "category": "Sport", "index": 6 },
    { "category": "Muzyka", "index": 7 },
    { "category": "Film", "index": 8 },
    { "category": "Historia", "index": 9 }
  ]
}