import { useEffect, RefObject } from 'react';
import Konva from 'konva';
import {
  getStackedPosition,
  getPawnPositionInField,
  generateClockwisePathIndices,
  findClosestFieldIndex,
} from './gameBoardUtils';
import type { BoardPositions, FieldCoordinate } from '../common/types';

type MapRef<T> = React.MutableRefObject<Map<string, T>>;

interface UsePawnAnimationsArgs {
  positions: BoardPositions;
  previousPositions?: BoardPositions | null;
  fieldCoordinates: FieldCoordinate[];
  pawnReferences: MapRef<Konva.Group>;
  tweensRef: MapRef<any>;
  centerX: number;
  centerY: number;
  numFields: number;
  positionUpdateBlock?: boolean;
  pzRef: React.MutableRefObject<any | null>;
  panzoomOptionsRef: React.MutableRefObject<any>;
  stageRef: RefObject<Konva.Stage | null>;
  playerIndex: string | null;
  mobile: boolean;
}

export function usePawnAnimations({
  positions,
  previousPositions,
  fieldCoordinates,
  pawnReferences,
  tweensRef,
  centerX,
  centerY,
  numFields,
  positionUpdateBlock = false,
  pzRef,
  panzoomOptionsRef,
  stageRef,
  playerIndex,
  mobile,
}: UsePawnAnimationsArgs) {
  const stopTweenIfExists = (pawnId: string) => {
    const t = tweensRef.current.get(pawnId);
    if (t && typeof t.stop === 'function') {
      try {
        t.stop();
      } catch {
        // ignore
      }
    }
    tweensRef.current.delete(pawnId);
  };

  const setInitialPositions = () => {
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
    if (firstNode) firstNode.getLayer()?.batchDraw();
  };

  const buildPositionMap = (data: BoardPositions) => {
    const map = new Map<string, { fieldIndex: number; stackIndex: number; totalInStack: number }>();
    data.forEach((field, fieldIndex) => {
      field.forEach((pawn, stepIndex) => {
        map.set(pawn.index, {
          fieldIndex,
          stackIndex: stepIndex,
          totalInStack: field.length,
        });
      });
    });
    return map;
  };

  const fadeOutRemovedPawns = (prevMap: Map<string, any>, currMap: Map<string, any>) => {
    previousPositions?.forEach((field) => {
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
              onFinish: () => resolve(),
            });
            tweensRef.current.set(pawnData.index, tween);
          });

          promise.then(() => stopTweenIfExists(pawnData.index));
        }
      });
    });
  };

  const smoothCenterOnNode = (node: Konva.Node, index: string, lerp = 0.2) => {
    if (index !== playerIndex) return;
    if (!pzRef.current || !stageRef.current) return;

    try {
      const rect = stageRef.current.container().getBoundingClientRect();
      const viewX = rect.width / (mobile ? 3.5 : 2.5);
      const viewY = rect.height / (mobile ? 3.5 : 2.5);

      const pawnPos = node.getAbsolutePosition();
      const transform = pzRef.current.getTransform();

      const targetX = viewX - pawnPos.x * transform.scaleX();
      const targetY = viewY - pawnPos.y * transform.scaleY();

      const current = transform.translate();
      const nextX = current.x + (targetX - current.x) * lerp;
      const nextY = current.y + (targetY - current.y) * lerp;

      pzRef.current.moveTo(nextX, nextY);
    } catch {
      // ignore centering errors
    }
  };

  const animatePawn = (pawnId: string, fromIndex: number, toIndex: number, toStackIndex: number, totalInStack: number) => {
    const node = pawnReferences.current.get(pawnId);
    if (!node) return;

    const pathIndices = generateClockwisePathIndices(fromIndex, toIndex, numFields);
    const tweenPath = pathIndices.map((idx) => getPawnPositionInField(fieldCoordinates[idx], centerX, centerY));

    stopTweenIfExists(pawnId);

    let currentStep = 0;
    const totalSteps = tweenPath.length;

    const tween = new Konva.Tween({
      node,
      duration: 0.4 * totalSteps,
      onUpdate: () => {
        const pos = tweenPath[Math.min(currentStep, totalSteps - 1)];
        node.setAttrs({ x: pos.x, y: pos.y });
        currentStep++;
      },
      onFinish: () => {
        const endCoords = fieldCoordinates[toIndex];
        const stackedPos = getStackedPosition(endCoords, toStackIndex, totalInStack, centerX, centerY);
        node.setAttrs({
          x: stackedPos.x,
          y: stackedPos.y,
          scaleX: stackedPos.scale,
          scaleY: stackedPos.scale,
          opacity: 1,
        });
        smoothCenterOnNode(node, pawnId);
      },
    });

    tweensRef.current.set(pawnId, tween);
    tween.play();
  };

  useEffect(() => {
    if (!fieldCoordinates.length || positionUpdateBlock) return;

    if (!previousPositions) {
      setInitialPositions();
      return;
    }

    const prevMap = buildPositionMap(previousPositions);
    const currMap = buildPositionMap(positions);

    fadeOutRemovedPawns(prevMap, currMap);

    positions.forEach((field, toIndex) => {
      field.forEach((pawnData, toStackIndex) => {
        const pawnId = pawnData.index;
        const node = pawnReferences.current.get(pawnId);
        if (!node) return;

        const prev = prevMap.get(pawnId);
        if (!prev) {
          stopTweenIfExists(pawnId);
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

        let fromIndex = prev.fieldIndex;
        if (tweensRef.current.has(pawnId)) {
          const guessed = findClosestFieldIndex(node, fieldCoordinates, centerX, centerY);
          if (guessed !== -1) fromIndex = guessed;
        }

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

        animatePawn(pawnId, fromIndex, toIndex, toStackIndex, field.length);
      });
    });
  }, [
    positions,
    previousPositions,
    fieldCoordinates,
    centerX,
    centerY,
    numFields,
    positionUpdateBlock,
    playerIndex,
    mobile,
  ]);
}

