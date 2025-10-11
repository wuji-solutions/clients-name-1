import { BoardSettings } from './BoardConfig';
import { CommonSettings } from './CommonConfig';
import { ExamSettings } from './ExamConfig';
import { mode, ConfigDTO } from '../../common/types';

export const settingsToConfig = (
  mode: mode,
  commonSettings: CommonSettings,
  examSettings: ExamSettings,
  boardSettings: BoardSettings
): ConfigDTO => {
  switch (mode) {
    case 'board':
      return {
        ...commonSettings,
        ...boardSettings,
        type: 'BOARD',
      };

    case 'exam':
      return {
        ...commonSettings,
        ...examSettings,
        type: 'EXAM',
      };

    case 'quiz':
      return {
        ...commonSettings,
        type: 'QUIZ',
      };
  }
};

export const applySettingsFromDto = (
  dto: ConfigDTO,
  setCommonSettings: React.Dispatch<React.SetStateAction<CommonSettings>>,
  setExamSettings: React.Dispatch<React.SetStateAction<ExamSettings>>,
  setBoardSettings: React.Dispatch<React.SetStateAction<BoardSettings>>
) => {
  const common: CommonSettings = {
    endImmediatelyAfterTime: dto.endImmediatelyAfterTime,
    questionFilePath: dto.questionFilePath,
  };

  setCommonSettings(common);

  switch (dto.type) {
    case 'EXAM':
      setExamSettings({
        totalDurationMinutes: dto.totalDurationMinutes,
        questionDurationSeconds: dto.questionDurationSeconds,
        requiredQuestionCount: dto.requiredQuestionCount,
        randomizeQuestions: dto.randomizeQuestions,
        enforceDifficultyBalance: dto.enforceDifficultyBalance,
        selectedQuestionIds: dto.selectedQuestionIds,
        zeroPointsOnCheating: dto.zeroPointsOnCheating,
        markQuestionOnCheating: dto.markQuestionOnCheating,
        notifyTeacherOnCheating: dto.notifyTeacherOnCheating,
        pointsPerDifficulty: dto.pointsPerDifficulty,
        allowGoingBack: dto.allowGoingBack,
      });
      break;

    case 'BOARD':
      setBoardSettings({
        totalDurationMinutes: dto.totalDurationMinutes,
        questionDurationSeconds: dto.questionDurationSeconds,
        pointsPerDifficulty: dto.pointsPerDifficulty,
        rankingPromotionRules: dto.rankingPromotionRules,
      });
      break;

    case 'QUIZ':
      // quiz only uses common settings, so nothing else to set
      break;
  }
};
