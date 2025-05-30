import type { CharacterRole } from '@/lib/model/model-llm';
import { NPC_DUDE } from './dude';
import { NPC_MOLLY } from './molly';
import { NPC_EMMA } from './emma';
import { NPC_HENRY } from './henry';

export const NPCS: Record<string, CharacterRole> = {
  dude: NPC_DUDE,
  molly: NPC_MOLLY,
  emma: NPC_EMMA,
  henry: NPC_HENRY,
};
