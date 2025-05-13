import { config } from '../config';
import type { BattleState } from './model';

export const initialState: BattleState = {
  turn: 1,
  activePlayerId: 1,
  wonByPlayerId: null,
  players: [
    {
      id: 0,
      name: 'Henry',
      hand: [],
      score: 0,
    },
    {
      id: 1,
      name: 'The Dude',
      hand: [],
      score: 0,
    },
  ],
  deployedCards: [],
  board: [],
};

export const gs: BattleState = $state(initialState);

export const resetState = (): BattleState => {
  (Object.keys(initialState) as Array<keyof BattleState>).forEach((key) => {
    const value = initialState[key];
    if (Array.isArray(value)) {
      (gs[key] as any) = [...value];
    } else {
      (gs[key] as any) = value;
    }
  });
  initializeBoard(gs);
  return gs;
};

export const initializeBoard = (state: BattleState): BattleState => {
  state.board = Array.from({ length: config.boardSize }, (_, x) =>
    Array.from({ length: config.boardSize }, (_, y) => ({
      position: { x, y },
      controlStatus: null,
      occupiedByUnitId: null,
    }))
  );
  return state;
};

export const saveStateToLocalStorage = (): void => {
  try {
    localStorage.setItem('battleState', JSON.stringify(gs));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

export const loadStateFromLocalStorage = (): BattleState | null => {
  try {
    const savedState = localStorage.getItem('battleState');
    if (!savedState) return null;

    const parsedState = JSON.parse(savedState);
    // Update the current state with the loaded data
    Object.assign(gs, parsedState);
    return gs;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
};
