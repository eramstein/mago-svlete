import type { Character } from '@/lib/model/model-sim';
import type { State } from '@/lib/model/main';
import { initBattle } from '@/lib/logic/battle/battle';
import { initChat } from '@/lib/llm/chat';

export async function startGameTool(
  gs: State,
  character: Character,
  param: {
    opponent: string;
  }
) {
  const opponent = gs.sim.characters.find((c) => c.name === param.opponent);
  if (opponent) {
    initBattle(opponent.name, [gs.sim.player.decks[0], opponent.decks[0]]);
    if (!gs.chat.history[opponent.key]) {
      await initChat(gs.chat, opponent.key);
    }
  } else {
    console.log('No opponent found', param);
  }
}
