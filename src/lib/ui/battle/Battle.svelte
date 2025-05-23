<script lang="ts">
  import { resetBattleState, initialBattleState } from '@lib/state/state-battle.svelte';
  import { initBattle } from '@lib/logic/battle';
  import { uiState } from '@lib/state/state-ui.svelte';

  import CardInfo from './CardInfo.svelte';
  import Player from './Player.svelte';
  import Board from './Board.svelte';
  import { cancelCardSelected } from '../_helpers';
  import { gs } from '@lib/state/main.svelte';
  import { resetContext } from '@lib/llm/context';

  function playAgain() {
    resetBattleState(initialBattleState);
    initBattle();
    resetContext(gs.chat);
  }

  function stopPlaying() {
    resetBattleState(initialBattleState);
    resetContext(gs.chat);
  }
</script>

<div class="battle-container">
  <div class="player-container left">
    <Player player={gs.battle.players[0]} />
  </div>
  <div class="board-container">
    <Board />
  </div>
  {#if uiState.selectedCard}
    <div class="popover-container" on:click={() => cancelCardSelected()}>
      <CardInfo card={uiState.selectedCard} />
    </div>
  {/if}
  {#if gs.battle.wonByPlayerId !== null}
    <div class="winner-container">
      <h1>Winner</h1>
      <p>{gs.battle.players[gs.battle.wonByPlayerId].name} wins!</p>
      <hr />
      <button on:click={() => playAgain()}>Play again</button>
      <hr />
      <button on:click={() => stopPlaying()}>Quit playing</button>
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

  .popover-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 1rem;
    padding: 1rem;
    background-color: #222;
  }
</style>
