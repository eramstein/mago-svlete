import { drawCard } from './card';
import { resetState } from '../state/state.svelte';
import { playAiTurn } from './ai';
import { cards } from '../../data/cards';

export function initBattle() {
  const state = resetState();
  drawCard(state, 0, cards['f_castle']);
  drawCard(state, 0, cards['f_wall']);
  drawCard(state, 0, cards['f_cabin']);
  drawCard(state, 0, cards['f_bridge']);
  drawCard(state, 0, cards['f_cavalry']);
  drawCard(state, 0, cards['f_footman']);
  drawCard(state, 0, cards['h_druid']);
  drawCard(state, 0, cards['h_franz']);
  drawCard(state, 0, cards['h_vai']);
  drawCard(state, 0, cards['h_coeurebene']);
  drawCard(state, 1, cards['f_castle']);
  drawCard(state, 1, cards['f_wall']);
  drawCard(state, 1, cards['f_cabin']);
  drawCard(state, 1, cards['f_bridge']);
  drawCard(state, 1, cards['f_cavalry']);
  drawCard(state, 1, cards['f_footman']);
  drawCard(state, 1, cards['f_footman']);
  drawCard(state, 1, cards['f_golem']);
  drawCard(state, 1, cards['f_dragon']);
  drawCard(state, 1, cards['f_cabin']);
  playAiTurn(state);
}
