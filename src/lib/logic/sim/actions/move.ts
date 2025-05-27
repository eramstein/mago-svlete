import { addContextFromLocation } from '@/lib/llm/context';
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
    move(gs, character, place, zone);
  }
}

export function move(gs: State, character: Character, place: Place, zone: Zone) {
  character.place = place?.index || 0;
  character.zone = zone?.index || 0;
  console.log('move', character.key, place.name, zone.name);

  // update chat contexts
  if (character.key !== gs.sim.player.key) {
    addContextFromLocation(gs, character.key);
    console.log('chat context', gs.chat.context);
  }
}
