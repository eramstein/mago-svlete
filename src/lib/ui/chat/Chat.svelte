<script lang="ts">
  import { PLAYER_CONFIG } from '@/data/npcs/player';
  import { sendMessage, endChat, checkProposedAction } from '@/lib/llm/chat';
  import { gs } from '@/lib/state';
  import { getCharacterImage } from '../_helpers';
  import { jointAction } from '@/lib/logic/sim/actions';
  import { ActionType } from '@/lib/config';
  import { initBattle } from '@/lib/logic';
  import { initTrade } from '@/lib/logic/sim/actions/trade';

  let { npcKey }: { npcKey: string } = $props();

  let fullMessage = '';
  let currentMessage = $state('');
  let currentAction = $state('');
  let proposedAction = $state<{ actionType: ActionType; args: Record<string, any> } | null>(null);
  let chatHistoryElement: HTMLDivElement;

  function scrollToBottom() {
    if (chatHistoryElement) {
      chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    }
  }

  $effect(() => {
    if (currentMessage || currentAction || gs.chat.history[npcKey]) {
      scrollToBottom();
    }
  });

  async function sendChat(e: Event, includesActionProposal: boolean = false) {
    const target = e.target as HTMLInputElement;
    if (!target) {
      return;
    }
    const message = target.value;
    const shortCircuited = handleShortcuts(message, includesActionProposal);
    if (shortCircuited) {
      return;
    }

    // Clear the input and focus it
    target.value = '';

    await sendMessage(gs, npcKey, message, onStream);
    currentMessage = '';
    fullMessage = '';
    if (includesActionProposal) {
      const response = await checkProposedAction(gs, npcKey, message);
      if (response?.answer === 'YES' && response?.action) {
        proposedAction = response.action;
      }
    }
  }

  function handleShortcuts(message: string, includesActionProposal: boolean) {
    if (includesActionProposal && message === 'battle') {
      const opponentId = gs.sim.characters.findIndex((c) => c.key === npcKey);
      initBattle(gs.sim.characters[opponentId].name, [
        gs.sim.player.decks[0],
        gs.sim.characters[opponentId].decks[0],
      ]);
      return true;
    }
    if (includesActionProposal && message === 'trade') {
      const partnerId = gs.sim.characters.findIndex((c) => c.key === npcKey);
      initTrade(gs, gs.sim.characters[partnerId]);
      return true;
    }
    if (message === 'bye') {
      endChat(gs, npcKey);
      return true;
    }
    return false;
  }

  async function executeAction() {
    if (proposedAction) {
      const actingWith = gs.sim.characters.find((c) => c.key === npcKey);
      if (!actingWith) {
        return;
      }
      await jointAction(gs, proposedAction.actionType, proposedAction.args, [
        actingWith,
        gs.sim.player,
      ]);
      proposedAction = null;
    }
  }

  function resetAction() {
    proposedAction = null;
  }

  function onStream(chunk: string) {
    fullMessage += chunk;
    currentMessage = fullMessage;
  }

  const names: Record<string, string> = {
    user: PLAYER_CONFIG.name,
    assistant: gs.sim.characters.find((c) => c.key === npcKey)?.name || npcKey,
  };
</script>

<div class="chat-container">
  <div class="portrait-container">
    <div
      class="portrait"
      style="background-image: url({getCharacterImage(npcKey)})"
      onclick={() => console.log(gs.chat.characterOpinions[npcKey])}
    ></div>
  </div>
  <div id="chat-history" class="chat-history" bind:this={chatHistoryElement}>
    {#each gs.chat.history[npcKey]?.filter((m) => m.role !== 'system') as message}
      <div class="chat-bit">
        <strong>{names[message.role]}:</strong>
        <div>{message.displayMessage || message.content}</div>
      </div>
    {/each}
    {#if currentMessage}
      <div class="chat-bit">
        <strong>{names.assistant}:</strong>
        <div>{currentMessage}</div>
      </div>
    {/if}
    {#if currentAction}
      <div class="chat-bit">
        <strong>{names.assistant}:</strong>
        <div>{currentAction}</div>
      </div>
    {/if}
    {#if proposedAction && proposedAction.actionType !== ActionType.None}
      <div class="action-preview">
        <div class="preview-content">
          <strong>{proposedAction.actionType}</strong>
          {JSON.stringify(proposedAction.args)}
        </div>
        <div class="preview-buttons">
          <button onclick={executeAction}>Yep</button>
          <button class="reset" onclick={resetAction}>Nope</button>
        </div>
      </div>
    {/if}
  </div>
  <div class="input-container">
    <span class="input-icon">🤝</span>
    <input
      class="chat-input"
      type="text"
      onkeydown={(e) => e.key === 'Enter' && sendChat(e, true)}
    />
  </div>
  <div class="input-container">
    <span class="input-icon">💬</span>
    <input
      class="chat-input"
      type="text"
      onkeydown={(e) => e.key === 'Enter' && sendChat(e)}
      placeholder="Type your message..."
    />
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    width: 420px;
    height: 100%;
    background-color: #333;
    color: white;
  }
  .portrait-container {
    width: 100%;
    height: 270px;
    background-image: url('/src/assets/ui/border_wood_square.png');
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
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
  .input-container {
    display: flex;
    align-items: center;
    margin: 0 10px 10px 5px;
    gap: 8px;
  }
  .input-icon {
    font-size: 1.2rem;
  }
  .chat-input {
    width: 100%;
  }
  .chat-bit {
    margin-top: 5px;
  }
  .chat-bit-action {
    font-style: italic;
  }
  .action-preview {
    background: #444;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 0.5rem;
    margin: 0.5rem 0;
  }
  .preview-content {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .preview-buttons {
    display: flex;
    gap: 0.5rem;
  }
  button {
    padding: 0.5rem 1rem;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  button:hover {
    background: #45a049;
  }
  button.reset {
    background: #e57373;
  }
  button.reset:hover {
    background: #ef5350;
  }
</style>
