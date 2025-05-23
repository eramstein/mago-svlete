import { initNpcMemory, listCollections, resetVectorDatabase } from '@/lib/llm';
import { initWorldMemory } from '@/lib/llm/world';
import { gs } from '@/lib/state';

export const consoleCommands = {
  loadvectors: () => {
    initNpcMemory(gs.sim);
    initWorldMemory();
  },
  resetvectors: () => {
    resetVectorDatabase();
  },
  listcollections: () => {
    listCollections();
  },
};
