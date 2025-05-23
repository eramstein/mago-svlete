import { gs } from '@/lib/state';
import type { Tool } from 'ollama';
import { ActionType } from '../config';
import { ACTIONS } from '../logic/sim/action-types';

const goTo: () => Tool = () => {
  return {
    type: 'function',
    function: {
      name: ActionType.GoTo,
      description: ACTIONS[ActionType.GoTo].description,
      parameters: {
        type: 'object',
        required: ['destinationZone'],
        properties: {
          destinationZone: {
            type: 'string',
            description: 'The zone within the place where the person is going to',
            enum: gs.sim.places.flatMap((p) => p.zones.map((z) => z.name)),
          },
        },
      },
    },
  };
};

const startGame: () => Tool = () => {
  return {
    type: 'function',
    function: {
      name: ActionType.StartGame,
      description: ACTIONS[ActionType.StartGame].description,
      parameters: {
        type: 'object',
        required: ['opponent'],
        properties: {
          opponent: {
            type: 'string',
            description:
              'The other player in the game, one of the characters present at the same place',
            enum: gs.sim.characters.map((c) => c.name),
          },
        },
      },
    },
  };
};

export function getTools(): Tool[] {
  return [goTo, startGame].map((f) => f());
}
