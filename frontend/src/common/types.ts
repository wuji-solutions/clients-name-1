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

export type mode = 'quiz' | 'board' | 'exam' | 'test' | 'game';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
