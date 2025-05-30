import { AttackDirection, CardType, ControlDirection, Realm } from '@lib/config/enums-battle';
import type { CardTemplate } from '@lib/model/model-battle';

export const cardsArabia: Record<string, CardTemplate> = {
  a_palace: {
    id: 'a_palace',
    name: "Caliph's Palace",
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Arabia,
    cost: 8,
  },
  a_cave: {
    id: 'a_cave',
    name: 'Forty Thieves Cave',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Arabia,
    cost: 8,
  },
  a_mosque: {
    id: 'a_mosque',
    name: 'Golden Mosque',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Arabia,
    cost: 8,
  },
  a_suleiman: {
    id: 'a_suleiman',
    name: 'King Suleiman',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Arabia,
    cost: 6,
  },
  a_aladdin: {
    id: 'a_aladdin',
    name: 'Aladdin',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Arabia,
    cost: 6,
  },
  a_djinn: {
    id: 'a_djinn',
    name: 'Djinn',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Arabia,
    cost: 6,
  },
  a_scheherazade: {
    id: 'a_scheherazade',
    name: 'Scheherazade',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Arabia,
    cost: 6,
  },
  a_efrit: {
    id: 'a_efrit',
    name: 'Efrit',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Arabia,
    cost: 6,
  },
  a_roc: {
    id: 'a_roc',
    name: 'Roc',
    hp: 2,
    type: CardType.Unit,
    attack: {
      strength: 1,
    },
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Arabia,
    cost: 6,
  },
  a_lamp: {
    id: 'a_lamp',
    name: 'Magic Lamp',
    hp: 3,
    type: CardType.Structure,
    control: {
      direction: ControlDirection.Cross,
    },
    realm: Realm.Arabia,
    cost: 8,
  },
};
