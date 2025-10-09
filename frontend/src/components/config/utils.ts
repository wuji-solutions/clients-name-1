import { BoardSettings } from './BoardConfig';
import { CommonSettings } from './CommonConfig';
import { ExamSettings } from './ExamConfig';
import { mode, ConfigDTO, CreateConfigDto } from '../../common/types';

export const settingsToConfig = (
  mode: mode,
  commonSettings: CommonSettings,
  examSettings: ExamSettings,
  boardSettings: BoardSettings
): CreateConfigDto => {
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

export const applySettingsFromDto = (
  dto: ConfigDTO,
  setCommonSettings: React.Dispatch<React.SetStateAction<CommonSettings>>,
  setExamSettings: React.Dispatch<React.SetStateAction<ExamSettings>>,
  setBoardSettings: React.Dispatch<React.SetStateAction<BoardSettings>>
) => {
  const common: CommonSettings = {
    totalDurationMinutes: dto.totalDurationMinutes,
    endImmediatelyAfterTime: dto.endImmediatelyAfterTime,
    questionFilePath: dto.questionFilePath,
    questionDurationSecond: dto.questionDurationSecond,
  };

  setCommonSettings(common);

  switch (dto.type) {
    case 'exam':
      setExamSettings({
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

    case 'board':
      setBoardSettings({
        pointsPerDifficulty: dto.pointsPerDifficulty,
        rankingPromotionRules: dto.rankingPromotionRules,
      });
      break;

    case 'quiz':
      // quiz only uses common settings, so nothing else to set
      break;
  }
};
