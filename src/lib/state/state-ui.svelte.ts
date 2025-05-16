import type { UiState } from './model-ui';

export const uiState: UiState = $state({
  selectedCard: null,
  draggedCard: null,
  abilityTriggeredCards: {},
});

// Gives a hint to the UI that an ability has been triggered
export function setAbilityTriggeredFlag(cardInstanceId: string) {
  setTimeout(() => {
    uiState.abilityTriggeredCards[cardInstanceId] = true;
  }, 10);
  setTimeout(() => {
    uiState.abilityTriggeredCards[cardInstanceId] = false;
  }, 500);
}
