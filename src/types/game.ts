// Strength tier system for both cards and enemies
export type StrengthTier = 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';

// Tier order for upgrades
export const tierOrder: StrengthTier[] = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];

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
  baseName: string; // Original name for matching duplicates
  effect: string;
  type: 'block' | 'heal' | 'damage';
  value: number;
  cost?: number;
  tier: StrengthTier;
  level: number; // 1-5, each level can tier up
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
  cardsUpgraded: number;
  totalDamageDealt: number;
  totalHealing: number;
}

// Achievement definitions
export type AchievementId = 
  | 'first_blood' 
  | 'enemy_slayer_10' 
  | 'enemy_slayer_50' 
  | 'enemy_slayer_100'
  | 'boss_hunter_5' 
  | 'boss_hunter_10'
  | 'point_collector_100'
  | 'point_collector_500'
  | 'upgrade_master_5'
  | 'upgrade_master_20'
  | 'streak_5'
  | 'streak_10'
  | 'survivor';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  statKey: keyof PlayerStats | 'special';
}

export const achievements: Achievement[] = [
  { id: 'first_blood', name: 'First Blood', description: 'Defeat your first enemy', icon: '🩸', requirement: 1, statKey: 'totalEnemiesDefeated' },
  { id: 'enemy_slayer_10', name: 'Threat Hunter', description: 'Defeat 10 enemies', icon: '🎯', requirement: 10, statKey: 'totalEnemiesDefeated' },
  { id: 'enemy_slayer_50', name: 'Cyber Warrior', description: 'Defeat 50 enemies', icon: '⚔️', requirement: 50, statKey: 'totalEnemiesDefeated' },
  { id: 'enemy_slayer_100', name: 'Digital Legend', description: 'Defeat 100 enemies', icon: '👑', requirement: 100, statKey: 'totalEnemiesDefeated' },
  { id: 'boss_hunter_5', name: 'Boss Buster', description: 'Defeat 5 bosses', icon: '💀', requirement: 5, statKey: 'bossesDefeated' },
  { id: 'boss_hunter_10', name: 'Overlord Slayer', description: 'Defeat 10 bosses', icon: '🏆', requirement: 10, statKey: 'bossesDefeated' },
  { id: 'point_collector_100', name: 'Data Miner', description: 'Earn 100 total points', icon: '💎', requirement: 100, statKey: 'highestPoints' },
  { id: 'point_collector_500', name: 'Crypto King', description: 'Earn 500 total points', icon: '💰', requirement: 500, statKey: 'highestPoints' },
  { id: 'upgrade_master_5', name: 'Tinkerer', description: 'Upgrade 5 cards', icon: '🔧', requirement: 5, statKey: 'cardsUpgraded' },
  { id: 'upgrade_master_20', name: 'Master Crafter', description: 'Upgrade 20 cards', icon: '⚡', requirement: 20, statKey: 'cardsUpgraded' },
  { id: 'streak_5', name: 'On Fire', description: 'Get a 5 win streak', icon: '🔥', requirement: 5, statKey: 'currentWinStreak' },
  { id: 'streak_10', name: 'Unstoppable', description: 'Get a 10 win streak', icon: '💥', requirement: 10, statKey: 'currentWinStreak' },
  { id: 'survivor', name: 'Survivor', description: 'Win a game', icon: '🏅', requirement: 1, statKey: 'special' },
];

export interface GameState {
  points: number;
  systemHealth: number;
  maxHealth: number;
  shield: number;
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
  showCardSelection: boolean;
  cardChoices: Card[];
  unlockedAchievements: AchievementId[];
  showDeckManager: boolean;
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

// Get upgraded card stats
export const getUpgradedCard = (card: Card): Card => {
  const newLevel = card.level + 1;
  const tierIndex = tierOrder.indexOf(card.tier);
  
  // Every 2 levels, tier up (if not already max)
  let newTier = card.tier;
  if (newLevel % 2 === 0 && tierIndex < tierOrder.length - 1) {
    newTier = tierOrder[tierIndex + 1];
  }
  
  // Value increases based on new tier
  const tierMultipliers: Record<StrengthTier, number> = {
    'very-weak': 1,
    'weak': 1.5,
    'medium': 2,
    'strong': 2.5,
    'very-strong': 3,
  };
  
  const baseValue = Math.ceil(card.value / tierMultipliers[card.tier]);
  const newValue = Math.ceil(baseValue * tierMultipliers[newTier]);
  
  return {
    ...card,
    level: newLevel,
    tier: newTier,
    value: newValue,
    name: `${card.baseName} +${newLevel}`,
    effect: `${card.type === 'damage' ? 'Deal' : card.type === 'block' ? 'Block' : 'Restore'} ${newValue} ${card.type === 'heal' ? 'health' : 'damage'}`,
  };
};

// Check if two cards can be merged (same base name and type)
export const canMergeCards = (card1: Card, card2: Card): boolean => {
  return card1.baseName === card2.baseName && 
         card1.type === card2.type && 
         card1.id !== card2.id &&
         card1.level < 5; // Max level is 5
};
