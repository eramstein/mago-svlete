<script lang="ts">
  import Battle from './lib/ui/Battle.svelte';
  import { initBattle } from './lib/logic/battle';

  initBattle();
</script>

<main>
  <Battle />
</main>
