import type { BattleState } from '../state/model';

export function computeWinner(state: BattleState) {
  if (!isGameOver(state)) {
    return;
  }
  const playerScores: Record<number, number> = {};
  for (const player of state.players) {
    playerScores[player.id] = 0;
  }
  for (const cell of state.board.flat()) {
    if (cell.controlStatus) {
      playerScores[cell.controlStatus.playerId]++;
    }
  }
  const winner = Object.entries(playerScores).sort((a, b) => b[1] - a[1])[0][0];
  if (winner) {
    state.wonByPlayerId = parseInt(winner);
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
