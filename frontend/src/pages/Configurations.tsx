import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import theme from '../common/theme';
import { mode } from '../common/types';
import { ButtonChoose, ButtonCustom } from '../components/Button';
import { useAppContext } from '../providers/AppContextProvider';
import AccessRestricted from '../components/AccessRestricted';
import { service } from '../service/service';
import GameConfig from '../components/config/GameConfig';
import { BoardSettings } from '../components/config/BoardConfig';
import { CommonSettings } from '../components/config/CommonConfig';
import { ExamSettings } from '../components/config/ExamConfig';
import { settingsToConfig } from '../components/config/utils';
import { useError } from '../providers/ErrorProvider';
import { darkenColor, lightenColor } from '../common/utils';

const Container = styled.div({
  width: 'calc(100%-20px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  padding: '0 20px 0 20px',
});

const InstructionContainer = styled.div({
  width: '25%',
  minWidth: '220px',
  padding: '5px',
  border: `4px solid ${theme.palette.main.accent}`,
  boxShadow: `0px 4px 0 0 ${theme.palette.main.accent}`,
  borderRadius: '15px',
  height: 'fit-content',
  minHeight: '80vh',
  margin: 'auto',
});

const InstructionHeader = styled.div({
  margin: 'auto',
  paddingLeft: '10px',
  paddingRight: '10px',
  width: '100%',
  height: '50px',
  marginTop: '20px',
  textAlign: 'center',
  alignContent: 'center',
  borderRadius: '5px',

  color: lightenColor(theme.palette.main.accent, 0.1),
  textShadow: 'none',
  fontSize: '1.65em',
});

