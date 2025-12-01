import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import theme from '../common/theme';
import { mode } from '../common/types';
import { ButtonCustom, InfoButton, SquareButton } from '../components/Button';
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
import Divider from '../components/Divider';
import ArrowIndicator from '../components/ArrowIndicator';
import Modal from '../components/Modal';
import QRCode from 'react-qr-code';
import { QRContainer, QRWrapper } from './WaitingRoom';
import { CustomInput } from '../components/Fields';

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
  minHeight: '700px',
  margin: 'auto',
});

const InstructionHeader = styled.div({
  margin: 'auto',
  paddingLeft: '10px',
  paddingRight: '10px',
  width: '100%',
  minHeight: '50px',
  marginTop: '20px',
  textAlign: 'center',
  alignContent: 'center',
  borderRadius: '5px',

  color: theme.palette.main.info_text,
  textShadow: 'none',
  fontSize: '1.65em',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: '20px',
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
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
});

const ModeContainer = styled.div({
  width: '100%',
  maxWidth: '30%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: '100px',
});

const ModeHeader = styled.div({
  margin: 'auto',
  color: theme.palette.main.info_text,
  textShadow: 'none',
  paddingLeft: '10px',
  paddingRight: '10px',
  width: '80%',
  maxWidth: '450px',
  minWidth: '300px',
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
  width: '15rem',
  maxWidth: '280px',
  minWidth: '100px',
  padding: '10px',

  '&:hover': {
    backgroundColor: lightenColor(theme.palette.main.background, 0.01),
  },

  backgroundColor: active
    ? lightenColor(theme.palette.main.background, 0.01)
    : theme.palette.main.background,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  transform: active ? 'none' : 'translateY(10px)',

  cursor: 'pointer',
  position: 'relative',
}));

const ModeOptionHeader = styled.div({
  color: theme.palette.main.info_text,
  textShadow: 'none',
  fontSize: '1.3em',
});

const OptionsContainer = styled.div({
  width: '40%',
  display: 'flex',
  flexDirection: 'column',
});

