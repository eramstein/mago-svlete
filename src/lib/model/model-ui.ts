import type { UiView } from '../state/state-ui.svelte';
import type { Card } from './model-battle';

export type UiState = {
  selectedCard: Card | null;
  draggedCard: Card | null;
  abilityTriggeredCards: Record<string, boolean>;
  currentView: UiView;
};
