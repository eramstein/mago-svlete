import { initNpcMemory, listCollectionsWithContent, resetVectorDatabase } from '@/lib/llm';
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
    listCollectionsWithContent();
  },
  l: () => {
    console.log(JSON.stringify(gs, null, 2));
  },
  vdb: async () => {
    await resetVectorDatabase();
    await initNpcMemory(gs.sim);
    await initWorldMemory();
  },
};
