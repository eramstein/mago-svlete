import type { Ability, AbilityTargets } from '../state/model';

import { AbilityTrigger } from '../state/enums';
import type { DeployedCard } from '../state/model';
import type { BattleState } from '../state/model';
import { getCellString, getImpactedCellsPreview } from './board';
import { setAbilityTriggeredFlag } from '../state';

export function triggerAbilities(state: BattleState, trigger: AbilityTrigger, card: DeployedCard) {
  if (!card.abilities) {
    return;
  }
  card.abilities.forEach((ability) => {
    if (ability.trigger.type === trigger) {
      triggerAbility(state, card, ability);
    }
  });
}

function triggerAbility(state: BattleState, card: DeployedCard, ability: Ability) {
  // Add visual feedback
  setAbilityTriggeredFlag(card.instanceId);
  // Call ability's effect
  if (ability.targets) {
    const validTargets = getValidTargets(state, card, ability.targets);
    validTargets.forEach((target) => {
      ability.effect(state, card, target);
    });
  } else {
    ability.effect(state, card, null);
  }
}

function getValidTargets(state: BattleState, card: DeployedCard, targets: AbilityTargets) {
  const cellsInPatterns = targets.pattern
    ? getImpactedCellsPreview(targets.pattern, card.position)
    : null;
  return state.deployedCards.filter((target) => {
    if (cellsInPatterns && !cellsInPatterns[getCellString(target.position.x, target.position.y)]) {
      return false;
    }
    if (targets.condition && !targets.condition(state, card, target)) {
      return false;
    }
    return true;
  });
}
