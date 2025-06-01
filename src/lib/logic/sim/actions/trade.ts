import { ActionType } from '@/lib/config';
import { initChat } from '@/lib/llm';
import type { State } from '@/lib/model/main';
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
