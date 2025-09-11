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
      cat1: 2,
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
      category: 'M2tematyka',
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
  categories: ['cat1'],
  tiles: [
    {
      category: 'cat1',
      index: 0,
    },
    {
      category: 'cat1',
      index: 1,
    },
    {
      category: 'cat1',
      index: 2,
    },
    {
      category: 'cat1',
      index: 3,
    },
    {
      category: 'cat1',
      index: 4,
    },
    {
      category: 'cat1',
      index: 5,
    },
    {
      category: 'cat1',
      index: 6,
    },
    {
      category: 'cat1',
      index: 7,
    },
    {
      category: 'cat1',
      index: 8,
    },
    {
      category: 'cat1',
      index: 9,
    },
  ],
};
