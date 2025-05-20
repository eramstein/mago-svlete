<script lang="ts">
  import { actFromText } from '@/lib/logic/sim/actions';
  import { gs } from '@/lib/state';
  let inputValue = '';

  function focusInput(node: HTMLInputElement) {
    node.focus();
  }

  function handleInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const actionText = inputValue.trim();
      console.log(actionText);
      actFromText(gs.sim, actionText, gs.sim.player);
    }
  }
</script>

<input
  type="text"
  bind:value={inputValue}
  placeholder="Actions..."
  on:keydown={handleInputKeyDown}
  use:focusInput
/>

<style>
  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
  }

  input:focus {
    outline: none;
    border-color: #666;
  }
</style>
