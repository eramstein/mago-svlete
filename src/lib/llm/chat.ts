import ollama from 'ollama';
import { NPCS } from '@/data/npcs';
import type { ChatState, DecodedMessage } from '@/lib/model/model-llm';
import { LLM_MODEL, LLM_MODEL_TOOLS } from './config';
import { PLAYER_CONFIG } from '@/data/npcs/player';
import { getActionFromText } from './action';
import type { State } from '../model/main';
import { addContextFromLocation, getFullContextString, resetContext } from './context';
import { gs } from '../state/main.svelte';
import { addNpcMemory, queryNpcMemory } from './npc-memory';

const SYSTEM_PROMPT_PREFIX = `This is a collaborative writing with the user. 
Make short answers (2-3 sentences).
Try to move the story forward, don't repeat or run into cycles.
Don't make your character too caricatural, their personality traits don't have to always be emphasized.
You are writing a character named`;
const SYSTEM_PROMPT_PREFIX_2 = `The user is writing a character named`;
const SYSTEM_PROMPT_OUTPUT_INSTRUCTIONS =
  'For every user message, replay with what your character says and does.';
const CONTEXT_PREFIX = `
  For context, this is what is happening around your character: 
`;

export function chatWithNpc(chat: ChatState, character: string) {
  chat.chattingWith = character;
  if (chat.history[character]) {
    return;
  }
  initChat(chat, character);
}

function getSystemPrompt(
  chat: ChatState,
  character: string,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  // Get 2 random personality traits
  const traits = NPCS[character].personalityTraits;
  const randomTraits = traits
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .join(' and ');

  const npcPrompt =
    NPCS[character].name +
    '. ' +
    SYSTEM_PROMPT_PREFIX_2 +
    fromCharacterName +
    '. ' +
    NPCS[character].systemPrompt +
    `\n${NPCS[character].name} is ${randomTraits}.`;

  const opinionPrompt = `This is the opinion ${character} has of ${PLAYER_CONFIG.name}: ${chat.characterOpinions[character]}. `;

  addContextFromLocation(gs, character);
  const contextPrompt = CONTEXT_PREFIX + getFullContextString(gs.chat);

  return `
    ${SYSTEM_PROMPT_PREFIX}
    ${npcPrompt}
    ${contextPrompt}
    ${opinionPrompt}
    ${SYSTEM_PROMPT_OUTPUT_INSTRUCTIONS}
  `;
}

export function initChat(
  chat: ChatState,
  character: string,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  chat.history[character] = [
    {
      role: 'system',
      content: getSystemPrompt(chat, character, fromCharacterName),
    },
  ];
}

export async function endChat(chat: ChatState, character: string) {
  const summary = await summarizeChat(chat, character);
  await addNpcMemory(character, summary);
  await updateNpcOpinion(chat, character, summary);
  delete chat.history[character];
  chat.chattingWith = '';
  resetContext(chat);
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
  ollama
    .chat({
      model: LLM_MODEL,
      messages: [{ role: 'user', content: promptPrefix + summary }],
    })
    .then((m) => (chat.characterOpinions[character] = m.message.content));
}

async function summarizeChat(chat: ChatState, character: string) {
  const messages = chat.history[character]
    .filter((c) => c.role !== 'system')
    .map((c) => c.character + ': ' + c.content || '')
    .join(' \n');
  const promptPrefix = `
    Write a 10 or 12 sentences summary of the following story. 
    Write it from the perspective of the character ${character}. It is a memory they are forming.
    Focus on important and memorable elements. Return only the summary, no other text.
    Story: 
  `;
  const memory = await ollama.chat({
    model: LLM_MODEL,
    messages: [{ role: 'user', content: promptPrefix + messages }],
  });
  return memory.message.content;
}

export async function sendMessage(
  gs: State,
  characterKey: string,
  message: string,
  onStream: ((chunk: string) => void) | null,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  const startTime = performance.now();
  console.log(`[sendMessage] Starting message to ${characterKey}`);

  // reset initial system prompt
  gs.chat.history[characterKey][0].content = getSystemPrompt(
    gs.chat,
    characterKey,
    fromCharacterName
  );

  const messageWithSender = message ? `${fromCharacterName} says and does this: ${message}` : '';
  let memoryPrompt = '';
  try {
    memoryPrompt = await queryNpcMemory(characterKey, messageWithSender);
  } catch (error) {
    console.error('Failed to query NPC memory:', error);
    memoryPrompt = ''; // Fallback to empty string if memory query fails
  }
  const messageObject: DecodedMessage = {
    role: 'user',
    content: `${memoryPrompt} ${messageWithSender}`,
    character: fromCharacterName,
  };

  messageObject.displayMessage = message;

  // Use streaming API
  const streamStartTime = performance.now();
  console.log(
    `[sendMessage] memory request in ${(streamStartTime - startTime).toFixed(2)}ms Starting stream request to LLM`
  );

  gs.chat.history[characterKey].push(messageObject);

  const stream = await ollama.chat({
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

  gs.chat.history[characterKey][gs.chat.history[characterKey].length - 1].content =
    messageObject.content.replace(memoryPrompt, '');

  const streamReadyTime = performance.now();
  console.log(
    `[sendMessage] Stream starting in ${(streamReadyTime - streamStartTime).toFixed(2)}ms`
  );

  let fullResponse = '';
  for await (const chunk of stream) {
    fullResponse += chunk.message.content;
    onStream?.(chunk.message.content);
  }

  const streamEndTime = performance.now();
  console.log(
    `[sendMessage] Stream completed in ${(streamEndTime - streamStartTime).toFixed(2)}ms`
  );

  // add NPC response to chat history
  const characterName = gs.sim.characters.find((c) => c.key === characterKey)?.name;
  gs.chat.history[characterKey].push({
    role: 'assistant',
    content: fullResponse,
    character: characterName,
  });

  // every 10 messages, add a summary to the chat history
  if ((gs.chat.history[characterKey].length - 1) % 10 <= 1) {
    summarizeChat(gs.chat, characterKey).then((summary) => {
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

  const endTime = performance.now();
  console.log(`[sendMessage] Total execution time: ${(endTime - startTime).toFixed(2)}ms`);
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
  const response = await ollama.chat({
    model: LLM_MODEL_TOOLS,
    messages: [systemPrompt, question],
    options: {
      temperature: 0.1, // Lower temperature for more deterministic responses
    },
  });
  const answer = response.message.content.trim().toUpperCase();
  return {
    answer: answer === 'YES' ? 'YES' : 'NO', // Ensure we only return YES or NO
    action: proposedAction,
  };
}

export async function reactToContextChange(gs: State, characterKey: string, newContext: string) {
  const characterName = gs.sim.characters.find((c) => c.key === characterKey)?.name;

  if (!gs.chat.history[characterKey]) {
    initChat(gs.chat, characterKey);
  }

  const message = {
    role: 'user',
    content: `The following just happened: ${newContext}. How does your character react to this?`,
  };

  const reaction = await ollama.chat({
    model: LLM_MODEL,
    messages: [...gs.chat.history[characterKey], message],
  });

  gs.chat.history[characterKey].push({
    role: 'assistant',
    content: reaction.message.content,
    character: characterName,
  });
}
