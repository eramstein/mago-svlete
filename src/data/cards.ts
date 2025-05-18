import type { Card, CardTemplate } from '../lib/state/model';
import { cardsFrankia } from './cards_frankia';
import { cardsHibernia } from './cards_hibernia';
import { estimateCardCost } from '../lib/tools/card_cost_heuristics';

export const baseCards: Record<string, Omit<CardTemplate, 'cost'>> = {
  ...cardsFrankia,
  ...cardsHibernia,
};

// TEMP: for now we compute the cost on the fly, but we set it manually directly in data
export const cards: Record<string, CardTemplate> = {};

Object.entries(baseCards).forEach(([id, card]) => {
  cards[id] = {
    ...card,
    cost: estimateCardCost(card as Card),
  };
});

console.log(Object.entries(cards).map(([id, card]) => `${id}: ${card.cost}`));
