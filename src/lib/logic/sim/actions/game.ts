import type { Character, SimState } from '@/lib/model/model-sim';
import { initBattle } from '@/lib/logic/battle/battle';
import { initChat } from '@/lib/llm/chat';

export function startGameTool(
  sim: SimState,
  character: Character,
  param: {
    opponent: string;
  }
) {
  const opponent = sim.characters.find((c) => c.name === param.opponent);
  if (opponent) {
    initBattle(opponent.name);
    initChat(opponent.key);
  } else {
    console.log('No opponent found', param);
  }
}
