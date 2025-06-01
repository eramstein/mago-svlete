import type { UiState } from '../model/model-ui';

export enum UiView {
  Battle,
  Sim,
  Collection,
  Trade,
}

export const uiState: UiState = $state({
  selectedCard: null,
  draggedCard: null,
  abilityTriggeredCards: {},
  currentView: UiView.Sim,
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
