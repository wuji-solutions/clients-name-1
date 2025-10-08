import { BoardSettings } from './BoardConfig';
import { CommonSettings } from './CommonConfig';
import { ExamSettings } from './ExamConfig';
import { config, mode } from '../../common/types';

export const settingsToConfig = (
  mode: mode,
  commonSettings: CommonSettings,
  examSettings: ExamSettings,
  boardSettings: BoardSettings
): config => {
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
