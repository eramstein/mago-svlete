import { gs } from '../state/main.svelte';
import { cards } from '../../data/cards';
import { reactToContextChange } from './chat';
import type { DeployedCard } from '../model';

// disabled for now
export async function chatOnCardEntered(newCard: DeployedCard) {
  // const opponentCharacterKey =
  //   gs.sim.characters.find((c) => c.name === gs.battle.players[1].name)?.key || '';
  // const cardTemplate = cards[newCard.id];
  // const currentPlayer = gs.battle.players[newCard.ownerId].name;
  // const description = `${currentPlayer} deployed ${cardTemplate.name} (${cardTemplate.type}).`;
  // // Append to existing context
  // gs.chat.context.game += (gs.chat.context.game ? '\n' : '') + ' --- ' + description;
  // // Have the opponent react to the context change
  // if (newCard.cost > 10) {
  //   await reactToContextChange(gs, opponentCharacterKey, description);
  // }
}

export async function chatOnBattleWon() {
  if (gs.battle.wonByPlayerId === null) {
    return;
  }
  const opponentCharacterKey =
    gs.sim.characters.find((c) => c.name === gs.battle.players[1].name)?.key || '';
  const winner = gs.battle.players[gs.battle.wonByPlayerId].name;
  const description = `${winner} won the battle by ${gs.battle.players[gs.battle.wonByPlayerId].score} points vs ${gs.battle.players[1 - gs.battle.wonByPlayerId].score}.`;
  gs.chat.context.game += (gs.chat.context.game ? '\n' : '') + ' --- ' + description;
  // Have the opponent react to the context change
  await reactToContextChange(gs, opponentCharacterKey, description);
}
