import { config } from '@lib/config';
import type { BattleState } from '@lib/model/model-battle';
import { getFreePositions } from './board';
import { deployCard } from './card';
import { randomElement } from './random';

export function playAiTurn(state: BattleState) {
  const player = state.players[state.activePlayerId];
  const card = randomElement(player.hand);
  const pos = randomElement(getFreePositions(state));
  window.setTimeout(() => {
    if (card && pos) {
      deployCard(state, card, pos);
    }
  }, config.aiDelay);
}
