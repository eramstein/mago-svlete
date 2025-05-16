import type {
  AbilityTrigger,
  AttackDirection,
  CardType,
  ControlDirection,
  Keyword,
  Realm,
} from './enums';

export type BattleState = {
  turn: number;
  activePlayerId: number;
  wonByPlayerId: number | null;
  players: Player[];
  deployedCards: DeployedCard[];
  board: Cell[][];
};

export type Player = {
  id: number;
  name: string;
  hand: Card[];
  score: number; // derivedfrom deployed cards, needed for performance
};

export type CardTemplate = {
  id: string;
  name: string;
  type: CardType;
  realm: Realm;
  hp: number;
  control?: ControlPattern;
  attack?: AttackPattern;
  keywords?: Record<Keyword, number>;
  abilities?: Ability[];
};

export type Card = CardTemplate & {
  instanceId: string;
  ownerId: number;
  summoned?: boolean;
};

export type DeployedCard = Card & {
  position: Position;
  hpCurrent: number;
};

export type Ability = {
  trigger: {
    type: AbilityTrigger;
    condition?: (state: BattleState, card: DeployedCard) => boolean;
  };
  targets?: AbilityTargets;
  effect: AbilityEffect;
};

export type AbilityEffect = (
  state: BattleState,
  card: DeployedCard,
  target: DeployedCard | null
) => void;

export type AbilityTargets = {
  pattern?: ControlPattern;
  condition?: (state: BattleState, card: DeployedCard, target: DeployedCard) => boolean;
};

export type Position = {
  x: number;
  y: number;
};

export type ControlPattern = {
  direction: ControlDirection;
  distance?: number;
  strength?: number;
};

export type ControlStatus = {
  playerId: number;
  strength: number;
};

export type AttackPattern = {
  directions?: AttackDirection[];
  strength: number;
};

export type Cell = {
  position: Position;
  occupiedByUnitId: string | null; // derived from deployed cards, needed for performance
  controlStatus: ControlStatus | null; // derived from deployed cards, needed for performance
};
