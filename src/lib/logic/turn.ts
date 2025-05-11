import type { BattleState } from '../state/model';
import { playAiTurn } from './ai';

export function passTurn(state: BattleState) {
  if (state.activePlayerId === state.players.length - 1) {
    state.turn++;
  }
  state.activePlayerId = (state.activePlayerId + 1) % state.players.length;
  if (state.activePlayerId !== 0) {
    playAiTurn(state);
  }
}
