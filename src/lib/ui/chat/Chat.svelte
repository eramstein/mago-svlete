<script lang="ts">
  import { PLAYER_CONFIG } from '@/data/npcs/player';
  import { sendMessage, endChat, checkProposedAction } from '@/lib/llm/chat';
  import { gs } from '@/lib/state';
  import { getCharacterImage } from '../_helpers';
  import { jointAction } from '@/lib/logic/sim/actions';
  import { ActionType } from '@/lib/config';

  let { npcKey }: { npcKey: string } = $props();

  let fullMessage = '';
  let currentMessage = $state('');
  let fullAction = '';
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
    if (message === 'bye') {
      endChat(gs.chat, npcKey);
      return;
    }
    target.value = '';

    let messageInStars = '';
    let messageOutsideStars = '';

    // Split message into parts within and outside stars
    const starMatch = message.match(/\*(.*?)\*/);
    if (starMatch) {
      messageInStars = starMatch[1];
      messageOutsideStars = message.replace(/\*.*?\*/, '').trim();
    } else {
      messageInStars = '';
      messageOutsideStars = message;
    }

    await sendMessage(gs, npcKey, messageOutsideStars, messageInStars, onStream);
    currentMessage = '';
    fullMessage = '';
    if (includesActionProposal) {
      const response = await checkProposedAction(gs, npcKey, message);
      if (response?.answer === 'YES' && response?.action) {
        proposedAction = response.action;
      }
    }
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
    // this is trick to display text only after the speech JSON property is set in the response
    if (fullMessage.includes(': "')) {
      currentMessage += chunk;
    }
  }

  function onStreamAction(chunk: string) {
    fullAction += chunk;
    // this is trick to display text only after the speech JSON property is set in the response
    if (fullAction.includes(': "')) {
      currentAction += chunk;
    }
  }

  const names: Record<string, string> = {
    user: PLAYER_CONFIG.name,
    assistant: gs.sim.characters.find((c) => c.key === npcKey)?.name || npcKey,
  };
</script>

<div class="chat-container">
  <div class="portrait-container">
    <div class="portrait" style="background-image: url({getCharacterImage(npcKey)})"></div>
  </div>
  <div id="chat-history" class="chat-history" bind:this={chatHistoryElement}>
    {#each gs.chat.history[npcKey]?.filter((m) => m.role !== 'system') as message}
      <div class="chat-bit">
        <strong>{names[message.role]}:</strong>
        {#if message.speech}
          <div>{message.speech}</div>
        {/if}
        {#if message.actions}
          <div class="chat-bit-action">
            {'<' + message.actions + '>'}
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
      placeholder="Propose a common action..."
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
    height: 20px;
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
