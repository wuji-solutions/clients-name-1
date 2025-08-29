import React from "react";
import Konva from 'konva';
import { Group, Circle, RegularPolygon } from "react-konva";
import { darkenColor, isMobileView } from "../common/utils";

interface PawnProps {
  id: string;
  x: number;
  y: number;
  scale: number;
  color: string;
  isCurrentPlayer?: boolean;
  nodeRef: (node: Konva.Group | null) => void;
}

const Pawn: React.FC<PawnProps> = ({ id, x, y, scale, color, isCurrentPlayer, nodeRef }) => {
  const pawnHeight = ( isMobileView() ? 32 : 50) * scale;
  const pawnWidth = ( isMobileView() ? 18 : 28) * scale;

  return (
    <Group
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
      ref={nodeRef}
      listening={false}
    >
      <Circle
        x={0}
        y={-pawnHeight * ( isMobileView() ? 0.2 : 0.01)}
        radius={pawnWidth / 2}
        fillRadialGradientStartPoint={{ x: -pawnWidth * 0.2, y: -pawnWidth * 0.2 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndRadius={pawnWidth}
        fillRadialGradientColorStops={[0, color, 0.9, darkenColor(color, 0.5)]}
        shadowColor="black"
        shadowBlur={2}
        shadowOffset={{ x: 3, y: 3 }}
        shadowOpacity={0.3}
      />

      <Circle
        x={0}
        y={-pawnHeight * (0.4)}
        radius={pawnWidth / 4}
        fillRadialGradientStartPoint={{ x: -pawnWidth * 0.1, y: -pawnWidth * 0.1 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndRadius={pawnWidth / 2}
        fillRadialGradientColorStops={[0, color, 0.9, darkenColor(color, 0.5)]}
        shadowColor="black"
        shadowBlur={2}
        shadowOffset={{ x: 2, y: 2 }}
        shadowOpacity={0.3}
      />

      {isCurrentPlayer && (
        <RegularPolygon
          x={0}
          y={-pawnHeight*1.05}
          sides={3}
          radius={12}
          fill="#3d3d3d"
          stroke="#2b2b2b"
          strokeWidth={1}
          rotation={180}
          shadowBlur={1}
        />
      )}
    </Group>
  );
};

export default Pawn;
