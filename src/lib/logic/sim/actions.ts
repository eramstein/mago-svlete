import { getActionFromText } from '@/lib/llm';
import type { Character } from '@/lib/model/model-sim';
import type { State } from '@/lib/model/main';
import { ACTIONS } from './action-types';
import { passTime } from './time';
import type { ActionType } from '@/lib/config';
import { addContextForAction } from '@/lib/llm/context';

export async function actFromText(gs: State, actionText: string, character?: Character) {
  const { actionType, args } = await getActionFromText(actionText);
  await act(gs, actionType, args, character);
}

export async function act(
  gs: State,
  actionType: ActionType,
  args: Record<string, any>,
  character?: Character
) {
  const action = ACTIONS[actionType];
  if (!action) {
    console.log('No action found for tool ' + actionType);
  }
  const actingCharacter = character || gs.sim.player;
  action.fn(gs, actingCharacter, args);
  addContextForAction(gs.chat, actionType);
  passTime(gs.sim, action.duration);
}
