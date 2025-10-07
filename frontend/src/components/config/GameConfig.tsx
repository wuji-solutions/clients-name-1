import { useState } from 'react';
import { mode } from '../../common/types';
import CommonConfig, { CommonSettings } from './CommonConfig';
import QuizConfig from './QuizConfig';
import ExamConfig, { ExamSettings } from './ExamConfig';
import BoardConfig, { BoardSettings } from './BoardConfig';
import { ButtonCustom } from '../Button';
import Divider from '../Divider';

interface Props {
  mode: mode | null;
}

export default function GameConfig({ mode }: Props) {
  const [commonSettings, setCommonSettings] = useState<CommonSettings>({
    totalDurationMinutes: 30,
    endImmediatelyAfterTime: true,
    questionFilePath: '',
    questionDurationSecond: 30,
  });
  const [examSettings, setExamSettings] = useState<ExamSettings>({
    requiredQuestionCount: 10,
    randomizeQuestions: true,
    enforceDifficultyBalance: false,
    selectedQuestionIds: [],
    zeroPointsOnCheating: true,
    markQuestionOnCheating: false,
    notifyTeacherOnCheating: true,
    pointsPerDifficulty: {
      EASY: 1,
      MEDIUM: 2,
      HARD: 3,
    },
    allowGoingBack: true,
  });
  const [boardSettings, setBoardSettings] = useState<BoardSettings>({
    pointsPerDifficulty: {
      EASY: 1,
      MEDIUM: 2,
      HARD: 3,
    },
    rankingPromotionRules: {},
  });

  return (
    <div
      style={{
        // there is a bug regarding height;
        // it is too tall (leaves empty space in the end)
        marginTop: 'auto',
        marginBottom: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '95%',
      }}
    >
      <h1 className="centered" style={{ fontSize: '300%' }}>
        Ustawienia
      </h1>
      <ButtonCustom style={{ width: '40%' }}>Wczytaj</ButtonCustom>
      <div
        style={{
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '25px',
        }}
      >
        <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <Divider />

          <CommonConfig commonSettings={commonSettings} setCommonSettings={setCommonSettings} />
          <Divider />
          {mode === 'quiz' && <QuizConfig />}
          {mode === 'board' && (
            <BoardConfig settings={boardSettings} setSettings={setBoardSettings} />
          )}
          {mode === 'exam' && <ExamConfig settings={examSettings} setSettings={setExamSettings} />}
        </div>
      </div>

      <ButtonCustom style={{ width: '40%' }}>Zapisz</ButtonCustom>
    </div>
  );
}
