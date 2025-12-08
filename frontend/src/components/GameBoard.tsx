import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Stage, Layer, Ellipse, Path, Group } from 'react-konva';
import Konva from 'konva';
import panzoom from 'panzoom';
import { BoardPositions, PlayerState } from '../common/types';
import { usePrevious } from '../hooks/usePrevious';
import { colorPalette, isMobileView } from '../common/utils';
import Pawn from './Pawn';
import { service } from '../service/service';

import { createCheckerboardImage, computeFieldCoordinates } from './gameBoardUtils';

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
  ranking?: any[];
}

// Memoized Path component to prevent re-renders
const MemoizedPath = React.memo(({ 
  pathData, 
  fill, 
  fillPatternImage, 
  stroke, 
  strokeWidth, 
  mobile 
}: any) => (
  <Path
    data={pathData}
    fill={fill}
    fillPatternImage={fillPatternImage}
    fillPatternRepeat="repeat"
    fillPatternScale={{ x: 1, y: 0.92 }}
    fillPatternRotation={10}
    stroke={stroke}
    strokeWidth={strokeWidth}
    listening={false}
    perfectDrawEnabled={false}
    shadowForStrokeEnabled={false}
  />
));

function GameBoard({
  positions,
  width,
  height,
  numFields,
  storedPlayerIndex = null,
  positionUpdateBlock = false,
  observerVersion = false,
  boardColorReferences,
  tileStates = [],
  ranking = [],
}: Props) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const pawnReferences = useRef<Map<string, Konva.Group>>(new Map());
  const tweensRef = useRef<Map<string, any>>(new Map());
  const pzRef = useRef<any | null>(null);
  const panzoomOptionsRef = useRef<any>(null);
  const previousPositions = usePrevious(positions);
  const [playerIndex, setPlayerIndex] = useState<string | null>(storedPlayerIndex);
  const [rankingMap, setRankingMap] = useState<Map<string, any>>(new Map());
  const [checkerboardLoaded, setCheckerboardLoaded] = useState(false);

  const mobile = isMobileView();

  useEffect(() => {
    const result = new Map();
    for (const entry of ranking) {
      result.set(entry.nickname, entry);
    }
    setRankingMap(result);
  }, [ranking]);

  useEffect(() => {
    if (!storedPlayerIndex && !observerVersion)
      service.getPlayerId().then((response) => setPlayerIndex(response.data));
  }, []);

  const centerX = width / 2;
  const centerY = height / 2;
  const BOARD_X_RADIUS = width / 2.02;
  const BOARD_Y_RADIUS = BOARD_X_RADIUS / 3.5;
  const Y_OFFSET = mobile ? 10 : 45;

  const getInitialZoomValue = useCallback(() => {
    if (observerVersion) return 0.9;
    if (mobile) {
      return 1.6;
    } else {
      return 1;
    }
  }, [observerVersion, mobile]);

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

  // compute field coords - only recalculate when dimensions change
  const fieldCoordinates = useMemo(() => {
    return computeFieldCoordinates(numFields, BOARD_X_RADIUS, BOARD_Y_RADIUS, centerX, centerY);
  }, [width, height, numFields]);

  // Memoize checkerboard image creation
  const checkerboardImage = useMemo(() => {
    const img = createCheckerboardImage(mobile ? 8 : 18);
    img.onload = () => setCheckerboardLoaded(true);
    return img;
  }, [mobile]);

  // Pre-calculate all path data to avoid recalculation on every render
  const boardPaths = useMemo(() => {
    const paths = [];
    const INNER_X_RADIUS = BOARD_X_RADIUS * 0.45;
    const INNER_Y_RADIUS = (BOARD_Y_RADIUS + 0.35) * 0.45;
    const OUTER_X_RADIUS = BOARD_X_RADIUS * 1.4;
    const OUTER_Y_RADIUS = (BOARD_Y_RADIUS + 0.35) * 1.4;

    for (let i = 0; i < numFields; i++) {
      const angle = ((2 * Math.PI) / numFields) * i;
      const angleWidth = (2 * Math.PI) / numFields;
      const startAngle = angle - angleWidth / 2;
      const endAngle = angle + angleWidth / 2;

      const outerStartX = centerX + OUTER_X_RADIUS * Math.cos(startAngle);
      const outerStartY = centerY + OUTER_Y_RADIUS * Math.sin(startAngle);
      const outerEndX = centerX + OUTER_X_RADIUS * Math.cos(endAngle);
      const outerEndY = centerY + OUTER_Y_RADIUS * Math.sin(endAngle);

      const innerStartX = centerX + INNER_X_RADIUS * Math.cos(startAngle);
      const innerStartY = centerY + INNER_Y_RADIUS * Math.sin(startAngle);
      const innerEndX = centerX + INNER_X_RADIUS * Math.cos(endAngle);
      const innerEndY = centerY + INNER_Y_RADIUS * Math.sin(endAngle);

      const largeArcFlag = angleWidth > Math.PI ? 1 : 0;

      const pathData = `
        M ${outerStartX} ${outerStartY}
        A ${BOARD_X_RADIUS} ${BOARD_Y_RADIUS + 0.35} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}
        L ${innerEndX} ${innerEndY}
        A ${INNER_X_RADIUS} ${INNER_Y_RADIUS} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
        Z
      `;

      paths.push({
        key: `path_${i}`,
        pathData,
        isStart: i === 0,
        colorRef: boardColorReferences?.get(tileStates[i]),
      });
    }

    return paths;
  }, [numFields, centerX, centerY, BOARD_X_RADIUS, BOARD_Y_RADIUS, boardColorReferences, tileStates]);

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

  // Callback for pawn node refs
  const handlePawnNodeRef = useCallback((index: string, node: Konva.Group | null) => {
    if (node) {
      pawnReferences.current.set(index, node);
    } else {
      pawnReferences.current.delete(index);
    }
  }, []);

  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer listening={false}>
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
          perfectDrawEnabled={false}
          shadowForStrokeEnabled={false}
        />
        <Group
          listening={false}
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
          {boardPaths.map((path) => (
            <MemoizedPath
              key={path.key}
              pathData={path.pathData}
              fill={path.isStart ? undefined : path.colorRef}
              fillPatternImage={path.isStart && checkerboardLoaded ? checkerboardImage : undefined}
              stroke={theme.palette.main.accent}
              strokeWidth={mobile ? 2 : 5}
              mobile={mobile}
            />
          ))}
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
                position={rankingMap.get(pawnData.nickname)?.position}
                nodeRef={(node) => handlePawnNodeRef(pawnData.index, node)}
              />
            );
          })
        )}
      </Layer>
    </Stage>
  );
}

export default GameBoard;