import ollama from 'ollama';
import { NPC_DUDE, NPCS } from '@/data/npcs';
import type { ChatState, MessageExpansion } from '@/lib/model/model-llm';
import { vectorDatabaseClient } from './vector-db';
import { LLM_MODEL } from './config';
import { PLAYER_CONFIG } from '@/data/npcs/player';
import { getActionFromText } from './action';
import { ACTIONS } from '../logic/sim/action-types';
import type { SimState } from '../model';
import type { State } from '../model/main';

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
      documents: NPC_DUDE.initialMemories,
      ids: NPC_DUDE.initialMemories.map((_, i) => character.key + ' memory ' + i),
    });
  });
  console.log('NPCs memory initalized');
}

async function queryNpcMemory(characterKey: string, message: string) {
  const collection = await vectorDatabaseClient.getOrCreateCollection({
    name: characterKey,
  });
  const results = await collection.query({
    queryTexts: message,
    nResults: 1,
  });
  if (!results.documents.length) {
    return '';
  }
  return 'The following memory is relevant: ' + results.documents[0] + '. ';
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
  chat.chattingWith = character;
}

export async function endChat(chat: ChatState, character: string) {
  const messages = chat.history[character]
    .filter((c) => c.role !== 'system')
    .map((c) => c.character + ': ' + c.speech || '')
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
  chat.context = '';
}

export async function sendMessage(
  gs: State,
  characterKey: string,
  message: string,
  onStream: ((chunk: string) => void) | null,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  const messageWithSender = `${fromCharacterName} tells you this: ${message}`;
  const memoryPrompt = await queryNpcMemory(characterKey, messageWithSender);
  const contextPrompt = CONTEXT_PREFIX + gs.chat.context;
  gs.chat.history[characterKey].push({
    role: 'user',
    content: `${contextPrompt}. ${memoryPrompt}. ${messageWithSender}`,
    speech: message,
    character: fromCharacterName,
  });

  // Use streaming API
  const stream = await ollama.chat({
    model: LLM_MODEL,
    messages: gs.chat.history[characterKey],
    stream: true,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    fullResponse += chunk.message.content;
    onStream?.(chunk.message.content);
  }

  fullResponse = extractJsonFromMessage(fullResponse);

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
    return message.substring(startJson);
  }
  return '';
}

export async function checkProposedAction(gs: State, npcKey: string, message: string) {
  const proposedAction = await findActionRequestInMessage(gs, npcKey, message);
  if (!proposedAction) {
    return null;
  }
  const characterName = gs.sim.characters.find((c) => c.key === npcKey)?.name;
  const npcPrompt =
    NPCS[npcKey].name +
    '. ' +
    SYSTEM_PROMPT_PREFIX_2 +
    PLAYER_CONFIG.name +
    '. ' +
    NPCS[npcKey].systemPrompt;
  const systemPrompt = {
    role: 'system',
    content: `
      ${SYSTEM_PROMPT_PREFIX} ${npcPrompt}. 
      You character is proposed an activity.
      You MUST respond with EXACTLY one of these two words: "YES" or "NO".
      Do not include any other text, explanations, or punctuation.
      Just respond with either "YES" or "NO".
    `,
  };
  const actionType = ACTIONS[proposedAction.actionType].description;
  const proposition = `${characterName} proposes the following activity with you: ${actionType}`;
  const response = await ollama.chat({
    model: LLM_MODEL,
    messages: [systemPrompt, { role: 'user', content: proposition }],
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
