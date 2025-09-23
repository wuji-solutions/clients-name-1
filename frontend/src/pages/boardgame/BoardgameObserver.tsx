import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import GameBoard from '../../components/GameBoard';
import { BoardPositions, Pawn } from '../../common/types';
import { useContainerDimensions } from '../../hooks/useContainerDimensions';
import { service } from '../../service/service';
import { useSSEChannel } from '../../providers/SSEProvider';
import { BACKEND_ENDPOINT } from '../../common/config';
import { Container, GameContainer } from './BoardgamePlayer';
import { boardgameColorPalette } from '../../common/utils';

function parsePlayerPositions(
  positions: [{ tileIndex: number; players: [Pawn]; category: string }]
) {
  return positions.map((tileState) => tileState.players);
}

function getBoardSetup(data: {
  tileStates: [{ players: [Pawn]; tileIndex: number; category: string }];
}) {
  const positions = parsePlayerPositions(data.tileStates);
  const categoryColorReferences = new Map<string, string | undefined>();
  data.tileStates.map((tile, i) => {
    if (tile.category in categoryColorReferences) return;
    categoryColorReferences.set(tile.category, boardgameColorPalette[ i + 2 % boardgameColorPalette.length]);
  })
  return { positions: positions, numfields: positions.length, tileColors: categoryColorReferences, tileStates: data.tileStates.map((entry) => entry.category) };
}

function SSEOnBoardgameStateChangeListener({ setPositions }: { setPositions: Function }) {
  const delegate = useSSEChannel(BACKEND_ENDPOINT + '/sse/board/new-state', {
    withCredentials: true,
  });

  useEffect(() => {
    const unsubscribe = delegate.on('new-board-state', (data) => {
      setPositions(parsePlayerPositions(data.tileStates));
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

function BoardgameObserver() {
  const [positionsBuffer, setPositionsBuffer] = useState<BoardPositions>([]);
  const [positions, setPositions] = useState<BoardPositions>([]);
  const [numfields, setNumfields] = useState<number>(0);
  const { ref: gameContainerRef, dimensions } = useContainerDimensions();
  const [tileStates, setTileStates] = useState<string[]>();
  const [boardColorReferences, setBoardColorReferences] = useState<Map<string, string | undefined>>();

  const [positionUpdateBlock, setPositionUpdateBlock] = useState<boolean>(false);

  useEffect(() => {
    service.getBoardState('admin').then((response) => {
      const setup = getBoardSetup(response.data);
      setPositions(setup.positions);
      setNumfields(setup.numfields);
      setTileStates(setup.tileStates);
      setBoardColorReferences(setup.tileColors);
    });
  }, []);

  useEffect(() => {
    if (!positionUpdateBlock) setPositions(positionsBuffer);
  }, [positionsBuffer, positionUpdateBlock]);

  return (
    <Container>
      <SSEOnBoardgameStateChangeListener setPositions={setPositionsBuffer} />
      <GameContainer ref={gameContainerRef} style={{marginLeft: '-60px'}}>
        {dimensions.width > 0 && numfields && (
          <GameBoard
            positions={positions}
            width={dimensions.width}
            height={dimensions.height}
            numFields={numfields}
            positionUpdateBlock={positionUpdateBlock}
            observerVersion={true}
            boardColorReferences={boardColorReferences}
            tileStates={tileStates}
          />
        )}
      </GameContainer>
    </Container>
  );
}

export default BoardgameObserver;
