<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/ui/Counter.svelte'
</script>

<main>
  
  <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />

  <Counter />

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
