import { ActionType } from '@/lib/config';
import { moveTool } from './actions/move';
import { startGameTool } from './actions/game';
import type { ActionTypeDefinition } from '@/lib/model';

export const ACTIONS: Record<string, ActionTypeDefinition> = {
  [ActionType.GoTo]: {
    fn: moveTool,
    duration: 30,
  },
  [ActionType.StartGame]: {
    fn: startGameTool,
    duration: 10,
  },
  [ActionType.None]: {
    fn: () => {},
    duration: 0,
  },
};
