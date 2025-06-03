import type { Message } from 'ollama';

export type ChatState = {
  chattingWith: string;
  history: Record<string, ChatHistory>;
  context: {
    place: string;
    people: string;
    game: string;
  }; // what happens around the conversation
  characterOpinions: Record<string, string>; // what NPCs think of the player
};

export type CharacterRole = {
  key: string;
  name: string;
  systemPrompt: string;
  initialMemories: string[];
  personalityTraits: string[]; // these are traits that we don't want injected in every prompt
  opinionOfPlayer: string;
  cardsValuation: Record<string, number>; // if a character has specific options of a card; how much the character values a card, from 0 to 100.
};

export type MessageExpansion = {
  character?: string;
  displayMessage?: string;
};

export type DecodedMessage = Message & MessageExpansion;

export type ChatHistory = DecodedMessage[];
