import { ChromaClient } from 'chromadb';

export const vectorDatabaseClient = new ChromaClient();

export async function resetVectorDatabase() {
  const collections = await vectorDatabaseClient.listCollections();
  collections.forEach(async (c) => {
    await vectorDatabaseClient.deleteCollection({ name: c });
  });
  console.log('Vector database reset');
}

export async function listCollections() {
  const collections = await vectorDatabaseClient.listCollections();
  collections.forEach(async (collectionName) => {
    await vectorDatabaseClient.getOrCreateCollection({
      name: collectionName,
    });
  });
  return collections;
}
