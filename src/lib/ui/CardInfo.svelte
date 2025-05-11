<script lang="ts">
  import ControlPreview from './ControlPreview.svelte';
  import type { Card } from '../state/model';

  let { card }: { card: Card } = $props();
</script>

<div class="card-info">
  <div class="card-name">{card.name}</div>
  {#if card.control}
    <div class="control-preview-container">
      <ControlPreview pattern={card.control} />
    </div>
  {/if}
</div>

<style>
  .card-info {
    position: relative;
    background-color: #fff;
    width: 240px;
    height: 400px;
  }

  .control-preview-container {
    position: absolute;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0px;
    right: 0px;
    background-color: #f5f5f5;
  }

  .card-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    padding: 10px 20px;
  }
</style>
