import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Stage, Layer, Ellipse, Path, Group } from 'react-konva';
import Konva from 'konva';
import panzoom from 'panzoom';
import { BoardPositions, FieldCoordinate } from '../common/types';
import { usePrevious } from '../hooks/usePrevious';
import { colorPalette, isMobileView } from '../common/utils';
import Pawn from './Pawn';
import { service } from '../service/service';

interface Props {
  positions: BoardPositions;
  width: number;
  height: number;
  numFields: number;
  storedPlayerIndex?: string;
}

const STACK_OFFSET = isMobileView() ? 3.5 : 10;
const PAWN_POSITION_OFFSET = 0.70;
const PERSPECTIVE = 0.35;
const MIN_SCALE = 0.6;
const MAX_SCALE = 1.2;

const GameBoard: React.FC<Props> = ({ positions, width, height, numFields, storedPlayerIndex = '1' }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const pawnReferences = useRef<Map<string, Konva.Group>>(new Map());
  const animationInProgress = useRef<boolean>(false);
  const pzRef = useRef<ReturnType<typeof panzoom> | null>(null);
  const previousPositions = usePrevious(positions);
  const [playerIndex, setPlayerIndex] = useState<string | null>(storedPlayerIndex);

  useEffect(() => {
    if (!storedPlayerIndex) service.getPlayerId().then((response) => setPlayerIndex(response.data));
  }, []);

  const centerX = width / 2;
  const centerY = height / 2;
  const BOARD_X_RADIUS = width / 2.02;
  const BOARD_Y_RADIUS = BOARD_X_RADIUS / 3.5;
  const Y_OFFSET = isMobileView() ? 10 : 45;

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      const container = stage.container();

      const mobile = isMobileView();
      const pz = panzoom(container, {
        bounds: true,
        boundsPadding: 0.2,
        minZoom: 1,
        initialX: centerX,
        initialY: centerY,
        initialZoom: mobile ? 1.6 : 1,
        maxZoom: mobile ? 3 : 2.2,
        autocenter: true,
        enableTextSelection: false, 
        smoothScroll: false,
        beforeMouseDown: () => true,
      });

      pzRef.current = pz;

      return () => {
        pz.dispose();
        pzRef.current = null;
      };
    }
  }, []);

  const fieldCoordinates = useMemo<FieldCoordinate[]>(() => {
    const coords: FieldCoordinate[] = [];
    const radius_x = BOARD_X_RADIUS;
    const radius_y = BOARD_Y_RADIUS;

    for (let i = 0; i < numFields; i++) {
      const angle = ((2 * Math.PI) / numFields) * i;
      const sinAngle = Math.sin(angle);
      const depth = sinAngle + 1;
      const scale = MIN_SCALE + ((MAX_SCALE - MIN_SCALE) * depth) / 2;
      const y = centerY + (radius_y * sinAngle + PERSPECTIVE);
      coords.push({
        x: centerX + radius_x * Math.cos(angle),
        y,
        scale,
      });
    }

    return coords;
  }, [width, height, numFields]);

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
      scale: fieldCoords.scale,
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

    const radiusX = STACK_OFFSET * 2.5 * (1 / fieldPosition.scale); // CHANGE PAWN SPACING BASED TO DEVICE WIDTH
    const radiusY = STACK_OFFSET * 1.1 * (1 / fieldPosition.scale); // SAME AS ABOVE

    return {
      x: fieldPosition.x - Math.cos(angle) * radiusX,
      y: fieldPosition.y - Math.sin(angle) * radiusY,
      scale: fieldPosition.scale,
    };
  };

  const generateClockwisePathIndices = (
    fromIndex: number,
    toIndex: number,
    totalFields: number
  ) => {
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

          const stackedPos = getStackedPosition(
            endCoords,
            toStackIndex,
            field.length,
            centerX,
            centerY
          );
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

          const stackedPos = getStackedPosition(
            coords,
            toStackIndex,
            field.length,
            centerX,
            centerY
          );
          const promise = new Promise<void>((resolve) => {
            node.to({
              x: stackedPos.x,
              y: stackedPos.y,
              scaleX: stackedPos.scale,
              scaleY: stackedPos.scale,
              duration: 0.2,
              easing: Konva.Easings.EaseOut,
              onUpdate: () => {
                smoothCenterOnNode(node, pawnData.id);
              },
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
          const startStackedPos = getStackedPosition(
            startCoords,
            fromStackIndex,
            prevField.length,
            centerX,
            centerY
          );

          node.setAttrs({
            x: startStackedPos.x,
            y: startStackedPos.y,
            scaleX: startStackedPos.scale,
            scaleY: startStackedPos.scale,
            opacity: 1,
          });

          const stepIndices = generateClockwisePathIndices(fromIndex, toIndex, numFields);

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
                  onUpdate: () => {
                    smoothCenterOnNode(node, pawnData.id);
                  },
                  onFinish: stepResolve,
                });
              });
            }

            const endStackedPos = getStackedPosition(
              endCoords,
              toStackIndex,
              field.length,
              centerX,
              centerY
            );

            await new Promise<void>((finalResolve) => {
              node.to({
                x: endStackedPos.x,
                y: endStackedPos.y,
                scaleX: endStackedPos.scale,
                scaleY: endStackedPos.scale,
                duration: 0.25,
                easing: Konva.Easings.EaseInOut,
                onUpdate: () => {
                  smoothCenterOnNode(node, pawnData.id);
                },
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

  const smoothCenterOnNode = (node: Konva.Node, index: string, lerp = 0.2) => {
    if (index != playerIndex) return;
    if (!pzRef.current || !stageRef.current) return;
    const mobile = isMobileView()
  
    const rect = stageRef.current.container().getBoundingClientRect();
    const viewX = rect.width / ( mobile ? 3.5 : 2.5);
    const viewY = rect.height / ( mobile ? 3.5 : 2.5);
  
    const pawnPos = node.getAbsolutePosition();
  
    const transform = pzRef.current.getTransform();
  
    const targetX = viewX - pawnPos.x * transform.scale;
    const targetY = viewY - pawnPos.y * transform.scale;
  
    const newX = transform.x + (targetX - transform.x) * lerp;
    const newY = transform.y + (targetY - transform.y) * lerp;
  
    pzRef.current.moveTo(newX, newY);
  
    const scale = mobile ? 2 : 1.2;
    pzRef.current.zoomAbs(viewX, viewY, scale);
  };

  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer>
        <Ellipse
          x={centerX}
          y={centerY + Y_OFFSET}
          radiusX={BOARD_X_RADIUS}
          radiusY={BOARD_Y_RADIUS + 0.35}
          fillRadialGradientStartPoint={{ x: 0, y: -200 }}
          fillRadialGradientStartRadius={0}
          fillRadialGradientEndPoint={{ x: 0, y: 0 }}
          fillRadialGradientEndRadius={BOARD_Y_RADIUS - 50}
          stroke="white"
          strokeWidth={isMobileView() ? 2 : 4}
        />
        <Group
          clipFunc={(ctx) => {
            ctx.ellipse(
              centerX,
              centerY + Y_OFFSET,
              BOARD_X_RADIUS,
              BOARD_Y_RADIUS + 0.35,
              0,
              0,
              Math.PI * 2
            );
          }}
        >
          {fieldCoordinates.map((coords, i) => {
            const INNER_X_RADIUS = BOARD_X_RADIUS * 0.45;
            const INNER_Y_RADIUS = (BOARD_Y_RADIUS + 0.35) * 0.45;

            const angle = ((2 * Math.PI) / numFields) * i;
            const angleWidth = (2 * Math.PI) / numFields;

            const startAngle = angle - angleWidth / 2;
            const endAngle = angle + angleWidth / 2;

            const OUTER_X_RADIUS = BOARD_X_RADIUS * 1.4;
            const OUTER_Y_RADIUS = (BOARD_Y_RADIUS + 0.35) * 1.4;

            const outerStartX = centerX + OUTER_X_RADIUS * Math.cos(startAngle);
            const outerStartY = centerY + OUTER_Y_RADIUS * Math.sin(startAngle);
            const outerEndX = centerX + OUTER_X_RADIUS * Math.cos(endAngle);
            const outerEndY = centerY + OUTER_Y_RADIUS * Math.sin(endAngle);

            const innerStartX = centerX + INNER_X_RADIUS * Math.cos(startAngle);
            const innerStartY = centerY + INNER_Y_RADIUS * Math.sin(startAngle);
            const innerEndX = centerX + INNER_X_RADIUS * Math.cos(endAngle);
            const innerEndY = centerY + INNER_Y_RADIUS * Math.sin(endAngle);

            const largeArcFlag = angleWidth > Math.PI ? 1 : 0;
            const sweepOuter = 1;
            const sweepInner = 0;

            const pathData = `
            M ${outerStartX} ${outerStartY}
            A ${BOARD_X_RADIUS} ${BOARD_Y_RADIUS + 0.35} 0 ${largeArcFlag} ${sweepOuter} ${outerEndX} ${outerEndY}
            L ${innerEndX} ${innerEndY}
            A ${INNER_X_RADIUS} ${INNER_Y_RADIUS} 0 ${largeArcFlag} ${sweepInner} ${innerStartX} ${innerStartY}
            Z
          `;

            return (
              <Path
                key={i}
                data={pathData}
                // fill="rgba(0, 210, 255, 1)"
                stroke="rgba(255, 255, 255, 1)"
                strokeWidth={1}
                listening={false}
                fillLinearGradientColorStops={[0, 'rgba(0, 0, 0, 1)', 1, 'rgba(255, 255, 255, 1)']}
                fillPatternX={20}
                fillPatternRepeat='repeat'
              />
            );
          })}
        </Group>
      </Layer>

      <Layer>
        {positions.flatMap((field) =>
          field.map((pawnData) => {
            return (
              <Pawn
                key={pawnData.id}
                id={pawnData.id}
                x={0}
                y={0}
                scale={1}
                color={colorPalette[parseInt(pawnData.id) % colorPalette.length]}
                isCurrentPlayer={pawnData.id == playerIndex}
                nodeRef={(node) => {
                  if (node) {
                    pawnReferences.current.set(pawnData.id, node);
                  } else {
                    pawnReferences.current.delete(pawnData.id);
                  }
                }}
              />
            );
          })
        )}
      </Layer>
    </Stage>
  );
};

export default GameBoard;
