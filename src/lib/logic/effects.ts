import { CardType, ControlDirection } from '../state/enums';
import type { BattleState, CardTemplate, DeployedCard, Position } from '../state/model';
import { deployCard, makeTokenCard } from './card';

export function rebuild(target: DeployedCard | null, value: number) {
  if (!target || target.type !== CardType.Structure) {
    return;
  }
  target.hpCurrent += value;
}

export function heal(target: DeployedCard, value: number) {
  if (target.type !== CardType.Unit) {
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
