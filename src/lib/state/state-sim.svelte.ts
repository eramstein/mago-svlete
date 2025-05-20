import { PLAYER_CONFIG } from '@/data/npcs/player';
import type { SimState } from '../model/model-sim';
import { NPC_DUDE } from '@/data/npcs/dude';
import { PLACES } from '@/data/world/places';

export const initialSimState: SimState = {
  time: {
    startDate: new Date(),
    ellapsedTime: 0,
  },
  places: PLACES,
  characters: [
    {
      key: NPC_DUDE.key,
      name: NPC_DUDE.name,
      place: 1,
      zone: 0,
    },
  ],
  player: {
    key: PLAYER_CONFIG.key,
    name: PLAYER_CONFIG.name,
    place: 0,
    zone: 0,
  },
};
