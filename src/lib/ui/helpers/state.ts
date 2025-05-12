import type { Card } from '../../state/model';
import { uiState } from '../../state/state-ui.svelte';

export function toggleCardSelected(card: Card) {
  if (uiState.selectedCard?.id === card.id) {
    uiState.selectedCard = null;
  } else {
    uiState.selectedCard = card;
  }
}

export function cancelCardSelected() {
  uiState.selectedCard = null;
}
