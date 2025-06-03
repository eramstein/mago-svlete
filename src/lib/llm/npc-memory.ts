import { NPCS } from '@/data/npcs';
import { vectorDatabaseClient } from './vector-db';
import type { SimState } from '../model';
import { queryWorldsMemory } from './world';

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

export async function queryNpcMemory(characterKey: string, message: string) {
  // Query character's personal memories
  const characterCollection = await vectorDatabaseClient.getOrCreateCollection({
    name: characterKey,
  });
  const characterResults = await characterCollection.query({
    queryTexts: message,
    nResults: 1,
  });
  const characterMemoryDistance = characterResults.distances?.[0]?.[0] || 2;

  const worldResults = await queryWorldsMemory(message);

  let response = '';

  if (characterResults.documents.length && characterMemoryDistance < 1.5) {
    response += 'Personal memory: ' + characterResults.documents[0] + '. ';
  }

  if (worldResults) {
    response += ' ' + worldResults + '. ';
  }

  console.log('queryNpcMemory', characterKey, message, response);
  return response;
}

export async function addNpcMemory(characterKey: string, message: string) {
  const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const collection = await vectorDatabaseClient.getOrCreateCollection({
    name: characterKey,
  });
  console.log('addNpcMemory', characterKey, message);
  collection.add({
    ids: [uid],
    metadatas: [{ type: 'c' }],
    documents: [message],
  });
}
