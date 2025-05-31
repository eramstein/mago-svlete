import { PLAYER_CONFIG } from '@/data/npcs/player';
import type { SimState } from '../model/model-sim';
import { NPC_DUDE } from '@/data/npcs/dude';
import { PLACES } from '@/data/world/places';
import { NPC_MOLLY } from '@/data/npcs/molly';
import { NPC_EMMA } from '@/data/npcs/emma';
import { NPC_HENRY } from '@/data/npcs/henry';
import { realmDecks } from '@/data/decks';
import { Realm } from '../config/enums-battle';

// Helper function to initialize card collection from deck
const initializeCardCollection = (cardIds: string[]) => {
  return cardIds.reduce(
    (acc, cardId) => {
      acc[cardId] = (acc[cardId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
};

export const initialSimState: SimState = {
  time: {
    startDate: new Date(),
    ellapsedTime: 0,
  },
  places: PLACES,
  characters: [
    {
      key: NPC_DUDE.key,
      name: NPC_DUDE.name,
      place: 1,
      zone: 0,
      decks: [
        {
          name: "Dude's Frankia Deck",
          ownerId: 1,
          cardIds: realmDecks[Realm.Frankia],
        },
      ],
      cardCollection: initializeCardCollection(realmDecks[Realm.Frankia]),
    },
    {
      key: NPC_MOLLY.key,
      name: NPC_MOLLY.name,
      place: 1,
      zone: 0,
      decks: [
        {
          name: "Molly's Arabia Deck",
          ownerId: 1,
          cardIds: realmDecks[Realm.Arabia],
        },
      ],
      cardCollection: initializeCardCollection(realmDecks[Realm.Arabia]),
    },
    {
      key: NPC_EMMA.key,
      name: NPC_EMMA.name,
      place: 1,
      zone: 0,
      decks: [
        {
          name: "Emma's Italia Deck",
          ownerId: 1,
          cardIds: realmDecks[Realm.Italia],
        },
      ],
      cardCollection: initializeCardCollection(realmDecks[Realm.Italia]),
    },
    {
      key: NPC_HENRY.key,
      name: NPC_HENRY.name,
      place: 1,
      zone: 0,
      decks: [
        {
          name: "Henry's Midguard Deck",
          ownerId: 1,
          cardIds: realmDecks[Realm.Midguard],
        },
      ],
      cardCollection: initializeCardCollection(realmDecks[Realm.Midguard]),
    },
  ],
  player: {
    key: PLAYER_CONFIG.key,
    name: PLAYER_CONFIG.name,
    place: 1,
    zone: 0,
    decks: [
      {
        name: "Player's Hibernia Deck",
        ownerId: 1,
        cardIds: realmDecks[Realm.Hibernia],
      },
    ],
    cardCollection: initializeCardCollection(realmDecks[Realm.Hibernia]),
  },
};
