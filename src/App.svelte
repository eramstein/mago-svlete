<script lang="ts">
  import Main from './lib/ui/Main.svelte';
  import { initBattle } from './lib/logic/battle';
  import { onMount, onDestroy } from 'svelte';
  import { handleKeybinds } from './lib/ui/_keybinds/keybinds';
  import { loadCardImages } from './lib/ui/_helpers';

  onMount(() => {
    loadCardImages();
    window.addEventListener('keydown', handleKeybinds);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeybinds);
  });
</script>

<main>
  <Main />
</main>
