<script lang="ts">
  import { gs } from '@lib/state/main.svelte';
  import { getCardImage } from '../_helpers';
  import { cards } from '@/data/cards';
  import CardInfo from '../battle/CardInfo.svelte';
  import { uiState } from '@lib/state/state-ui.svelte';
  import type { Card } from '@lib/model/model-battle';
  import { Realm } from '@lib/config/enums-battle';

  let selectedCard: Card | null = $state(null);
  let searchQuery = $state('');
  let selectedRealm: Realm | null = $state(null);

  $effect(() => {
    if (selectedCard) {
      uiState.selectedCard = selectedCard;
    }
  });

  const filteredCards = $derived(
    Object.entries(cards).filter(([id, card]) => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRealm = selectedRealm === null || card.realm === selectedRealm;
      return matchesSearch && matchesRealm;
    })
  );
</script>

<div class="collection">
  <div class="controls">
    <div class="search">
      <input type="text" placeholder="Search cards..." bind:value={searchQuery} />
    </div>

    <div class="realm-tabs">
      <button
        class="tab"
        class:active={selectedRealm === null}
        onclick={() => (selectedRealm = null)}
      >
        All
      </button>
      {#each Object.values(Realm) as realm}
        <button
          class="tab"
          class:active={selectedRealm === realm}
          onclick={() => (selectedRealm = realm)}
        >
          {realm.charAt(0).toUpperCase() + realm.slice(1)}
        </button>
      {/each}
    </div>
  </div>

  <div class="cards-grid">
    {#each filteredCards as [id, card]}
      <div
        class="card"
        class:owned={gs.sim.player.cardCollection[id] > 0}
        style="background-image: url({getCardImage(id)})"
        onclick={() => (selectedCard = { ...card, id, instanceId: id, ownerId: 0 })}
      >
        {#if gs.sim.player.cardCollection[id] > 0}
          <div class="count">{gs.sim.player.cardCollection[id]}</div>
        {/if}
      </div>
    {/each}
  </div>

  {#if selectedCard}
    <div class="popover-container" onclick={() => (selectedCard = null)}>
      <CardInfo card={selectedCard} />
    </div>
  {/if}
</div>

<style>
  .collection {
    padding: 50px 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
  }

  .search {
    flex-shrink: 0;
  }

  .search input {
    width: 300px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .search input:focus {
    outline: none;
    border-color: #666;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .card {
    aspect-ratio: 1;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card:not(.owned) {
    filter: grayscale(100%);
  }

  .count {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .popover-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }

  .realm-tabs {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
  }

  .tab {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tab:hover {
    background: #f0f0f0;
  }

  .tab.active {
    background: #007bff;
    color: white;
    border-color: #0056b3;
  }
</style>
