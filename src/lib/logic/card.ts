import type { BattleState, Card, CardTemplate, Position } from '../state/model';
import { passTurn } from './turn';
import { computeBoardControlStatus, isCellOccupied } from './board';
import { attack } from './combat';

export function drawCard(state: BattleState, playerId: number, cardTemplate: CardTemplate) {
  const card = { ...cardTemplate, instanceId: crypto.randomUUID(), ownerId: playerId };
  state.players[playerId].hand.push(card);
}

export function deployCard(state: BattleState, card: Card, position: Position) {
  if (isCellOccupied(state, position.x, position.y)) {
    console.log('Cell is occupied');
    return;
  }
  const deployedCard = { ...card, position, hpCurrent: card.hp };
  state.deployedCards.push(deployedCard);
  state.board[position.x][position.y].occupied = true;
  state.players[card.ownerId].hand = state.players[card.ownerId].hand.filter(
    (c) => c.instanceId !== card.instanceId
  );
  attack(state, deployedCard);
  computeBoardControlStatus(state);
  passTurn(state);
}
