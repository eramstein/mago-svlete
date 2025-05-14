<script lang="ts">
  import { send, receive } from './transitions/crossfade';

  import { config } from '../config';
  import { deployCard, getCellString, getImpactedCellsPreview } from '../logic';
  import { gs, uiState } from '../state';
  import { getAttackedCellsPreview, getCardImage, toggleCardSelected } from './helpers';

  let dragOverCell: { row: number; col: number } | null = $state(null);
  let impactedCellsPreview: Record<string, boolean> = $state({});
  let attackedCellsPreview: Record<string, number> = $state({});

  function handleDrop(e: DragEvent, row: number, col: number) {
    e.preventDefault();
    dragOverCell = null;
    if (uiState.draggedCard) {
      deployCard(gs, uiState.draggedCard, { x: col, y: row });
    }
    uiState.draggedCard = null;
    impactedCellsPreview = {};
    attackedCellsPreview = {};
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function handleDragEnter(e: DragEvent, row: number, col: number) {
    e.preventDefault();
    dragOverCell = { row, col };
    if (uiState.draggedCard?.control) {
      impactedCellsPreview = getImpactedCellsPreview(uiState.draggedCard.control, {
        x: col,
        y: row,
      });
    }
    if (uiState.draggedCard?.attack) {
      attackedCellsPreview = getAttackedCellsPreview(uiState.draggedCard.attack, {
        x: col,
        y: row,
      });
    }
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragOverCell = null;
    impactedCellsPreview = {};
    attackedCellsPreview = {};
  }
</script>

<div class="board" style="--board-size: {config.boardSize}; --cell-size: {config.cellSize}px">
  {#each Array(gs.board.length) as _, row}
    {#each Array(gs.board[row].length) as _, col}
      <div
        class="cell"
        class:player0-control={gs.board[col][row].controlStatus?.playerId === 0}
        class:player1-control={gs.board[col][row].controlStatus?.playerId === 1}
        class:drag-over={dragOverCell?.row === row && dragOverCell?.col === col}
        class:impacted={impactedCellsPreview[getCellString(col, row)]}
        style="--control-strength: {gs.board[col][row].controlStatus?.strength || 0}"
        role="button"
        tabindex="0"
        ondrop={(e) => handleDrop(e, row, col)}
        ondragover={handleDragOver}
        ondragenter={(e) => handleDragEnter(e, row, col)}
        ondragleave={handleDragLeave}
      >
        {#if attackedCellsPreview[getCellString(col, row)]}
          <div class="attacked">{attackedCellsPreview[getCellString(col, row)]}⚔️</div>
        {/if}
      </div>
    {/each}
  {/each}
  {#each gs.deployedCards as card (card.instanceId)}
    <div
      class="deployed-card"
      style="
        background-image: url({getCardImage(card.id)});
        left: calc({card.position.x} * (var(--cell-size) + 2px) + 3px);
        top: calc({card.position.y} * (var(--cell-size) + 2px) + 3px);
      "
      in:receive={{ key: card.instanceId }}
      out:send={{ key: card.instanceId }}
      onclick={() => toggleCardSelected(card)}
    >
      <div class="card-hp">{card.hpCurrent}</div>
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
    transition: background-color 0.3s ease;
  }

  .cell.player0-control {
    background-color: rgba(35, 49, 213, calc(var(--control-strength) * 0.2));
  }

  .cell.player1-control {
    background-color: rgba(213, 49, 35, calc(var(--control-strength) * 0.2));
  }

  .deployed-card {
    position: absolute;
    width: calc(var(--cell-size) - 6px);
    height: calc(var(--cell-size) - 6px);
    background-color: #333;
    color: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .card-hp {
    position: absolute;
    bottom: 2px;
    right: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    width: 16px;
    height: 16px;
    color: white;
    font-weight: bold;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.75);
    padding: 5px;
  }

  .cell.drag-over {
    background-color: rgba(35, 49, 213, 0.3);
    box-shadow: inset 0 0 0 2px rgba(35, 49, 213, 0.5);
  }

  .cell.impacted {
    box-shadow: inset 0 0 0 2px rgb(35, 49, 213, 0.5);
  }

  .cell .attacked {
    border-radius: 50%;
    background-color: rgba(213, 49, 35);
    color: white;
    border: 2px solid white;
    padding: 5px;
    font-size: 20px;
    z-index: 1;
  }
</style>
