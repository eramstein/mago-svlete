import type { AbilityTargets } from '@lib/model/model-battle';
import { AbilityTrigger, ControlDirection } from '@lib/config/enums-battle';

export const OnDeploy = {
  type: AbilityTrigger.OnDeploy,
};

export const OnTurnStart = {
  type: AbilityTrigger.OnTurnStart,
};

export const TargetEnemies: AbilityTargets = {
  pattern: { direction: ControlDirection.All, distance: 1 },
  condition: (state, card, target) => {
    return card.ownerId !== target.ownerId;
  },
};

export const TargetAllies: AbilityTargets = {
  pattern: { direction: ControlDirection.All, distance: 1 },
  condition: (state, card, target) => {
    return card.ownerId === target.ownerId;
  },
};
