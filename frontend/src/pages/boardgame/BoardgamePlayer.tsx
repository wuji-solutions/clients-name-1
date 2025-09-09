import { styled } from 'styled-components';
import { useState } from 'react';
import GameBoard from '../../components/GameBoard';
import { BoardPositions } from '../../common/types';
import { ButtonCustom } from '../../components/Button';
import { useContainerDimensions } from '../../hooks/useContainerDimensions';

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

const NUMFIELDS = 15;

const getInitialPositions = (): BoardPositions => {
  const initial: BoardPositions = Array.from({ length: NUMFIELDS }, () => []);
  initial[0] = [
    { id: '1', color: '#e74c3c' },
    { id: '3', color: '#2ecc71' },
    { id: '2', color: '#3498db' },
    { id: '4', color: '#f23552' },
    { id: '6', color: '#2ecc71' },
    { id: '8', color: '#3498db' },
    { id: '5', color: '#e74c3c' },
    { id: '7', color: '#2ecc71' },
    { id: '9', color: '#3498db' },
    { id: '10', color: '#f23552' },
    { id: '12', color: '#2ecc71' },
    { id: '14', color: '#3498db' },
    { id: '11', color: '#e74c3c' },
    { id: '13', color: '#2ecc71' },
    { id: '15', color: '#3498db' },
  ];
  return initial;
};

function BoardgamePlayer() {
  const [positions, setPositions] = useState<BoardPositions>(getInitialPositions());

  const { ref: gameContainerRef, dimensions } = useContainerDimensions();

  const testMove = () => {
    const board: BoardPositions = Array.from({ length: NUMFIELDS }, () => []);
    for (let i = 0; i < NUMFIELDS; i++) {
      for (const player of positions[i]) {
        const new_position = (getRandomIntInclusive(1, 6) + i) % NUMFIELDS;
        board[new_position].push(player);
      }
    }
    setPositions(board);
  };

  return (
    <Container>
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
