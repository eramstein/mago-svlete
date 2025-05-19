import { ChromaClient } from 'chromadb';

export const vectorDatabaseClient = new ChromaClient();

export async function resetVectorDatabase() {
  console.log('resetting vector database');
  const collections = await vectorDatabaseClient.listCollections();
  collections.forEach(async (c) => {
    await vectorDatabaseClient.deleteCollection({ name: c });
  });
}

export async function listCollections() {
  const collections = await vectorDatabaseClient.listCollections();
  collections.forEach(async (collectionName) => {
    const collection = await vectorDatabaseClient.getOrCreateCollection({
      name: collectionName,
    });
  });
}
