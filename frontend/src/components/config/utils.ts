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
        selectedQuestionIds: examSettings.randomizeQuestions
          ? []
          : examSettings.selectedQuestionIds,
        requiredQuestionCount: Math.min(
          examSettings.requiredQuestionCount,
          examSettings.selectedQuestionIds.length
        ),
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
    questionFilePath: dto.questionFilePath,
    questionDurationSeconds: dto.questionDurationSeconds,
  };

  setCommonSettings(common);

  switch (dto.type) {
    case 'EXAM':
      setExamSettings({
        totalDurationMinutes: dto.totalDurationMinutes,
        endImmediatelyAfterTime: dto.endImmediatelyAfterTime,
        requiredQuestionCount: dto.requiredQuestionCount,
        randomizeQuestions: dto.randomizeQuestions,
        enforceDifficultyBalance: dto.enforceDifficultyBalance,
        selectedQuestionIds: dto.selectedQuestionIds,
        zeroPointsOnCheating: dto.zeroPointsOnCheating,
        markQuestionOnCheating: dto.markQuestionOnCheating,
        notifyTeacherOnCheating: dto.notifyTeacherOnCheating,
        pointsPerDifficulty: dto.pointsPerDifficulty,
        allowGoingBack: dto.allowGoingBack,
        showDetailedFinishFeedback: dto.showDetailedFinishFeedback,
        additionalTimeToAnswerAfterFinishInSeconds: dto.additionalTimeToAnswerAfterFinishInSeconds,
      });
      break;

    case 'BOARD':
      setBoardSettings({
        totalDurationMinutes: dto.totalDurationMinutes,
        endImmediatelyAfterTime: dto.endImmediatelyAfterTime,
        showLeaderboard: dto.showLeaderboard,
        pointsPerDifficulty: dto.pointsPerDifficulty,
        rankingPromotionRules: dto.rankingPromotionRules,
        numberOfTiles: dto.numberOfTiles
      });
      break;

    case 'QUIZ':
      break;

    default:
      throw new Error('Tryb gry jest niewspierany!');
  }
};
