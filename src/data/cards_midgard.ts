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

export const cardsMidgard: Record<string, Omit<CardTemplate, 'cost'>> = {
  m_valhalla: {
    id: 'm_valhalla',
    name: 'Valhalla',
    hp: 6,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Diagonal,
      strength: 2,
    },
    realm: Realm.Midguard,
  },
  m_longhouse: {
    id: 'm_longhouse',
    name: 'Longhouse',
    hp: 4,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Horizontal,
      distance: 2,
      strength: 1,
    },
    realm: Realm.Midguard,
  },
  m_drakkar: {
    id: 'm_drakkar',
    name: 'Drakkar',
    hp: 2,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Horizontal,
      distance: 3,
    },
    realm: Realm.Midguard,
  },
  m_berserker: {
    id: 'm_berserker',
    name: 'Berserker',
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
    realm: Realm.Midguard,
  },
  m_viking: {
    id: 'm_viking',
    name: 'Viking Warrior',
    hp: 2,
    type: CardType.Unit,
    attack: {
      directions: [AttackDirection.Up, AttackDirection.Down],
      strength: 2,
    },
    control: {
      direction: ControlDirection.Cross,
      strength: 1,
    },
    realm: Realm.Midguard,
  },
  m_dwarf: {
    id: 'm_dwarf',
    name: 'Dwarf Smith',
    hp: 1,
    type: CardType.Unit,
    control: {
      direction: ControlDirection.Cross,
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
    realm: Realm.Midguard,
  },
  m_troll: {
    id: 'm_troll',
    name: 'Mountain Troll',
    hp: 4,
    type: CardType.Unit,
    attack: {
      strength: 3,
    },
    control: {
      direction: ControlDirection.Cross,
      distance: 1,
      strength: 3,
    },
    realm: Realm.Midguard,
  },
  m_valkyrie: {
    id: 'm_valkyrie',
    name: 'Valkyrie',
    hp: 2,
    type: CardType.Unit,
    attack: {
      directions: [
        AttackDirection.Up,
        AttackDirection.Down,
        AttackDirection.Left,
        AttackDirection.Right,
      ],
      strength: 1,
    },
    control: {
      direction: ControlDirection.Diagonal,
      distance: 2,
      strength: 1,
    },
    realm: Realm.Midguard,
  },
  m_frost_giant: {
    id: 'm_frost_giant',
    name: 'Frost Giant',
    hp: 5,
    type: CardType.Unit,
    attack: {
      directions: [
        AttackDirection.Up,
        AttackDirection.Down,
        AttackDirection.Left,
        AttackDirection.Right,
      ],
      strength: 4,
    },
    realm: Realm.Midguard,
  },
  m_yggdrasil: {
    id: 'm_yggdrasil',
    name: 'Yggdrasil',
    hp: 8,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.All,
      distance: 2,
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
    realm: Realm.Midguard,
  },
};
