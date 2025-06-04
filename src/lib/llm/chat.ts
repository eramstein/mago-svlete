import { NPCS } from '@/data/npcs';
import type { ChatState, DecodedMessage } from '@/lib/model/model-llm';
import { LLM_MODEL, LLM_MODEL_TOOLS } from './config';
import { PLAYER_CONFIG } from '@/data/npcs/player';
import { getActionFromText } from './action';
import type { State } from '../model/main';
import { addContextFromLocation, getFullContextString, resetContext } from './context';
import { gs } from '../state/main.svelte';
import { addNpcMemory, queryNpcMemory } from './npc-memory';
import { llmService } from './llm-service';
import { generateMemories } from './tool-memory';

const SYSTEM_PROMPT_PREFIX = `This is a collaborative writing with the user.
Try to move the story forward, don't repeat or run into cycles.
You are writing a character named`;
const SYSTEM_PROMPT_PREFIX_2 = `The user is writing a character named`;
const SYSTEM_PROMPT_OUTPUT_INSTRUCTIONS =
  'For every user message, replay with what your character says and does.';

export function chatWithNpc(chat: ChatState, character: string) {
  chat.chattingWith = character;
  if (chat.history[character]) {
    return;
  }
  initChat(chat, character);
}

async function getSystemPrompt(
  chat: ChatState,
  character: string,
  fromCharacterName: string = PLAYER_CONFIG.name,
  messageWithSender: string = ''
) {
  const traits = NPCS[character].personalityTraits.join(', ');
  const traitsPromps = `
    Your traits are: ${traits}. 
    For each player message, choose the trait most relevant to the context (e.g., humorous for casual chats, competitive for matches) and express it subtly in your response. Avoid overemphasizing traits; respond naturally as a real person.
  `;

  const npcPrompt = `    
    ${SYSTEM_PROMPT_PREFIX_2} ${fromCharacterName}.
    ${NPCS[character].systemPrompt}
    ${traitsPromps}
  `;

  const opinionPrompt = `This is the opinion ${character} has of ${PLAYER_CONFIG.name}: ${chat.characterOpinions[character]}. `;

  addContextFromLocation(gs, character);
  const contextPrompt = getFullContextString(gs.chat);

  let memoryPrompt = '';
  if (messageWithSender) {
    memoryPrompt = await queryNpcMemory(character, messageWithSender);
    memoryPrompt = `If relevant, reference a past interaction with ${fromCharacterName} from this memory: ${memoryPrompt}`;
  }

  return `
    ${SYSTEM_PROMPT_PREFIX} ${NPCS[character].name}.
    ${npcPrompt}
    ${contextPrompt}
    ${opinionPrompt}
    ${memoryPrompt}
    ${SYSTEM_PROMPT_OUTPUT_INSTRUCTIONS}    
  `;
}

export async function initChat(
  chat: ChatState,
  character: string,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  chat.history[character] = [
    {
      role: 'system',
      content: await getSystemPrompt(chat, character, fromCharacterName),
    },
  ];
}

export async function endChat(gs: State, character: string) {
  const chatHistory = gs.chat.history[character]
    .filter((c) => c.role !== 'system')
    .map((c) => c.content || '')
    .join(' \n');
  const memories = await generateMemories(gs, chatHistory);
  let summary = '';
  memories.forEach((memory) => {
    if (memory) {
      addNpcMemory(character, memory);
      summary += memory.summary + '\n';
    }
  });
  updateNpcOpinion(gs.chat, character, summary);
  delete gs.chat.history[character];
  gs.chat.chattingWith = '';
  resetContext(gs.chat);
}

function updateNpcOpinion(chat: ChatState, character: string, summary: string) {
  const opinion = chat.characterOpinions[character];
  const promptPrefix = `
    This was the opinion ${character} had of ${PLAYER_CONFIG.name}: ${opinion}
    Update the opinion of ${character} of ${PLAYER_CONFIG.name} based on the following summary: ${summary}
    Keep track of how well the characters know each other now, how their opinions and feelings evolve.
    For example, after a very positive encounter between 2 acquaintances, their opinion of each other should be more positive than before, and the fact that they know each other better noted.
    Return only the updated opinion, no other text.
  `;
  llmService
    .chat({
      model: LLM_MODEL,
      messages: [{ role: 'user', content: promptPrefix + summary }],
      stream: false,
    })
    .then((m) => (chat.characterOpinions[character] = llmService.getMessage(m)));
}

async function summarizeChat(chatHistory: string, character: string) {
  const prompt = `
    Summarize all interactions between these 2 characters into 2-3 sentences, focusing on key events (e.g., game outcomes, social moments, plans). Output only the summary text.
    Test to summarize: ${chatHistory}
  `;
  const memory = await llmService.chat({
    model: LLM_MODEL,
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  });
  return llmService.getMessage(memory);
}

