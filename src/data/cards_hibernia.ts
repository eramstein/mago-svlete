import { OnDeploy, TargetEnemies } from '../lib/logic/ability_shorthands';
import { mezz } from '../lib/logic/effects';
import {
  AbilityTrigger,
  AttackDirection,
  CardType,
  ControlDirection,
  Realm,
} from '../lib/state/enums';
import type { CardTemplate } from '../lib/state/model';

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
};
