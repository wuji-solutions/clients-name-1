import React from 'react';
import styled from 'styled-components';

type Direction = 'left' | 'right' | 'up' | 'down';

const rotationMap: Record<Direction, string> = {
  right: '135deg',
  down: '45deg',
  left: '315deg',
  up: '225deg',
};

interface Props {
  direction?: Direction;
  size?: number;
  color?: string;
  className?: string;
}

const Root = styled.div<{ $size: number; $color: string; $rotation: string }>`
  display: inline-block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  position: relative;
  transform-origin: center center;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 62.5%;
    width: ${({ $size }) => Math.round($size * 0.45)}px;
    height: ${({ $size }) => Math.round($size * 0.45)}px;
    border-right: ${({ $size }) => Math.max(1, Math.round($size / 6))}px solid ${({ $color }) => $color};
    border-bottom: ${({ $size }) => Math.max(1, Math.round($size / 6))}px solid ${({ $color }) => $color};
    transform: translate(-50%, -50%) rotate(${({ $rotation }) => $rotation});
    transform-origin: center center;
    box-sizing: content-box;
    margin-top: 0;
    margin-left: 0;
  }
`;

const ArrowIndicator: React.FC<Props> = ({
  direction = 'right',
  size = 14,
  color = 'currentColor',
  className,
}) => {
  const rotation = rotationMap[direction];
  return <Root className={className} $size={size} $color={color} $rotation={rotation} />;
};

export default ArrowIndicator;
