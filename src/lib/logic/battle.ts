import { cards } from '../../data/cards';
import { drawCard } from './card';
import { resetState } from '../state/state.svelte';

export function initBattle() {
  const state = resetState();
  drawCard(state, 0, cards['card-1']);
  drawCard(state, 0, cards['card-2']);
  drawCard(state, 0, cards['card-3']);
  drawCard(state, 0, cards['card-4']);

  drawCard(state, 1, cards['card-1']);
  drawCard(state, 1, cards['card-2']);
  drawCard(state, 1, cards['card-3']);
  drawCard(state, 1, cards['card-4']);
}
