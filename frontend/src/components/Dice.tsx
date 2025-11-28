import { useRef, useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { isMobileView } from '../common/utils';
import face1 from '../resources/face1.png';
import face2 from '../resources/face2.png';
import face3 from '../resources/face3.png';
import face4 from '../resources/face4.png';
import face5 from '../resources/face5.png';
import face6 from '../resources/face6.png';

const mobile = isMobileView();

type FaceNumber = '1' | '2' | '3' | '4' | '5' | '6';
type CheatValue = '1' | '2' | '3' | '4' | '5' | '6' | null;

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
  perspective: '400px',
  width: mobile ? '150px' : '250px',
  height: mobile ? '150px' : '250px',
  zIndex: 999
}));

const Cube = styled.div<{ rotationY: number; rotationX: number }>(({ rotationY, rotationX }) => ({
  transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`,

  width: '75%',
  height: '75%',
  position: 'relative',
  top: mobile ? '70%' : '10%',
  right: mobile ? '30%' : 'auto',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.18s linear',
  margin: 'auto',
}));

const CubeFace = styled.div<{ faceNumber: FaceNumber }>(({ faceNumber }) => {
  const size = mobile ? 150 : 250;
  const cubeSide = size * 0.75;
  const depth = cubeSide / 2;

  return {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    transform: `rotateY(-${CubeFaceData[faceNumber].y}deg)
                  rotateX(-${CubeFaceData[faceNumber].x}deg)
                  translateZ(${depth}px)`,
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  };
});

interface DiceProps {
  diceRoll?: boolean;
  cheatValue?: CheatValue;
}

function Dice({ diceRoll, cheatValue }: Readonly<DiceProps>) {
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const rollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleDice = (diceRoll?: boolean) => {
    if (diceRoll) {
      rollingInterval.current = setInterval(() => {
        const direction1 = Math.floor(Math.random() * 2) % 2 == 0; // NOSONAR
        setRotateX((prevState) => prevState + (direction1 ? 45 : 60));
        setRotateY((prevState) => prevState + (direction1 ? 45 : 60));
      }, 150);
    } else {
      if (rollingInterval.current) {
        clearInterval(rollingInterval.current);
        rollingInterval.current = null;
      }
      if (cheatValue) setValue(cheatValue);
    }
  };

  const setValue = (faceNumber: FaceNumber) => {
    setRotateY(CubeFaceData[faceNumber].y);
    setRotateX(CubeFaceData[faceNumber].x);
  };

  useEffect(() => {
    if (diceRoll != undefined) toggleDice(diceRoll);
  }, [diceRoll]);

  return (
    <Scene>
      <Cube rotationY={rotateY} rotationX={rotateX}>
        <CubeFace faceNumber="1">
          <img src={face1} alt={'1'} />
        </CubeFace>
        <CubeFace faceNumber="2">
          <img src={face2} alt={'2'} />
        </CubeFace>
        <CubeFace faceNumber="3">
          <img src={face3} alt={'3'} />
        </CubeFace>
        <CubeFace faceNumber="4">
          <img src={face4} alt={'4'} />
        </CubeFace>
        <CubeFace faceNumber="5">
          <img src={face5} alt={'5'} />
        </CubeFace>
        <CubeFace faceNumber="6">
          <img src={face6} alt={'6'} />
        </CubeFace>
      </Cube>
    </Scene>
  );
}

export default Dice;
