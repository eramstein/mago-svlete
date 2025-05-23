import { gs } from '../state/main.svelte';
import { cards } from '../../data/cards';

let previousUnitCount: number = 0;

// Effect to watch changes in battle state that are worth addingto the chat context
function initBattleContext() {
  $effect(() => {
    if (
      previousUnitCount !== gs.battle.deployedCards.length &&
      gs.battle.deployedCards.length > 0
    ) {
      const newCard = gs.battle.deployedCards[gs.battle.deployedCards.length - 1];
      const cardTemplate = cards[newCard.id];
      const currentPlayer = gs.battle.players[newCard.ownerId].name;
      const description = `${currentPlayer} deployed ${cardTemplate.name} (${cardTemplate.type}).`;
      // Append to existing context
      gs.chat.context += (gs.chat.context ? '\n' : '') + description;
    }
    // Update last known state
    previousUnitCount = gs.battle.deployedCards.length;
  });
  if (gs.battle.wonByPlayerId !== null) {
    const winner = gs.battle.players[gs.battle.wonByPlayerId].name;
    gs.chat.context += (gs.chat.context ? '\n' : '') + `${winner} won the battle.`;
  }
}

export { initBattleContext };
