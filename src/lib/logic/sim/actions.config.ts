import { ActionType } from '@/lib/config';
import { moveFromText } from './actions/move';
import type { ActionTypeDefinition } from '@/lib/model';

export const ACTIONS: Record<string, ActionTypeDefinition> = {
  [ActionType.GoTo]: {
    fn: moveFromText,
    duration: 30,
  },
  [ActionType.None]: {
    fn: () => {},
    duration: 0,
  },
};