export async function sendMessage(
  gs: State,
  characterKey: string,
  message: string,
  onStream: ((chunk: string) => void) | null,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  const messageWithSender = message ? `${fromCharacterName} says and does this: ${message}` : '';

  // reset initial system prompt
  gs.chat.history[characterKey][0].content = await getSystemPrompt(
    gs.chat,
    characterKey,
    fromCharacterName,
    messageWithSender
  );

  const messageObject: DecodedMessage = {
    role: 'user',
    content: `${messageWithSender}`,
    character: fromCharacterName,
  };

  messageObject.displayMessage = message;

  gs.chat.history[characterKey].push(messageObject);

  const stream = await llmService.chat({
    model: LLM_MODEL,
    messages: [
      ...gs.chat.history[characterKey].filter((c) => c.role === 'system'),
      ...gs.chat.history[characterKey].filter((c) => c.role !== 'system').slice(-5),
    ],
    stream: true,
    options: {
      temperature: 0.7,
      repeat_penalty: 1.1,
      top_k: 40,
      top_p: 0.9,
    },
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const convertedChunk = llmService.getStreamChunk(chunk);
    fullResponse += convertedChunk;
    onStream?.(convertedChunk);
  }

  // add NPC response to chat history
  const characterName = gs.sim.characters.find((c) => c.key === characterKey)?.name;
  gs.chat.history[characterKey].push({
    role: 'assistant',
    content: fullResponse,
    character: characterName,
  });

  // every 10 messages, add a summary to the chat history
  // the 2nd system prompt is the summary
  const SUMMARY_INTERVAL = 10;

  if ((gs.chat.history[characterKey].length - 1) % SUMMARY_INTERVAL <= 1) {
    const currentSystemPrompts = gs.chat.history[characterKey].filter((m) => m.role === 'system');
    const currentSummary = currentSystemPrompts.length > 1 ? currentSystemPrompts[1].content : null;
    const messagesToSummarize = gs.chat.history[characterKey]
      .filter((m) => m.role !== 'system')
      .slice(2 - SUMMARY_INTERVAL)
      .map((m) => m.content || '')
      .join(' \n');
    const summayPrompt = currentSummary
      ? 'Summary of previous events: ' + currentSummary + '\n\n New events:' + messagesToSummarize
      : messagesToSummarize;
    summarizeChat(summayPrompt, characterKey).then((summary) => {
      // Keep the first system prompt and remove all other system prompts
      const firstSystemPrompt = gs.chat.history[characterKey].find((m) => m.role === 'system');
      const nonSystemMessages = gs.chat.history[characterKey].filter((m) => m.role !== 'system');

      // Reconstruct history with first system prompt, non-system messages, and new summary
      gs.chat.history[characterKey] = [
        ...(firstSystemPrompt ? [firstSystemPrompt] : []),
        ...nonSystemMessages,
        {
          role: 'system',
          content: `Summary of earlier parts of the conversation: ${summary}`,
        },
      ];
    });
  }
}

export async function findActionRequestInMessage(
  gs: State,
  characterKey: string,
  message: string,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  const characterName = gs.sim.characters.find((c) => c.key === characterKey)?.name;
  const messageWithCharacters = `${fromCharacterName} tells ${characterName} this: ${message}`;
  const action = await getActionFromText(messageWithCharacters);
  return action;
}

export async function checkProposedAction(gs: State, npcKey: string, message: string) {
  const proposedAction = await findActionRequestInMessage(gs, npcKey, message);
  if (!proposedAction) {
    return null;
  }
  const systemPrompt = {
    role: 'system',
    content: `
      You are a system which decides whether an answer to a question or either YES or NO.
      You MUST respond with EXACTLY one of these two words: "YES" or "NO".
      Always give an answer.
      Do not include any other text, explanations, or punctuation.
      Just respond with either "YES" or "NO".
      In case of doubt, answer YES.
    `,
  };
  const question = {
    role: 'user',
    content: `
      This was the question: ${message}
      This was the answer the person gave: ${gs.chat.history[npcKey].slice(-1)[0].content}
      Is it a YES or a NO?
    `,
  };
  const response = await llmService.chat({
    model: LLM_MODEL_TOOLS,
    messages: [systemPrompt, question],
    options: {
      temperature: 0.1, // Lower temperature for more deterministic responses
    },
  });
  const answer = llmService.getMessage(response).trim().toUpperCase();
  return {
    answer: answer === 'YES' ? 'YES' : 'NO', // Ensure we only return YES or NO
    action: proposedAction,
  };
}

export async function reactToContextChange(gs: State, characterKey: string, newContext: string) {
  const characterName = gs.sim.characters.find((c) => c.key === characterKey)?.name;

  if (!gs.chat.history[characterKey]) {
    await initChat(gs.chat, characterKey);
  }

  const message = {
    role: 'user',
    content: `The following just happened: ${newContext}. How does your character react to this?`,
  };

  const reaction = await llmService.chat({
    model: LLM_MODEL,
    messages: [...gs.chat.history[characterKey], message],
  });

  gs.chat.history[characterKey].push({
    role: 'assistant',
    content: llmService.getMessage(reaction),
    character: characterName,
  });
}
