import { PLACES } from '@/data/world/places';
import { ActionType } from '../config';
import type { State } from '../model/main';
import type { ChatState } from '../model/model-llm';
import type { Character } from '../model/model-sim';
import { reactToContextChange } from './chat';

const reactionByActionType: Partial<Record<ActionType, (actingCharacter: Character) => string>> = {
  [ActionType.GoTo]: (actingCharacter) => `${actingCharacter.name} arrives.`,
};

export function resetContext(chat: ChatState) {
  chat.context = {
    place: '',
    people: '',
    game: '',
  };
}

export function getFullContextString(chat: ChatState) {
  return chat.context.place + ' ' + chat.context.people;
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

export function addContextFromLocation(gs: State, character: string) {
  const placeId = gs.sim.characters.find((c) => c.key === character)?.place;
  if (placeId === undefined) {
    return;
  }
  const place = PLACES.find((p) => p.index === placeId);
  gs.chat.context.place = `You are in this place: ${place?.name} (${place?.description})`;
  gs.chat.context.people =
    'The following people are in the same place as you: ' +
    gs.sim.characters
      .filter((c) => c.place === gs.sim.characters.find((c) => c.key === character)?.place)
      .filter((c) => c.key !== character)
      .map((c) => c.name)
      .join(', ');
}
