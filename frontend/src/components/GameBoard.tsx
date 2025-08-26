import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Ellipse, Circle, Wedge, Line, Path } from 'react-konva';
import Konva from 'konva';
import { BoardPositions, FieldCoordinate } from '../common/types';
import { usePrevious } from '../hooks/usePrevious';
import { BOARD_X_RADIUS, BOARD_Y_RADIUS } from '../common/config';

interface Props {
  positions: BoardPositions;
  fieldCoordinates: FieldCoordinate[];
}

const PAWN_RADIUS = 16;
const STACK_OFFSET = 12;
const PAWN_POSITION_OFFSET = 0.7;

const GameBoard: React.FC<Props> = ({ positions, fieldCoordinates }) => {
  const pawnReferences = useRef<Map<string, Konva.Circle>>(new Map());
  const previousPositions = usePrevious(positions);
  const animationInProgress = useRef<boolean>(false);

  const getPawnPositionInField = (
    fieldCoords: FieldCoordinate, 
    centerX: number, 
    centerY: number
  ) => {
    const dirX = fieldCoords.x - centerX;
    const dirY = fieldCoords.y - centerY;
    
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    const normalizedX = dirX / length;
    const normalizedY = dirY / length;
    
    return {
      x: centerX + normalizedX * length * PAWN_POSITION_OFFSET,
      y: centerY + normalizedY * length * PAWN_POSITION_OFFSET,
      scale: fieldCoords.scale
    };
  };

  const getStackedPosition = (
    baseCoords: FieldCoordinate,
    stackIndex: number,
    totalInStack: number,
    centerX: number,
    centerY: number
  ) => {
    const fieldPosition = getPawnPositionInField(baseCoords, centerX, centerY);
    
    if (totalInStack === 1) return fieldPosition;

    const angle = (stackIndex * 2 * Math.PI) / totalInStack;
    const stackRadius = STACK_OFFSET * (1 / fieldPosition.scale);

    return {
      x: fieldPosition.x + Math.cos(angle) * stackRadius,
      y: fieldPosition.y + Math.sin(angle) * stackRadius,
      scale: fieldPosition.scale
    };
  };

  const generateClockwisePathIndices = (fromIndex: number, toIndex: number, totalFields: number) => {
    const stepIndices: number[] = [];
    
    if (fromIndex === toIndex) {
      return stepIndices;
    }
    
    if (toIndex > fromIndex) {
      for (let i = fromIndex + 1; i < toIndex; i++) {
        stepIndices.push(i);
      }
    } else {
      for (let i = fromIndex + 1; i < totalFields; i++) {
        stepIndices.push(i);
      }
      for (let i = 0; i < toIndex; i++) {
        stepIndices.push(i);
      }
    }
    
    return stepIndices;
  };

  useEffect(() => {
    if (!fieldCoordinates.length || animationInProgress.current) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const totalFields = fieldCoordinates.length;

    if (!previousPositions) {
      positions.forEach((field, fieldIndex) => {
        field.forEach((pawnData, stackIndex) => {
          const node = pawnReferences.current.get(pawnData.id);
          const coords = fieldCoordinates[fieldIndex];
          if (!node || !coords) return;

          const stackedPos = getStackedPosition(coords, stackIndex, field.length, centerX, centerY);
          node.setAttrs({
            x: stackedPos.x,
            y: stackedPos.y,
            scaleX: stackedPos.scale,
            scaleY: stackedPos.scale,
            opacity: 1,
          });
        });
      });

      const firstNode = pawnReferences.current.values().next().value;
      if (firstNode) {
        firstNode.getLayer()?.batchDraw();
      }
      return;
    }

    animationInProgress.current = true;

    const animationPromises: Promise<void>[] = [];
    const currentPawnIds = new Set<string>();

    const removedPawns: string[] = [];
    previousPositions.forEach((field) => {
      field.forEach((pawnData) => {
        const stillExists = positions.some((currentField) =>
          currentField.some((currentPawn) => currentPawn.id === pawnData.id)
        );
        if (!stillExists) {
          removedPawns.push(pawnData.id);
        }
      });
    });

    removedPawns.forEach((pawnId) => {
      const node = pawnReferences.current.get(pawnId);
      if (node) {
        const promise = new Promise<void>((resolve) => {
          node.to({
            opacity: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 0.2,
            onFinish: resolve,
          });
        });
        animationPromises.push(promise);
      }
    });

    positions.forEach((field, toIndex) => {
      field.forEach((pawnData, toStackIndex) => {
        currentPawnIds.add(pawnData.id);
        const node = pawnReferences.current.get(pawnData.id);
        if (!node) return;

        let fromIndex = -1;
        let fromStackIndex = -1;

        previousPositions.forEach((prevField, prevIndex) => {
          const pawnIndex = prevField.findIndex((p) => p.id === pawnData.id);
          if (pawnIndex !== -1) {
            fromIndex = prevIndex;
            fromStackIndex = pawnIndex;
          }
        });

        if (fromIndex === -1) {
          const endCoords = fieldCoordinates[toIndex];
          if (!endCoords) return;

          const stackedPos = getStackedPosition(endCoords, toStackIndex, field.length, centerX, centerY);
          node.setAttrs({
            x: stackedPos.x,
            y: stackedPos.y,
            scaleX: stackedPos.scale,
            scaleY: stackedPos.scale,
            opacity: 1,
          });
          return;
        }

        if (fromIndex === toIndex) {
          const coords = fieldCoordinates[toIndex];
          if (!coords) return;

          const stackedPos = getStackedPosition(coords, toStackIndex, field.length, centerX, centerY);
          const promise = new Promise<void>((resolve) => {
            node.to({
              x: stackedPos.x,
              y: stackedPos.y,
              scaleX: stackedPos.scale,
              scaleY: stackedPos.scale,
              duration: 0.2,
              easing: Konva.Easings.EaseOut,
              onFinish: resolve,
            });
          });
          animationPromises.push(promise);
          return;
        }

        const startCoords = fieldCoordinates[fromIndex];
        const endCoords = fieldCoordinates[toIndex];
        if (!startCoords || !endCoords) return;

        const promise = new Promise<void>((resolve) => {
          const prevField = previousPositions[fromIndex];
          const startStackedPos = getStackedPosition(startCoords, fromStackIndex, prevField.length, centerX, centerY);

          node.setAttrs({
            x: startStackedPos.x,
            y: startStackedPos.y,
            scaleX: startStackedPos.scale,
            scaleY: startStackedPos.scale,
            opacity: 1,
          });

          const stepIndices = generateClockwisePathIndices(fromIndex, toIndex, totalFields);

          const animatePath = async () => {
            for (const stepIndex of stepIndices) {
              const stepCoords = fieldCoordinates[stepIndex];
              if (!stepCoords) continue;
              
              const stepPosition = getPawnPositionInField(stepCoords, centerX, centerY);

              await new Promise<void>((stepResolve) => {
                node.to({
                  x: stepPosition.x,
                  y: stepPosition.y,
                  scaleX: stepPosition.scale,
                  scaleY: stepPosition.scale,
                  duration: 0.25,
                  easing: Konva.Easings.EaseInOut,
                  onFinish: stepResolve,
                });
              });
            }

            const endStackedPos = getStackedPosition(endCoords, toStackIndex, field.length, centerX, centerY);

            await new Promise<void>((finalResolve) => {
              node.to({
                x: endStackedPos.x,
                y: endStackedPos.y,
                scaleX: endStackedPos.scale,
                scaleY: endStackedPos.scale,
                duration: 0.25,
                easing: Konva.Easings.EaseInOut,
                onFinish: finalResolve,
              });
            });

            resolve();
          };

          void animatePath();
        });

        animationPromises.push(promise);
      });
    });

    Promise.all(animationPromises).then(() => {
      const firstNode = pawnReferences.current.values().next().value;
      if (firstNode) {
        firstNode.getLayer()?.batchDraw();
      }
      animationInProgress.current = false;
    });
  }, [positions, previousPositions, fieldCoordinates]);

  const numFields = fieldCoordinates.length;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Ellipse
          x={centerX}
          y={centerY}
          radiusX={BOARD_X_RADIUS}
          radiusY={BOARD_Y_RADIUS + 0.35}
          fillRadialGradientStartPoint={{ x: 0, y: -200 }}
          fillRadialGradientStartRadius={0}
          fillRadialGradientEndPoint={{ x: 0, y: 0 }}
          fillRadialGradientEndRadius={BOARD_Y_RADIUS - 50}
          stroke="white"
          strokeWidth={4}
        />

        {fieldCoordinates.map((coords, i) => {
          const angle = ((2 * Math.PI) / numFields) * i;
          const angleWidth = (2 * Math.PI) / numFields;
          
          const startAngle = angle - angleWidth / 2;
          const endAngle = angle + angleWidth / 2;
          
          const startX = centerX + BOARD_X_RADIUS * Math.cos(startAngle);
          const startY = centerY + (BOARD_Y_RADIUS + 0.35) * Math.sin(startAngle);
          const endX = centerX + BOARD_X_RADIUS * Math.cos(endAngle);
          const endY = centerY + (BOARD_Y_RADIUS + 0.35) * Math.sin(endAngle);
          
          const pathData = `
            M ${centerX} ${centerY}
            L ${startX} ${startY}
            A ${BOARD_X_RADIUS} ${BOARD_Y_RADIUS + 0.35} 0 0 1 ${endX} ${endY}
            Z
          `;

          return (
            <Path
              key={i}
              data={pathData}
              fill="rgba(0, 210, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth={1}
              listening={false}
            />
          );
        })}
      </Layer>

      <Layer>
        {positions.flatMap((field) =>
          field.map((pawnData) => (
            <Circle
              key={pawnData.id}
              radius={PAWN_RADIUS}
              fill={pawnData.color}
              stroke="black"
              strokeWidth={2}
              shadowBlur={5}
              opacity={0}
              ref={(node) => {
                if (node) {
                  pawnReferences.current.set(pawnData.id, node);
                } else {
                  pawnReferences.current.delete(pawnData.id);
                }
              }}
            />
          ))
        )}
      </Layer>
    </Stage>
  );
};

export default GameBoard;