import { AttackDirection, CardType, ControlDirection, Realm } from '@lib/config/enums-battle';
import type { CardTemplate } from '@lib/model/model-battle';

export const cardsFrankia: Record<string, CardTemplate> = {
  f_castle: {
    id: 'f_castle',
    name: 'Camelot',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Frankia,
    cost: 8,
  },
  f_bridge: {
    id: 'f_bridge',
    name: 'Stone Bridge',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Frankia,
    cost: 8,
  },
  f_cabin: {
    id: 'f_cabin',
    name: 'Wood Cabin',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Frankia,
    cost: 8,
  },
  f_wall: {
    id: 'f_wall',
    name: 'Stone Wall',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Frankia,
    cost: 8,
  },
  f_cavalry: {
    id: 'f_cavalry',
    name: 'Cavalry',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Frankia,
    cost: 6,
  },
  f_footman: {
    id: 'f_footman',
    name: 'Footman',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Frankia,
    cost: 6,
  },
  f_dragon: {
    id: 'f_dragon',
    name: 'Dragon',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Frankia,
    cost: 6,
  },
  f_golem: {
    id: 'f_golem',
    name: 'Golem',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Frankia,
    cost: 6,
  },
};
