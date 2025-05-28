import type { Card, CardTemplate } from '@/lib/model';
import { cardsFrankia } from './cards_frankia';
import { cardsHibernia } from './cards_hibernia';
import { estimateCardCost } from '@/lib/tools/card_cost_heuristics';
import { cardsMidgard } from './cards_midgard';
import { cardsItalia } from './cards_italia';
import { cardsArabia } from './cards_arabia';

export const baseCards: Record<string, Omit<CardTemplate, 'cost'>> = {
  ...cardsFrankia,
  ...cardsHibernia,
  ...cardsMidgard,
  ...cardsArabia,
  ...cardsItalia,
};

// TEMP: for now we compute the cost on the fly, but we should set it manually directly in data
export const cards: Record<string, CardTemplate> = {};

Object.entries(baseCards).forEach(([id, card]) => {
  cards[id] = {
    ...card,
    cost: estimateCardCost(card as Card),
    //cost: 0,
  };
});
console.log(cards);
