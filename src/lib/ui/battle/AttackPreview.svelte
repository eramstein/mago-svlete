<script lang="ts">
  import type { AttackPattern } from '@lib/model/model-battle';
  import { AttackDirection } from '@lib/config/enums-battle';

  let { pattern }: { pattern: AttackPattern } = $props();

  let top = $derived(!pattern.directions || pattern.directions?.includes(AttackDirection.Up));
  let bottom = $derived(!pattern.directions || pattern.directions?.includes(AttackDirection.Down));
  let left = $derived(!pattern.directions || pattern.directions?.includes(AttackDirection.Left));
  let right = $derived(!pattern.directions || pattern.directions?.includes(AttackDirection.Right));
</script>

<div class="attack-preview">
  <div class="direction top">{top ? '⚔️' : ''}</div>
  <div class="middle">
    <div class="direction left">{left ? '⚔️' : ''}</div>
    <div class="strength">
      {pattern.strength}
    </div>
    <div class="direction right">{right ? '⚔️' : ''}</div>
  </div>
  <div class="direction bottom">{bottom ? '⚔️' : ''}</div>
</div>

<style>
  .attack-preview {
    text-align: center;
  }

  .middle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .strength {
    font-size: 1.5rem;
    line-height: 1;
    padding: 0 5px;
    font-weight: bold;
    font-family: sans-serif;
  }

  .direction {
    font-size: 0.7rem;
  }
</style>
