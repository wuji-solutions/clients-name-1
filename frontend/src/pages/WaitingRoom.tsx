import { useEffect, useState } from 'react';
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
import ErrorPopup from '../components/ErrorPopup';
import Cookies from 'js-cookie';

const Container = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
});

const QRWrapper = styled.div({
  padding: '10px',
  border: `5px solid ${theme.palette.main.accent}`,
  height: 'fit-content',
  width: 'fit-content',
  borderRadius: '15px',
  margin: 'auto',
});

const QRContainer = styled.div({
  margin: 'auto',
  background: '#fff',
  padding: '15px',
  borderRadius: '15px',
  border: '5px solid #fff',
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

const allowedGameModes = ['board', 'exam', 'quiz'];

function PlayerKickListener({
  userHandler,
  onKick,
}: {
  userHandler: React.Dispatch<React.SetStateAction<string | null>>;
  onKick: React.Dispatch<React.SetStateAction<boolean>>;
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
        Cookies.remove('JSESSIONID')
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
  const [startGameError, setStartGameError] = useState<string>('');
  const gameMode = new URLSearchParams(globalThis.location.search).get('tryb');
  const navigate = useNavigate();

  const joinGame = () => {
    if (!identificator || !gameMode) return;
    service
      .joinGame(identificator, gameMode)
      .then((response) => {
        setUsername(response.data);
        sessionStorage.setItem('username', response.data);
        sessionStorage.setItem('userindex', identificator.toString());
      })
      .catch((error) => console.log(error));
  };

  const startGame = () => {
    service
      .startGame()
      .then(() => {
        console.log('Game successfully started');
      })
      .catch((error) => {
        setStartGameError(error.response.data.message);
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
        console.log('Tryb gry nie został wybrany');
    }
  };

  if (!isAdmin()) {
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
      <SSEOnStartListener onGameStart={moveScreens} />
      <PlayerList />
      <QRWrapper>
        <QRContainer>
          <QRCode
            size={400}
            value={`http://192.168.137.1:3000/waiting-room?tryb=${gameMode}`} // NOSONAR
          />
        </QRContainer>
      </QRWrapper>
      <ErrorPopup error={startGameError} onClose={() => setStartGameError('')} />
      <ActionButtonContainer>
        <ButtonCustom onClick={() => startGame()}>Zacznij grę</ButtonCustom>
        <ButtonCustom onClick={() => navigate('/konfiguracja')}>Powrót</ButtonCustom>
      </ActionButtonContainer>
    </Container>
  );
}

export default WaitingRoom;
