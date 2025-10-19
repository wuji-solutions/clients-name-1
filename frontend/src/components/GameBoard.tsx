import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Stage, Layer, Ellipse, Path, Group } from 'react-konva';
import Konva from 'konva';
import panzoom from 'panzoom';
import { BoardPositions } from '../common/types';
import { usePrevious } from '../hooks/usePrevious';
import { colorPalette, isMobileView } from '../common/utils';
import Pawn from './Pawn';
import { service } from '../service/service';

import {
  createCheckerboardImage,
  computeFieldCoordinates,
} from './gameBoardUtils';

import { usePawnAnimations } from './usePawnAnimations';
import theme from '../common/theme';

interface Props {
  positions: BoardPositions;
  width: number;
  height: number;
  numFields: number;
  tileStates?: string[];
  boardColorReferences?: Map<string, string | undefined>;
  storedPlayerIndex?: string | null;
  positionUpdateBlock?: boolean;
  observerVersion?: boolean;
}

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
  const stageRef = useRef<Konva.Stage | null>(null);
  const pawnReferences = useRef<Map<string, Konva.Group>>(new Map());
  const tweensRef = useRef<Map<string, any>>(new Map());
  const pzRef = useRef<any | null>(null);
  const panzoomOptionsRef = useRef<any>(null);
  const previousPositions = usePrevious(positions);
  const [playerIndex, setPlayerIndex] = useState<string | null>(storedPlayerIndex);

  const mobile = isMobileView();

  useEffect(() => {
    if (!storedPlayerIndex && !observerVersion)
      service.getPlayerId().then((response) => setPlayerIndex(response.data));
  }, []);

  const centerX = width / 2;
  const centerY = height / 2;
  const BOARD_X_RADIUS = width / 2.02;
  const BOARD_Y_RADIUS = BOARD_X_RADIUS / 3.5;
  const Y_OFFSET = mobile ? 10 : 45;

  const getInitialZoomValue = () => {
    if (observerVersion) return 0.9
    if (mobile) {
      return 1.6
    } else {
      return 1
    }
  }

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      const container = stage.container();

      const panOptions = {
        bounds: true,
        boundsPaddning: 0.2,
        minZoom: observerVersion ? 0.5 : 1.5,
        initialX: observerVersion && !mobile ? centerX + 40 : centerX,
        initialY: centerY,
        initialZoom: getInitialZoomValue(),
        maxZoom: mobile ? 3 : 2.8,
        autocenter: true,
        enableTextSelection: false,
        smoothScroll: false,
        beforeMouseDown: () => true,
      };

      
      const pz = panzoom(container, panOptions);
      panzoomOptionsRef.current = panOptions;
      pz.pause();

      pzRef.current = pz;

      return () => {
        try {
          pz.dispose();
        } catch {
          // ignore
        }
        pzRef.current = null;
      };
    }
  }, []);

  // compute field coords
  const fieldCoordinates = useMemo(() => {
    return computeFieldCoordinates(numFields, BOARD_X_RADIUS, BOARD_Y_RADIUS, centerX, centerY);
  }, [width, height, numFields]);

  usePawnAnimations({
    positions,
    previousPositions,
    fieldCoordinates,
    pawnReferences,
    tweensRef,
    centerX,
    centerY,
    numFields,
    positionUpdateBlock,
    pzRef,
    panzoomOptionsRef,
    stageRef,
    playerIndex,
    mobile,
  });

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
          stroke={theme.palette.main.accent}
          strokeWidth={mobile ? 4 : 5}
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

            const checkerboardImage = createCheckerboardImage(mobile ? 8 : 18)

            const checkerboard = i === 0 ? checkerboardImage : undefined;

            const colorReferences = boardColorReferences?.get(tileStates[i])

            return (
              <Path
                key={`path_data_${i}`}
                data={pathData}
                fill={i === 0 ? undefined : colorReferences}
                fillPatternImage={checkerboard}
                fillPatternRepeat="repeat"
                fillPatternScale={{ x: 1, y: 0.92 }}
                fillPatternRotation={10}
                stroke={theme.palette.main.accent}
                strokeWidth={mobile ? 2 : 5}
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
                id={observerVersion ? pawnData.index : ''}
                x={0}
                y={0}
                scale={1}
                color={colorPalette[Number.parseInt(pawnData.index) % colorPalette.length]}
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
