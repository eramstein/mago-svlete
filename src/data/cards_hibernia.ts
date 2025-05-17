import {
  OnDeploy,
  OnTurnStart,
  TargetAllies,
  TargetEnemies,
} from '../lib/logic/ability_shorthands';
import { getFreePositions } from '../lib/logic/board';
import { damageCard, grantKeyword, mezz, summon } from '../lib/logic/effects';
import { randomElement } from '../lib/logic/random';
import {
  AbilityTrigger,
  AttackDirection,
  CardType,
  ControlDirection,
  Keyword,
  Realm,
} from '../lib/state/enums';
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
    control: {
      direction: ControlDirection.All,
      distance: 1,
      strength: 20,
    },
    abilities: [
      {
        trigger: OnDeploy,
        targets: TargetAllies,
        effect: (state, card, target) => {
          damageCard(state, target, 20);
        },
      },
    ],
  },
};
