<script lang="ts">
  import { gs } from '@/lib/state/main.svelte';
  import { getCharacterImage, getPlaceImage } from '../_helpers';
  import { chatWithNpc } from '@/lib/llm';

  const currentZone = $derived(gs.sim.places[gs.sim.player.place].zones[gs.sim.player.zone]);
  const presentCharacters = $derived(
    gs.sim.characters.filter(
      (character) =>
        character.place === gs.sim.player.place && character.zone === gs.sim.player.zone
    )
  );
</script>

<div
  class="sim-container"
  style="background-image: url({getPlaceImage(currentZone.image || currentZone.name)})"
>
  <div class="clock">
    {new Date(gs.sim.time.startDate.getTime() + gs.sim.time.ellapsedTime * 60 * 1000)
      .toLocaleString()
      .slice(0, 16)}
  </div>
  <div class="characters">
    {#each presentCharacters as character (character.key)}
      <div
        style="background-image: url({getCharacterImage(character.key)})"
        class="character"
        onclick={() => chatWithNpc(gs.chat, character.key)}
      ></div>
    {/each}
  </div>
</div>

<style>
  .sim-container {
    position: relative;
    width: 100%;
    height: 100vh;
    background-size: cover;
  }
  .clock {
    position: absolute;
    background-color: #eee;
    border: 1px solid #ccc;
    text-align: center;
    padding: 2px 20px;
    top: 60px;
    left: 10px;
  }
  .characters {
    position: absolute;
    bottom: 100px;
    left: 50px;
    display: flex;
    gap: 20px;
  }
  .character {
    width: 270px;
    height: 270px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    border: 10px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
</style>
