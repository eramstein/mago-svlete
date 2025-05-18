import type { BattleState } from '@lib/model/model-battle';
import { config, AbilityTrigger } from '@lib/config';
import { playAiTurn } from './ai';
import { computeWinner } from './victory';
import { triggerAbilities } from './abilities';

export function passTurn(state: BattleState) {
  computeWinner(state);
  if (state.activePlayerId === state.players.length - 1) {
    state.turn++;
  }
  state.activePlayerId = (state.activePlayerId + 1) % state.players.length;

  window.setTimeout(() => {
    state.deployedCards
      .filter((card) => card.ownerId === state.activePlayerId && card.abilities)
      .forEach((card) => {
        triggerAbilities(state, AbilityTrigger.OnTurnStart, card);
      });
  }, config.abilityDelay);

  if (state.activePlayerId !== 0) {
    playAiTurn(state);
  }
}
