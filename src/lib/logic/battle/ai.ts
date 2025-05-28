import { config } from '@lib/config';
import type { BattleState, Position, Card } from '@lib/model/model-battle';
import { getFreePositions } from './board';
import { deployCard } from './card';
import { setPlayerScores } from './victory';

interface MoveEvaluation {
  card: Card;
  position: Position;
  scoreGain: number;
  damagePotential: number;
  totalValue: number;
}

function evaluateMove(state: BattleState, card: Card, position: Position): MoveEvaluation {
  // Create a copy of the state to simulate the move
  const simulatedState = JSON.parse(JSON.stringify(state)) as BattleState;

  // Deploy the card in the simulated state
  deployCard(simulatedState, card, position, true);

  // Calculate score gain
  const originalScores = state.players.map((p) => p.score);
  setPlayerScores(simulatedState);
  const newScores = simulatedState.players.map((p) => p.score);
  const scoreGain = newScores[state.activePlayerId] - originalScores[state.activePlayerId];

  // Calculate potential damage
  let damagePotential = 0;
  const deployedCard = simulatedState.deployedCards.find((c) => c.instanceId === card.instanceId);
  if (deployedCard?.attack) {
    const directions = deployedCard.attack.directions || ['up', 'down', 'left', 'right'];
    directions.forEach((direction) => {
      const targetPos = getTargetPosition(deployedCard.position, direction);
      const targetCard = simulatedState.deployedCards.find(
        (c) =>
          c.ownerId !== deployedCard.ownerId &&
          c.position.x === targetPos.x &&
          c.position.y === targetPos.y
      );
      if (targetCard) {
        // Calculate damage value based on card cost and HP
        const damageValue = (targetCard.cost || 0) + (targetCard.hpCurrent || 0);
        damagePotential += damageValue;
      }
    });
  }

  // Calculate total value (weighted sum of score gain and damage potential)
  const totalValue = scoreGain * 2 + damagePotential;

  return {
    card,
    position,
    scoreGain,
    damagePotential,
    totalValue,
  };
}

function getTargetPosition(position: Position, direction: string): Position {
  switch (direction) {
    case 'up':
      return { x: position.x, y: position.y - 1 };
    case 'down':
      return { x: position.x, y: position.y + 1 };
    case 'left':
      return { x: position.x - 1, y: position.y };
    case 'right':
      return { x: position.x + 1, y: position.y };
    default:
      return position;
  }
}

export function playAiTurn(state: BattleState) {
  const player = state.players[state.activePlayerId];
  const freePositions = getFreePositions(state);

  // Evaluate all possible moves
  const evaluations: MoveEvaluation[] = [];
  for (const card of player.hand) {
    for (const position of freePositions) {
      evaluations.push(evaluateMove(state, card, position));
    }
  }

  // Sort moves by total value
  evaluations.sort((a, b) => b.totalValue - a.totalValue);

  // Execute the best move after a delay
  window.setTimeout(() => {
    const bestMove = evaluations[0];
    if (bestMove) {
      deployCard(state, bestMove.card, bestMove.position);
    }
  }, config.aiDelay);
}
