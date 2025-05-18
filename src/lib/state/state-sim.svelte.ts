import type { SimState } from '../model/model-sim';

export const initialSimState: SimState = {
  time: {
    startDate: new Date(),
    ellapsedTime: 0,
  },
  places: [],
  characters: [],
  player: {
    key: 'player',
    name: 'Henri',
    place: 0,
    zone: 0,
  },
};
