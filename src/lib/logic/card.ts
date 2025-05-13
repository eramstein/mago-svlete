import type { BattleState, Card, CardTemplate, DeployedCard, Position } from '../state/model';
import { passTurn } from './turn';
import { computeBoardControlStatus, isCellOccupied } from './board';
import { attack } from './combat';
import { playDeploySound } from '../sounds';
import { setPlayerScores } from './victory';
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
  state.board[position.x][position.y].occupiedByUnitId = deployedCard.instanceId;
  state.players[card.ownerId].hand = state.players[card.ownerId].hand.filter(
    (c) => c.instanceId !== card.instanceId
  );
  attack(state, deployedCard);
  computeBoardControlStatus(state);
  setPlayerScores(state);
  playDeploySound();
  passTurn(state);
}

export function removeCard(state: BattleState, card: DeployedCard) {
  state.deployedCards = state.deployedCards.filter((c) => c.instanceId !== card.instanceId);
  state.board[card.position.x][card.position.y].occupiedByUnitId = null;
}

export function getCardById(state: BattleState, id: string) {
  return state.deployedCards.find((c) => c.instanceId === id);
}
