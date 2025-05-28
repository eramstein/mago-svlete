import ollama from 'ollama';
import { NPCS } from '@/data/npcs';
import type { ChatState, DecodedMessage, MessageExpansion } from '@/lib/model/model-llm';
import { vectorDatabaseClient } from './vector-db';
import { LLM_MODEL, LLM_MODEL_TOOLS } from './config';
import { PLAYER_CONFIG } from '@/data/npcs/player';
import { getActionFromText } from './action';
import { ACTIONS } from '../logic/sim/action-types';
import type { SimState } from '../model';
import type { State } from '../model/main';
import { addContextFromLocation, getFullContextString, resetContext } from './context';
import { gs } from '../state/main.svelte';

const SYSTEM_PROMPT_PREFIX = `
  This is a collaborative writing with the user. You are writing a character named 
`;
const SYSTEM_PROMPT_PREFIX_2 = `
  The user is writing a character named 
`;
const SYSTEM_PROMPT_OUTPUT_INSTRUCTIONS = `
Return a JSON output describing what your character says and what actions he takes in that interaction. Format:
{
  "speech": "<what your character says>",
  "actions": "<what your character does>"
}
Return only ONE such object. Do not return multiple objects.
IMPORTANT: All property values MUST be enclosed in double quotes. 
Do not use single quotes or omit quotes.
Don't forget the comma before "actions".
Example of correct format:
{
  "speech": "Hello there!",
  "actions": "waves hand"
}
`;
const CONTEXT_PREFIX = `
  For context, this is what is happening around your character: 
`;

export async function initNpcMemory(sim: SimState) {
  sim.characters.forEach(async (character) => {
    const collection = await vectorDatabaseClient.getOrCreateCollection({
      name: character.key,
    });
    await collection.upsert({
      documents: NPCS[character.key].initialMemories,
      ids: NPCS[character.key].initialMemories.map((_, i) => character.key + ' memory ' + i),
    });
  });
  console.log('NPCs memory initalized');
}

async function queryNpcMemory(characterKey: string, message: string) {
  // Query character's personal memories
  const characterCollection = await vectorDatabaseClient.getOrCreateCollection({
    name: characterKey,
  });
  const characterResults = await characterCollection.query({
    queryTexts: message,
    nResults: 1,
  });

  // Query world memories
  const worldCollection = await vectorDatabaseClient.getOrCreateCollection({
    name: 'world',
  });
  const worldResults = await worldCollection.query({
    queryTexts: message,
    nResults: 1,
  });

  let response = '';

  if (characterResults.documents.length) {
    response +=
      'The following personal memory is relevant: ' + characterResults.documents[0] + '. ';
  }

  if (worldResults.documents.length) {
    response += 'The following world knowledge is relevant: ' + worldResults.documents[0] + '. ';
  }

  console.log('queryNpcMemory', characterKey, message, response);
  return response;
}

async function addNpcMemory(characterKey: string, message: string) {
  const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const collection = await vectorDatabaseClient.getOrCreateCollection({
    name: characterKey,
  });
  collection.add({
    ids: [uid],
    metadatas: [{ type: 'c' }],
    documents: [message],
  });
}

export function chatWithNpc(chat: ChatState, character: string) {
  chat.chattingWith = character;
  if (chat.history[character]) {
    return;
  }
  initChat(chat, character);
}

export function initChat(
  chat: ChatState,
  character: string,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  const npcPrompt =
    NPCS[character].name +
    '. ' +
    SYSTEM_PROMPT_PREFIX_2 +
    fromCharacterName +
    '. ' +
    NPCS[character].systemPrompt;
  chat.history[character] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT_PREFIX + npcPrompt + SYSTEM_PROMPT_OUTPUT_INSTRUCTIONS,
    },
  ];
  addContextFromLocation(gs, character);
}

