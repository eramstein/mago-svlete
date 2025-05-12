import type { BattleState, Position } from '../state/model';
import type { DeployedCard } from '../state';
import { AttackDirection } from '../state/enums';

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

  directions.forEach((direction) => {
    const target = getTargetPosition(card.position, direction);
    const targetCard = state.deployedCards.find(
      (c) => c.ownerId !== card.ownerId && c.position.x === target.x && c.position.y === target.y
    );
    if (targetCard) {
      damageCard(state, targetCard, card.attack?.strength || 0);
    }
  });
}

function damageCard(state: BattleState, card: DeployedCard, damage: number) {
  card.hpCurrent -= damage;
  if (card.hpCurrent <= 0) {
    state.deployedCards = state.deployedCards.filter((c) => c.instanceId !== card.instanceId);
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
