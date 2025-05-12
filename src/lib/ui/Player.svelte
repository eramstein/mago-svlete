<script lang="ts">
  import type { Player } from '../state/model';
  import { config } from '../config';
  import { gs } from '../state/state.svelte';
  import { send, receive } from './transitions/crossfade';
  import { flip } from 'svelte/animate';
  import { uiState } from '../state/state-ui.svelte';
  import { getCardImage, toggleCardSelected } from './helpers';
  let { player }: { player: Player } = $props();
</script>

<div>
  <div class="name">{player.name}</div>
  <div class="hand" style="--card-size: {config.cellSize - 4}px">
    {#if player.hand.length === 0}
      <p>No cards in hand</p>
    {:else}
      <div class="cards">
        {#each player.hand as card (card.instanceId)}
          <div
            class="card"
            style="background-image: url({getCardImage(card.id)})"
            draggable={gs.activePlayerId === player.id}
            ondragstart={() => (uiState.draggedCard = card)}
            in:receive={{ key: card.instanceId }}
            out:send={{ key: card.instanceId }}
            animate:flip={{ duration: 200 }}
            onclick={() => toggleCardSelected(card)}
          ></div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .name {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
  }

  .hand {
    margin-top: 0.5rem;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .card {
    width: var(--card-size);
    height: var(--card-size);
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
