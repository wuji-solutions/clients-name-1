import { BoardSettings } from '../components/config/BoardConfig';
import { CommonSettings } from '../components/config/CommonConfig';
import { ExamSettings } from '../components/config/ExamConfig';

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

export interface BoardConfig extends CommonSettings, BoardSettings {}

export interface ExamConfig extends CommonSettings, ExamSettings {}

export interface QuizConfig extends CommonSettings {}

export type config = BoardConfig | ExamConfig | QuizConfig;

export type mode = 'quiz' | 'board' | 'exam';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
