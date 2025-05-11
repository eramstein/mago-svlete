import type { BattleState, Card, CardTemplate, Position } from '../state/model';
import { passTurn } from './turn';
import { isCellOccupied } from './board';

export function drawCard(state: BattleState, playerId: number, cardTemplate: CardTemplate) {
  const card = { ...cardTemplate, instanceId: crypto.randomUUID(), ownerId: playerId };
  state.players[playerId].hand.push(card);
}

export function deployCard(state: BattleState, card: Card, position: Position) {
  if (isCellOccupied(state, position.x, position.y)) {
    console.log('Cell is occupied');
    return;
  }
  state.deployedCards.push({ ...card, position });
  state.players[card.ownerId].hand = state.players[card.ownerId].hand.filter(
    (c) => c.instanceId !== card.instanceId
  );
  passTurn(state);
}
