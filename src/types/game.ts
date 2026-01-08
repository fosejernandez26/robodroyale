export interface Card {
  id: string;
  name: string;
  effect: string;
  type: 'block' | 'heal' | 'points';
  value: number;
  cost?: number;
}

export interface Threat {
  id: string;
  name: string;
  damage: number;
  maxDamage: number;
  isBoss?: boolean;
  multiplier?: number;
  cards: Card[]; // Hidden cards for threat AI
}

export interface GameState {
  points: number;
  systemHealth: number;
  maxHealth: number;
  deck: Card[];
  hand: Card[];
  threats: Threat[];
  turn: number;
  gameOver: boolean;
  victory: boolean;
  threatsDefeated: number;
  threatsToWin: number;
  isPlayerTurn: boolean;
  cardPlayedThisTurn: boolean;
}