const ActionButtonContainer = styled.div({
  marginTop: '20px',
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

  const [mode, setMode] = useState<mode>('quiz');

  const [tab, setTab] = useState<string>('');
  const [hotspotOn, setHotspotOn] = useState<boolean>(false);
  const [hotspotRefresh, setHotspotRefresh] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [hotspotCredentials, setHotspotCredentails] = useState({ ssid: '', password: '' });

  const toggle = (tab: string) => {
    setTab((prev) => {
      console.log(prev);
      return prev === '' ? tab : '';
    });
  };

  const isHotspotOn = () => {
    window.electronAPI.isHotspotOn().then((response: boolean) => setHotspotOn(response));
  };

  useEffect(() => {
    isHotspotOn();
    window.electronAPI.getHotspotConfig().then((response) => {
      setHotspotCredentails(response);
    });
  }, [hotspotRefresh]);

  useEffect(() => {
    isHotspotOn();
  }, [tab]);

  const handleQR = () => {
    window.electronAPI
      .configureHotspot(hotspotCredentials.ssid, hotspotCredentials.password)
      .then(() => {
        window.electronAPI.getHotspotConfig().then((response) => {
          setHotspotCredentails(response);
          setQrVisible(true);
        });
      });
  };

  const startLobby = () => {
    if (!mode) return;
    const createGameDto = getConfig(mode, commonSettings, examSettings, boardSettings);
    service
      .startLobby(mode, createGameDto)
      .then(() => {
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
    zeroPointsOnCheating: false,
    markQuestionOnCheating: false,
    notifyTeacherOnCheating: true,
    showDetailedFinishFeedback: true,
    pointsPerDifficulty: {
      EASY: 1,
      MEDIUM: 2,
      HARD: 3,
    },
    allowGoingBack: false,
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
      {qrVisible && (
        <Modal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            <QRWrapper>
              <QRContainer>
                <QRCode
                  size={600}
                  value={`WIFI:S:${hotspotCredentials.ssid};T:WPA;P:${hotspotCredentials.password};;`}
                />
              </QRContainer>
            </QRWrapper>
            <ButtonCustom onClick={() => setQrVisible(false)}>Zamknij</ButtonCustom>
          </div>
        </Modal>
      )}
      <ButtonCustom
        onClick={() => navigate('/')}
        style={{ position: 'absolute', left: '80px', top: '10px' }}
      >
        Powrót
      </ButtonCustom>
      <InstructionContainer>
        <div>
          {(tab === '' || tab === 'instruction') && (
            <>
              <InstructionHeader>
                Instrukcja uruchomienia
                <SquareButton onClick={() => toggle('instruction')}>
                  <ArrowIndicator direction={tab === 'instruction' ? 'down' : 'up'} size={18} />
                </SquareButton>
              </InstructionHeader>
              <div style={{ width: '90%', margin: 'auto' }}>
                <Divider />
              </div>
            </>
          )}
          {tab === 'instruction' && (
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
                Upewnij się że Hotspot został włączony, a uczniowie mogą połączyć się z siecią {'('}{' '}
                za pomocą hasła lub skanując kod QR {')'}
              </span>
              <span>
                Kiedy wszystko będzie gotowe, możesz otworzyć poczekalnię, w której będzie widoczny
                kod QR pozwalający uczniom na dołączenie do rozgrywki
              </span>
            </InstructionContent>
          )}
        </div>
        <div>
          {(tab === '' || tab === 'hotspot') && (
            <>
              <InstructionHeader>
                Hotspot
                <SquareButton onClick={() => toggle('hotspot')}>
                  <ArrowIndicator direction={tab === 'hotspot' ? 'down' : 'up'} size={18} />
                </SquareButton>
              </InstructionHeader>
              <div style={{ width: '90%', margin: 'auto' }}>
                <Divider />
              </div>
            </>
          )}
          {tab === 'hotspot' && (
            <InstructionContent>
              <span>Hotspot jest aktualnie {hotspotOn ? 'WŁĄCZONY' : 'WYŁĄCZONY'}</span>
              <span style={{ marginBottom: '20px' }}>
                Jeżeli kod QR w ustawieniach systemu jest zbyt mały, wpisz w poniższe pola nazwę
                oraz hasło sieci, oraz klilnij przycisk Pokaż QR
              </span>
              <span>Nazwa sieci</span>
              <CustomInput
                value={hotspotCredentials.ssid}
                onChange={(e) =>
                  setHotspotCredentails({ ...hotspotCredentials, ssid: e.target.value })
                }
              />
              <span>Hasło</span>
              <CustomInput
                type="password"
                value={hotspotCredentials.password}
                onChange={(e) =>
                  setHotspotCredentails({ ...hotspotCredentials, password: e.target.value })
                }
              />
              <ButtonCustom onClick={handleQR}>Pokaż QR</ButtonCustom>
            </InstructionContent>
          )}
        </div>
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
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <InfoButton
                style={{
                  width: '700px',
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
                onHover={() => setMode('quiz')}
              >
                <video
                  autoPlay
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    border: `3px solid ${theme.palette.main.accent}`,
                    boxShadow: `0 0 3px 1px ${theme.palette.main.accent}`,
                  }}
                >
                  {' '}
                  <source src="/quiz_example.mp4" type="video/mp4" />{' '}
                </video>
              </InfoButton>
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
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <InfoButton
                style={{
                  width: '350px',
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
                onHover={() => setMode('exam')}
              >
                <video
                  autoPlay
                  style={{
                    width: '150%',
                    height: 'auto',
                    borderRadius: '8px',
                    border: `3px solid ${theme.palette.main.accent}`,
                    boxShadow: `0 0 3px 1px ${theme.palette.main.accent}`,
                    zIndex: 1000
                  }}
                >
                  {' '}
                  <source src="/exam_example.mp4" type="video/mp4" />{' '}
                </video>
              </InfoButton>
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
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <InfoButton
                style={{
                  width: '500px',
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  top: '-200px',
                }}
                onHover={() => setMode('board')}
              >
                <video
                  autoPlay
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    border: `3px solid ${theme.palette.main.accent}`,
                    boxShadow: `0 0 3px 1px ${theme.palette.main.accent}`,
                  }}
                >
                  {' '}
                  <source src="/board_example.mp4" type="video/mp4" />{' '}
                </video>
              </InfoButton>
            </div>
          </ModeOption>
        </ModeContent>
        <ActionButtonContainer>
          <ButtonCustom
            onClick={() => startLobby()}
            style={{ maxWidth: '250px', minWidth: '100px', width: '100%' }}
          >
            Otwórz poczekalnię
          </ButtonCustom>
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
