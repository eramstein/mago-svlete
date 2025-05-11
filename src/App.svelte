<script lang="ts">
  import Battle from './lib/ui/Battle.svelte';
  import { initBattle } from './lib/logic/battle';
  import { onMount } from 'svelte';

  onMount(() => {
    initBattle();
  });
</script>

<main>
  <Battle />
</main>
