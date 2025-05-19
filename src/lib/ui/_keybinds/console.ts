import { initNpcMemory, listCollections, resetVectorDatabase } from '@/lib/llm';
import { initWorldMemory } from '@/lib/llm/world';

export const consoleCommands = {
  loadvectors: () => {
    initNpcMemory();
    initWorldMemory();
  },
  resetvectors: () => {
    resetVectorDatabase();
  },
  listcollections: () => {
    listCollections();
  },
};
