import { getCellString } from '../../logic/board';
import { AttackDirection } from '../../config/enums-battle';
import type { AttackPattern } from '../../model';

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
