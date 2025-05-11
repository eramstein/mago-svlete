import type { UiState } from './model-ui';

export const uiState: UiState = $state({
  selectedCard: null,
  draggedCard: null,
});
