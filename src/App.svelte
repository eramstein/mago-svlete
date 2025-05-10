<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Battle from './lib/ui/Battle.svelte'
</script>

<main>
  
  <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />

  <Battle />

</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
</style>
