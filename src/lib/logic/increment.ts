import { state } from "../state/state.svelte"

export const increment = () => {
  state.score += 5
} 