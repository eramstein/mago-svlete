import type { BattleState } from '../state/model';
import { playAiTurn } from './ai';
import { computeWinner } from './victory';

export function passTurn(state: BattleState) {
  computeWinner(state);
  if (state.activePlayerId === state.players.length - 1) {
    state.turn++;
  }
  state.activePlayerId = (state.activePlayerId + 1) % state.players.length;
  if (state.activePlayerId !== 0) {
    playAiTurn(state);
  }
}
