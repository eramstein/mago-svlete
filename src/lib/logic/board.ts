import { config } from '../config';
import { AttackDirection, ControlDirection } from '../state/enums';
import type { BattleState, ControlPattern, DeployedCard, Position } from '../state/model';

export function isCellOccupied(state: BattleState, x: number, y: number) {
  return state.board[x][y].occupiedByUnitId !== null;
}

export function getCellString(x: number, y: number) {
  return `${x}-${y}`;
}

export function getOccupiedPositions(state: BattleState): Position[] {
  return state.board.flatMap((row) =>
    row.filter((cell) => cell.occupiedByUnitId !== null).map((cell) => cell.position)
  );
}

export function getOccupiedPositionsAsMap(state: BattleState): Record<string, boolean> {
  return getOccupiedPositions(state).reduce(
    (acc, position) => {
      acc[getCellString(position.x, position.y)] = true;
      return acc;
    },
    {} as Record<string, boolean>
  );
}

export function getFreePositions(state: BattleState): Position[] {
  return state.board.flatMap((row) =>
    row.filter((cell) => cell.occupiedByUnitId === null).map((cell) => cell.position)
  );
}

export function computeBoardControlStatus(state: BattleState) {
  const occupiedPositions = getOccupiedPositionsAsMap(state);
  // map positions to players total control strength
  const controlMap: Record<string, Record<number, number>> = {};
  const playersInitialStrength = Object.fromEntries(state.players.map((player) => [player.id, 0]));
  for (let x = 0; x < config.boardSize; x++) {
    for (let y = 0; y < config.boardSize; y++) {
      controlMap[getCellString(x, y)] = { ...playersInitialStrength };
    }
  }

  const fillHorizontal = (card: DeployedCard) => {
    const { position, control } = card;
    const { direction, distance, strength } = control as ControlPattern;
    // fill to left
    for (let i = 1; i <= (distance || config.boardSize); i++) {
      const cell = controlMap[getCellString(position.x - i, position.y)];
      if (!cell || occupiedPositions[getCellString(position.x - i, position.y)]) break;
      cell[card.ownerId] += strength || 1;
    }
    // fill to right
    for (let i = 1; i <= (distance || config.boardSize); i++) {
      const cell = controlMap[getCellString(position.x + i, position.y)];
      if (!cell || occupiedPositions[getCellString(position.x + i, position.y)]) break;
      cell[card.ownerId] += strength || 1;
    }
  };

  const fillVertical = (card: DeployedCard) => {
    const { position, control } = card;
    const { direction, distance, strength } = control as ControlPattern;
    // fill to top
    for (let i = 1; i <= (distance || config.boardSize); i++) {
      const cell = controlMap[getCellString(position.x, position.y - i)];
      if (!cell || occupiedPositions[getCellString(position.x, position.y - i)]) break;
      cell[card.ownerId] += strength || 1;
    }
    // fill to bottom
    for (let i = 1; i <= (distance || config.boardSize); i++) {
      const cell = controlMap[getCellString(position.x, position.y + i)];
      if (!cell || occupiedPositions[getCellString(position.x, position.y + i)]) break;
      cell[card.ownerId] += strength || 1;
    }
  };

  // fill map with deployed cards strengths
  // an occupied cell stops the propagation of control in that direction
  for (const card of state.deployedCards) {
    switch (card.control?.direction) {
      case ControlDirection.Horizontal:
        fillHorizontal(card);
        break;
      case ControlDirection.Vertical:
        fillVertical(card);
        break;
      case ControlDirection.All:
        fillHorizontal(card);
        fillVertical(card);
        break;
      default:
        break;
    }
    const cell = controlMap[getCellString(card.position.x, card.position.y)];
    cell[card.ownerId] = 10;
  }

  // update board cells with control status
  for (let x = 0; x < config.boardSize; x++) {
    for (let y = 0; y < config.boardSize; y++) {
      const cell = controlMap[getCellString(x, y)];
      let maxStrength = 0;
      let secondMaxStrength = 0;
      let playerId = -1;
      Object.entries(cell).forEach(([key, strength]) => {
        if (strength > maxStrength) {
          secondMaxStrength = maxStrength;
          maxStrength = strength;
          playerId = parseInt(key);
        }
      });
      state.board[x][y].controlStatus =
        playerId !== -1
          ? {
              strength: maxStrength - secondMaxStrength,
              playerId,
            }
          : null;
    }
  }
}

// returns the cell on the other side of the attack target
export function getOppositeCell(
  state: BattleState,
  position: Position,
  direction: AttackDirection
) {
  switch (direction) {
    case AttackDirection.Up:
      return position.y > 1 ? state.board[position.x][position.y - 2] : null;
    case AttackDirection.Down:
      return position.y < config.boardSize - 1 ? state.board[position.x][position.y + 2] : null;
    case AttackDirection.Left:
      return position.x > 1 ? state.board[position.x - 2][position.y] : null;
    case AttackDirection.Right:
      return position.x < config.boardSize - 1 ? state.board[position.x + 2][position.y] : null;
    default:
      return null;
  }
}
