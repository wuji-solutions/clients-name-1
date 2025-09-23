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
  tileStates? : string[];
  boardColorReferences?: Map<string, string | undefined>;
  storedPlayerIndex?: string;
  positionUpdateBlock?: boolean;
  observerVersion?: boolean;
}

function createCheckerboardImage(size = 8): HTMLImageElement {
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);

  // Convert canvas to image
  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}

const mobile = isMobileView();
const STACK_OFFSET = mobile ? 3.5 : 13;
const PAWN_POSITION_OFFSET = 0.7;
const PERSPECTIVE = 0.35;
const MIN_SCALE = 0.6;
const MAX_SCALE = 1.2;

const GameBoard: React.FC<Props> = ({
  positions,
  width,
  height,
  numFields,
  storedPlayerIndex = null,
  positionUpdateBlock = false,
  observerVersion = false,
  boardColorReferences,
  tileStates = [],
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const pawnReferences = useRef<Map<string, Konva.Group>>(new Map());
  const tweensRef = useRef<Map<string, any>>(new Map());
  const pzRef = useRef<ReturnType<typeof panzoom> | null>(null);
  const previousPositions = usePrevious(positions);
  const [playerIndex, setPlayerIndex] = useState<string | null>(storedPlayerIndex);

  useEffect(() => {
    if (!storedPlayerIndex && !observerVersion) service.getPlayerId().then((response) => setPlayerIndex(response.data));
  }, []);

  const centerX = width / 2;
  const centerY = height / 2;
  const BOARD_X_RADIUS = width / 2.02;
  const BOARD_Y_RADIUS = BOARD_X_RADIUS / 3.5;
  const Y_OFFSET = mobile ? 10 : 45;

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      const container = stage.container();

      const pz = panzoom(container, {
        bounds: true,
        boundsPadding: 0.2,
        minZoom: observerVersion ? 0.5 : 1,
        initialX: centerX,
        initialY: centerY,
        initialZoom: observerVersion ? 0.9 :  mobile ? 1.6 : 1,
        maxZoom: mobile ? 3 : 2.2,
        autocenter: true,
        enableTextSelection: false,
        smoothScroll: false,
        beforeMouseDown: () => true,
      });

      pz.pause();

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

    const radiusX = STACK_OFFSET * 3.5 * (1 / fieldPosition.scale); // Change pawn spacing based on device width
    const radiusY = STACK_OFFSET * 1.1 * (1 / fieldPosition.scale); // As above

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

  const findClosestFieldIndex = (node: Konva.Node) => {
    try {
      const pos = node.getAbsolutePosition();
      let min = Infinity;
      let best = -1;
      for (let i = 0; i < fieldCoordinates.length; i++) {
        const coords = fieldCoordinates[i];
        const pawnPos = getPawnPositionInField(coords, centerX, centerY);
        const dx = pawnPos.x - pos.x;
        const dy = pawnPos.y - pos.y;
        const d = dx * dx + dy * dy;
        if (d < min) {
          min = d;
          best = i;
        }
      }
      return best;
    } catch (e) {
      return -1;
    }
  };

  useEffect(() => {
    if (!fieldCoordinates.length || positionUpdateBlock) return;

    // Stop and cleanup existing tween for a pawn
    const stopTweenIfExists = (pawnId: string) => {
      const t = tweensRef.current.get(pawnId);
      if (t && typeof t.stop === 'function') {
        try {
          t.stop();
        } catch (e) {}
      }
      tweensRef.current.delete(pawnId);
    };

    // If there's no previousPositions, snap pawns into place
    if (!previousPositions) {
      positions.forEach((field, fieldIndex) => {
        field.forEach((pawnData, stackIndex) => {
          const node = pawnReferences.current.get(pawnData.index);
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

    const prevMap = new Map<
      string,
      { fieldIndex: number; stackIndex: number; totalInStack: number }
    >();
    previousPositions.forEach((field, fieldIndex) => {
      field.forEach((pawn, stepIndex) =>
        prevMap.set(pawn.index, {
          fieldIndex: fieldIndex,
          stackIndex: stepIndex,
          totalInStack: field.length,
        })
      );
    });

    const currMap = new Map<
      string,
      { fieldIndex: number; stackIndex: number; totalInStack: number }
    >();
    positions.forEach((field, fieldIndex) => {
      field.forEach((pawn, stepIndex) =>
        currMap.set(pawn.index, {
          fieldIndex: fieldIndex,
          stackIndex: stepIndex,
          totalInStack: field.length,
        })
      );
    });

    previousPositions.forEach((field) => {
      field.forEach((pawnData) => {
        if (!currMap.has(pawnData.index)) {
          const node = pawnReferences.current.get(pawnData.index);
          if (!node) return;
          stopTweenIfExists(pawnData.index);
          const promise = new Promise<void>((resolve) => {
            const tween = node.to({
              opacity: 0,
              scaleX: 0,
              scaleY: 0,
              duration: 0.2,
              onFinish: () => {
                resolve();
              },
            });
            tweensRef.current.set(pawnData.index, tween);
          });
          promise.then(() => {
            stopTweenIfExists(pawnData.index);
          });
        }
      });
    });

    const animationPromises: Promise<void>[] = [];

    positions.forEach((field, toIndex) => {
      field.forEach((pawnData, toStackIndex) => {
        const pawnId = pawnData.index;
        const node = pawnReferences.current.get(pawnId);
        if (!node) return;

        const prev = prevMap.get(pawnId);

        // If pawn is brand new, snap into place
        if (!prev) {
          // but if it's currently animating, stop that animation first
          stopTweenIfExists(pawnId);

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

        let fromIndex = prev.fieldIndex;
        let fromStackIndex = prev.stackIndex;

        if (tweensRef.current.has(pawnId)) {
          const guessed = findClosestFieldIndex(node);
          if (guessed !== -1) fromIndex = guessed;
        }

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

        // If pawn stays in same field, just animate to new stacked position
        if (fromIndex === toIndex) {
          const coords = fieldCoordinates[toIndex];
          if (!coords) return;

          stopTweenIfExists(pawnId);

          const stackedPos = getStackedPosition(
            coords,
            toStackIndex,
            field.length,
            centerX,
            centerY
          );
          const p = new Promise<void>((resolve) => {
            const tween = node.to({
              x: stackedPos.x,
              y: stackedPos.y,
              scaleX: stackedPos.scale,
              scaleY: stackedPos.scale,
              duration: 0.2,
              easing: Konva.Easings.EaseOut,
              onUpdate: () => {
                smoothCenterOnNode(node, pawnId);
              },
              onFinish: () => resolve(),
            });
            tweensRef.current.set(pawnId, tween);
          });

          animationPromises.push(p);
          return;
        }

        // Animate along the path from fromIndex to toIndex
        const startCoords = fieldCoordinates[fromIndex];
        const endCoords = fieldCoordinates[toIndex];
        if (!startCoords || !endCoords) return;

        stopTweenIfExists(pawnId);

        const pathPromise = new Promise<void>((resolve) => {
          const prevField = previousPositions[fromIndex] || [];
          const startStackedPos = getStackedPosition(
            startCoords,
            fromStackIndex,
            prevField.length || 1,
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
                const tween = node.to({
                  x: stepPosition.x,
                  y: stepPosition.y,
                  scaleX: stepPosition.scale,
                  scaleY: stepPosition.scale,
                  duration: 0.25,
                  easing: Konva.Easings.EaseInOut,
                  onUpdate: () => {
                    smoothCenterOnNode(node, pawnId);
                  },
                  onFinish: () => {
                    stepResolve();
                  },
                });

                tweensRef.current.set(pawnId, tween);
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
              const tween = node.to({
                x: endStackedPos.x,
                y: endStackedPos.y,
                scaleX: endStackedPos.scale,
                scaleY: endStackedPos.scale,
                duration: 0.25,
                easing: Konva.Easings.EaseInOut,
                onUpdate: () => {
                  smoothCenterOnNode(node, pawnId);
                },
                onFinish: () => finalResolve(),
              });

              tweensRef.current.set(pawnId, tween);
            });

            // Finish animation for this pawn
            tweensRef.current.delete(pawnId);
            resolve();
          };

          void animatePath();
        });

        animationPromises.push(pathPromise);
      });
    });

    // After all started animations settle, batch draw
    Promise.all(animationPromises).then(() => {
      const firstNode = pawnReferences.current.values().next().value;
      if (firstNode) {
        firstNode.getLayer()?.batchDraw();
      }
    });

    return () => {
      // Dont stop tweens here
    };
  }, [positions, previousPositions, fieldCoordinates]);

  const smoothCenterOnNode = (node: Konva.Node, index: string, lerp = 0.2) => {
    if (index != playerIndex) return;
    if (!pzRef.current || !stageRef.current) return;

    const rect = stageRef.current.container().getBoundingClientRect();
    const viewX = rect.width / (mobile ? 3.5 : 2.5);
    const viewY = rect.height / (mobile ? 3.5 : 2.5);

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
          strokeWidth={mobile ? 2 : 4}
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

            const checkerboard = i === 0 ? createCheckerboardImage(mobile ? 8 : 18) : undefined;

            return (
              <Path
                key={i}
                data={pathData}
                fill={i === 0 ? undefined : (boardColorReferences ? boardColorReferences.get(tileStates[i]) : '#00ffff')}
                fillPatternImage={checkerboard}
                fillPatternRepeat="repeat"
                fillPatternScale={{ x: 1, y: 0.92 }}
                fillPatternRotation={10}
                stroke="rgba(255, 255, 255, 1)"
                strokeWidth={1}
                listening={false}
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
                key={pawnData.index}
                id={pawnData.index}
                x={0}
                y={0}
                scale={1}
                color={colorPalette[parseInt(pawnData.index) % colorPalette.length]}
                isCurrentPlayer={pawnData.index == playerIndex}
                nodeRef={(node) => {
                  if (node) {
                    pawnReferences.current.set(pawnData.index, node);
                  } else {
                    pawnReferences.current.delete(pawnData.index);
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
