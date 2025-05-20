import type { Zone, Place, Character, SimState } from '@/lib/model/model-sim';

export function moveFromText(
  sim: SimState,
  character: Character,
  param: {
    destinationPlace: string;
    destinationZone?: string;
  }
) {
  const place = sim.places.find((p) => p.name === param.destinationPlace);
  if (place) {
    let zoneId = 0;
    if (param.destinationZone) {
      zoneId = place.zones.findIndex((z) => z.name === param.destinationZone) || 0;
    }
    move(character, place, place.zones[zoneId]);
  }
}

export function move(character: Character, place: Place, zone: Zone) {
  character.place = place?.index || 0;
  character.zone = zone?.index || 0;
}
