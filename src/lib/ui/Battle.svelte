<script lang="ts">
  import { state } from '../state/state.svelte';
  import Player from './Player.svelte';
  import Board from './Board.svelte';
</script>

<div class="battle-container">
  <div class="player-container left">
    <Player player={state.players[1]} />
  </div>
  <div class="board-container">
    <Board />
  </div>
  <div class="player-container right">
    <Player player={state.players[0]} />
  </div>
</div>

<style>
  .battle-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 50px;
  }

  .player-container {
    display: flex;
    flex-direction: column;
  }

  .board-container {
    flex: 1;
  }
</style>
