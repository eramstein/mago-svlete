import { cards } from '../../data/cards';
import type { State } from '../model/main';
import { initialBattleState, resetBattleState } from './state-battle.svelte';
import { initialSimState } from './state-sim.svelte';

const initialState: State = $state({
  sim: initialSimState,
  battle: initialBattleState,
  chat: {
    chattingWith: '',
    history: {},
    context: '',
  },
});

export const gs: State = $state(initialState);

export const saveStateToLocalStorage = (): void => {
  try {
    localStorage.setItem('magoSvelteState', JSON.stringify(gs));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

export const loadStateFromLocalStorage = (): State | null => {
  try {
    const savedState = localStorage.getItem('magoSvelteState');
    if (!savedState) return null;

    const parsedState: State = JSON.parse(savedState);

    // Restore startDate
    parsedState.sim.time.startDate = new Date(parsedState.sim.time.startDate);

    if (parsedState.battle) {
      // Restore abilities for deployed cards
      parsedState.battle.deployedCards.forEach((card: any) => {
        const template = cards[card.id];
        if (template?.abilities) {
          card.abilities = template.abilities;
        }
      });

      // Restore abilities for cards in hand
      parsedState.battle.players.forEach((player: any) => {
        player.hand.forEach((card: any) => {
          const template = cards[card.id];
          if (template?.abilities) {
            card.abilities = template.abilities;
          }
        });
      });
    }

    // Update the current state with the loaded data in a way that triggers reactivity
    gs.sim = parsedState.sim;
    gs.battle = parsedState.battle;
    gs.chat = parsedState.chat;

    resetBattleState(gs.battle);

    return gs;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
};
