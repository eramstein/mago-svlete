import ollama from 'ollama';
import { NPC_DUDE, NPCS } from '@/data/npcs';
import { gs } from '@/lib/state';
import type { MessageExpansion } from '@/lib/model/model-llm';
import { vectorDatabaseClient } from './vector-db';
import { LLM_MODEL } from './config';
import { PLAYER_CONFIG } from '@/data/npcs/player';

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
  "actions": "<what your character does>",
}
`;

export async function initNpcMemory() {
  gs.sim.characters.forEach(async (character) => {
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
  console.log(results.documents);
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

export function initChat(character: string, fromCharacterName: string = PLAYER_CONFIG.name) {
  const npcPrompt =
    NPCS[character].name +
    '. ' +
    SYSTEM_PROMPT_PREFIX_2 +
    fromCharacterName +
    '. ' +
    NPCS[character].systemPrompt;
  gs.chat[character] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT_PREFIX + npcPrompt + SYSTEM_PROMPT_OUTPUT_INSTRUCTIONS,
    },
  ];
}

export async function endChat(character: string) {
  const messages = gs.chat[character]
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
  console.log(memory.message.content);
  addNpcMemory(character, memory.message.content);
  delete gs.chat[character];
}

export async function sendMessage(
  characterKey: string,
  message: string,
  fromCharacterName: string = PLAYER_CONFIG.name
) {
  const messageWithSender = `${fromCharacterName} tells you this: ${message}`;
  const memoryPrompt = await queryNpcMemory(characterKey, messageWithSender);
  gs.chat[characterKey].push({
    role: 'user',
    content: `${memoryPrompt}. ${messageWithSender}`,
    speech: message,
    character: fromCharacterName,
  });
  const response = await ollama.chat({
    model: LLM_MODEL,
    messages: gs.chat[characterKey],
  });
  const characterName = gs.sim.characters.find((c) => c.key === characterKey)?.name;
  gs.chat[characterKey].push({
    role: 'assistant',
    content: response.message.content,
    character: characterName,
    ...parseMessage(response.message.content),
  });
}

export function parseMessage(message: string): MessageExpansion {
  let parsed = {};
  try {
    parsed = JSON.parse(message);
  } catch (e) {
    console.log(e);

    return {
      speech: message,
    };
  }
  return parsed;
}
