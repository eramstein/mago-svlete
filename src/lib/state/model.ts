import type { Direction } from './enums';

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
};

export type CardTemplate = {
  id: string;
  name: string;
  control?: ControlPattern;
};

export type Card = CardTemplate & {
  instanceId: string;
  ownerId: number;
};

export type DeployedCard = Card & {
  position: Position;
};

export type Position = {
  x: number;
  y: number;
};

export type ControlPattern = {
  direction: Direction;
  distance?: number;
  strength?: number;
};

export type ControlStatus = {
  playerId: number;
  strength: number;
};

export type Cell = {
  position: Position;
  occupied: boolean; // derived from deployed cards, needed for performance
  controlStatus: ControlStatus | null; // derived from deployed cards, needed for performance
};
