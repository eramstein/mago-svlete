import { PLACES } from '@/data/world/places';
import { vectorDatabaseClient } from './vector-db';

export async function initWorldMemory() {
  const collection = await vectorDatabaseClient.getOrCreateCollection({
    name: 'world',
  });
  const zonesDescriptions: string[] = [];
  PLACES.forEach((place) => {
    place.zones.forEach((zone) => {
      const desc = `${zone.name} is a known place in the world. It is part of ${place.name}. It is ${zone.description}. `;
      zonesDescriptions.push(desc);
    });
  });
  await collection.upsert({
    documents: zonesDescriptions,
    ids: zonesDescriptions.map((_, i) => 'entry ' + i),
  });
  console.log("World's memory initalized");
}
