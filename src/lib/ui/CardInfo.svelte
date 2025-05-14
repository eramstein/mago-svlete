<script lang="ts">
  import ControlPreview from './ControlPreview.svelte';
  import type { Card } from '../state/model';
  import { getCardImage } from './helpers';
  import AttackPreview from './AttackPreview.svelte';

  let { card }: { card: Card } = $props();
</script>

<div class="card-info">
  <div class="title">
    <div class="card-name">{card.name}</div>
  </div>
  <div class="card-image" style="background-image: url({getCardImage(card.id)})"></div>
  <div class="card-description">
    {#if card.keywords}
      <div class="keywords">
        {#each Object.entries(card.keywords) as [keyword, value]}
          <div class="keyword">
            <span class="keyword-name">{keyword}</span>
            {#if value}
              <span class="keyword-value">{value}</span>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="patterns-container">
    <div class="preview-container attack">
      {#if card.attack}
        <AttackPreview pattern={card.attack} />
      {/if}
    </div>
    <div class="hp-container">
      {card.hp}
    </div>
    <div class="preview-container control">
      {#if card.control}
        <ControlPreview pattern={card.control} />
      {/if}
    </div>
  </div>
</div>

<style>
  .card-info {
    position: relative;
    background-color: #fff;
    width: 256px;
    height: 512px;
    display: flex;
    flex-direction: column;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #3b3b3b;
    height: 60px;
    color: #f5f5f5;
  }

  .patterns-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #222;
    color: #fff;
    height: 76px;
  }

  .preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 33%;
  }

  .preview-container.attack {
    background-color: #171e8894;
  }

  .preview-container.control {
    background-color: #4e57d494;
  }

  .hp-container {
    background-color: #8b0c0c;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 24px;
    font-weight: bold;
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

  .card-description {
    flex: 1;
    padding: 10px;
    background-color: #f5f5f5;
  }

  .keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    color: #f5f5f5;
  }

  .keyword {
    background-color: #3b3b3b;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .keyword-value {
    font-weight: bold;
  }
</style>
