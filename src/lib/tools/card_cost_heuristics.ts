import { ControlDirection, Keyword } from '../state/enums-battle';
import type { Ability, AttackPattern, Card, ControlPattern } from '../state';

export function estimateCardCost(card: Card) {
  const controlValue = card.control ? estimateControlValue(card.control) : 0;
  const attackValue = card.attack ? estimateAttackValue(card.attack) : 0;
  const hpValue = Math.min(5, Math.round(Math.sqrt(card.hp)));
  const keywordsValue = card.keywords ? estimateKeywordsValue(card.keywords) : 0;
  const abilitiesValue = card.abilities ? estimateAbilitiesValue(card.abilities) : 0;
  return controlValue + attackValue + hpValue + keywordsValue + abilitiesValue;
}

// 1 point for 1 controlled cell
function estimateControlValue(pattern: ControlPattern) {
  let directionValue = 0;
  switch (pattern.direction) {
    case ControlDirection.Horizontal:
      directionValue = 1;
      break;
    case ControlDirection.Vertical:
      directionValue = 1;
      break;
    case ControlDirection.Diagonal:
      directionValue = 2;
      break;
    case ControlDirection.Cross:
      directionValue = 2;
      break;
    case ControlDirection.All:
      directionValue = 3;
      break;
  }
  let distanceValue = 3;
  if (pattern.distance && pattern.distance < 3) {
    distanceValue = pattern.distance;
  }
  return directionValue * distanceValue;
}

function estimateAttackValue(pattern: AttackPattern) {
  let directionValue = 4;
  if (pattern.directions) {
    directionValue = pattern.directions.length;
  }
  directionValue = Math.round(Math.sqrt(directionValue));
  const strengthValue = Math.round(Math.sqrt(pattern.strength));
  return Math.min(10, directionValue * strengthValue);
}

function estimateKeywordsValue(keywords: Partial<Record<Keyword, number>>) {
  let value = 0;
  for (const [keyword, count] of Object.entries(keywords)) {
    value += count * keywordFactors[keyword as Keyword];
  }
  return value;
}

const keywordFactors: Record<Keyword, number> = {
  [Keyword.Armor]: 2,
  [Keyword.Flanking]: 1,
};

function estimateAbilitiesValue(abilities: Ability[]) {
  let value = 0;
  for (const ability of abilities) {
    value += estimateAbilityValue(ability);
  }
  return value;
}

// TODO: Implement this
function estimateAbilityValue(ability: Ability) {
  return 5;
}
