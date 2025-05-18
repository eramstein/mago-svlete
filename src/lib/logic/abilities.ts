import type { Ability, AbilityTargets, DeployedCard, BattleState } from '../model';
import { AbilityTrigger } from '../config/enums-battle';
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

export function getAbilityDescription(ability: Ability): string {
  const parts: string[] = [];

  // Add target description
  if (ability.targets) {
    if (ability.targets.pattern) {
      const direction = ability.targets.pattern.direction;
      const distance = ability.targets.pattern.distance || 1;
      parts.push(`Targets ${direction} units within ${distance} space${distance > 1 ? 's' : ''}`);
    }
    if (ability.targets.condition) {
      // TO DO: find a way to auto write condition description
    }
  }

  // Add effect description by analyzing the effect function's body
  const effectStr = ability.effect.toString();
  if (effectStr.includes('mezz(')) {
    parts.push('Removes control from target');
  } else if (effectStr.includes('damageCard(')) {
    parts.push('Deals damage to target');
  } else if (effectStr.includes('grantKeyword(')) {
    parts.push('Grants a keyword to target');
  } else if (effectStr.includes('rebuild(')) {
    parts.push('Repairs target structure');
  } else if (effectStr.includes('summon(')) {
    parts.push('Summons a new unit');
  } else if (effectStr.includes('heal(')) {
    parts.push('Heals target unit');
  } else {
    parts.push('Applies an effect to target');
  }

  return parts.join('. ');
}
