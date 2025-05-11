<script lang="ts">
  import { config } from '../config';
  import { Direction } from '../state/enums';
  import type { ControlPattern } from '../state/model';

  let { pattern }: { pattern: ControlPattern } = $props();
  let strength: number = $derived(pattern.strength || 1);
  let distance: number = $derived(pattern.distance || config.boardSize);
</script>

<div class="control-preview">
  <div class="direction-indicator">
    {#if pattern.direction === Direction.Horizontal}
      <div class="arrows horizontal">
        {#each Array(distance) as _, i}
          <div class="horizontal-cell"></div>
        {/each}
        <div class="value">{strength}</div>
        {#each Array(distance) as _, i}
          <div class="horizontal-cell"></div>
        {/each}
      </div>
    {:else if pattern.direction === Direction.Vertical}
      <div class="arrows vertical">
        {#each Array(distance) as _, i}
          <div class="vertical-cell"></div>
        {/each}
        <div class="value">{strength}</div>
        {#each Array(distance) as _, i}
          <div class="vertical-cell"></div>
        {/each}
      </div>
    {:else if pattern.direction === Direction.All}
      <div class="arrows all">
        {#each Array(distance) as _, i}
          <div class="vertical-cell"></div>
        {/each}
        <div class="arrows horizontal">
          {#each Array(distance) as _, i}
            <div class="horizontal-cell"></div>
          {/each}
          <div class="value">{strength}</div>
          {#each Array(distance) as _, i}
            <div class="horizontal-cell"></div>
          {/each}
        </div>
        {#each Array(distance) as _, i}
          <div class="vertical-cell"></div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .control-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .direction-indicator {
    font-size: 1.5rem;
    line-height: 1;
  }

  .arrows {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .arrows.horizontal {
    flex-direction: row;
  }

  .arrows.vertical {
    flex-direction: column;
  }

  .arrows.all {
    flex-direction: column;
  }

  .value {
    font-family: sans-serif;
    font-weight: bold;
    padding: 4px 8px;
  }

  .vertical-cell {
    margin-top: 1px;
    height: 2px;
    width: 12px;
    background-color: #777;
  }

  .horizontal-cell {
    margin-right: 1px;
    height: 12px;
    width: 2px;
    background-color: #777;
  }
</style>
