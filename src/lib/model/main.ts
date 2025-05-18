import type { BattleState } from './model-battle';
import type { ChatHistory } from './model-llm';
import type { SimState } from './model-sim';

export interface State {
  sim: SimState;
  battle: BattleState;
  chat: Record<string, ChatHistory>;
}
