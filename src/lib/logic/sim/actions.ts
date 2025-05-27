import { getActionFromText, reactToContextChange } from '@/lib/llm';
import type { Character } from '@/lib/model/model-sim';
import type { State } from '@/lib/model/main';
import { ACTIONS } from './action-types';
import { passTime } from './time';
import { ActionType } from '@/lib/config';
import { triggerReactionsOnAction } from '@/lib/llm/context';

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
  triggerReactionsOnAction(gs, actingCharacter, actionType);
  passTime(gs.sim, action.duration);
}

// case when several characters do something together
export async function jointAction(
  gs: State,
  actionType: ActionType,
  args: Record<string, any>,
  characters: Array<Character>
) {
  const action = ACTIONS[actionType];
  if (!action) {
    console.log('No action found for tool ' + actionType);
  }
  if (actionType === ActionType.StartGame) {
    action.fn(gs, gs.sim.player, args);
  } else {
    characters.forEach((character) => {
      action.fn(gs, character, args);
    });
  }
  triggerReactionsOnAction(gs, gs.sim.player, actionType);
  passTime(gs.sim, action.duration);
}
