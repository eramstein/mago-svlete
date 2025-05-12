import { AttackDirection, CardType, ControlDirection } from '../lib/state/enums';
import type { CardTemplate } from '../lib/state/model';

export const cards: Record<string, CardTemplate> = {
  a_castle: {
    id: 'a_castle',
    name: 'Camelot',
    hp: 1,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Vertical,
    },
  },
  a_bridge: {
    id: 'a_bridge',
    name: 'Stone Bridge',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
  },
  a_cabin: {
    id: 'a_cabin',
    name: 'Wood Cabin',
    hp: 1,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Horizontal,
      distance: 3,
      strength: 2,
    },
  },
  a_wall: {
    id: 'a_wall',
    name: 'Stone Wall',
    hp: 99,
    type: CardType.Structure,
  },
  c_cavalry: {
    id: 'c_cavalry',
    name: 'Cavalry',
    hp: 2,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Up, AttackDirection.Down],
      strength: 1,
    },
  },
  c_footman: {
    id: 'c_footman',
    name: 'Footman',
    hp: 1,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 2,
      strength: 1,
    },
  },
  c_dragon: {
    id: 'c_dragon',
    name: 'Dragon',
    hp: 1,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Right],
      strength: 5,
    },
  },
  c_golem: {
    id: 'c_golem',
    name: 'Golem',
    hp: 3,
    type: CardType.Unit,
    attack: {
      strength: 2,
    },
  },
};
