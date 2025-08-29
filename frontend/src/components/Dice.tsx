import { useState } from 'react';
import { styled } from 'styled-components';

const CubeFaceData = {
  '1': {
    y: 0,
    z: 25,
  },
  '2': {
    y: 90,
    z: 25,
  },
  '3': {
    y: 180,
    z: 25,
  },
  '4': {
    y: 270,
    z: 25,
  },
};

const Scene = styled.div(() => ({
  perspective: '600px',
  width: '100px',
  height: '100px',
  margin: '25px',
}));

const Cube = styled.div<{ rotation: number }>(({ rotation }) => ({
  transform: `rotateY(${rotation}deg)`,

  width: '50px',
  height: '50px',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.2s ease-in-out',
  margin: 'auto',
}));

const CubeFace = styled.div<{ faceNumber: '1' | '2' | '3' | '4' }>(({ faceNumber }) => ({
  position: 'absolute',
  width: '50px',
  height: '50px',
  color: '#000',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  userSelect: 'none',
  backgroundColor: '#fff',

  transform: `rotateY(${CubeFaceData[faceNumber].y}deg) translateZ(${CubeFaceData[faceNumber].z}px)`,
}));

function Dice() {
  const [rotate, setRotate] = useState(0);

  return (
    <Scene>
      <Cube rotation={rotate} onClick={() => setRotate(rotate + 90)}>
        <CubeFace faceNumber="1">•</CubeFace>
        <CubeFace faceNumber="2">{'••'}</CubeFace>
        <CubeFace faceNumber="3">{'•'}{'•'}{'•'}</CubeFace>
        <CubeFace faceNumber="4">{'••'}{'••'}</CubeFace>
      </Cube>
    </Scene>
  );
}

export default Dice;
