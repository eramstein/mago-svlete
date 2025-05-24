import { gs } from '../state/main.svelte';
import { cards } from '../../data/cards';
import { reactToContextChange } from './chat';

let previousUnitCount: number = 0;

// Effect to watch changes in battle state that are worth addingto the chat context
async function initBattleContext() {
  const handleBattleChanges = async () => {
    const opponentCharacterKey =
      gs.sim.characters.find((c) => c.name === gs.battle.players[1].name)?.key || '';

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
      // Have the opponent react to the context change
      if (newCard.cost > 10) {
        await reactToContextChange(gs, opponentCharacterKey, description);
      }
    }
    if (gs.battle.wonByPlayerId !== null) {
      const winner = gs.battle.players[gs.battle.wonByPlayerId].name;
      const description = `${winner} won the battle.`;
      gs.chat.context += (gs.chat.context ? '\n' : '') + description;
      await reactToContextChange(gs, opponentCharacterKey, description);
    }

    // Update last known state
    previousUnitCount = gs.battle.deployedCards.length;
  };

  $effect(() => {
    handleBattleChanges();
  });
}

export { initBattleContext };
