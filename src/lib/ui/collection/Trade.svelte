<script lang="ts">
  import { gs } from '@lib/state/main.svelte';
  import { getCardImage } from '../_helpers';
  import { cards } from '@/data/cards';
  import type { Card } from '@lib/model/model-battle';
  import { Realm } from '@lib/config/enums-battle';
  import { tradeCards } from '@/lib/logic/sim/actions/trade';
  import { proposeTrade } from '@/lib/llm';

  let selectedPlayerCard: Card | null = $state(null);
  let selectedNpcCard: Card | null = $state(null);
  let searchQuery = $state('');
  let selectedRealm: Realm | null = $state(null);

  const npc = $derived(gs.sim.characters.find((c) => c.key === gs.chat.chattingWith) ?? null);

  const filteredCards = $derived(
    Object.entries(cards).filter(([id, card]) => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRealm = selectedRealm === null || card.realm === selectedRealm;
      return matchesSearch && matchesRealm;
    })
  );

  const filteredPlayerCards = $derived(
    filteredCards.filter(([id, card]) => {
      return (gs.sim.player.cardCollection[id] ?? 0) > 0;
    })
  );

  const filteredNpcCards = $derived(
    filteredCards.filter(([id, card]) => {
      return (npc?.cardCollection[id] ?? 0) > 0;
    })
  );

  async function executeTrade() {
    if (!selectedPlayerCard || !selectedNpcCard || !npc) return;

    const tradeResponse = await proposeTrade(
      gs,
      npc.key,
      selectedPlayerCard.id,
      selectedNpcCard.id
    );

    if (tradeResponse.answer.includes('YES')) {
      tradeCards(gs, selectedPlayerCard, selectedNpcCard, npc);
    }

    // Reset selections
    selectedPlayerCard = null;
    selectedNpcCard = null;
  }
</script>

<div class="trade">
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

  <div class="trade-container">
    <div class="collection-section">
      <h2>Your Collection</h2>
      <div class="cards-grid">
        {#each filteredPlayerCards as [id, card]}
          <div
            class="card"
            class:owned={(gs.sim.player.cardCollection[id] ?? 0) > 0}
            class:selected={selectedPlayerCard?.id === id}
            style="background-image: url({getCardImage(id)})"
            onclick={() => {
              if ((gs.sim.player.cardCollection[id] ?? 0) > 0) {
                selectedPlayerCard = { ...card, id, instanceId: id, ownerId: 0 };
              }
            }}
          >
            {#if (gs.sim.player.cardCollection[id] ?? 0) > 0}
              <div class="count">{gs.sim.player.cardCollection[id]}</div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="trade-actions">
      <button
        class="trade-button"
        disabled={!selectedPlayerCard || !selectedNpcCard}
        onclick={executeTrade}
      >
        Trade Cards
      </button>
    </div>

    <div class="collection-section">
      <h2>{npc?.name ?? 'NPC'}'s Collection</h2>
      <div class="cards-grid">
        {#each filteredNpcCards as [id, card]}
          <div
            class="card"
            class:owned={(npc?.cardCollection[id] ?? 0) > 0}
            class:selected={selectedNpcCard?.id === id}
            style="background-image: url({getCardImage(id)})"
            onclick={() => {
              if ((npc?.cardCollection[id] ?? 0) > 0) {
                selectedNpcCard = { ...card, id, instanceId: id, ownerId: 1 };
              }
            }}
          >
            {#if (npc?.cardCollection[id] ?? 0) > 0}
              <div class="count">{npc?.cardCollection[id]}</div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .trade {
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

  .trade-container {
    display: flex;
    gap: 2rem;
    flex: 1;
    overflow: hidden;
  }

  .collection-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: white;
  }

  .collection-section h2 {
    margin: 0;
    text-align: center;
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

  .card.selected {
    border: 3px solid #007bff;
    transform: scale(1.05);
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

  .trade-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .trade-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .trade-button:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .trade-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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
