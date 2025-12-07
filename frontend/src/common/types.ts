import { BoardSettings } from '../components/config/BoardConfig';
import { CommonSettings } from '../components/config/CommonConfig';
import { ExamSettings } from '../components/config/ExamConfig';

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
  images: TaskImage[];
  answers: Array<Answer>;
  difficultyLevel: DifficultyLevel;
}

export interface TaskImage {
  image: string;
  type: 'BASE64' | 'URL';
}

interface PlayerAnswerDto {
  selectedIds: number[];
}

export interface ExamQuestion extends Question {
  playerAlreadyAnswered: boolean;
  playerAnswerDto: PlayerAnswerDto;
  questionNumber: number;
  totalBaseQuestions: number;
}

export interface QuizQuestion extends Question {
  questionNumber: number;
  totalQuestions: number;
}

export interface QuestionData {
  question: Question;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
}

export interface Pawn {
  index: string;
  nickname: string;
}

export type BoardPositions = Pawn[][];

export interface FieldCoordinate {
  x: number;
  y: number;
  scale: number;
}

interface PlayerState {
  index: number;
  nickname: string;
  points: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface ExamState {
  requiredQuestionCount: number;
  playerState: PlayerState[];
}
export interface BoardConfig extends CommonSettings, BoardSettings {}

export interface ExamConfig extends CommonSettings, ExamSettings {}

export interface QuizConfig extends CommonSettings {}

export type ConfigDTO =
  | ({ type: 'QUIZ' } & CommonSettings)
  | ({ type: 'EXAM' } & CommonSettings & ExamSettings)
  | ({ type: 'BOARD' } & CommonSettings & BoardSettings);

export type CreateGameDTO = { name: string } & { config: ConfigDTO };

export type mode = 'quiz' | 'board' | 'exam';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

interface QuestionAnsweredData extends QuestionData {
  selectedAnswerIds: string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export type CompleteExamResponseDto = {
  totalPointsEarned: number;
  questionsAnswered?: QuestionAnsweredData[];
};

export type CategoryToDifficulty = {
  [key: string]: DifficultyLevel;
};

interface BoardPlayerDto {
  index: number;
  nickname: String;
  points: number;
  state: PlayerState;
  currentPosition: number;
  categoryToDifficulty: CategoryToDifficulty;
}

export type BoardAnswerQuestionDto = {
  correct: boolean;
  player: BoardPlayerDto;
};
