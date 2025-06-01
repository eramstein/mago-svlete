import type { ActionType } from '../config';
import type { State } from './main';

export interface SimState {
  time: Time;
  places: Place[];
  characters: Character[];
  player: Character;
  ongoingActivity: {
    actionType: ActionType;
    characters: Character[];
  } | null;
}

export interface Time {
  startDate: Date;
  ellapsedTime: number;
}

export interface Place {
  index: number;
  name: string;
  description: string;
  zones: Zone[];
}

export interface Zone {
  index: number;
  name: string;
  place: number;
  description: string;
  image?: string;
}

export interface Character {
  key: string;
  name: string;
  place: number;
  zone: number;
  decks: Deck[];
  cardCollection: Record<string, number>; // cardId -> number of cards
}

export interface ActionTypeDefinition {
  fn: ActionEffect;
  duration: number;
  description: string;
}

export type ActionEffect = (gs: State, character: Character, args: any) => void;

export type Deck = {
  name: string;
  ownerId: number;
  cardIds: string[];
};
