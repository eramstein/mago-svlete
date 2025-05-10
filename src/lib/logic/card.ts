import type { Card, CardTemplate, Position } from '../state/model';
import { state } from '../state/state.svelte';

export const drawCard = (playerId: number, cardTemplate: CardTemplate) => {
  const card = { ...cardTemplate, instanceId: crypto.randomUUID(), ownerId: playerId };
  state.players[playerId].hand.push(card);
};

export const deployCard = (card: Card, position: Position) => {
  console.log('deployCard', card, position);

  state.deployedCards.push({ ...card, position });
  state.players[card.ownerId].hand = state.players[card.ownerId].hand.filter(
    (c) => c.instanceId !== card.instanceId
  );
};
