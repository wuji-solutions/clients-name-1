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
    },
  ],
};
