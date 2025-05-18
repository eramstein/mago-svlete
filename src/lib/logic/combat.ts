import type { BattleState, Position, DeployedCard } from '../model';
import { config, AttackDirection } from '../config';
import { getCardById } from './card';
import { playAttackHeavySound, playAttackLightSound } from '../sounds';
import { getOppositeCell } from './board';
import { damageCard } from './effects';

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
      let strength = applyFlanking(state, attacker, direction);
      if (targetCard.keywords?.armor) {
        strength -= targetCard.keywords.armor;
      }
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
