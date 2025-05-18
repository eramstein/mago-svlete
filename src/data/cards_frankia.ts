import { AttackDirection, CardType, ControlDirection, Realm } from '@lib/config/enums-battle';
import type { CardTemplate } from '@lib/model/model-battle';
import { rebuild } from '@lib/logic/battle/effects';
import { OnDeploy, TargetAllies } from '@lib/logic/battle/ability_shorthands';

export const cardsFrankia: Record<string, Omit<CardTemplate, 'cost'>> = {
  f_castle: {
    id: 'f_castle',
    name: 'Camelot',
    hp: 5,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Diagonal,
    },
    realm: Realm.Frankia,
  },
  f_bridge: {
    id: 'f_bridge',
    name: 'Stone Bridge',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Frankia,
  },
  f_cabin: {
    id: 'f_cabin',
    name: 'Wood Cabin',
    hp: 1,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
      distance: 1,
      strength: 2,
    },
    realm: Realm.Frankia,
  },
  f_wall: {
    id: 'f_wall',
    name: 'Stone Wall',
    hp: 99,
    type: CardType.Structure,
    realm: Realm.Frankia,
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetAllies,
        effect: (state, card, target) => {
          rebuild(target, 5);
        },
      },
    ],
  },
  f_cavalry: {
    id: 'f_cavalry',
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
  f_footman: {
    id: 'f_footman',
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
  f_dragon: {
    id: 'f_dragon',
    name: 'Dragon',
    hp: 1,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Right],
      strength: 5,
    },
    realm: Realm.Frankia,
  },
  f_golem: {
    id: 'f_golem',
    name: 'Golem',
    hp: 3,
    type: CardType.Unit,
    attack: {
      strength: 2,
    },
    control: {
      direction: ControlDirection.Cross,
      distance: 1,
      strength: 2,
    },
    realm: Realm.Frankia,
  },
};
