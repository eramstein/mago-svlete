import type { State } from '../model/main';
import { LLM_MODEL_TOOLS } from './config';
import { PLAYER_CONFIG } from '@/data/npcs/player';
import { queryNpcMemory } from './npc-memory';
import { cards } from '@/data/cards';
import { NPCS } from '@/data/npcs';
import { llmService } from './llm-service';

export async function proposeTrade(gs: State, npcKey: string, card1: string, card2: string) {
  const card1Name = cards[card1].name;
  const card2Name = cards[card2].name;
  const proposedAction = `${PLAYER_CONFIG.name} proposes to trade his ${card1Name} card for your ${card2Name} card`;
  const npcOpinion = gs.chat.characterOpinions[npcKey];

  // Get NPC's card valuations from their character role
  const npcRole = NPCS[npcKey];
  const card1Value = npcRole?.cardsValuation?.[card1] ?? 50;
  const card2Value = npcRole?.cardsValuation?.[card2] ?? 50;

  // Query relevant memories for this trade
  const relevantMemories = await queryNpcMemory(npcKey, proposedAction);

  // Add the proposed trade as a user message in chat history
  gs.chat.history[npcKey].push({
    role: 'user',
    content: proposedAction,
  });

  const systemPrompt = {
    role: 'system',
    content: `
      You are a system which decides whether an answer to a trade proposal is YES or NO.
      Your response MUST start with either "YES" or "NO" followed by what the character would say in response.
      Example responses:
      "YES, I'd be happy to make that trade!"
      "NO, I'm not interested in that deal."
      Always give an answer starting with YES or NO.
      Include the character's dialogue after the YES/NO.
    `,
  };
  const question = {
    role: 'user',
    content: `      
      Your opinion of ${PLAYER_CONFIG.name}: ${npcOpinion}
      ${relevantMemories}
      --- 
      Card Values:
      - ${card1Name}: ${card1Value} points
      - ${card2Name}: ${card2Value} points
      --- 
      ${proposedAction}
      --- 
      What is your response? Start with YES or NO followed by what you would say.
    `,
  };
  const response = await llmService.chat({
    model: LLM_MODEL_TOOLS,
    messages: [systemPrompt, question],
    stream: false,
    options: {
      temperature: 0.5, // Lower temperature for more deterministic responses
    },
  });
  const fullResponse = llmService.getMessage(response).trim();
  gs.chat.history[npcKey].push({
    role: 'assistant',
    content: fullResponse,
  });
  return {
    answer: fullResponse,
    action: proposedAction,
  };
}
