import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { BACKEND_ENDPOINT } from '../common/config';
import { styled } from 'styled-components';
import { useSSEChannel } from '../providers/SSEProvider';
import theme from '../common/theme';
import { service } from '../service/service';
import { useError } from '../providers/ErrorProvider';

const Contaier = styled.div({
  marginTop: 'auto',
  marginBottom: 'auto',
  marginLeft: '20px',
  height: '70vh',
  width: '30%',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  border: `5px solid ${theme.palette.main.accent}`,
  borderRadius: '25px',
});

const Header = styled.span({
  fontWeight: 700,
  fontSize: '40px',
  color: theme.palette.main.info_text,
  textShadow: 'none',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '15px',
  marginBottom: '25px',
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
});

const PlayerContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '30px',
  fontSize: '20px',
  textAlign: 'start',
  overflowY: 'auto',
  overflowX: 'hidden',
  height: '100%',
});

const PlayerEntry = styled.span<{ isNew: boolean }>(({ isNew }) => ({
  display: 'inline-block',
  transformOrigin: 'center',
  animation: isNew ? 'popin 0.3s ease forwards' : 'none',
  '@keyframes popin': {
    '0%': {
      transform: 'scale(0.5)',
      opacity: 0,
    },
    '60%': {
      transform: 'scale(1.2)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
}));

const CloseIcon = styled.a(() => ({
  marginLeft: '20px',
  width: '32px',
  height: '32px',
  opacity: '1',
  color: theme.palette.main.error,
  cursor: 'pointer',

  '&:hover': {
    opacity: '0.6',
  },
  '&:before': {
    left: '15px',
    content: ' ',
    height: '33px',
    width: '2px',
    backgroundColor: '#333',
    transform: 'rotate(45deg)',
  },
  '&:after': {
    left: '15px',
    content: ' ',
    height: '33px',
    width: '2px',
    backgroundColor: '#333',
    transform: 'rotate(45deg)',
  },
}));

type Player = {
  index: number;
  nickname: string;
  details: any;
};

const addPlayers = (
  event: Player[],
  players: Player[],
  setPlayers: Dispatch<SetStateAction<Player[]>>,
  setNewPlayers: Dispatch<SetStateAction<Set<string>>>
) => {
  try {
    const data: Player[] = event;

    const currentNicknames = new Set(players.map((p) => p.nickname));
    const addedPlayers = data.filter((p) => !currentNicknames.has(p.nickname));

    setPlayers(data);

    if (addedPlayers.length > 0) {
      setNewPlayers((prev) => {
        const updated = new Set(prev);
        addedPlayers.forEach((p) => updated.add(p.nickname));
        return updated;
      });

      setTimeout(() => {
        setNewPlayers((prev) => {
          const updated = new Set(prev);
          addedPlayers.forEach((p) => updated.delete(p.nickname));
          return updated;
        });
      }, 1500);
    }
  } catch (error) {
    console.error('Failed to fetch player list: ', error);
  }
};

function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayers, setNewPlayers] = useState<Set<string>>(new Set());
  const delegate = useSSEChannel(`${BACKEND_ENDPOINT}/sse/users`);
  const { setError } = useError();

  const [showPlayers, setShowPlayers] = useState<boolean>(false);

  useEffect(() => {
    service
      .getPlayerList()
      .then((response) => addPlayers(response.data, players, setPlayers, setNewPlayers))
      .catch((error) =>
        setError('Wystąpił błąd podczas listowania graczy:\n' + error.response.data.message)
      );
  }, []);

  useEffect(() => {
    const unsubscribe = delegate.on('player-list', (data) => {
      addPlayers(data, players, setPlayers, setNewPlayers);
    });
    return unsubscribe;
  }, [delegate]);

  const kickPlayer = (index: number, nickname: string) => {
    service
      .kickPlayer(index, nickname)
      .then(() => {
        service
          .getPlayerList()
          .then((response) => addPlayers(response.data, players, setPlayers, setNewPlayers))
          .catch((error) =>
            setError('Wystąpił błąd podczas wyrzucania gracza:\n' + error.response.data.message)
          );
      })
      .catch((error) =>
        setError('Wystąpił błąd podczas wyrzucania gracza:\n' + error.response.data.message)
      );
  };

  return (
    <Contaier>
      <Header>
        Lista graczy{' '}
        <div style={{marginTop: 'auto'}}>
          {!showPlayers && (
            <svg
              onClick={() => setShowPlayers(true)}
              cursor="pointer"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
          {showPlayers && (
            <svg
              onClick={() => setShowPlayers(false)}
              cursor="pointer"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94C16.12 19.21 14.14 20 12 20 5 20 1 12 1 12c1.11-1.94 2.5-3.65 4.06-5.06" />
              <path d="M22.06 12.94c-.64 1.11-1.41 2.15-2.29 3.06" />
              <path d="M12 4c2.14 0 4.12.79 5.94 2.06" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </div>
      </Header>
      <span style={{margin: 'auto', fontSize: '20px'}}>
        Liczba graczy: {players.length}
      </span>
      <PlayerContainer>
        {players.map((player) => (
          <PlayerEntry key={player.nickname} isNew={newPlayers.has(player.nickname)}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {player.nickname}
              <div
                style={{ display: 'flex', flexDirection: 'row', marginLeft: '15px' }}
              >
                {showPlayers && ` (${player.index})`}
              </div>
              <CloseIcon onClick={() => kickPlayer(player.index, player.nickname)}>✕</CloseIcon>
            </div>
          </PlayerEntry>
        ))}
      </PlayerContainer>
    </Contaier>
  );
}

export default PlayerList;
