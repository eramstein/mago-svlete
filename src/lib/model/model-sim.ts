export interface SimState {
  time: Time;
  places: Place[];
  characters: Character[];
  player: Character;
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
}

export interface ActionTypeDefinition {
  fn: ActionEffect;
  duration: number;
  description: string;
}

export type ActionEffect = (sim: SimState, character: Character, args: any) => void;
