import { Realm } from '@lib/config/enums-battle';
import { cards } from './cards';
import { config } from '@lib/config/config';

// Helper function to get all card IDs for a specific realm, limited to deckSize
const getRealmCardIds = (realm: Realm) => {
  return Object.values(cards)
    .filter((card) => card.realm === realm)
    .map((card) => card.id)
    .slice(0, config.deckSize);
};

// Create a deck for each realm containing up to deckSize cards
export const realmDecks: Record<Realm, string[]> = {
  [Realm.Frankia]: getRealmCardIds(Realm.Frankia),
  [Realm.Hibernia]: getRealmCardIds(Realm.Hibernia),
  [Realm.Midguard]: getRealmCardIds(Realm.Midguard),
  [Realm.Arabia]: getRealmCardIds(Realm.Arabia),
  [Realm.Italia]: getRealmCardIds(Realm.Italia),
};
