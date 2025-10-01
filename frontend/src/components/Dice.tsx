import { useRef, useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { isMobileView } from '../common/utils';
import face1 from '../resources/face1.png';
import face2 from '../resources/face2.png';
import face3 from '../resources/face3.png';
import face4 from '../resources/face4.png';
import face5 from '../resources/face5.png';
import face6 from '../resources/face6.png';

const mobile = isMobileView()

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
  perspective: mobile ? '400px' : '400px',
  width: mobile ? '150px' : '250px',
  height: mobile ? '150px' : '250px',
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

    transform: `rotateY(-${CubeFaceData[faceNumber].y}deg) rotateX(-${CubeFaceData[faceNumber].x}deg) translateZ(${mobile ? 48 : 90}px)`,

    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      pointerEvents: 'none',
    },
  })
);

function Dice({diceRoll, cheatValue}: {diceRoll?: boolean, cheatValue?: '1' | '2' | '3' | '4' | '5' | '6'}) {
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [diceRolling, setDiceRolling] = useState(false);
  const rollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleDice = (diceRoll?: boolean) => {
    if (!diceRoll) {
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
        setRotateY((prevState) => prevState + (direction1 ? 90 : 180));
      }, 200);
    }
  };

  const setValue = (faceNumber: '1' | '2' | '3' | '4' | '5' | '6') => {
    setRotateY(CubeFaceData[faceNumber].y);
    setRotateX(CubeFaceData[faceNumber].x);
  };

  useEffect(() => {
    if (diceRoll != undefined) toggleDice(diceRoll);
  }, [diceRoll]);

  useEffect(() => {
    if (cheatValue) setValue(cheatValue);
  }, [cheatValue])

  return (
    <Scene>
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
