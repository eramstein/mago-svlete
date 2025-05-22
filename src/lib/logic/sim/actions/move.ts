import type { Zone, Place, Character, SimState } from '@/lib/model/model-sim';

export function moveTool(
  sim: SimState,
  character: Character,
  param: {
    destinationZone: string;
  }
) {
  const zone = sim.places.flatMap((p) => p.zones).find((z) => z.name === param.destinationZone);
  const place = sim.places.find((p) => p.index === zone?.place);
  if (place && zone) {
    move(character, place, zone);
  }
}

export function move(character: Character, place: Place, zone: Zone) {
  character.place = place?.index || 0;
  character.zone = zone?.index || 0;
}
