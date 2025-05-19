import { PLACES } from '@/data/world/places';
import { vectorDatabaseClient } from './vector-db';

export async function initWorldMemory() {
  const collection = await vectorDatabaseClient.getOrCreateCollection({
    name: 'world',
  });
  const placesDescriptions: string[] = [];
  PLACES.forEach((place) => {
    let desc = `${place.name} is a known place in the world. It is ${place.description}. It is composed of the following zones: `;
    place.zones.forEach((zone) => {
      desc = desc + `- zone ${zone.name}: ${zone.description}. `;
    });
    placesDescriptions.push(desc);
  });
  await collection.upsert({
    documents: placesDescriptions,
    ids: placesDescriptions.map((_, i) => 'entry ' + i),
  });
  console.log("World's memory initalized");
}
