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

  function resetToMainSimView() {
    uiState.currentView = UiView.Sim;
    gs.sim.ongoingActivity = null;
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
  <div class="view-toggle-container">
    <button class="view-toggle collection-toggle" onclick={toggleCollection}> Collection </button>
    <button class="view-toggle sim-toggle" onclick={resetToMainSimView}> Sim </button>
  </div>
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
  .view-toggle-container {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 100;
    display: flex;
    gap: 10px;
  }
  .view-toggle {
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .sim-toggle {
    right: 10px;
  }
  .collection-toggle {
    right: 10px;
  }
  .collection-toggle:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
</style>
