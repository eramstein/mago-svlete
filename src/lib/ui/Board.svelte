<script lang="ts">
  import { config } from '../config';
  import { deployCard } from '../logic/card';
  import { state } from '../state/state.svelte';
  import { send, receive } from './transitions/crossfade';

  function handleDrop(e: DragEvent, row: number, col: number) {
    e.preventDefault();
    const cardData = e.dataTransfer?.getData('text/plain');
    if (cardData) {
      const card = JSON.parse(cardData);
      deployCard(state, card, { x: col, y: row });
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }
</script>

<div class="board" style="--board-size: {config.boardSize}; --cell-size: {config.cellSize}px">
  {#each Array(config.boardSize) as _, row}
    {#each Array(config.boardSize) as _, col}
      <div
        class="cell"
        role="button"
        tabindex="0"
        ondrop={(e) => handleDrop(e, row, col)}
        ondragover={handleDragOver}
      >
        {row} - {col}
      </div>
    {/each}
  {/each}
  {#each state.deployedCards as card (card.instanceId)}
    <div
      class="deployed-card"
      style="
        left: calc({card.position.x} * (var(--cell-size) + 2px) + 2px);
        top: calc({card.position.y} * (var(--cell-size) + 2px) + 2px);
      "
      in:receive={{ key: card.instanceId }}
      out:send={{ key: card.instanceId }}
    >
      <span>{card.name}</span>
    </div>
  {/each}
</div>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(var(--board-size), 1fr);
    gap: 2px;
    background-color: #ccc;
    border-radius: 4px;
    max-width: fit-content;
    margin: 0 auto;
    position: relative;
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 2px;
    width: var(--cell-size);
    height: var(--cell-size);
  }

  .deployed-card {
    position: absolute;
    width: calc(var(--cell-size) - 6px);
    height: calc(var(--cell-size) - 6px);
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .deployed-card span {
    font-size: 0.8rem;
    word-break: break-word;
  }
</style>
