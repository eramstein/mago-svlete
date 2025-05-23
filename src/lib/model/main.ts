import type { BattleState } from './model-battle';
import type { ChatState } from './model-llm';
import type { SimState } from './model-sim';

export interface State {
  sim: SimState;
  battle: BattleState;
  chat: ChatState;
}
