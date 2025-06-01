<script lang="ts">
  import { gs } from '@lib/state/main.svelte';
  import { uiState, UiView } from '@lib/state/state-ui.svelte';
  import Battle from './battle/Battle.svelte';
  import Sim from './sim/Sim.svelte';
  import Chat from './chat/Chat.svelte';
  import Actions from './Actions.svelte';
  import Collection from './collection/Collection.svelte';
  import { ActionType } from '../config';
  import Trade from './collection/Trade.svelte';

  function toggleCollection() {
    uiState.currentView =
      uiState.currentView === UiView.Collection ? UiView.Sim : UiView.Collection;
  }

  $effect(() => {
    if (gs.battle.turn) {
      uiState.currentView = UiView.Battle;
    } else if (gs.sim.ongoingActivity?.actionType === ActionType.StartTrade) {
      uiState.currentView = UiView.Trade;
    } else {
      uiState.currentView = UiView.Sim;
    }
  });
</script>

<div class="main">
  <button class="collection-toggle" onclick={toggleCollection}>
    {uiState.currentView === UiView.Collection ? 'Collection' : 'Collection'}
  </button>
  <div class="scene-container">
    {#if uiState.currentView === UiView.Battle}
      <Battle />
    {/if}
    {#if uiState.currentView === UiView.Sim}
      <Sim />
    {/if}
    {#if uiState.currentView === UiView.Collection}
      <Collection />
    {/if}
    {#if uiState.currentView === UiView.Trade}
      <Trade />
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
    position: relative;
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
  .collection-toggle {
    position: absolute;
    top: 50px;
    left: 10px;
    z-index: 100;
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .collection-toggle:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
</style>
