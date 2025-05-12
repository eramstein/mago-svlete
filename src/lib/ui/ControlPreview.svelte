<script lang="ts">
  import { config } from '../config';
  import { Direction } from '../state/enums';
  import type { ControlPattern } from '../state/model';

  let { pattern }: { pattern: ControlPattern } = $props();
  let strength: number = $derived(pattern.strength || 1);
  let distance: string = $derived(pattern.distance ? String(pattern.distance) : '∞');
</script>

<div class="control-preview">
  {#if pattern.direction === Direction.Horizontal}
    <div class="arrows horizontal">
      <div>{distance}</div>
      <div class="value">{strength}</div>
      <div>{distance}</div>
    </div>
  {:else if pattern.direction === Direction.Vertical}
    <div class="arrows vertical">
      <div>{distance}</div>
      <div class="value">{strength}</div>
      <div>{distance}</div>
      <div></div>
    </div>
  {:else if pattern.direction === Direction.All}
    <div class="arrows all">
      <div>{distance}</div>
      <div class="arrows horizontal">
        <div>{distance}</div>
        <div class="value">{strength}</div>
        <div>{distance}</div>
      </div>
      <div>{distance}</div>
    </div>
  {/if}
</div>

<style>
  .control-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .arrows {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
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
    font-size: 1.5rem;
    line-height: 1;
    padding: 0 5px;
  }
</style>
