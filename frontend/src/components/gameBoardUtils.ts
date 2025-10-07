import Konva from 'konva';
import { FieldCoordinate } from '../common/types';
import { isMobileView } from '../common/utils';

export const mobile = isMobileView();
export const STACK_OFFSET = mobile ? 3.5 : 13;
export const PAWN_POSITION_OFFSET = 0.7;
export const PERSPECTIVE = 0.35;
export const MIN_SCALE = 0.6;
export const MAX_SCALE = 1.2;

/**
 * Create a small checkerboard image using canvas.
 */
export function createCheckerboardImage(size = 8): HTMLImageElement {
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);

  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}

/**
 * Compute the circular/elliptical field coordinates for the board.
 */
export function computeFieldCoordinates(
  numFields: number,
  BOARD_X_RADIUS: number,
  BOARD_Y_RADIUS: number,
  centerX: number,
  centerY: number
): FieldCoordinate[] {
  const coords: FieldCoordinate[] = [];

  for (let i = 0; i < numFields; i++) {
    const angle = ((2 * Math.PI) / numFields) * i;
    const sinAngle = Math.sin(angle);
    const depth = sinAngle + 1;
    const scale = MIN_SCALE + ((MAX_SCALE - MIN_SCALE) * depth) / 2;
    const y = centerY + (BOARD_Y_RADIUS * sinAngle + PERSPECTIVE);
    coords.push({
      x: centerX + BOARD_X_RADIUS * Math.cos(angle),
      y,
      scale,
    });
  }

  return coords;
}

/**
 * Get a pawn's central position inside a field (along radial direction).
 */
export function getPawnPositionInField(
  fieldCoords: FieldCoordinate,
  centerX: number,
  centerY: number
) {
  const dirX = fieldCoords.x - centerX;
  const dirY = fieldCoords.y - centerY;

  const length = Math.hypot(dirX * dirX + dirY * dirY) || 1;
  const normalizedX = dirX / length;
  const normalizedY = dirY / length;

  return {
    x: centerX + normalizedX * length * PAWN_POSITION_OFFSET,
    y: centerY + normalizedY * length * PAWN_POSITION_OFFSET,
    scale: fieldCoords.scale,
  };
}

/**
 * Position pawns stacked on a field — spacing depends on STACK_OFFSET and the pawn scale.
 */
export function getStackedPosition(
  baseCoords: FieldCoordinate,
  stackIndex: number,
  totalInStack: number,
  centerX: number,
  centerY: number
) {
  const fieldPosition = getPawnPositionInField(baseCoords, centerX, centerY);
  if (totalInStack === 1) return fieldPosition;

  const angle = (stackIndex * 2 * Math.PI) / totalInStack;

  const radiusX = STACK_OFFSET * 3.5 * (1 / fieldPosition.scale);
  const radiusY = STACK_OFFSET * 1.1 * (1 / fieldPosition.scale);

  return {
    x: fieldPosition.x - Math.cos(angle) * radiusX,
    y: fieldPosition.y - Math.sin(angle) * radiusY,
    scale: fieldPosition.scale,
  };
}

/**
 * Generate intermediate clockwise indices from `fromIndex` to `toIndex`.
 */
export function generateClockwisePathIndices(
  fromIndex: number,
  toIndex: number,
  totalFields: number
) {
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
}

/**
 * Find which field index is closest to a Konva node's absolute position.
 */
export function findClosestFieldIndex(
  node: Konva.Node,
  fieldCoordinates: FieldCoordinate[],
  centerX: number,
  centerY: number
) {
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
    console.error(`Error during movement rendering: ${e}`)
    return -1;
  }
}
