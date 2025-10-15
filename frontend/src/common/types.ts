export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuestionStats {
  answers: Array<{ answer: Answer; count: number }>;
}

export interface Question {
  id: string;
  category: string;
  type: string;
  task: string;
  answers: Array<Answer>;
  difficultyLevel: string;
}

interface PlayerAnswerDto {
  selectedIds: number[];
}

export interface ExtendedQuestion extends Question {
  playerAlreadyAnswered: boolean;
  playerAnswerDto: PlayerAnswerDto;
}

export interface QuestionData {
  question: {
    id: number;
    category: string;
    type: string;
    task: string;
    answers: Answer[];
  };
  correctAnswersCount: number;
  incorrectAnswersCount: number;
}

export interface Pawn {
  index: string;
  nickname: string;
}

export type BoardPositions = Pawn[][]

export interface FieldCoordinate {
  x: number;
  y: number;
  scale: number;
}

interface PlayerState {
  index: number,
  nickname: string,
  points: number,
  correctAnswers: number,
  incorrectAnswers: number,
}

export interface ExamState {
  requiredQuestionCount: number,
  playerState: PlayerState[]
}

export interface QuizConfig {
  type: string;
  totalDurationMinutes: number;
  questionFilePath: string;
  questionDurationSeconds: number;
  endImmediatelyAfterTime: boolean;
  requiredQuestionCount: number;
  randomizeQuestions: boolean;
  enforceDifficultyBalance: boolean;
  selectedQuestionIds: number[];
  zeroPointsOnCheating: boolean;
  markQuestionOnCheating: boolean;
  notifyTeacherOnCheating: boolean;
  pointsPerDifficulty: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
  allowGoingBack: boolean;
}