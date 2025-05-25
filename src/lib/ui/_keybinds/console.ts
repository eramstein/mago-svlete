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
  l: () => {
    console.log(JSON.stringify(gs, null, 2));
  },
};
