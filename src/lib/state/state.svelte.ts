import { config } from '../config';
import type { BattleState } from './model';

export const initialState: BattleState = {
  turn: 1,
  activePlayerId: 0,
  players: [
    {
      id: 0,
      name: 'Player 0',
      hand: [],
    },
    {
      id: 1,
      name: 'Player 1',
      hand: [],
    },
  ],
  deployedCards: [],
  board: [],
};

export const state: BattleState = $state(initialState);

export const resetState = (): BattleState => {
  (Object.keys(initialState) as Array<keyof BattleState>).forEach((key) => {
    const value = initialState[key];
    if (Array.isArray(value)) {
      (state[key] as any) = [...value];
    } else {
      (state[key] as any) = value;
    }
  });
  initializeBoard(state);
  return state;
};

export const initializeBoard = (state: BattleState): BattleState => {
  state.board = Array.from({ length: config.boardSize }, (_, x) =>
    Array.from({ length: config.boardSize }, (_, y) => ({
      position: { x, y },
      controlStatus: null,
      occupied: false,
    }))
  );
  return state;
};
