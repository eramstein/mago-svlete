import type { CharacterRole } from '@/lib/model/model-llm';
import { NPC_DUDE } from './dude';
import { NPC_MOLLY } from './molly';

export const NPCS: Record<string, CharacterRole> = {
  dude: NPC_DUDE,
  molly: NPC_MOLLY,
};
