<script lang="ts">
  import type { Player } from '../state/model';
  import { config } from '../config';
  let { player }: { player: Player } = $props();
</script>

<div>
  <div class="hand" style="--card-size: {config.cellSize - 4}px">
    {#if player.hand.length === 0}
      <p>No cards in hand</p>
    {:else}
      <div class="cards">
        {#each player.hand as card}
          <div
            class="card"
            draggable="true"
            role="button"
            tabindex="0"
            ondragstart={(e) => {
              e.dataTransfer?.setData('text/plain', JSON.stringify(card));
            }}
          >
            <span>{card.name}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .hand {
    margin-top: 0.5rem;
  }

  .cards {
    display: flex;
    flex-direction: column;
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
  }

  .card span {
    font-size: 0.8rem;
    word-break: break-word;
  }
</style>
