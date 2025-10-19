import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { BACKEND_ENDPOINT } from '../common/config';
import { styled } from 'styled-components';
import { useSSEChannel } from '../providers/SSEProvider';
import theme from '../common/theme';
import { service } from '../service/service';
import { lightenColor } from '../common/utils';

const Contaier = styled.div({
  marginTop: 'auto',
  marginBottom: 'auto',
  marginLeft: '20px',
  height: '70vh',
  width: '37%',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  border: `5px solid ${theme.palette.main.accent}`,
  borderRadius: '25px',
});

const Header = styled.span({
  fontWeight: 700,
  fontSize: '40px',
  color: lightenColor(theme.palette.main.accent, 0.1),
  textShadow: 'none',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '15px',
  marginBottom: '25px',
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

  useEffect(() => {
    service
      .getPlayerList()
      .then((response) => addPlayers(response.data, players, setPlayers, setNewPlayers))
      .catch((error) => console.log(error));
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
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  return (
    <Contaier>
      <Header>Lista graczy</Header>
      <PlayerContainer>
        {players.map((player) => (
          <PlayerEntry key={player.nickname} isNew={newPlayers.has(player.nickname)}>
            {player.nickname} {` (${player.index})`}
            <CloseIcon onClick={() => kickPlayer(player.index, player.nickname)}>X</CloseIcon>
          </PlayerEntry>
        ))}
      </PlayerContainer>
    </Contaier>
  );
}

export default PlayerList;
