import { drawCard } from './card';
import {
  initialBattleState,
  initializeBoard,
  resetBattleState,
} from '@lib/state/state-battle.svelte';
import { playAiTurn } from './ai';
import { cards } from '@data/cards';

export function initBattle(opponentName: string = 'Default AI') {
  const state = resetBattleState(initialBattleState);
  initializeBoard(state);
  state.turn = 1;
  state.players[1].name = opponentName;
  drawCard(state, 0, cards['h_celtic_village']);
  drawCard(state, 0, cards['h_bear_cabin']);
  drawCard(state, 0, cards['h_cursed_forest']);
  drawCard(state, 0, cards['h_leprechaun']);
  drawCard(state, 0, cards['h_fireflies_clearing']);
  drawCard(state, 0, cards['h_treeman']);
  drawCard(state, 0, cards['h_druid']);
  drawCard(state, 0, cards['h_franz']);
  drawCard(state, 0, cards['h_vai']);
  drawCard(state, 0, cards['h_coeurebene']);
  drawCard(state, 1, cards['m_valhalla']);
  drawCard(state, 1, cards['m_longhouse']);
  drawCard(state, 1, cards['m_drakkar']);
  drawCard(state, 1, cards['m_berserker']);
  drawCard(state, 1, cards['m_viking']);
  drawCard(state, 1, cards['m_dwarf']);
  drawCard(state, 1, cards['m_troll']);
  drawCard(state, 1, cards['m_valkyrie']);
  drawCard(state, 1, cards['m_frost_giant']);
  drawCard(state, 1, cards['m_yggdrasil']);
  playAiTurn(state);
}
