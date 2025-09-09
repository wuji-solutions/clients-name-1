import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import face1 from '../resources/face1.png';
import face2 from '../resources/face2.png';
import face3 from '../resources/face3.png';
import face4 from '../resources/face4.png';
import face5 from '../resources/face5.png';
import face6 from '../resources/face6.png';

const CubeFaceData = {
  '1': {
    x: 0,
    y: 0,
  },
  '2': {
    x: 0,
    y: 90,
  },
  '6': {
    x: 0,
    y: 180,
  },
  '5': {
    x: 0,
    y: 270,
  },
  '4': {
    x: 90,
    y: 0,
  },
  '3': {
    x: 270,
    y: 0,
  },
};

const Scene = styled.div(() => ({
  perspective: '600px',
  width: '400px',
  height: '400px',
  margin: '25px',
}));

const Cube = styled.div<{ rotationY: number; rotationX: number }>(({ rotationY, rotationX }) => ({
  transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`,

  width: '50%',
  height: '50%',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.18s linear',
  margin: 'auto',
}));

const CubeFace = styled.div<{ faceNumber: '1' | '2' | '3' | '4' | '5' | '6' }>(
  ({ faceNumber }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    userSelect: 'none',
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',

    transform: `rotateY(${CubeFaceData[faceNumber].y}deg) rotateX(${CubeFaceData[faceNumber].x}deg) translateZ(-100px)`,

    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      pointerEvents: 'none',
    },
  })
);

function Dice() {
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [diceRolling, setDiceRolling] = useState(false);
  const rollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleDice = () => {
    if (diceRolling) {
      if (rollingInterval.current) {
        clearInterval(rollingInterval.current);
        rollingInterval.current = null;
        setDiceRolling(false);
      }
    } else {
      setDiceRolling(true);
      rollingInterval.current = setInterval(() => {
        const direction1 = Math.floor(Math.random() * 2) % 2 == 0;
        const direction2 = Math.floor(Math.random() * 2) % 2 == 0;
        setRotateX((prevState) => prevState + (direction1 ? 90 : 180));
        setRotateY((prevState) => prevState + (direction2 ? 90 : 180));
      }, 180);
    }
  };

  const setValue = (faceNumber: '1' | '2' | '3' | '4' | '5' | '6') => {
    setRotateY(CubeFaceData[faceNumber].y);
    setRotateX(CubeFaceData[faceNumber].x);
  }

  return (
    <Scene onClick={() => toggleDice()}>
      <Cube rotationY={rotateY} rotationX={rotateX}>
        <CubeFace faceNumber="1">
          <img src={face1} />
        </CubeFace>
        <CubeFace faceNumber="2">
          <img src={face2} />
        </CubeFace>
        <CubeFace faceNumber="3">
          <img src={face3} />
        </CubeFace>
        <CubeFace faceNumber="4">
          <img src={face4} />
        </CubeFace>
        <CubeFace faceNumber="5">
          <img src={face5} />
        </CubeFace>
        <CubeFace faceNumber="6">
          <img src={face6} />
        </CubeFace>
      </Cube>
    </Scene>
  );
}

export default Dice;
