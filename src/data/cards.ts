import { Direction } from '../lib/state/enums';
import type { CardTemplate } from '../lib/state/model';

export const cards: Record<string, CardTemplate> = {
  a_castle: {
    id: 'a_castle',
    name: 'Camelot',
    control: {
      direction: Direction.Vertical,
    },
  },
  a_wall: {
    id: 'a_wall',
    name: 'Stone Wall',
    control: {
      direction: Direction.All,
      distance: 1,
    },
  },
  a_cabin: {
    id: 'a_cabin',
    name: 'Wood Cabin',
    control: {
      direction: Direction.Horizontal,
      distance: 3,
      strength: 2,
    },
  },
  a_bridge: {
    id: 'a_bridge',
    name: 'Bridge',
  },
};
