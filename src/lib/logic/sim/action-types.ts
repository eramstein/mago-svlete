import { ActionType } from '@/lib/config';
import { startGameTool, startTradeTool, moveTool } from '@/lib/logic/sim/actions/index';
import type { ActionTypeDefinition } from '@/lib/model';

export const ACTIONS: Record<string, ActionTypeDefinition> = {
  [ActionType.GoTo]: {
    fn: moveTool,
    duration: 30,
    description: 'Go somewhere',
  },
  [ActionType.StartGame]: {
    fn: startGameTool,
    duration: 10,
    description: 'Start a game of Hordes cards.',
  },
  [ActionType.StartTrade]: {
    fn: startTradeTool,
    duration: 10,
    description: 'Start a trade with a character.',
  },
  [ActionType.None]: {
    fn: () => {},
    duration: 0,
    description: 'Do nothing',
  },
};
