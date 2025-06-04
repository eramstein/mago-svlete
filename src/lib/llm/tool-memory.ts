import { llmService } from './llm-service';
import { LLM_MODEL_TOOLS } from './config';
import type { State } from '../model/main';
import type { Memory } from '../model/model-llm';

export async function generateMemories(gs: State, chatTranscript: string): Promise<Memory[]> {
  let memoryCount = 1;
  if (chatTranscript.length > 5000) {
    memoryCount = 3;
  } else if (chatTranscript.length > 2000) {
    memoryCount = 2;
  }
  const systemMessage = {
    role: 'system',
    content: `
    Summarize the provided chat history into ${memoryCount}-${memoryCount + 1} distinct memories, each focusing on a specific event or topic (e.g., game outcome, social interaction, card trade, future plans). For each memory:
      1. Generate a concise summary (2-4 sentences) capturing the key details.
      2. Provide metadata in JSON format with the following required fields:
        - interaction_type: One of ["game_session", "tournament", "card_trade", "social_event", "conversation"].
        - relationship_status: One of ["friend", "rival", "neutral", "romantic_interest"].
        - sentiment: One of ["amused", "friendly", "tense", "frustrated", "excited", "curious", "confident", "nervous", "competitive", "playful", "nostalgic", "annoyed", "relaxed", "suspicious", "grateful", "disappointed", "eager", "sympathetic", "defensive", "inspired", "indifferent", "jealous", "proud", "embarrassed", "hopeful", "irritated", "warm", "cautious", "admiring", "bored"].
        - trait_expressed: One of ["playful", "strategic", "shy", "bold", "witty", "serious", "kind", "competitive", "curious", "charming", "skeptical", "energetic", "pensive", "loyal", "sarcastic", "optimistic", "cautious", "creative", "grumpy", "confident", "nostalgic", "patient", "impulsive", "helpful", "arrogant", "inquisitive", "relaxed", "proud", "empathetic", "mischievous"].
        - memory_importance: One of ["high", "medium", "low"]        
      4. Output the result as a JSON array of objects, each with "summary" and "metadata" keys.
      5. Do not include any text outside the JSON output.

      **Chat History**:
      ${chatTranscript}

      **Output Format**:
      [
        {
          "summary": "Summary text here",
          "metadata": {
            "interaction_type": "string",
            "relationship_status": "string",
            "sentiment": "string",
            "trait_expressed": "string",
            "memory_importance": "string"
          }
        },
        ...
      ]
    `,
  };
  const response = await llmService.chat({
    model: LLM_MODEL_TOOLS,
    messages: [systemMessage],
    responseFormat: { type: 'json_object' },
  });

  try {
    const json = JSON.parse(llmService.getMessage(response));
    if (!Array.isArray(json)) {
      return [];
    }
    return json.map((memory: any) => {
      if (!memory.summary || !memory.metadata) {
        return {
          summary: JSON.stringify(memory),
          metadata: {
            time: gs.sim.time.ellapsedTime,
            place: gs.sim.places[gs.sim.player.place].name,
            memory_type: 'player_interaction',
          },
        };
      }
      return {
        summary: memory.summary,
        metadata: {
          time: gs.sim.time.ellapsedTime,
          place: gs.sim.places[gs.sim.player.place].name,
          memory_type: 'player_interaction',
          ...memory.metadata,
        },
      };
    });
  } catch (error) {
    return [];
  }
}
