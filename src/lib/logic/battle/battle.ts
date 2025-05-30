import { drawCard } from './card';
import {
  initialBattleState,
  initializeBoard,
  resetBattleState,
} from '@lib/state/state-battle.svelte';
import { playAiTurn } from './ai';
import { cards } from '@data/cards';
import type { Deck } from '@/lib/model/model-sim';

export function initBattle(opponentName: string = 'Default AI', decks: Deck[]) {
  const state = resetBattleState(initialBattleState);
  initializeBoard(state);
  state.turn = 1;
  state.players[1].name = opponentName;
  decks.forEach((deck, deckIndex) => {
    deck.cardIds.forEach((cardId) => {
      drawCard(state, deckIndex, cards[cardId]);
    });
  });
  playAiTurn(state);
}
