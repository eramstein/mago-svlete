import { CardType } from '../state/enums';
import type { DeployedCard } from '../state/model';

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
