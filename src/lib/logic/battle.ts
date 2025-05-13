import { cards } from '../../data/cards';
import { drawCard } from './card';
import { resetState } from '../state/state.svelte';
import { playAiTurn } from './ai';

export function initBattle() {
  const state = resetState();
  drawCard(state, 0, cards['a_castle']);
  drawCard(state, 0, cards['a_wall']);
  drawCard(state, 0, cards['a_cabin']);
  drawCard(state, 0, cards['a_bridge']);
  drawCard(state, 0, cards['c_cavalry']);
  drawCard(state, 0, cards['c_footman']);
  drawCard(state, 0, cards['c_golem']);
  drawCard(state, 0, cards['c_dragon']);

  drawCard(state, 1, cards['a_castle']);
  drawCard(state, 1, cards['a_wall']);
  drawCard(state, 1, cards['a_cabin']);
  drawCard(state, 1, cards['a_bridge']);
  drawCard(state, 1, cards['c_cavalry']);
  drawCard(state, 1, cards['c_footman']);
  drawCard(state, 1, cards['c_golem']);
  drawCard(state, 1, cards['c_dragon']);

  playAiTurn(state);
}
