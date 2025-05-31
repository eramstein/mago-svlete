import { NPCS } from '@/data/npcs';
import type { ChatState } from '../model/model-llm';

export const initialChatState: ChatState = {
  chattingWith: '',
  history: {},
  context: {
    place: '',
    people: '',
    game: '',
  },
  characterOpinions: Object.fromEntries(
    Object.values(NPCS).map((npc) => [npc.key, npc.opinionOfPlayer])
  ),
};
