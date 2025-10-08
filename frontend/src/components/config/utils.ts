import { BoardSettings } from './BoardConfig';
import { CommonSettings } from './CommonConfig';
import { ExamSettings } from './ExamConfig';
import { BoardConfig, ExamConfig, mode, QuizConfig } from '../../common/types';

export const settingsToConfig = (
  mode: mode,
  commonSettings: CommonSettings,
  examSettings: ExamSettings,
  boardSettings: BoardSettings
): BoardConfig | ExamConfig | QuizConfig => {
  switch (mode) {
    case 'board':
      return {
        ...commonSettings,
        ...boardSettings,
      };

    case 'exam':
      return {
        ...commonSettings,
        ...examSettings,
      };

    case 'quiz':
      return {
        ...commonSettings,
      };
  }
};
