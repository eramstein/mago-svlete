import type { Message } from 'ollama';

export type ChatState = {
  chattingWith: string;
  history: Record<string, ChatHistory>;
  context: {
    place: string;
    people: string;
    game: string;
  }; // what happens around the conversation
};

export type CharacterRole = {
  key: string;
  name: string;
  systemPrompt: string;
  initialMemories: string[];
};

export type MessageExpansion = {
  speech?: string;
  actions?: string;
  character?: string;
};

export type DecodedMessage = Message & MessageExpansion;

export type ChatHistory = DecodedMessage[];
