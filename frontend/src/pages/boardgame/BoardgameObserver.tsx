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
    categoryColorReferences.set(
      tile.category,
      boardgameColorPalette[i + (2 % boardgameColorPalette.length)]
    );
  });
  return {
    positions: positions,
    numfields: positions.length,
    tileColors: categoryColorReferences,
    tileStates: data.tileStates.map((entry) => entry.category),
  };
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

function SSEBoardGameRankingChangeListener({ setRanking }: { setRanking: Function }) {
  const delegate = useSSEChannel(BACKEND_ENDPOINT + '/sse/events', {
    withCredentials: true,
  });

  useEffect(() => {
    const unsubscribe = delegate.on('new-ranking-state', (data) => {
      setRanking(data);
    });
    return unsubscribe;
  }, [delegate]);

  return <></>;
}

const RankingContainer = styled.div<{ expanded: boolean }>(({ expanded }) => ({
  width: '100%',
  height: expanded ? '500px' : '20px',
  position: 'absolute',
  bottom: '0px',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  transition: 'height 0.3s ease-in-out',
  zIndex: '99',
  borderRadius: '10px 10px 0 0',
  border: '1px solid #000',
}));

const RankingToggleButton = styled.div(() => ({
  width: '200px',
  height: '41px',
  position: 'absolute',
  top: '-40px',
  left: 'calc(50% - 100px)',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  textAlign: 'center',
  lineHeight: '40px',
  fontWeight: 'bold',

  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',

  clipPath: 'polygon(5% 0, 90% 0, 100% 5%, 100% 100%, 0% 100%, 0% 20%)',

  cursor: 'pointer',
  border: '1px solid #000',
}));

const RankingContent = styled.div(() => ({
  textAlign: 'center',
  lineHeight: '40px',
  fontWeight: 'bold',
  marginTop: '50px',
  fontSize: 'x-large',
  alignItems: 'center',
  justifyContent: 'center',
}));

const positionMap = ['#FFD700', '#C0C0C0', '#996515'];

const PositionIndicator = styled.div<{ position: number }>(({ position }) => ({
  borderRadius: '50%',
  backgroundColor: position >= 0 && position < 3 ? positionMap[position] : '#CFC0CF',
  height: '50px',
  width: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  fontSize: '30px',
}));

function BoardgameObserver() {
  const [positionsBuffer, setPositionsBuffer] = useState<BoardPositions>([]);
  const [positions, setPositions] = useState<BoardPositions>([]);
  const [numfields, setNumfields] = useState<number>(0);
  const { ref: gameContainerRef, dimensions } = useContainerDimensions();
  const [tileStates, setTileStates] = useState<string[]>();
  const [boardColorReferences, setBoardColorReferences] =
    useState<Map<string, string | undefined>>();
  const [playerRanking, setPlayerRanking] = useState<Pawn[]>([]);
  const [rankingExpanded, setRankingExpanded] = useState<boolean>(false);

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
    service.getPlayerLeaderboard().then((response) => {
      setPlayerRanking(response.data);
    });
  }, []);

  useEffect(() => {
    setPositions(positionsBuffer);
  }, [positionsBuffer]);

  return (
    <Container>
      <SSEOnBoardgameStateChangeListener setPositions={setPositionsBuffer} />
      <SSEBoardGameRankingChangeListener setRanking={setPlayerRanking} />
      <GameContainer ref={gameContainerRef}>
        {dimensions.width > 0 && numfields && (
          <GameBoard
            positions={positions}
            width={dimensions.width}
            height={dimensions.height}
            numFields={numfields}
            positionUpdateBlock={false}
            observerVersion={true}
            boardColorReferences={boardColorReferences}
            tileStates={tileStates}
          />
        )}
      </GameContainer>
      <RankingContainer expanded={rankingExpanded}>
        <RankingToggleButton onClick={() => setRankingExpanded((prev) => !prev)}>
          RANKING
        </RankingToggleButton>

        {rankingExpanded && (
          <RankingContent>
            {playerRanking.map((player, position) => (
              <div
                key={`player_${player.index}`}
                style={{
                  width: 'fit-content',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '20px',
                  margin: 'auto',
                }}
              >
                <PositionIndicator position={position}>{position + 1}</PositionIndicator>
                <span>{player.nickname}</span>
              </div>
            ))}
          </RankingContent>
        )}
      </RankingContainer>
    </Container>
  );
}

export default BoardgameObserver;
