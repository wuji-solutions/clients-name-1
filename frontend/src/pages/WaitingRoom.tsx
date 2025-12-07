import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import theme from '../common/theme';
import { ButtonCustom } from '../components/Button';
import PlayerList from '../components/PlayerList';
import { useAppContext } from '../providers/AppContextProvider';
import { CustomInput } from '../components/Fields';
import '../service/service';
import { service } from '../service/service';
import { useSSEChannel } from '../providers/SSEProvider';
import { BACKEND_ENDPOINT, BACKEND_ENDPOINT_EXTERNAL } from '../common/config';
import Cookies from 'js-cookie';
import { useError } from '../providers/ErrorProvider';

const Container = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
});

export const QRWrapper = styled.div({
  padding: '10px',
  border: `5px solid ${theme.palette.main.accent}`,
  height: 'fit-content',
  width: 'fit-content',
  borderRadius: '15px',
  margin: 'auto',
});

export const QRContainer = styled.div({
  margin: 'auto',
  background: '#fff',
  padding: '15px',
  borderRadius: '15px',
  border: '5px solid #fff',
  position: 'relative',
});

const ActionButtonContainer = styled.div({
  marginTop: 'auto',
  marginBottom: '20px',
  marginRight: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '20%',
});

const UserInputContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
  gap: '60px',
  width: '80vw',
});

const ExamWarningContainer = styled.div({
  fontSize: 'larger',
  color: '#ff4539',
  fontWeight: 'bolder',
});

