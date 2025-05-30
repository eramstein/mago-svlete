import { AttackDirection, CardType, ControlDirection, Realm } from '@lib/config/enums-battle';
import type { CardTemplate } from '@lib/model/model-battle';

export const cardsMidgard: Record<string, CardTemplate> = {
  m_valhalla: {
    id: 'm_valhalla',
    name: 'Valhalla',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Midguard,
    cost: 8,
  },
  m_longhouse: {
    id: 'm_longhouse',
    name: 'Longhouse',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Midguard,
    cost: 8,
  },
  m_drakkar: {
    id: 'm_drakkar',
    name: 'Drakkar',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Midguard,
    cost: 8,
  },
  m_berserker: {
    id: 'm_berserker',
    name: 'Berserker',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Midguard,
    cost: 6,
  },
  m_viking: {
    id: 'm_viking',
    name: 'Viking Warrior',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Midguard,
    cost: 6,
  },
  m_dwarf: {
    id: 'm_dwarf',
    name: 'Dwarf Smith',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Midguard,
    cost: 6,
  },
  m_troll: {
    id: 'm_troll',
    name: 'Mountain Troll',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Midguard,
    cost: 6,
  },
  m_valkyrie: {
    id: 'm_valkyrie',
    name: 'Valkyrie',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Midguard,
    cost: 6,
  },
  m_frost_giant: {
    id: 'm_frost_giant',
    name: 'Frost Giant',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Midguard,
    cost: 6,
  },
  m_yggdrasil: {
    id: 'm_yggdrasil',
    name: 'Yggdrasil',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Midguard,
    cost: 8,
  },
};
