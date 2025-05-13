import type { BattleState, Position } from '../state/model';
import type { DeployedCard } from '../state';
import { AttackDirection, Keyword } from '../state/enums';
import { getCardById, removeCard } from './card';
import { playAttackHeavySound, playAttackLightSound } from '../sounds';
import { config } from '../config';
import { getOppositeCell } from './board';

export function attack(state: BattleState, attacker: DeployedCard) {
  if (!attacker.attack) {
    return;
  }

  const directions = attacker.attack.directions || [
    AttackDirection.Up,
    AttackDirection.Down,
    AttackDirection.Left,
    AttackDirection.Right,
  ];

  directions.forEach((direction, index) => {
    const target = getTargetPosition(attacker.position, direction);
    const targetCard = state.deployedCards.find(
      (c) =>
        c.ownerId !== attacker.ownerId && c.position.x === target.x && c.position.y === target.y
    );
    if (targetCard) {
      const strength = applyFlanking(state, attacker, direction);
      damageCard(state, targetCard, strength);
      window.setTimeout(() => {
        if (attacker.attack?.strength && attacker.attack.strength > 1) {
          playAttackHeavySound();
        } else {
          playAttackLightSound();
        }
      }, config.soundDelay * index);
    }
  });
}

function damageCard(state: BattleState, card: DeployedCard, damage: number) {
  card.hpCurrent -= damage;
  if (card.hpCurrent <= 0) {
    removeCard(state, card);
  }
}

function getTargetPosition(position: Position, direction: AttackDirection): Position {
  switch (direction) {
    case AttackDirection.Up:
      return { x: position.x, y: position.y - 1 };
    case AttackDirection.Down:
      return { x: position.x, y: position.y + 1 };
    case AttackDirection.Left:
      return { x: position.x - 1, y: position.y };
    case AttackDirection.Right:
      return { x: position.x + 1, y: position.y };
  }
}

function applyFlanking(state: BattleState, attacker: DeployedCard, direction: AttackDirection) {
  let strength = attacker.attack?.strength || 0;
  if (attacker.keywords?.flanking) {
    const oppositeCell = getOppositeCell(state, attacker.position, direction);
    if (
      oppositeCell?.occupiedByUnitId &&
      getCardById(state, oppositeCell.occupiedByUnitId)?.ownerId === attacker.ownerId
    ) {
      strength += attacker.keywords.flanking;
    }
  }
  return strength;
}
