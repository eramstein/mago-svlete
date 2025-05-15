import type { CardTemplate } from '../lib/state/model';
import { cardsFrankia } from './cards_frankia';
import { cardsHibernia } from './cards_hibernia';

export const cards: Record<string, CardTemplate> = {
  ...cardsFrankia,
  ...cardsHibernia,
};
