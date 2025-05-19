<script lang="ts">
  import { gs } from '@lib/state/main.svelte';
  import Battle from './battle/Battle.svelte';
  import Sim from './sim/Sim.svelte';
</script>

<div class="main">
  {#if gs.battle.turn}
    <Battle />
  {:else}
    <Sim />
  {/if}
</div>

<style>
  .main {
    height: 100%;
  }
</style>
