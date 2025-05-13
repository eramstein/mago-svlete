import { config } from '../../config';
import { getCellString } from '../../logic/board';
import { AttackDirection, ControlDirection } from '../../state/enums';
import type { ControlPattern, AttackPattern } from '../../state/model';

export function getImpactedCellsPreview(
  control: ControlPattern,
  position: { x: number; y: number }
) {
  const controlMap: Record<string, boolean> = {};
  const { distance } = control;

  const fillHorizontal = () => {
    // fill to left
    for (let i = 1; i <= (distance || config.boardSize); i++) {
      controlMap[getCellString(position.x - i, position.y)] = true;
    }
    // fill to right
    for (let i = 1; i <= (distance || config.boardSize); i++) {
      controlMap[getCellString(position.x + i, position.y)] = true;
    }
  };

  const fillVertical = () => {
    // fill to top
    for (let i = 1; i <= (distance || config.boardSize); i++) {
      controlMap[getCellString(position.x, position.y - i)] = true;
    }
    // fill to bottom
    for (let i = 1; i <= (distance || config.boardSize); i++) {
      controlMap[getCellString(position.x, position.y + i)] = true;
    }
  };

  switch (control.direction) {
    case ControlDirection.Horizontal:
      fillHorizontal();
      break;
    case ControlDirection.Vertical:
      fillVertical();
      break;
    case ControlDirection.All:
      fillHorizontal();
      fillVertical();
      break;
    default:
      break;
  }

  return controlMap;
}

export function getAttackedCellsPreview(
  attackPattern: AttackPattern,
  position: { x: number; y: number }
) {
  const attackedCells: Record<string, number> = {};

  if (!attackPattern.directions || attackPattern.directions?.includes(AttackDirection.Up)) {
    attackedCells[getCellString(position.x, position.y - 1)] = attackPattern.strength;
  }

  if (!attackPattern.directions || attackPattern.directions?.includes(AttackDirection.Down)) {
    attackedCells[getCellString(position.x, position.y + 1)] = attackPattern.strength;
  }

  if (!attackPattern.directions || attackPattern.directions?.includes(AttackDirection.Left)) {
    attackedCells[getCellString(position.x - 1, position.y)] = attackPattern.strength;
  }

  if (!attackPattern.directions || attackPattern.directions?.includes(AttackDirection.Right)) {
    attackedCells[getCellString(position.x + 1, position.y)] = attackPattern.strength;
  }

  return attackedCells;
}
