<script lang="ts">
  import { gs } from '@lib/state/main.svelte';
  import Battle from './battle/Battle.svelte';
  import Sim from './sim/Sim.svelte';
  import Chat from './chat/Chat.svelte';
  import Actions from './Actions.svelte';
</script>

<div class="main">
  <div class="scene-container">
    {#if gs.battle.turn}
      <Battle />
    {:else}
      <Sim />
    {/if}
    <div class="actions-container">
      <Actions />
    </div>
  </div>
  {#if gs.chat.chattingWith}
    <div class="chat-container">
      <Chat npcKey={gs.chat.chattingWith} />
    </div>
  {/if}
</div>

<style>
  .main {
    height: 100%;
    display: flex;
  }
  .scene-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .chat-container {
    height: 100%;
  }
  .actions-container {
    position: absolute;
    width: 60%;
    bottom: 20px;
    right: 20%;
  }
</style>
