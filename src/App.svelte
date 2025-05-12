<script lang="ts">
  import Battle from './lib/ui/Battle.svelte';
  import { initBattle } from './lib/logic/battle';
  import { onMount, onDestroy } from 'svelte';
  import { handleKeybinds } from './lib/ui/keybinds/keybinds';
  import { loadCardImages } from './lib/ui/helpers';

  onMount(() => {
    loadCardImages();
    initBattle();
    window.addEventListener('keydown', handleKeybinds);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeybinds);
  });
</script>

<main>
  <Battle />
</main>
