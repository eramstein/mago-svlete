<script lang="ts">
  import type { Player } from '../state/model';

  let { player }: { player: Player } = $props();
</script>

<div>
  {player.name}
</div>
