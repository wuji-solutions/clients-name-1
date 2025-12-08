import { useEffect, RefObject, MutableRefObject } from 'react';
import Konva from 'konva';
import {
  getStackedPosition,
  getPawnPositionInField,
  generateClockwisePathIndices,
  findClosestFieldIndex,
} from './gameBoardUtils';
import type { BoardPositions, FieldCoordinate, Pawn } from '../common/types';

type MapRef<T> = MutableRefObject<Map<string, T>>;

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
  pzRef: MutableRefObject<any | null>;
  panzoomOptionsRef: MutableRefObject<any>;
  stageRef: RefObject<Konva.Stage | null>;
  playerIndex: string | null;
  mobile: boolean;
}

interface ResolvePathPromiseArgs {
  previousPositions: BoardPositions;
  fromIndex: number;
  startCoords: FieldCoordinate;
  fromStackIndex: number;
  centerX: number;
  centerY: number;
  node: Konva.Node;
  toIndex: number;
  numFields: number;
  fieldCoordinates: FieldCoordinate[];
  playerIndex: string | null;
  stageRef: RefObject<Konva.Stage | null>;
  mobile: boolean;
  pzRef: MutableRefObject<any | null>;
  pawnId: string;
  tweensRef: MapRef<any>;
  endCoords: FieldCoordinate;
  field: Pawn[];
  toStackIndex: number;
}

let lastCameraUpdate = 0;
const CAMERA_UPDATE_INTERVAL = 50; // ms

const smoothCenterOnNode = (
  playerIndex: string | null,
  stageRef: RefObject<Konva.Stage | null>,
  mobile: boolean,
  pzRef: MutableRefObject<any | null>,
  node: Konva.Node,
  index: string,
  lerp = 0.2
) => {
  if (index !== playerIndex) return;
  if (!pzRef.current || !stageRef.current) return;

  try {
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
    const scale = mobile ? 2 : 1.5;
    pzRef.current.zoomAbs(viewX, viewY, scale);
  } catch {
    // ignore
  }
};

const resolvePathPromise = ({
  previousPositions,
  fromIndex,
  startCoords,
  fromStackIndex,
  centerX,
  centerY,
  node,
  toIndex,
  numFields,
  fieldCoordinates,
  playerIndex,
  stageRef,
  mobile,
  pzRef,
  pawnId,
  tweensRef,
  endCoords,
  field,
  toStackIndex,
}: ResolvePathPromiseArgs) => {
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
      const skipSteps = 1;
      const filteredSteps = stepIndices.filter((_, idx) => idx % skipSteps === 0);

      for (const stepIndex of filteredSteps) {
        const stepCoords = fieldCoordinates[stepIndex];
        if (!stepCoords) continue;

        const stepPosition = getPawnPositionInField(stepCoords, centerX, centerY);

        await new Promise<void>((stepResolve) => {
          const tween = node.to({
            x: stepPosition.x,
            y: stepPosition.y,
            scaleX: stepPosition.scale,
            scaleY: stepPosition.scale,
            duration: 0.4,
            easing: Konva.Easings.EaseInOut,
            onUpdate: () => smoothCenterOnNode(playerIndex, stageRef, mobile, pzRef, node, pawnId),
            onFinish: () => stepResolve(),
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
          duration: 0.4,
          easing: Konva.Easings.EaseInOut,
          onUpdate: () => smoothCenterOnNode(playerIndex, stageRef, mobile, pzRef, node, pawnId),
          onFinish: () => finalResolve(),
        });

        tweensRef.current.set(pawnId, tween);
      });

      tweensRef.current.delete(pawnId);
      resolve();
    };

    void animatePath();
  });
  return pathPromise;
};

interface ResolvePawnDidntMoveArgs {
  fromIndex: number;
  toIndex: number;
  fieldCoordinates: FieldCoordinate[];
  stopTweenIfExists: Function;
  pawnId: string;
  toStackIndex: number;
  field: Pawn[];
  centerX: number;
  centerY: number;
  node: Konva.Node;
  playerIndex: string | null;
  stageRef: RefObject<Konva.Stage | null>;
  mobile: boolean;
  pzRef: MutableRefObject<any | null>;
  tweensRef: MapRef<any>;
  animationPromises: Promise<void>[];
}

