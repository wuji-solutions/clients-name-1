export interface Answer {
  id: string;
  content: string;
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