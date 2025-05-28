import {
  AttackDirection,
  CardType,
  ControlDirection,
  Realm,
  Keyword,
} from '@lib/config/enums-battle';
import type { CardTemplate } from '@lib/model/model-battle';
import { rebuild } from '@lib/logic/battle/effects';
import { OnDeploy, TargetAllies } from '@lib/logic/battle/ability-shorthands';

export const cardsArabia: Record<string, Omit<CardTemplate, 'cost'>> = {
  a_palace: {
    id: 'a_palace',
    name: "Caliph's Palace",
    hp: 7,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.All,
      distance: 2,
      strength: 2,
    },
    realm: Realm.Arabia,
  },
  a_cave: {
    id: 'a_cave',
    name: 'Forty Thieves Cave',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Diagonal,
      distance: 2,
    },
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetAllies,
        effect: (state, card, target) => {
          rebuild(target, 1);
        },
      },
    ],
    realm: Realm.Arabia,
  },
  a_mosque: {
    id: 'a_mosque',
    name: 'Golden Mosque',
    hp: 5,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
      distance: 2,
      strength: 1,
    },
    realm: Realm.Arabia,
  },
  a_suleiman: {
    id: 'a_suleiman',
    name: 'King Suleiman',
    hp: 4,
    type: CardType.Unit,
    attack: {
      directions: [
        AttackDirection.Up,
        AttackDirection.Down,
        AttackDirection.Left,
        AttackDirection.Right,
      ],
      strength: 2,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
      strength: 2,
    },
    keywords: {
      armor: 1,
    },
    realm: Realm.Arabia,
  },
  a_aladdin: {
    id: 'a_aladdin',
    name: 'Aladdin',
    hp: 2,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Left, AttackDirection.Right],
      strength: 2,
    },
    control: {
      direction: ControlDirection.Horizontal,
      distance: 2,
      strength: 1,
    },
    realm: Realm.Arabia,
  },
  a_djinn: {
    id: 'a_djinn',
    name: 'Djinn',
    hp: 3,
    type: CardType.Unit,
    attack: {
      directions: [
        AttackDirection.Up,
        AttackDirection.Down,
        AttackDirection.Left,
        AttackDirection.Right,
      ],
      strength: 3,
    },
    control: {
      direction: ControlDirection.Diagonal,
      distance: 2,
      strength: 1,
    },
    realm: Realm.Arabia,
  },
  a_scheherazade: {
    id: 'a_scheherazade',
    name: 'Scheherazade',
    hp: 2,
    type: CardType.Unit,
    control: {
      direction: ControlDirection.All,
      distance: 1,
      strength: 2,
    },
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetAllies,
        effect: (state, card, target) => {
          rebuild(target, 2);
        },
      },
    ],
    realm: Realm.Arabia,
  },
  a_efrit: {
    id: 'a_efrit',
    name: 'Efrit',
    hp: 4,
    type: CardType.Unit,
    attack: {
      directions: [
        AttackDirection.Up,
        AttackDirection.Down,
        AttackDirection.Left,
        AttackDirection.Right,
      ],
      strength: 3,
    },
    keywords: {
      flanking: 1,
    },
    realm: Realm.Arabia,
  },
  a_roc: {
    id: 'a_roc',
    name: 'Roc',
    hp: 3,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Up, AttackDirection.Down],
      strength: 4,
    },
    control: {
      direction: ControlDirection.Vertical,
      distance: 2,
      strength: 1,
    },
    realm: Realm.Arabia,
  },
  a_lamp: {
    id: 'a_lamp',
    name: 'Magic Lamp',
    hp: 2,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
      distance: 1,
      strength: 1,
    },
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetAllies,
        effect: (state, card, target) => {
          rebuild(target, 3);
        },
      },
    ],
    realm: Realm.Arabia,
  },
};
