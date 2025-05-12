<script lang="ts">
  import ControlPreview from './ControlPreview.svelte';
  import type { Card } from '../state/model';
  import { getCardImage } from './helpers';

  let { card }: { card: Card } = $props();
</script>

<div class="card-info">
  <div class="title">
    <div class="card-name">{card.name}</div>
    {#if card.control}
      <div class="control-preview-container">
        <ControlPreview pattern={card.control} />
      </div>
    {/if}
  </div>
  <div class="card-image" style="background-image: url({getCardImage(card.id)})"></div>
</div>

<style>
  .card-info {
    position: relative;
    background-color: #fff;
    width: 256px;
    height: 512px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #f5f5f5;
    height: 80px;
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
  }

  .card-image {
    width: 100%;
    height: 256px;
    background-size: cover;
    background-position: center;
  }
</style>
