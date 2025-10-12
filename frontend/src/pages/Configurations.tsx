import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import theme from '../common/theme';
import { mode } from '../common/types';
import { ButtonChoose, ButtonCustom } from '../components/Button';
import { TEST_GAME, TEST_QUIZ } from '../common/test';
import { useAppContext } from '../providers/AppContextProvider';
import AccessRestricted from '../components/AccessRestricted';
import { service } from '../service/service';
import GameConfig from '../components/config/GameConfig';
import { BoardSettings } from '../components/config/BoardConfig';
import { CommonSettings } from '../components/config/CommonConfig';
import { ExamSettings } from '../components/config/ExamConfig';
import { settingsToConfig } from '../components/config/utils';

const Container = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
});

const InstructionContainer = styled.div({
  width: '25%',
  padding: '5px',
});

const InstructionHeader = styled.div({
  margin: 'auto',
  background: theme.palette.main.primary,
  paddingLeft: '10px',
  paddingRight: '10px',
  width: 'fit-content',
  height: '50px',
  marginTop: '20px',
  textAlign: 'center',
  alignContent: 'center',
  borderRadius: '5px',
});

const InstructionContent = styled.div({
  margin: 'auto',
  marginTop: '10px',
  padding: '10px',
});

const ModeContainer = styled.div({
  width: '40%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: '100px',
});

const ModeHeader = styled.div({
  margin: 'auto',
  background: theme.palette.main.primary,
  paddingLeft: '10px',
  paddingRight: '10px',
  width: 'fit-content',
  height: '50px',
  marginTop: '20px',
  textAlign: 'center',
  alignContent: 'center',
  borderRadius: '5px',
});

const ModeContent = styled.div({
  margin: 'auto',
  marginTop: '10px',
  padding: '10px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
});

const OptionsContainer = styled.div({
  width: '35%',
  display: 'flex',
  flexDirection: 'column',
});

const FileSelector = styled.div({
  background: '#3377FF',
  opacity: '85%',
  border: '1px solid #000',
  borderRadius: '10px',
  width: '140px',
  height: '50px',
  padding: '5px',
  boxShadow: '0 3px 4px 0 rgba(0,0,0,0.24),0 4px 12px 0 rgba(0,0,0,0.19)',
  '&:hover': {
    boxShadow: '0 6px 8px 0 rgba(0,0,0,0.24),0 9px 25px 0 rgba(0,0,0,0.19)',
  },
  '-webkit-transition-duration': '0.2s',
  transitionDuration: '0.2s',
  marginTop: '15px',
});

const ActionButtonContainer = styled.div({
  marginTop: 'auto',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

function Configurations() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      console.log(files);
    },
  });

  const [mode, setMode] = useState<mode>('quiz');

  const startLobby = () => {
    if (!mode) return;
    const config = settingsToConfig(mode, commonSettings, examSettings, boardSettings);
    service
      .startLobby(mode, mode === 'quiz' ? { ...TEST_QUIZ } : { ...TEST_GAME })
      .then((response) => {
        console.log('Successfully created new game');
        navigate(`/waiting-room?tryb=${mode}`);
      })
      .catch((error) => console.log(error));
  };

  const [commonSettings, setCommonSettings] = useState<CommonSettings>({
    questionDurationSeconds: 30,
    questionFilePath: '',
  });
  const [examSettings, setExamSettings] = useState<ExamSettings>({
    requiredQuestionCount: 10,
    endImmediatelyAfterTime: true,
    totalDurationMinutes: 30,
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
    totalDurationMinutes: 30,
    endImmediatelyAfterTime: true,
    showLeaderboard: true,
    pointsPerDifficulty: {
      EASY: 1,
      MEDIUM: 2,
      HARD: 3,
    },
    rankingPromotionRules: {},
  });

  if (user == 'user') {
    return <AccessRestricted />;
  }

  return (
    <Container>
      <InstructionContainer>
        <InstructionHeader>Instrukcja uruchomienia</InstructionHeader>
        <InstructionContent>Uruchom</InstructionContent>
      </InstructionContainer>
      <ModeContainer>
        <ModeHeader>Wybierz tryb rozgrywki</ModeHeader>
        <ModeContent>
          <ButtonChoose active={mode == 'quiz'} onClick={() => setMode('quiz')}>
            Quiz
          </ButtonChoose>
          <ButtonChoose active={mode == 'exam'} onClick={() => setMode('exam')}>
            Sprawdzian
          </ButtonChoose>
          <ButtonChoose active={mode == 'board'} onClick={() => setMode('board')}>
            Plansza
          </ButtonChoose>
        </ModeContent>
      </ModeContainer>
      <OptionsContainer>
        <FileSelector {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Dodaj pytania...</p>
        </FileSelector>
        <GameConfig
          mode={mode}
          commonSettings={commonSettings}
          setCommonSettings={setCommonSettings}
          examSettings={examSettings}
          setExamSettings={setExamSettings}
          boardSettings={boardSettings}
          setBoardSettings={setBoardSettings}
        />
        <ActionButtonContainer>
          <ButtonCustom onClick={() => startLobby()}>Otwórz poczekalnię</ButtonCustom>
          <ButtonCustom onClick={() => navigate('/')}>Powrót</ButtonCustom>
        </ActionButtonContainer>
      </OptionsContainer>
    </Container>
  );
}

export default Configurations;
