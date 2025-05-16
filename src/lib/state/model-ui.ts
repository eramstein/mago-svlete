import type { Card } from './model';

export type UiState = {
  selectedCard: Card | null;
  draggedCard: Card | null;
  abilityTriggeredCards: Record<string, boolean>;
};
