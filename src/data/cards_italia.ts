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

export const cardsItalia: Record<string, Omit<CardTemplate, 'cost'>> = {
  i_duomo: {
    id: 'i_duomo',
    name: 'Florence Cathedral',
    hp: 8,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.All,
      distance: 2,
      strength: 2,
    },
    realm: Realm.Italia,
  },
  i_canals: {
    id: 'i_canals',
    name: 'Venice Canals',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Horizontal,
      distance: 3,
      strength: 1,
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
    realm: Realm.Italia,
  },
  i_david: {
    id: 'i_david',
    name: "Michelangelo's David",
    hp: 5,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
      distance: 2,
      strength: 2,
    },
    keywords: {
      armor: 2,
    },
    realm: Realm.Italia,
  },
  i_leonardo: {
    id: 'i_leonardo',
    name: 'Leonardo da Vinci',
    hp: 3,
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
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetAllies,
        effect: (state, card, target) => {
          rebuild(target, 2);
        },
      },
    ],
    realm: Realm.Italia,
  },
  i_duellist: {
    id: 'i_duellist',
    name: 'Rapier Duellist',
    hp: 2,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Left, AttackDirection.Right],
      strength: 3,
    },
    control: {
      direction: ControlDirection.Horizontal,
      distance: 1,
      strength: 2,
    },
    keywords: {
      flanking: 1,
    },
    realm: Realm.Italia,
  },
  i_cannoniere: {
    id: 'i_cannoniere',
    name: 'Cannoniere',
    hp: 2,
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
    realm: Realm.Italia,
  },
  i_medici: {
    id: 'i_medici',
    name: 'Medici Banker',
    hp: 2,
    type: CardType.Unit,
    control: {
      direction: ControlDirection.Cross,
      distance: 2,
      strength: 2,
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
    realm: Realm.Italia,
  },
  i_condottiere: {
    id: 'i_condottiere',
    name: 'Condottiere',
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
    keywords: {
      armor: 1,
    },
    realm: Realm.Italia,
  },
  i_clocktower: {
    id: 'i_clocktower',
    name: 'Clock Tower',
    hp: 4,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Diagonal,
      distance: 2,
      strength: 1,
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
    realm: Realm.Italia,
  },
  i_architect: {
    id: 'i_architect',
    name: 'Renaissance Architect',
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
    realm: Realm.Italia,
  },
};
