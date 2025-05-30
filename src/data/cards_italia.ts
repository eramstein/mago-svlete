import { AttackDirection, CardType, ControlDirection, Realm } from '@lib/config/enums-battle';
import type { CardTemplate } from '@lib/model/model-battle';

export const cardsItalia: Record<string, CardTemplate> = {
  i_duomo: {
    id: 'i_duomo',
    name: 'Florence Cathedral',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Italia,
    cost: 8,
  },
  i_canals: {
    id: 'i_canals',
    name: 'Venice Canals',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Italia,
    cost: 8,
  },
  i_david: {
    id: 'i_david',
    name: "Michelangelo's David",
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Italia,
    cost: 8,
  },
  i_leonardo: {
    id: 'i_leonardo',
    name: 'Leonardo da Vinci',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Italia,
    cost: 6,
  },
  i_duellist: {
    id: 'i_duellist',
    name: 'Rapier Duellist',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Italia,
    cost: 6,
  },
  i_cannoniere: {
    id: 'i_cannoniere',
    name: 'Cannoniere',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Italia,
    cost: 6,
  },
  i_medici: {
    id: 'i_medici',
    name: 'Medici Banker',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Italia,
    cost: 6,
  },
  i_condottiere: {
    id: 'i_condottiere',
    name: 'Condottiere',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Italia,
    cost: 6,
  },
  i_clocktower: {
    id: 'i_clocktower',
    name: 'Clock Tower',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Italia,
    cost: 8,
  },
  i_architect: {
    id: 'i_architect',
    name: 'Renaissance Architect',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Italia,
    cost: 6,
  },
};