const InstructionContent = styled.div({
  margin: 'auto',
  marginTop: '10px',
  padding: '20px',
  fontSize: 'larger',
  justifyContent: 'center',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
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
  color: lightenColor(theme.palette.main.accent, 0.1),
  textShadow: 'none',
  paddingLeft: '10px',
  paddingRight: '10px',
  width: '100%',
  maxWidth: '450px',
  minWidth: '350px',
  height: 'fit-content',
  marginTop: '50px',
  textAlign: 'center',
  alignContent: 'center',
  borderRadius: '5px',

  fontSize: '1.45em',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const ModeContent = styled.div({
  margin: 'auto',
  marginTop: '10px',
  padding: '10px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
});

const ModeOption = styled.div<{ active: boolean }>(({ active }) => ({
  border: `4px solid ${theme.palette.main.accent}`,
  boxShadow: `0px 4px 0 0 ${theme.palette.main.accent}`,
  borderRadius: '20px',

  height: '130px',
  width: '280px',
  padding: '10px',

  '&:hover': {
    backgroundColor: lightenColor(theme.palette.main.background, 0.01),
  },

  backgroundColor: active
    ? lightenColor(theme.palette.main.background, 0.01)
    : theme.palette.main.background,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  transform: active ? 'none' : 'translateY(10px)',
}));

const ModeOptionHeader = styled.div({
  color: lightenColor(theme.palette.main.accent, 0.1),
  textShadow: 'none',
  fontSize: '1.3em',
});

const OptionsContainer = styled.div({
  width: '35%',
  display: 'flex',
  flexDirection: 'column',
});

const ActionButtonContainer = styled.div({
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const getConfig = (
  mode: mode,
  commonSettings: CommonSettings,
  examSettings: ExamSettings,
  boardSettings: BoardSettings
) => {
  const config = settingsToConfig(mode, commonSettings, examSettings, boardSettings);
  const createGameDto = { config: config, name: 'Przykładowa gra' };
  return mode !== 'board'
    ? createGameDto
    : {
        ...createGameDto,
        numberOfTiles: Object.keys(boardSettings.rankingPromotionRules).length * 3,
      };
};

const openHotspot = () => {
  window.electronAPI.openHotspot();
};

function Configurations() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { setError } = useError();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      console.log(files);
    },
  });

  const [mode, setMode] = useState<mode>('quiz');

  const startLobby = () => {
    if (!mode) return;
    const createGameDto = getConfig(mode, commonSettings, examSettings, boardSettings);
    service
      .startLobby(mode, createGameDto)
      .then((response) => {
        navigate(`/waiting-room?tryb=${mode}`);
      })
      .catch((error) =>
        setError('Wystąpił błąd podczas tworzenia gry:\n' + error.response.data.message)
      );
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
    additionalTimeToAnswerAfterFinishInSeconds: 10,
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
        <InstructionContent>
          <span>
            Za pomocą przycisku start lub wyszukiwarki aplikacji znajdź <h4>USTAWIENIA</h4>{' '}
            Następnie wybierz zakładkę{' '}
            <span color={theme.palette.main.accent}>Sieć i Internet</span> oraz opcję{' '}
            <b>Hotspot mobilny</b>
          </span>
          <span>Możesz szybko przejść do konfiguracji za pomocą poniższego przycisku</span>
          <ButtonCustom
            style={{ marginTop: '20px', marginBottom: '20px', width: '180px' }}
            onClick={openHotspot}
          >
            Hotspot
          </ButtonCustom>
          <span>
            Upewnij się że Hotspot został włączony, a uczniowie mogą połączyć się z siecią {'('} za
            pomocą hasła lub skanując kod QR {')'}
          </span>
          <span>
            Kiedy wszystko będzie gotowe, możesz otworzyć poczekalnię, w której będzie widoczny kod
            QR pozwalający uczniom na dołączenie do rozgrywki
          </span>
        </InstructionContent>
      </InstructionContainer>
      <ModeContainer>
        <ModeHeader>
          <div
            style={{
              margin: 'auto',
              height: '10%',
              width: '50%',
              borderBottom: `4px solid ${theme.palette.main.accent}`,
            }}
          />
          <span>Wybierz tryb rozgrywki</span>
          <div
            style={{
              margin: 'auto',
              height: '10%',
              width: '50%',
              borderBottom: `4px solid ${theme.palette.main.accent}`,
            }}
          />
        </ModeHeader>
        <ModeContent>
          <ModeOption active={mode == 'quiz'} onClick={() => setMode('quiz')}>
            <ModeOptionHeader>QUIZ</ModeOptionHeader>
            <div
              style={{
                margin: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FF6B6B',
                  boxShadow: `0 3px 1px 1px ${darkenColor('#FF6B6B', 0.2)}`,
                  borderRadius: '10px',
                  width: '60px',
                  height: '35px',
                }}
              />
              <div
                style={{
                  backgroundColor: '#00ffff',
                  boxShadow: `0 3px 1px 1px ${darkenColor('#00ffff', 0.2)}`,
                  borderRadius: '10px',
                  width: '60px',
                  height: '35px',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <div
                style={{
                  backgroundColor: '#F2D60D',
                  boxShadow: `0 3px 1px 1px ${darkenColor('#F2D60D', 0.2)}`,
                  borderRadius: '10px',
                  width: '60px',
                  height: '35px',
                }}
              />
            </div>
          </ModeOption>
          <ModeOption active={mode == 'exam'} onClick={() => setMode('exam')}>
            <ModeOptionHeader>SPRAWDZIAN</ModeOptionHeader>
            <div
              style={{
                margin: 'auto',
                marginTop: '20px',
                width: '60px',
                height: '65px',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #dcdcdc',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: '10px',
              }}
            >
              <div
                style={{
                  width: '60%',
                  height: '10px',
                  borderRadius: '4px',
                  backgroundColor: '#e0e0e0',
                }}
              />
              <div
                style={{
                  width: '60%',
                  height: '10px',
                  borderRadius: '4px',
                  backgroundColor: '#e0e0e0',
                }}
              />
            </div>
          </ModeOption>
          <ModeOption active={mode == 'board'} onClick={() => setMode('board')}>
            <ModeOptionHeader>GRA PLANSZOWA</ModeOptionHeader>
            <div
              style={{
                margin: 'auto',
                marginTop: '20px',
                width: '150px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#408080',
                boxShadow: `0 3px 1px 1px ${darkenColor('#408080', 0.2)}`,
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.main.background,
                }}
              />
            </div>
          </ModeOption>
        </ModeContent>
        <ActionButtonContainer>
          <ButtonCustom onClick={() => startLobby()}>Otwórz poczekalnię</ButtonCustom>
          <ButtonCustom onClick={() => navigate('/')}>Powrót</ButtonCustom>
        </ActionButtonContainer>
      </ModeContainer>
      <OptionsContainer>
        <GameConfig
          mode={mode}
          commonSettings={commonSettings}
          setCommonSettings={setCommonSettings}
          examSettings={examSettings}
          setExamSettings={setExamSettings}
          boardSettings={boardSettings}
          setBoardSettings={setBoardSettings}
        />
      </OptionsContainer>
    </Container>
  );
}

export default Configurations;
