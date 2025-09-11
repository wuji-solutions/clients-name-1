import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import GameBoard from '../../components/GameBoard';
import { BoardPositions, Pawn } from '../../common/types';
import { ButtonCustom } from '../../components/Button';
import { useContainerDimensions } from '../../hooks/useContainerDimensions';
import { service } from '../../service/service';
import { useSSEChannel } from '../../providers/SSEProvider';
import { BACKEND_ENDPOINT_EXTERNAL } from '../../common/config';
import Dice from '../../components/Dice';

export const Container = styled.div(() => ({
  width: '100%',
  height: '100%',
  margin: 'auto',
}));

export const ActionContainer = styled.div(() => ({
  position: 'absolute',
  zIndex: 2,
  margin: 'auto',
  textAlign: 'center',
  top: '25%',
  left: '50%',
  width: 'fit-content',
  height: 'fit-content',
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
  const [positionsBuffer, setPositionsBuffer] = useState<BoardPositions>([]);
  const [positions, setPositions] = useState<BoardPositions>([]);
  const [numfields, setNumfields] = useState<number>(0);
  const { ref: gameContainerRef, dimensions } = useContainerDimensions();
  const [playerIndex, setPlayerIndex] = useState<string | undefined>(undefined);
  const [diceRoll, setDiceRoll] = useState<boolean | undefined>(undefined);
  const [cheatValue, setCheatValue] = useState<'1' | '2' | '3' | '4' | '5' | '6' | undefined>(undefined);
  const [positionUpdateBlock, setPositionUpdateBlock] = useState<boolean>(false);

  useEffect(() => {
    service.getBoardState('user').then((response) => {
      const setup = getBoardSetup(response.data)
      setPositions(setup.positions);
      setNumfields(setup.numfields);
    });
  }, []);

  useEffect(() => {
    if (!playerIndex) {
      service.getPlayerId().then((response) => setPlayerIndex(response.data.index as string))
    }
  }, []);

  useEffect(() => {
    if (!positionUpdateBlock) setPositions(positionsBuffer);
  }, [positionsBuffer, positionUpdateBlock])

  const rollDice = () => {
    setPositionUpdateBlock(true)
    setCheatValue(undefined)
    setDiceRoll(true)
    service.makeMove().then((response) => {
      setTimeout(() => {
        setDiceRoll(false)
        setCheatValue(response.data.diceRoll)
        setPositionUpdateBlock(false)
      }, 1000)
    }).catch((e) => setDiceRoll(false))
  };

  return (
    <Container>
      <SSEOnBoardgameStateChangeListener setPositions={setPositionsBuffer} />
      <ActionContainer onClick={rollDice}>
        <Dice diceRoll={diceRoll} cheatValue={cheatValue} />
      </ActionContainer>
      <GameContainer ref={gameContainerRef}>
        {dimensions.width > 0 && numfields && (
          <GameBoard
            positions={positions}
            width={dimensions.width}
            height={dimensions.height}
            numFields={numfields}
            storedPlayerIndex={playerIndex}
            positionUpdateBlock={positionUpdateBlock}
          />
        )}
      </GameContainer>
    </Container>
  );
}

export default BoardgamePlayer;
