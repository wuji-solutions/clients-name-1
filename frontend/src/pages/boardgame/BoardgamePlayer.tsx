import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import GameBoard from '../../components/GameBoard';
import { BoardPositions, Pawn } from '../../common/types';
import { ButtonCustom } from '../../components/Button';
import { useContainerDimensions } from '../../hooks/useContainerDimensions';
import { service } from '../../service/service';
import { useSSEChannel } from '../../providers/SSEProvider';
import { BACKEND_ENDPOINT_EXTERNAL } from '../../common/config';

export const Container = styled.div(() => ({
  width: '100%',
  height: '100%',
  margin: 'auto',
}));

export const ActionContainer = styled.div(() => ({
  position: 'relative',
  zIndex: 2,
  marginBottom: '10px',
  textAlign: 'center',
}));

export const GameContainer = styled.div(() => ({
  width: '100%',
  height: 'calc(80vh)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: '10px',
  position: 'relative',
  zIndex: 1,
  margin: 'auto',
  padding: '20px',
}));

function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function parsePlayerPositions(
  positions: [{ tileIndex: number; players: [Pawn]; category: string }]
) {
  return positions.map((tileState) => tileState.players);
}

function SSEOnBoardgameStateChangeListener({setPositions}: {setPositions: Function}) {
  const delegate = useSSEChannel(
    BACKEND_ENDPOINT_EXTERNAL + '/sse/board/new-state',
    { withCredentials: true }
  );

  useEffect(() => {
    const unsubscribe = delegate.on('new-board-state', (data) => {
      setPositions(parsePlayerPositions(data));
    });
    return unsubscribe;
  }, [delegate]);

  return <></>
}

const NUMFIELDS = 15;

function BoardgamePlayer() {
  const [positions, setPositions] = useState<BoardPositions>([]);
  const { ref: gameContainerRef, dimensions } = useContainerDimensions();

  useEffect(() => {
    service.getBoardState('user').then((response) => {
      setPositions(parsePlayerPositions(response.data.tileStates));
    });
  }, []);

  const testMove = () => {
    service.makeMove().then((response) => console.log(response));
  };

  return (
    <Container>
      <SSEOnBoardgameStateChangeListener setPositions={setPositions} />
      <ActionContainer>
        <ButtonCustom onClick={testMove}>Test</ButtonCustom>
      </ActionContainer>
      <GameContainer ref={gameContainerRef}>
        {dimensions.width > 0 && (
          <GameBoard
            positions={positions}
            width={dimensions.width}
            height={dimensions.height}
            numFields={NUMFIELDS}
          />
        )}
      </GameContainer>
    </Container>
  );
}

export default BoardgamePlayer;
