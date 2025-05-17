import {
  OnDeploy,
  OnTurnStart,
  TargetAllies,
  TargetEnemies,
} from '../lib/logic/ability_shorthands';
import { getFreePositions } from '../lib/logic/board';
import { damageCard, grantKeyword, heal, mezz, summon } from '../lib/logic/effects';
import { randomElement } from '../lib/logic/random';
import { AttackDirection, CardType, ControlDirection, Keyword, Realm } from '../lib/state/enums';
import type { CardTemplate } from '../lib/state/model';
import { cards } from './cards';

export const cardsHibernia: Record<string, CardTemplate> = {
  h_vai: {
    id: 'h_vai',
    name: 'Vai',
    hp: 5,
    type: CardType.Unit,
    control: {
      direction: ControlDirection.All,
      distance: 1,
    },
    realm: Realm.Hibernia,
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetEnemies,
        effect: (state, card, target) => {
          mezz(target);
        },
      },
    ],
  },
  h_coeurebene: {
    id: 'h_coeurebene',
    name: 'Coeurebene',
    hp: 3,
    type: CardType.Unit,
    realm: Realm.Hibernia,
    abilities: [
      {
        trigger: OnTurnStart,
        effect: (state, card) => {
          const pos = randomElement(getFreePositions(state));
          summon(state, card.ownerId, cards['h_shrooms_stream'], pos);
        },
      },
    ],
  },
  h_shrooms_stream: {
    id: 'h_shrooms_stream',
    name: 'Shrooms Stream',
    hp: 3,
    type: CardType.Structure,
    realm: Realm.Hibernia,
    control: {
      direction: ControlDirection.Cross,
      distance: 1,
    },
  },
  h_franz: {
    id: 'h_franz',
    name: 'Franz',
    hp: 6,
    type: CardType.Unit,
    realm: Realm.Hibernia,
    control: {
      direction: ControlDirection.Cross,
      distance: 1,
    },
    keywords: {
      armor: 1,
    },
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetAllies,
        effect: (state, card, target) => {
          grantKeyword(target, Keyword.Armor, 1, card.instanceId);
        },
      },
    ],
  },
  h_druid: {
    id: 'h_druid',
    name: 'Druid',
    hp: 4,
    type: CardType.Unit,
    realm: Realm.Hibernia,
    attack: {
      directions: [AttackDirection.Up, AttackDirection.Down],
      strength: 2,
    },
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetAllies,
        effect: (state, card, target) => {
          heal(target, 20);
        },
      },
    ],
  },
  h_celtic_village: {
    id: 'h_celtic_village',
    name: 'Celtic Village',
    hp: 8,
    type: CardType.Structure,
    realm: Realm.Hibernia,
    control: {
      direction: ControlDirection.Horizontal,
      strength: 1,
    },
  },
  h_bear_cabin: {
    id: 'h_bear_cabin',
    name: 'Bear Cabin',
    hp: 2,
    type: CardType.Structure,
    realm: Realm.Hibernia,
    control: {
      direction: ControlDirection.Cross,
      strength: 1,
      distance: 1,
    },
    attack: {
      strength: 1,
    },
  },
  h_cursed_forest: {
    id: 'h_cursed_forest',
    name: 'Cursed Forest',
    hp: 3,
    type: CardType.Structure,
    realm: Realm.Hibernia,
    control: {
      direction: ControlDirection.All,
      strength: 5,
      distance: 1,
    },
  },
  h_fireflies_clearing: {
    id: 'h_fireflies_clearing',
    name: 'Fireflies Clearing',
    hp: 99,
    type: CardType.Structure,
    realm: Realm.Hibernia,
    control: {
      direction: ControlDirection.Diagonal,
    },
  },
  h_leprechaun: {
    id: 'h_leprechaun',
    name: 'Leprechaun',
    hp: 3,
    type: CardType.Unit,
    realm: Realm.Hibernia,
    abilities: [
      {
        trigger: OnTurnStart,
        targets: TargetEnemies,
        effect: (state, card, target) => {
          damageCard(state, target, 1);
        },
      },
    ],
  },
  h_treeman: {
    id: 'h_treeman',
    name: 'Treeman',
    hp: 5,
    type: CardType.Structure,
    realm: Realm.Hibernia,
    keywords: {
      armor: 3,
    },
    control: {
      direction: ControlDirection.Vertical,
    },
  },
};
