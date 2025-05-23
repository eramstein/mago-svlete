import { ActionType } from '../config';
import type { ChatState } from '../model/model-llm';
import type { ActionTypeDefinition } from '../model/model-sim';
import { PLAYER_CONFIG } from '@/data/npcs/player';

const contextByActionType: Record<ActionType, string> = {
  [ActionType.GoTo]: 'You are moving to a new location.',
  [ActionType.StartGame]: 'You are playing a game of Hordes with ' + PLAYER_CONFIG.name,
  [ActionType.None]: 'You are doing nothing.',
};

export function resetContext(chat: ChatState) {
  chat.context = '';
}

export function addContext(chat: ChatState, message: string) {
  chat.context += ' --- ' + message;
}

export function addContextForAction(chat: ChatState, actionType: ActionType) {
  addContext(chat, contextByActionType[actionType]);
}
