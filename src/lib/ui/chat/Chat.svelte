<script lang="ts">
  import { PLAYER_CONFIG } from '@/data/npcs/player';
  import { sendMessage, initChat, endChat } from '@/lib/llm/chat';
  import { gs } from '@/lib/state';
  import { onMount } from 'svelte';
  import { getCharacterImage } from '../_helpers';

  let { npcKey }: { npcKey: string } = $props();

  let fullMessage = '';
  let currentMessage = $state('');

  async function sendChat(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target) {
      return;
    }
    const message = target.value;
    if (message === 'bye') {
      endChat('dude');
      return;
    }
    target.value = '';
    await sendMessage('dude', message, onStream);
    currentMessage = '';
    fullMessage = '';
  }

  function onStream(chunk: string) {
    fullMessage += chunk;
    // this is trick to display text only after the speech JSON property is set in the response
    if (fullMessage.includes(': "')) {
      currentMessage += chunk;
    }
  }

  const names: Record<string, string> = {
    user: PLAYER_CONFIG.name,
    assistant: gs.sim.characters.find((c) => c.key === npcKey)?.name || npcKey,
  };

  onMount(() => {
    initChat('dude');
  });
</script>

<div class="chat-container">
  <div class="portrait-container">
    <div class="portrait" style="background-image: url({getCharacterImage(npcKey)})"></div>
  </div>
  <div id="chat-history" class="chat-history">
    {#each gs.chat.history[npcKey]?.filter((m) => m.role !== 'system') as message, i}
      <div class="chat-bit">
        <strong>{names[message.role]}:</strong>
        {#if message.speech}
          <div>{message.speech}</div>
        {/if}
        {#if message.actions}
          <div class="chat-bit-action">
            {message.actions}
          </div>
        {/if}
      </div>
    {/each}
    {#if currentMessage}
      <div class="chat-bit">
        <strong>{names.assistant}:</strong>
        <div>{currentMessage}</div>
      </div>
    {/if}
  </div>
  <input class="chat-input" type="text" onchange={sendChat} />
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    width: 290px;
    height: 100%;
    background-color: #333;
    color: white;
  }
  .portrait-container {
    width: 270px;
    height: 270px;
    padding: 10px;
    background-image: url('/src/assets/ui/border_wood_square.png');
    background-size: cover;
  }
  .portrait {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
  }
  .chat-history {
    height: calc(100vh - 400px);
    overflow: auto;
    padding: 10px;
    flex-grow: 1;
  }
  .chat-history::-webkit-scrollbar {
    display: none;
  }
  .chat-input {
    width: 265px;
    margin-left: 10px;
    margin-bottom: 10px;
    height: 20px;
  }
  .chat-bit {
    margin-top: 5px;
  }
  .chat-bit-action {
    font-style: italic;
  }
</style>
