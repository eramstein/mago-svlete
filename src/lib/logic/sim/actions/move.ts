import type { State } from '@/lib/model/main';
import type { Zone, Place, Character } from '@/lib/model/model-sim';

export function moveTool(
  gs: State,
  character: Character,
  param: {
    destinationZone: string;
  }
) {
  const zone = gs.sim.places.flatMap((p) => p.zones).find((z) => z.name === param.destinationZone);
  const place = gs.sim.places.find((p) => p.index === zone?.place);
  if (place && zone) {
    move(character, place, zone);
  }
}

export function move(character: Character, place: Place, zone: Zone) {
  character.place = place?.index || 0;
  character.zone = zone?.index || 0;
}
