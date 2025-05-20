<script lang="ts">
  import { gs } from '@lib/state/main.svelte';
  import Battle from './battle/Battle.svelte';
  import Sim from './sim/Sim.svelte';
  import Chat from './chat/Chat.svelte';
  import Actions from './Actions.svelte';
</script>

<div class="main">
  {#if gs.battle.turn}
    <Battle />
  {:else}
    <Sim />
  {/if}
  {#if gs.chat.chattingWith}
    <div class="chat-container">
      <Chat npcKey={gs.chat.chattingWith} />
    </div>
  {/if}
  <div class="actions-container">
    <Actions />
  </div>
</div>

<style>
  .main {
    position: relative;
    height: 100%;
  }
  .chat-container {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100%;
  }
  .actions-container {
    position: absolute;
    width: 60%;
    bottom: 20px;
    left: 20%;
  }
</style>
