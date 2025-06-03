import { ActionType } from '@/lib/config';
import { initChat } from '@/lib/llm';
import type { State } from '@/lib/model/main';
import type { Card } from '@/lib/model/model-battle';
import type { Character } from '@/lib/model/model-sim';

export function startTradeTool(
  gs: State,
  character: Character,
  param: {
    partner: string;
  }
) {
  const tradePartner = gs.sim.characters.find((c) => c.name === param.partner);
  if (tradePartner) {
    initTrade(gs, tradePartner);
    if (!gs.chat.history[tradePartner.key]) {
      initChat(gs.chat, tradePartner.key);
    }
  } else {
    console.log('No tradePartner found', param);
  }
}

export function initTrade(gs: State, tradePartner: Character) {
  gs.sim.ongoingActivity = {
    actionType: ActionType.StartTrade,
    characters: [gs.sim.player, tradePartner],
  };
}

export function tradeCards(
  gs: State,
  selectedPlayerCard: Card,
  selectedNpcCard: Card,
  npc: Character
) {
  if (!selectedPlayerCard || !selectedNpcCard || !npc) return;

  // Remove cards from both collections
  gs.sim.player.cardCollection[selectedPlayerCard.id]--;
  if (npc.cardCollection[selectedNpcCard.id]) {
    npc.cardCollection[selectedNpcCard.id]--;
  }

  // Add cards to opposite collections
  gs.sim.player.cardCollection[selectedNpcCard.id] =
    (gs.sim.player.cardCollection[selectedNpcCard.id] || 0) + 1;
  if (npc.cardCollection) {
    npc.cardCollection[selectedPlayerCard.id] =
      (npc.cardCollection[selectedPlayerCard.id] || 0) + 1;
  }
}