export async function endChat(chat: ChatState, character: string) {
  const messages = chat.history[character]
    .filter((c) => c.role !== 'system')
    .map((c) => c.character + ': ' + c.content || '')
    .join(' \n');
  const promptPrefix = `
      Write a summary of the following conversation. 
      Focus on important and memorable elements. Return only the summary, no other text.
      Conversation: 
    `;
  const memory = await ollama.chat({
    model: LLM_MODEL,
    messages: [{ role: 'user', content: promptPrefix + messages }],
  });
  addNpcMemory(character, memory.message.content);
  delete chat.history[character];
  chat.chattingWith = '';
  resetContext(chat);
}

export async function sendMessage(
  gs: State,
  characterKey: string,
  message: string,
  action: string,
  onStream: ((chunk: string) => void) | null,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  const messageWithSender = message ? `${fromCharacterName} tells you this: ${message}` : '';
  const actionWithSender = action ? `${fromCharacterName} does this: ${action}` : '';
  const memoryPrompt = await queryNpcMemory(
    characterKey,
    messageWithSender + ' ' + actionWithSender
  );
  const contextPrompt = CONTEXT_PREFIX + getFullContextString(gs.chat);

  const messageObject: DecodedMessage = {
    role: 'user',
    content: `${contextPrompt}. ${memoryPrompt}. ${messageWithSender}. ${actionWithSender}`,
    character: fromCharacterName,
  };

  messageObject.speech = message;
  messageObject.actions = action;

  gs.chat.history[characterKey].push(messageObject);

  // Use streaming API
  const stream = await ollama.chat({
    model: LLM_MODEL,
    messages: [
      ...(gs.chat.history[characterKey].length > 10 ? [gs.chat.history[characterKey][0]] : []), // Include system prompt only if more than 10 messages
      ...gs.chat.history[characterKey].slice(-10), // Keep last 10 messages - TODO: write intermediate summaries?
    ],
    stream: true,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    fullResponse += chunk.message.content;
    onStream?.(chunk.message.content);
  }

  fullResponse = extractJsonFromMessage(fullResponse);

  // remove memoryPrompt and context from chat history to avoid bloating it
  if (gs.chat.history[characterKey].length > 1) {
    const lastMessage = gs.chat.history[characterKey][gs.chat.history[characterKey].length - 1];
    lastMessage.content = lastMessage.content.replace(memoryPrompt, '').replace(contextPrompt, '');
  }

  // add NPC response to chat history
  const characterName = gs.sim.characters.find((c) => c.key === characterKey)?.name;
  gs.chat.history[characterKey].push({
    role: 'assistant',
    content: fullResponse,
    character: characterName,
    ...parseMessage(fullResponse),
  });
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

function parseMessage(message: string): MessageExpansion {
  let parsed = {};
  try {
    parsed = JSON.parse(message);
  } catch (e) {
    return {
      speech: message,
    };
  }
  return parsed;
}

function extractJsonFromMessage(message: string): string {
  const startJson = message.indexOf('{');
  if (startJson !== -1) {
    const json = message
      .substring(startJson)
      .trim()
      .replace(/, }/, '}')
      .replace(/^```json\n/, '')
      .replace(/\n```$/, '');
    return json.endsWith('}') ? json : json + '}';
  }
  return '';
}

export async function checkProposedAction(gs: State, npcKey: string, message: string) {
  const proposedAction = await findActionRequestInMessage(gs, npcKey, message);
  if (!proposedAction) {
    return null;
  }
  const systemPrompt = {
    role: 'assistant',
    content: `
      Is the following message a yes or no answer to the proposed action?
      Analyze the emotion and sentiment of this message to decide if it's positive or negative.
      ${gs.chat.history[npcKey].slice(-1)[0].content}
      You MUST respond with EXACTLY one of these two words: "YES" or "NO".
      Always give an answer.
      Do not include any other text, explanations, or punctuation.
      Just respond with either "YES" or "NO".
    `,
  };
  const response = await ollama.chat({
    model: LLM_MODEL_TOOLS,
    messages: [systemPrompt],
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

  const reactionJson = extractJsonFromMessage(reaction.message.content);

  gs.chat.history[characterKey].push({
    role: 'assistant',
    content: reactionJson,
    character: characterName,
    ...parseMessage(reactionJson),
  });
}
