import { styled } from 'styled-components';
import React, { useState, useRef, useMemo } from 'react';
import GameBoard from '../../components/GameBoard';
import { BoardPositions, FieldCoordinate } from '../../common/types';
import panzoom from 'panzoom';
import { ButtonCustom } from '../../components/Button';
import { BOARD_X_RADIUS, BOARD_Y_RADIUS } from '../../common/config';

export const Container = styled.div(() => ({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  cursor: 'grab',

  '&:active': {
    cursor: 'grabbing',
  },
}));

function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

const NUMFIELDS = 30;
const PERSPECTIVE = 0.35;
const MIN_SCALE = 0.6;
const MAX_SCALE = 1.2;

const getInitialPositions = (): BoardPositions => {
  const initial: BoardPositions = Array.from({ length: NUMFIELDS }, () => []);
  initial[0] = [{ id: 'p1', color: '#e74c3c' }, { id: 'p3', color: '#2ecc71' }, { id: 'p2', color: '#3498db' },
  { id: 'p4', color: '#f2355' }, { id: 'p6', color: '#2ecc71' }, { id: 'p8', color: '#3498db' },
  { id: 'p5', color: '#e74c3c' }, { id: 'p7', color: '#2ecc71' }, { id: 'p9', color: '#3498db' }];
  return initial;
};

function BoardgamePlayer() {
  const [positions, setPositions] = useState<BoardPositions>(getInitialPositions());
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const fieldCoordinates = useMemo<FieldCoordinate[]>(() => {
    const coords: FieldCoordinate[] = [];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius_x = BOARD_X_RADIUS;
    const radius_y = BOARD_Y_RADIUS;
    const offset = 0;

    for (let i = 0; i < NUMFIELDS; i++) {
      const angle = ((2 * Math.PI) / NUMFIELDS) * i;
      const sinAngle = Math.sin(angle);
      const depth = sinAngle + 1;
      const scale = MIN_SCALE + ((MAX_SCALE - MIN_SCALE) * depth) / 2;
      const y = centerY + offset + (radius_y * sinAngle + PERSPECTIVE);
      coords.push({
        x: centerX + radius_x * Math.cos(angle),
        y,
        scale,
      });
    }

    return coords;
  }, []);

  React.useEffect(() => {
    if (gameContainerRef.current) {
      panzoom(gameContainerRef.current, {
        maxZoom: 3,
        minZoom: 0.5,
      });
    }
  }, []);

  const testMove = () => {
    const board: BoardPositions = Array.from({ length: NUMFIELDS }, () => []);
    for (let i = 0; i < NUMFIELDS; i++) {
      for (const player of positions[i]) {
        const new_position = (getRandomIntInclusive(1, 6) + i) % NUMFIELDS
        board[new_position].push(player)
      }
    }
    setPositions(board)
    
  }

  return (
    <Container ref={gameContainerRef}>
      <ButtonCustom onClick={testMove} >Test</ButtonCustom>
      <GameBoard positions={positions} fieldCoordinates={fieldCoordinates} />
    </Container>
  );
}

export default BoardgamePlayer;
