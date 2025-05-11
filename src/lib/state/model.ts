export type BattleState = {
  turn: number;
  activePlayerId: number;
  players: Player[];
  deployedCards: DeployedCard[];
};

export type Player = {
  id: number;
  name: string;
  hand: Card[];
};

export type CardTemplate = {
  id: string;
  name: string;
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
