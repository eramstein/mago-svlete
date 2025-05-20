import { gs } from '@/lib/state';
import type { Tool } from 'ollama';
import { ActionType } from '../config';

const goTo: () => Tool = () => {
  return {
    type: 'function',
    function: {
      name: ActionType.GoTo,
      description: 'A person going to a different place',
      parameters: {
        type: 'object',
        required: ['destinationPlace'],
        properties: {
          destinationPlace: {
            type: 'string',
            description: 'The destination where the person is going to',
            enum: gs.sim.places.map((p) => p.name),
          },
          destinationZone: {
            type: 'string',
            description: 'The zone within the place where the person is going to',
            enum: gs.sim.places.map((p) => p.zones.map((z) => z.name)).flat(),
          },
        },
      },
    },
  };
};

export function getTools(): Tool[] {
  return [goTo].map((f) => f());
}
