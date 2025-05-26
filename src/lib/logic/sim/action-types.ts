import { ActionType } from '@/lib/config';
import { moveTool } from './actions/move';
import { startGameTool } from './actions/game';
import type { ActionTypeDefinition } from '@/lib/model';

export const ACTIONS: Record<string, ActionTypeDefinition> = {
  [ActionType.GoTo]: {
    fn: moveTool,
    duration: 30,
    description: 'Move to a different place',
  },
  [ActionType.StartGame]: {
    fn: startGameTool,
    duration: 10,
    description: 'Start a game of Hordes cards.',
  },
  [ActionType.None]: {
    fn: () => {},
    duration: 0,
    description: 'Do nothing',
  },
};
