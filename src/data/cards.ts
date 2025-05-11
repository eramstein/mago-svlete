import { Direction } from '../lib/state/enums';
import type { CardTemplate } from '../lib/state/model';

export const cards: Record<string, CardTemplate> = {
  'card-1': {
    id: 'card-1',
    name: 'Card 1',
    control: {
      direction: Direction.Vertical,
    },
  },
  'card-2': {
    id: 'card-2',
    name: 'Card 2',
    control: {
      direction: Direction.All,
      distance: 1,
    },
  },
  'card-3': {
    id: 'card-3',
    name: 'Card 3',
    control: {
      direction: Direction.Horizontal,
      distance: 3,
      strength: 2,
    },
  },
  'card-4': {
    id: 'card-4',
    name: 'Card 4',
  },
};
