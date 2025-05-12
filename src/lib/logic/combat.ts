import type { BattleState, Position } from '../state/model';
import type { DeployedCard } from '../state';
import { AttackDirection } from '../state/enums';
import { removeCard } from './card';
import { playAttackHeavySound, playAttackLightSound } from '../sounds';
import { config } from '../config';

export function attack(state: BattleState, card: DeployedCard) {
  if (!card.attack) {
    return;
  }

  const directions = card.attack.directions || [
    AttackDirection.Up,
    AttackDirection.Down,
    AttackDirection.Left,
    AttackDirection.Right,
  ];

  directions.forEach((direction, index) => {
    const target = getTargetPosition(card.position, direction);
    const targetCard = state.deployedCards.find(
      (c) => c.ownerId !== card.ownerId && c.position.x === target.x && c.position.y === target.y
    );
    if (targetCard) {
      damageCard(state, targetCard, card.attack?.strength || 0);
      window.setTimeout(() => {
        if (card.attack?.strength && card.attack.strength > 1) {
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
