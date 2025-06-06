import type {
  BattleState,
  Card,
  CardTemplate,
  DeployedCard,
  Position,
} from '@lib/model/model-battle';
import { passTurn } from './turn';
import { computeBoardControlStatus, isCellOccupied } from './board';
import { attack } from './combat';
import { playDeploySound } from '@lib/sounds';
import { setPlayerScores } from './victory';
import { triggerAbilities } from './abilities';
import { AbilityTrigger } from '@lib/config/enums-battle';
import { chatOnCardEntered } from '@/lib/llm/battle-context.svelte';

export function drawCard(state: BattleState, playerId: number, cardTemplate: CardTemplate) {
  const card = { ...cardTemplate, instanceId: crypto.randomUUID(), ownerId: playerId };
  state.players[playerId].hand.push(card);
}

export function deployCard(
  state: BattleState,
  card: Card,
  position: Position,
  simulation: boolean = false
) {
  if (isCellOccupied(state, position.x, position.y)) {
    console.log('Cell is occupied');
    return;
  }
  const deployedCard = { ...card, position, hpCurrent: card.hp };
  state.deployedCards.push(deployedCard);
  state.board[position.x][position.y].occupiedByUnitId = deployedCard.instanceId;
  state.players[card.ownerId].hand = state.players[card.ownerId].hand.filter(
    (c) => c.instanceId !== card.instanceId
  );
  attack(state, deployedCard, simulation);
  triggerAbilities(state, AbilityTrigger.OnDeploy, deployedCard);
  computeBoardControlStatus(state);
  setPlayerScores(state);
  if (!simulation) {
    playDeploySound();
  }
  if (!card.summoned && !simulation) {
    chatOnCardEntered(deployedCard);
    passTurn(state);
  }
}

export function removeCard(state: BattleState, card: DeployedCard) {
  state.deployedCards = state.deployedCards.filter((c) => c.instanceId !== card.instanceId);
  state.board[card.position.x][card.position.y].occupiedByUnitId = null;
  // if that card was granting temporary keywords, remove them
  state.deployedCards.forEach((c) => {
    if (c.temporaryKeywords) {
      c.temporaryKeywords
        .filter((kw) => kw.sourceCardId === card.instanceId)
        .forEach((kw) => {
          if (c.keywords?.[kw.keyword]) {
            const currentValue = c.keywords[kw.keyword] ?? 0;
            const newValue = currentValue - kw.value;
            console.log('removing keyword', kw.keyword, 'from', c.instanceId, 'to', newValue);
            if (newValue <= 0) {
              delete c.keywords[kw.keyword];
            } else {
              c.keywords[kw.keyword] = newValue;
            }
          }
        });
    }
  });
  computeBoardControlStatus(state);
}

export function getCardById(state: BattleState, id: string) {
  return state.deployedCards.find((c) => c.instanceId === id);
}

export function makeTokenCard(playerId: number, cardTemplate: CardTemplate) {
  return { ...cardTemplate, instanceId: crypto.randomUUID(), ownerId: playerId, summoned: true };
}
