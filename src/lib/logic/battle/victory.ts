import { chatOnBattleWon } from '@/lib/llm/battle-context.svelte';
import type { BattleState } from '@lib/model/model-battle';

export function computeWinner(state: BattleState) {
  if (!isGameOver(state)) {
    return;
  }
  const winner = state.players.sort((a, b) => b.score - a.score)[0];
  if (winner) {
    state.wonByPlayerId = winner.id;
    chatOnBattleWon();
  }
}

export function isGameOver(state: BattleState): boolean {
  let result = true;
  state.players.forEach((player) => {
    if (player.hand.length > 0) {
      result = false;
    }
  });
  return result;
}

export function setPlayerScores(state: BattleState) {
  const playerScores: Record<number, number> = {};
  for (const player of state.players) {
    playerScores[player.id] = 0;
  }
  for (const cell of state.board.flat()) {
    if (cell.controlStatus) {
      playerScores[cell.controlStatus.playerId]++;
    }
  }
  state.players.forEach((player) => {
    player.score = playerScores[player.id];
  });
}
