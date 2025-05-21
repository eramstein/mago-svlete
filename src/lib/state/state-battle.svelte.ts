import { config } from '../config/';
import type { BattleState } from '../model/model-battle';
import { gs } from './main.svelte';

export const initialBattleState: BattleState = {
  turn: 0,
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
      name: 'Default AI',
      hand: [],
      score: 0,
    },
  ],
  deployedCards: [],
  board: [],
};

export const resetBattleState = (bs: BattleState): BattleState => {
  (Object.keys(bs) as Array<keyof BattleState>).forEach((key) => {
    const value = bs[key];
    if (Array.isArray(value)) {
      (gs.battle[key] as any) = [...value];
    } else {
      (gs.battle[key] as any) = value;
    }
  });
  return gs.battle;
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
