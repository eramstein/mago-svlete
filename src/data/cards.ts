import { AttackDirection, CardType, ControlDirection, Keyword, Realm } from '../lib/state/enums';
import type { CardTemplate } from '../lib/state/model';

export const cards: Record<string, CardTemplate> = {
  a_castle: {
    id: 'a_castle',
    name: 'Camelot',
    hp: 5,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.All,
    },
    realm: Realm.Frankia,
  },
  a_bridge: {
    id: 'a_bridge',
    name: 'Stone Bridge',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Vertical,
      distance: 2,
    },
    realm: Realm.Frankia,
  },
  a_cabin: {
    id: 'a_cabin',
    name: 'Wood Cabin',
    hp: 1,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.All,
      distance: 1,
      strength: 2,
    },
    realm: Realm.Frankia,
  },
  a_wall: {
    id: 'a_wall',
    name: 'Stone Wall',
    hp: 99,
    type: CardType.Structure,
    realm: Realm.Frankia,
  },
  c_cavalry: {
    id: 'c_cavalry',
    name: 'Cavalry',
    hp: 2,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Left, AttackDirection.Right],
      strength: 1,
    },
    control: {
      direction: ControlDirection.Horizontal,
      distance: 1,
      strength: 1,
    },
    keywords: {
      flanking: 1,
    },
    realm: Realm.Frankia,
  },
  c_footman: {
    id: 'c_footman',
    name: 'Footman',
    hp: 1,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Up, AttackDirection.Down],
      strength: 2,
    },
    control: {
      direction: ControlDirection.Vertical,
      strength: 1,
    },
    realm: Realm.Frankia,
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
    realm: Realm.Frankia,
  },
  c_golem: {
    id: 'c_golem',
    name: 'Golem',
    hp: 3,
    type: CardType.Unit,
    attack: {
      strength: 2,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
      strength: 2,
    },
    realm: Realm.Frankia,
  },
};
