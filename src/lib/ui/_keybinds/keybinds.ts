import { initBattle } from '@/lib/logic/battle';
import { loadStateFromLocalStorage, saveStateToLocalStorage, gs } from '../../state';

export function handleKeybinds(event: KeyboardEvent) {
  if (event.key === 'F4') {
    event.preventDefault();
    const loadedState = loadStateFromLocalStorage();
    if (loadedState) {
      console.log('State reloaded from localStorage');
    } else {
      console.log('No saved state found');
    }
  } else if (event.key === 'F5') {
    event.preventDefault();
    saveStateToLocalStorage();
    console.log('State saved to localStorage');
  } else if (event.key === 'l') {
    console.log('Current game state:', JSON.parse(JSON.stringify(gs, null, 2)));
  } else if (event.key === 'b') {
    initBattle();
  }
}
