import type { BattleState } from './model';

export const state: BattleState = $state({
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
});
