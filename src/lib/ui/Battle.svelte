<script lang="ts">
  import { state } from '../state/state.svelte'
  import Player from './Player.svelte'
</script>

<div>
  <Player player={state.players[0]} />
  <Player player={state.players[1]} />
</div>