import { getActionFromText } from '@/lib/llm';
import type { Character, SimState } from '@/lib/model/model-sim';
import { ACTIONS } from './actions.config';
import { passTime } from './time';

export async function actFromText(sim: SimState, actionText: string, character?: Character) {
  console.log('PREPARE ACTION', character?.name, actionText);
  const { actionType, args } = await getActionFromText(actionText);
  const action = ACTIONS[actionType];
  if (!action) {
    console.log('No action found for tool ' + actionType);
  }
  const actingCharacter = character || sim.player;
  console.log('PREPARE ACTION', actingCharacter, actionType, args);
  action.fn(sim, actingCharacter, args);
  passTime(sim, action.duration);
}
