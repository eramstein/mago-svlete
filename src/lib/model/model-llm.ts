import type { Message } from "ollama";

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
