<script lang="ts">
  import ControlPreview from './ControlPreview.svelte';
  import type { Card } from '@lib/model/model-battle';
  import { getCardImage } from '../_helpers';
  import AttackPreview from './AttackPreview.svelte';
  import { getAbilityDescription } from '@lib/logic/battle/abilities';

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
    {#if card.abilities}
      <div class="abilities">
        {#each card.abilities as ability}
          <div class="ability">
            <span class="ability-trigger">{ability.trigger.type}</span>
            <span class="ability-description">{getAbilityDescription(ability)}</span>
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

  .abilities {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ability {
    background-color: #2c2c2c;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
  }

  .ability-trigger {
    color: #f5f5f5;
    text-transform: capitalize;
    display: block;
    margin-bottom: 4px;
    font-weight: bold;
  }

  .ability-description {
    color: #e0e0e0;
    font-size: 13px;
    line-height: 1.4;
  }
</style>
