<script lang="ts">
  import { resetState, state } from '../state/state.svelte';
  import Player from './Player.svelte';
  import Board from './Board.svelte';
  import { initBattle } from '../logic/battle';

  function playAgain() {
    resetState();
    initBattle();
  }
</script>

<div class="battle-container">
  <div class="player-container left">
    <Player player={state.players[0]} />
  </div>
  <div class="board-container">
    <div class="turn">
      Turn {state.turn}
    </div>
    <Board />
  </div>
  <div class="player-container right">
    <Player player={state.players[1]} />
  </div>
  {#if state.wonByPlayerId !== null}
    <div class="winner-container">
      <h1>Winner</h1>
      <p>{state.players[state.wonByPlayerId].name} wins!</p>
      <button on:click={() => playAgain()}>Play again</button>
    </div>
  {/if}
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

  .turn {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-align: center;
    margin-bottom: 1rem;
  }

  .winner-container {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.9);
    padding: 10rem 20rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .winner-container h1 {
    color: #ffd700;
    margin: 0 0 1rem 0;
  }

  .winner-container p {
    color: white;
    font-size: 1.2rem;
    margin: 0;
  }
</style>
