<script lang="ts">
  import { state } from '../state/state.svelte'
  import { increment } from '../logic/increment'
</script>

<button onclick={increment}>
  count is {state.score}
</button>