function SSEOnStartListener({ onGameStart }: { onGameStart: Function }) {
  const { isAdmin } = useAppContext();
  const delegate = useSSEChannel(
    `${isAdmin() ? BACKEND_ENDPOINT : BACKEND_ENDPOINT_EXTERNAL}/sse/events`,
    { withCredentials: true }
  );

  useEffect(() => {
    const unsubscribe = delegate.on('game-start', () => {
      onGameStart();
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

function PlayerKickListener({
  userHandler,
  onKick,
}: {
  userHandler: Dispatch<SetStateAction<string | null>>;
  onKick: Dispatch<SetStateAction<boolean>>;
}) {
  const delegate = useSSEChannel(`${BACKEND_ENDPOINT_EXTERNAL}/sse/events`, {
    withCredentials: true,
  });

  useEffect(() => {
    const unsubscribe = delegate.on('player-kicked', (data) => {
      if (
        sessionStorage.getItem('userindex') == data.index &&
        sessionStorage.getItem('username') == data.nickname
      ) {
        sessionStorage.removeItem('userindex');
        sessionStorage.removeItem('username');
        Cookies.remove('JSESSIONID');
        onKick(true);
        userHandler(null);
      }
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

function WaitingRoom() {
  const { isAdmin, username, setUsername } = useAppContext();
  const [identificator, setIdentificator] = useState<number | null>(null);
  const [playerKicked, setPlayerKicked] = useState(false);
  const { setError } = useError();
  const hash = globalThis.location.hash;
  const queryString = hash.split("?")[1] || "";
  const gameMode = new URLSearchParams(queryString).get("tryb");
  const navigate = useNavigate();

  const joinGame = () => {
    if (!identificator || !gameMode) return;
    console.log(identificator)
    service
      .joinGame(identificator, gameMode)
      .then((response) => {
        if (response.status === 208) {
          setError('Gracz o takim identyfikatorze dołączył juz do rozgrywki');
          return;
        }
        setUsername(response.data);
        sessionStorage.setItem('username', response.data);
        sessionStorage.setItem('userindex', identificator.toString());
      })
      .catch((error) => {
        setError('Wystąpił błąd podczas dołączania do gry\n' + error.response.data.message);
        setUsername(null);
      });
  };

  const startGame = () => {
    service
      .startGame()
      .then(() => {
        console.log('Game successfully started');
      })
      .catch((error) => {
        setError('Wystąpił błąd podczas startowania gry:\n' + error.response.data.message);
      });
  };

  const moveScreens = () => {
    switch (gameMode) {
      case 'quiz':
        navigate('/gra/quiz');
        break;
      case 'board':
        navigate('/gra/planszowa');
        break;
      case 'exam':
        navigate('/sprawdzian');
        break;
      default:
        setError('Tryb gry nie został wybrany');
    }
  };

  if (!isAdmin()) {
    console.log("TRYB: " + gameMode);
    if (!gameMode || !['quiz', 'board', 'exam'].includes(gameMode))
      return (
        <Container>
          <UserInputContainer>
            Wybrano nieprawidłowy tryb, spróbuj dołączyć ponownie
          </UserInputContainer>
        </Container>
      );

    return (
      <Container>
        {username ? (
          <UserInputContainer>
            <SSEOnStartListener onGameStart={moveScreens} />
            <PlayerKickListener userHandler={setUsername} onKick={setPlayerKicked} />
            <h3>Witaj {username}!</h3>
            {gameMode === 'exam' && (
              <ExamWarningContainer>
                Pamiętaj że podczas sprawdzianu zabronione jest zmienianie karty w przeglądarce.
                Każda taka próba zostanie oznaczona jako oszustwo, a twoje punkty mogą zostać
                wyzerowane
              </ExamWarningContainer>
            )}
            Czekaj na rozpoczęcie rozgrywki
          </UserInputContainer>
        ) : playerKicked ? (
          <UserInputContainer>
            <span>Wyrzucono cie z gry, kliknij OK aby dołączyć ponownie</span>
            <ButtonCustom
              onClick={() => {
                setPlayerKicked(false);
              }}
            >
              OK
            </ButtonCustom>
          </UserInputContainer>
        ) : (
          <UserInputContainer>
            <CustomInput
              type="number"
              placeholder="Podaj numer z dziennika / numer grupy"
              onChange={(e) => setIdentificator(Number.parseInt(e.target.value))}
            />
            <ButtonCustom onClick={() => joinGame()}>Dołącz do gry</ButtonCustom>
          </UserInputContainer>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <ButtonCustom
        onClick={() => navigate('/konfiguracja')}
        style={{ position: 'absolute', left: '80px', top: '10px' }}
      >
        Powrót
      </ButtonCustom>
      <div
        style={{
          position: 'absolute',
          left: '57%',
          top: '30px',
          transform: 'translateX(-57%)',
          display: 'flex',
          flexDirection: 'row',
          width: '300px',
          gap: '20px',
          padding: '0 10px',
          color: theme.palette.main.info_text,
          textShadow: 'none',
          fontSize: '20px',
        }}
      >
        <div
          style={{
            margin: 'auto',
            height: '10%',
            width: '50%',
            borderBottom: `4px solid ${theme.palette.main.accent}`,
          }}
        />
        <span style={{ justifyContent: 'center', textAlign: 'center' }}>
          {gameMode === 'quiz' && 'QUIZ'}
          {gameMode === 'exam' && 'SPRAWDZIAN'}
          {gameMode === 'board' && 'GRA PLANSZOWA'}
        </span>
        <div
          style={{
            margin: 'auto',
            height: '10%',
            width: '50%',
            borderBottom: `4px solid ${theme.palette.main.accent}`,
          }}
        />
      </div>
      <SSEOnStartListener onGameStart={moveScreens} />
      <PlayerList />
      <QRWrapper>
        <QRContainer>
          <QRCode
            size={400}
            value={`http://192.168.137.1:3000/#/waiting-room?tryb=${gameMode}`} // NOSONAR
          />
        </QRContainer>
      </QRWrapper>
      <ActionButtonContainer>
        <ButtonCustom onClick={() => startGame()}>Zacznij grę</ButtonCustom>
      </ActionButtonContainer>
    </Container>
  );
}

export default WaitingRoom;
