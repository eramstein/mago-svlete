import { config } from '../config';
import type { BattleState, Position } from '../state/model';

export function isCellOccupied(state: BattleState, x: number, y: number) {
  return state.deployedCards.some((card) => card.position.x === x && card.position.y === y);
}

export function getFreePositions(state: BattleState): Position[] {
  const occupiedCells: { [key: string]: boolean } = {};
  for (const card of state.deployedCards) {
    occupiedCells[`${card.position.x}-${card.position.y}`] = true;
  }
  const freePositions = [];
  for (let x = 0; x < config.boardSize; x++) {
    for (let y = 0; y < config.boardSize; y++) {
      if (!occupiedCells[`${x}-${y}`]) {
        freePositions.push({ x, y });
      }
    }
  }
  return freePositions;
}
