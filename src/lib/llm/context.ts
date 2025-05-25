import { ActionType } from '../config';
import type { State } from '../model/main';
import type { ChatState } from '../model/model-llm';
import type { Character } from '../model/model-sim';
import { reactToContextChange } from './chat';

const reactionByActionType: Partial<Record<ActionType, (actingCharacter: Character) => string>> = {
  [ActionType.GoTo]: (actingCharacter) => `${actingCharacter.name} arrives.`,
};

export function resetContext(chat: ChatState) {
  chat.context = '';
}

export function addContext(chat: ChatState, message: string) {
  chat.context += ' --- ' + message;
}

export function triggerReactionsOnAction(
  gs: State,
  actingCharacter: Character,
  actionType: ActionType
) {
  if (!reactionByActionType[actionType]) {
    return;
  }
  const reaction = reactionByActionType[actionType](actingCharacter);
  const charactersInZone = gs.sim.characters.filter(
    (c) => c.place === actingCharacter.place && c.zone === actingCharacter.zone
  );
  const contextPrefix = 'The following just happened: ';
  const contextSuffix = 'How does your character react to this?';
  const context = contextPrefix + reaction + contextSuffix;
  charactersInZone.forEach((c) => {
    reactToContextChange(gs, c.key, context);
  });
}
