import { CardType, Keyword } from '../state/enums-battle';
import type { BattleState, CardTemplate, DeployedCard, Position } from '../state';
import { deployCard, makeTokenCard, removeCard } from './card';

export function rebuild(target: DeployedCard | null, value: number) {
  if (!target || target.type !== CardType.Structure) {
    return;
  }
  target.hpCurrent += value;
}

export function heal(target: DeployedCard | null, value: number) {
  if (!target || target.type !== CardType.Unit) {
    return;
  }
  target.hpCurrent += value;
  if (target.hpCurrent > target.hp) {
    target.hpCurrent = target.hp;
  }
}

export function mezz(target: DeployedCard | null) {
  if (!target || target.type !== CardType.Unit || !target.control) {
    return;
  }
  delete target.control;
}

export function summon(
  state: BattleState,
  playerId: number,
  card: CardTemplate,
  position: Position
) {
  const summonedCard = makeTokenCard(playerId, card);
  deployCard(state, summonedCard, position);
}

export function grantKeyword(
  target: DeployedCard | null,
  keyword: Keyword,
  value: number,
  sourceCardId: string
) {
  if (!target) {
    return;
  }
  if (!target.temporaryKeywords) {
    target.temporaryKeywords = [];
  }
  target.temporaryKeywords.push({ keyword, value, sourceCardId });
  target.keywords = {
    ...target.keywords,
    [keyword]: (target.keywords?.[keyword] || 0) + value,
  };
}

export function damageCard(state: BattleState, card: DeployedCard | null, damage: number) {
  if (!card) {
    return;
  }
  card.hpCurrent -= damage;
  if (card.hpCurrent <= 0) {
    removeCard(state, card);
  }
}
