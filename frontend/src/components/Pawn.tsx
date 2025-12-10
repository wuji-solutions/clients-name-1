import { useRef, useEffect, useMemo } from 'react';
import Konva from 'konva';
import { Group, Circle, RegularPolygon, Text } from 'react-konva';
import { darkenColor, isMobileView } from '../common/utils';
import theme from '../common/theme';

const rankingPositions = new Set(['1', '2', '3']);

interface PawnProps {
  id: string;
  x: number;
  y: number;
  scale: number;
  color: string;
  isCurrentPlayer?: boolean;
  nodeRef: (node: Konva.Group | null) => void;
  position?: string;
}

const mobile = isMobileView();

const playIndicatorAnimation = ({ playerRefValue }: { playerRefValue: any }) => {
  const tween = new Konva.Tween({
    node: playerRefValue.current,
    duration: 0.3,
    y: playerRefValue.current.y() - (mobile ? 5 : 10),
    easing: Konva.Easings.EaseInOut,
    onFinish: () => {
      new Konva.Tween({
        node: playerRefValue.current,
        duration: 0.3,
        y: playerRefValue.current.y() + (mobile ? 5 : 10),
        easing: Konva.Easings.EaseInOut,
      }).play();
    },
  });
  tween.play();
};

const Pawn = ({ id, x, y, scale, color, isCurrentPlayer, nodeRef, position }: PawnProps) => {
  const pawnHeight = (mobile ? 22 : 80) * scale;
  const pawnWidth = (mobile ? 12 : 44) * scale;
  const playerIndicatorRef = useRef<any | null>(null);

  useEffect(() => {
    if (mobile) return;
    const interval = setInterval(() => {
      if (playerIndicatorRef.current) {
        playIndicatorAnimation({ playerRefValue: playerIndicatorRef });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [playerIndicatorRef]);

  const getRankingColors = (position: string | undefined) => {
    switch(position) {
      case '1':
        return {stroke: '#c29102', fill: '#dea602'}
      case '2':
        return {stroke: '#8f8e8d', fill: '#b3b2b1'}
      case '3':
        return {stroke: '#6b3601', fill: '#8a4a0a'}
      default:
        return {stroke: 'gray', fill: 'gray'}
    }
  }

  const colors = useMemo(() => getRankingColors(String(position)), [position]);

  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale} ref={nodeRef} listening={false}>
      <Group>
        {position && rankingPositions.has(String(position)) ? (
          <Group>
            <Circle
              radius={20}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={3}
              x={0}
              y={-80}
            />

            <Text
              text={String(position)}
              x={0}
              y={-80}
              fontSize={24}
              fill="white"
              shadowColor="black"
              shadowBlur={1}
              shadowOffset={{ x: 1, y: 1 }}
              shadowOpacity={0.7}
              align="center"
              verticalAlign="middle"
              offsetX={7}
              offsetY={11}
              fontStyle="bold"
            />
          </Group>
        ) : (
          <></>
        )}
        <Circle
          x={0}
          y={-pawnHeight * 0.01}
          radius={pawnWidth / 2}
          fillRadialGradientStartPoint={{ x: -pawnWidth * 0.2, y: -pawnWidth * 0.2 }}
          fillRadialGradientStartRadius={0}
          fillRadialGradientEndPoint={{ x: 0, y: 0 }}
          fillRadialGradientEndRadius={pawnWidth}
          fillRadialGradientColorStops={[0, color, 0.9, darkenColor(color, 0.5)]}
          shadowColor={darkenColor(color, 0.5)}
          shadowBlur={1}
          shadowOffset={mobile ? { x: 1, y: 1 } : { x: 2, y: 2 }}
          shadowOpacity={1}
        />
        {id && (
          <Text
            text={id.toString()}
            fontSize={pawnWidth / 2.3}
            fontStyle="bold"
            fill="white"
            align="center"
            verticalAlign="middle"
            offsetX={pawnWidth / 8}
            offsetY={pawnWidth / 4.3}
            shadowColor="black"
            shadowBlur={1}
            shadowOffset={{ x: 1, y: 1 }}
            shadowOpacity={0.7}
          />
        )}
      </Group>

      <Circle
        x={0}
        y={-pawnHeight * 0.4}
        radius={pawnWidth / 4}
        fillRadialGradientStartPoint={{ x: -pawnWidth * 0.1, y: -pawnWidth * 0.1 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndRadius={pawnWidth / 2}
        fillRadialGradientColorStops={[0, color, 0.9, darkenColor(color, 0.5)]}
        shadowColor={darkenColor(color, 0.5)}
        shadowBlur={1}
        shadowOffset={mobile ? { x: 1, y: 1 } : { x: 2, y: 2 }}
        shadowOpacity={1}
      />

      {isCurrentPlayer && (
        <RegularPolygon
          x={0}
          y={-pawnHeight * (mobile ? 1.05 : 0.85)}
          sides={3}
          radius={mobile ? 5 : 12}
          fill={theme.palette.main.accent}
          stroke="#fff"
          strokeWidth={1}
          rotation={180}
          shadowBlur={1}
          ref={playerIndicatorRef}
        />
      )}
    </Group>
  );
};

export default Pawn;
