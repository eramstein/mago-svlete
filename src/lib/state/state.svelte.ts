import type { GameState } from './model';

export const state: GameState = $state({
  players: [
    {
      id: 1,
      name: 'Player 1',
    },
    {
      id: 2,
      name: 'Player 2',
    },
  ],
});
