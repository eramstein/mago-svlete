import { OnDeploy, OnTurnStart, TargetEnemies } from '../lib/logic/ability_shorthands';
import { getFreePositions } from '../lib/logic/board';
import { mezz, summon } from '../lib/logic/effects';
import { randomElement } from '../lib/logic/random';
import {
  AbilityTrigger,
  AttackDirection,
  CardType,
  ControlDirection,
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
};
