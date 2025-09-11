import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import GameBoard from '../../components/GameBoard';
import { BoardPositions, Pawn } from '../../common/types';
import { ButtonCustom } from '../../components/Button';
import { useContainerDimensions } from '../../hooks/useContainerDimensions';
import { service } from '../../service/service';
import { useSSEChannel } from '../../providers/SSEProvider';
import { BACKEND_ENDPOINT_EXTERNAL } from '../../common/config';
import { data } from 'react-router';

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

function parsePlayerPositions(
  positions: [{ tileIndex: number; players: [Pawn]; category: string }]
) {
  return positions.map((tileState) => tileState.players);
}

function getBoardSetup(data: {tileStates: [{players: [Pawn], tileIndex: number, category: string}]}){
  const positions = parsePlayerPositions(data.tileStates)
  return {positions: positions, numfields: positions.length}
}

function SSEOnBoardgameStateChangeListener({setPositions}: {setPositions: Function}) {
  const delegate = useSSEChannel(
    BACKEND_ENDPOINT_EXTERNAL + '/sse/board/new-state',
    { withCredentials: true }
  );

  useEffect(() => {
    const unsubscribe = delegate.on('new-board-state', (data) => {
      setPositions(parsePlayerPositions(data.tileStates));
    });
    return unsubscribe;
  }, [delegate]);

  return <></>
}

function BoardgamePlayer() {
  const [positions, setPositions] = useState<BoardPositions>([]);
  const [numfields, setNumfields] = useState<number>(0);
  const { ref: gameContainerRef, dimensions } = useContainerDimensions();

  useEffect(() => {
    service.getBoardState('user').then((response) => {
      const setup = getBoardSetup(response.data)
      setPositions(setup.positions);
      setNumfields(setup.numfields);
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
        {dimensions.width > 0 && numfields && (
          <GameBoard
            positions={positions}
            width={dimensions.width}
            height={dimensions.height}
            numFields={numfields}
          />
        )}
      </GameContainer>
    </Container>
  );
}

export default BoardgamePlayer;
