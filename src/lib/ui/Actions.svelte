<script lang="ts">
  import { act } from '@/lib/logic/sim/actions';
  import { getActionFromText } from '@/lib/llm';
  import { gs } from '@/lib/state';
  import { ActionType } from '@/lib/config';

  let inputValue = $state('');
  let previewAction = $state<{ actionType: ActionType; args: Record<string, any> } | null>(null);

  function focusInput(node: HTMLInputElement) {
    node.focus();
  }

  async function handleInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (previewAction) {
        await executeAction();
      } else {
        const actionText = inputValue.trim();
        previewAction = await getActionFromText(actionText);
      }
    } else if (event.key === 'Escape') {
      resetAction();
    }
  }

  async function executeAction() {
    if (previewAction) {
      await act(gs, previewAction.actionType, previewAction.args, gs.sim.player);
      inputValue = '';
      previewAction = null;
    }
  }

  function resetAction() {
    inputValue = '';
    previewAction = null;
  }
</script>

<div class="actions-container">
  {#if previewAction}
    <div class="preview">
      <div class="preview-content">
        <strong>Action: {previewAction.actionType}</strong>
        {#if previewAction.actionType !== ActionType.None}
          <div>Arguments: {JSON.stringify(previewAction.args)}</div>
        {/if}
      </div>
      <div class="preview-buttons">
        {#if previewAction.actionType !== ActionType.None}
          <button onclick={executeAction}>Execute</button>
        {/if}
        <button class="reset" onclick={resetAction}>Reset</button>
      </div>
    </div>
  {/if}
  <input
    type="text"
    bind:value={inputValue}
    placeholder="Actions..."
    onkeydown={handleInputKeyDown}
    use:focusInput
  />
</div>

<style>
  .actions-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: #666;
  }

  .preview {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .preview-content {
    font-size: 0.9rem;
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
