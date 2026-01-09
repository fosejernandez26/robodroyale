// Strength tier system for both cards and enemies
export type StrengthTier = 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';

// Color mapping for strength tiers
export const strengthColors: Record<StrengthTier, { bg: string; text: string; border: string; glow: string }> = {
  'very-weak': { 
    bg: 'bg-white/10', 
    text: 'text-white', 
    border: 'border-white/30',
    glow: '0 0 15px rgba(255, 255, 255, 0.3)'
  },
  'weak': { 
    bg: 'bg-blue-500/20', 
    text: 'text-blue-400', 
    border: 'border-blue-400/50',
    glow: '0 0 15px rgba(59, 130, 246, 0.4)'
  },
  'medium': { 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-400', 
    border: 'border-yellow-400/50',
    glow: '0 0 15px rgba(250, 204, 21, 0.4)'
  },
  'strong': { 
    bg: 'bg-orange-500/20', 
    text: 'text-orange-400', 
    border: 'border-orange-400/50',
    glow: '0 0 15px rgba(249, 115, 22, 0.4)'
  },
  'very-strong': { 
    bg: 'bg-red-500/20', 
    text: 'text-red-400', 
    border: 'border-red-400/50',
    glow: '0 0 20px rgba(239, 68, 68, 0.6)'
  },
};

// Enemy types with different visuals
export type EnemyType = 'hacker' | 'virus' | 'trojan';

export const enemyTypeInfo: Record<EnemyType, { name: string; icon: string }> = {
  'hacker': { name: 'Hacker', icon: '👤' },
  'virus': { name: 'Virus', icon: '🦠' },
  'trojan': { name: 'Trojan', icon: '🐴' },
};

// Threat special abilities
export type ThreatAbility = 'steal-points' | 'damage-over-time' | 'heal-self' | 'none';

export interface Card {
  id: string;
  name: string;
  effect: string;
  type: 'block' | 'heal' | 'damage';
  value: number;
  cost?: number;
  tier: StrengthTier;
}

export interface Threat {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  isBoss?: boolean;
  isMegaBoss?: boolean;
  multiplier?: number;
  cards: Card[];
  tier: StrengthTier;
  enemyType: EnemyType;
  ability: ThreatAbility;
  pointsReward: number;
}

export interface PlayerStats {
  totalEnemiesDefeated: number;
  currentWinStreak: number;
  highestPoints: number;
  bossesDefeated: number;
}

export interface GameState {
  points: number;
  systemHealth: number;
  maxHealth: number;
  shield: number; // Temporary shield from block cards
  deck: Card[];
  hand: Card[];
  threats: Threat[];
  turn: number;
  gameOver: boolean;
  victory: boolean;
  threatsDefeated: number;
  threatsToWin: number;
  isPlayerTurn: boolean;
  selectedCard: Card | null;
  playerStats: PlayerStats;
  // Card selection after defeating enemy
  showCardSelection: boolean;
  cardChoices: Card[];
}

// Helper to calculate player power from hand
export const calculatePlayerPower = (hand: Card[]): number => {
  if (hand.length === 0) return 0;
  const total = hand.reduce((sum, card) => sum + card.value, 0);
  return total / hand.length;
};

// Get relative strength tier based on power comparison
export const getRelativeTier = (enemyPower: number, playerPower: number): StrengthTier => {
  const ratio = enemyPower / playerPower;
  if (ratio <= 0.4) return 'very-weak';
  if (ratio <= 0.7) return 'weak';
  if (ratio <= 1.3) return 'medium';
  if (ratio <= 1.8) return 'strong';
  return 'very-strong';
};