const resolvePawnDidntMove = ({
  fromIndex,
  toIndex,
  fieldCoordinates,
  stopTweenIfExists,
  pawnId,
  toStackIndex,
  field,
  centerX,
  centerY,
  node,
  playerIndex,
  stageRef,
  mobile,
  pzRef,
  tweensRef,
  animationPromises,
}: ResolvePawnDidntMoveArgs) => {
  if (fromIndex === toIndex) {
    const coords = fieldCoordinates[toIndex];
    if (!coords) return;
    stopTweenIfExists(pawnId);

    const stackedPos = getStackedPosition(coords, toStackIndex, field.length, centerX, centerY);
    const movePromise = new Promise<void>((resolve) => {
      const tween = node.to({
        x: stackedPos.x,
        y: stackedPos.y,
        scaleX: stackedPos.scale,
        scaleY: stackedPos.scale,
        duration: 0.4,
        easing: Konva.Easings.EaseOut,
        onUpdate: () => smoothCenterOnNode(playerIndex, stageRef, mobile, pzRef, node, pawnId),
        onFinish: () => resolve(),
      });
      tweensRef.current.set(pawnId, tween);
    });

    animationPromises.push(movePromise);
  }
};

const resolveStopPromise = (
  node: Konva.Node,
  tweensRef: MapRef<any>,
  stopTweenIfExists: Function,
  pawnData: Pawn,
  mobile: boolean
) => {
  const promise = new Promise<void>((resolve) => {
    const tween = node.to({
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 0.4,
      onFinish: () => resolve(),
    });
    tweensRef.current.set(pawnData.index, tween);
  });

  promise.then(() => stopTweenIfExists(pawnData.index));
};

function animatePawns({
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
  if (!fieldCoordinates.length || positionUpdateBlock) return;

  const stopTweenIfExists = (pawnId: string) => {
    const t = tweensRef.current.get(pawnId);
    if (t && typeof t.stop === 'function') {
      try {
        t.stop();
      } catch {
        ///ignore
      }
    }
    tweensRef.current.delete(pawnId);
  };

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
    if (firstNode) firstNode.getLayer()?.batchDraw();
    return;
  }

  const prevMap = new Map<
    string,
    { fieldIndex: number; stackIndex: number; totalInStack: number }
  >();
  previousPositions.forEach((field, fieldIndex) => {
    field.forEach((pawn, stepIndex) =>
      prevMap.set(pawn.index, {
        fieldIndex,
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
        fieldIndex,
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

        resolveStopPromise(node, tweensRef, stopTweenIfExists, pawnData, mobile);
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

      if (!prev) {
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
        const guessed = findClosestFieldIndex(node, fieldCoordinates, centerX, centerY);
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

      resolvePawnDidntMove({
        fromIndex,
        toIndex,
        fieldCoordinates,
        stopTweenIfExists,
        pawnId,
        toStackIndex,
        field,
        centerX,
        centerY,
        node,
        playerIndex,
        stageRef,
        mobile,
        pzRef,
        tweensRef,
        animationPromises,
      });

      const startCoords = fieldCoordinates[fromIndex];
      const endCoords = fieldCoordinates[toIndex];
      if (!startCoords || !endCoords) return;

      stopTweenIfExists(pawnId);

      const pathPromise = resolvePathPromise({
        previousPositions,
        fromIndex,
        startCoords,
        fromStackIndex,
        centerX,
        centerY,
        node,
        toIndex,
        numFields,
        fieldCoordinates,
        playerIndex,
        stageRef,
        mobile,
        pzRef,
        pawnId,
        tweensRef,
        endCoords,
        field,
        toStackIndex,
      });

      animationPromises.push(pathPromise);
    });
  });

  Promise.all(animationPromises).then(() => {
    const firstNode = pawnReferences.current.values().next().value;
    if (firstNode) firstNode.getLayer()?.batchDraw();
  });
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
  useEffect(() => {
    animatePawns({
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
    return () => {
      // ignore
    };
  }, [positions, previousPositions, fieldCoordinates]);
}