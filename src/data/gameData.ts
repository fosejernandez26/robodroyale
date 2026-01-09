import { Card, Threat, StrengthTier, EnemyType, ThreatAbility } from '@/types/game';

// Tier-based card values
const tierValues: Record<StrengthTier, { min: number; max: number }> = {
  'very-weak': { min: 1, max: 2 },
  'weak': { min: 2, max: 3 },
  'medium': { min: 3, max: 5 },
  'strong': { min: 5, max: 7 },
  'very-strong': { min: 7, max: 10 },
};

// Rarity weights (higher = more common)
const tierRarity: Record<StrengthTier, number> = {
  'very-weak': 5,
  'weak': 25,
  'medium': 40,
  'strong': 25,
  'very-strong': 5,
};

// Starter deck - balanced mix of tiers
export const starterCards: Omit<Card, 'id'>[] = [
  // Damage cards
  { name: "Basic Attack", effect: "Deal 2 damage", type: "damage", value: 2, tier: 'weak' },
  { name: "Quick Strike", effect: "Deal 1 damage", type: "damage", value: 1, tier: 'very-weak' },
  { name: "System Probe", effect: "Deal 3 damage", type: "damage", value: 3, tier: 'medium' },
  { name: "Ping Attack", effect: "Deal 2 damage", type: "damage", value: 2, tier: 'weak' },
  
  // Block cards
  { name: "Simple Password", effect: "Block 1 damage", type: "block", value: 1, tier: 'very-weak' },
  { name: "Old Firewall", effect: "Block 2 damage", type: "block", value: 2, tier: 'weak' },
  { name: "Email Filter", effect: "Block 2 damage", type: "block", value: 2, tier: 'weak' },
  { name: "USB Blocker", effect: "Block 3 damage", type: "block", value: 3, tier: 'medium' },
  
  // Heal cards
  { name: "Basic Antivirus", effect: "Restore 1 health", type: "heal", value: 1, tier: 'very-weak' },
  { name: "Reboot System", effect: "Restore 2 health", type: "heal", value: 2, tier: 'weak' },
];

// All available cards by tier and type for rewards
export const allCardPool: Omit<Card, 'id'>[] = [
  // Very Weak
  { name: "Ping", effect: "Deal 1 damage", type: "damage", value: 1, tier: 'very-weak' },
  { name: "Weak Shield", effect: "Block 1 damage", type: "block", value: 1, tier: 'very-weak' },
  { name: "Bandaid Fix", effect: "Restore 1 health", type: "heal", value: 1, tier: 'very-weak' },
  
  // Weak
  { name: "Script Kiddie", effect: "Deal 2 damage", type: "damage", value: 2, tier: 'weak' },
  { name: "Port Scan", effect: "Deal 2 damage", type: "damage", value: 2, tier: 'weak' },
  { name: "Basic Firewall", effect: "Block 2 damage", type: "block", value: 2, tier: 'weak' },
  { name: "VPN Lite", effect: "Block 2 damage", type: "block", value: 2, tier: 'weak' },
  { name: "Patch Update", effect: "Restore 2 health", type: "heal", value: 2, tier: 'weak' },
  { name: "Cache Clear", effect: "Restore 2 health", type: "heal", value: 2, tier: 'weak' },
  
  // Medium
  { name: "Brute Force", effect: "Deal 4 damage", type: "damage", value: 4, tier: 'medium' },
  { name: "SQL Injection", effect: "Deal 4 damage", type: "damage", value: 4, tier: 'medium' },
  { name: "Phishing Hook", effect: "Deal 3 damage", type: "damage", value: 3, tier: 'medium' },
  { name: "Encryption", effect: "Block 4 damage", type: "block", value: 4, tier: 'medium' },
  { name: "2FA Shield", effect: "Block 3 damage", type: "block", value: 3, tier: 'medium' },
  { name: "System Restore", effect: "Restore 3 health", type: "heal", value: 3, tier: 'medium' },
  { name: "Anti-Malware", effect: "Restore 4 health", type: "heal", value: 4, tier: 'medium' },
  
  // Strong
  { name: "Rootkit Attack", effect: "Deal 6 damage", type: "damage", value: 6, tier: 'strong' },
  { name: "DDoS Blast", effect: "Deal 6 damage", type: "damage", value: 6, tier: 'strong' },
  { name: "Zero Day", effect: "Deal 7 damage", type: "damage", value: 7, tier: 'strong' },
  { name: "Fortress Wall", effect: "Block 6 damage", type: "block", value: 6, tier: 'strong' },
  { name: "Military Encrypt", effect: "Block 5 damage", type: "block", value: 5, tier: 'strong' },
  { name: "Full Recovery", effect: "Restore 5 health", type: "heal", value: 5, tier: 'strong' },
  { name: "AI Defense", effect: "Restore 6 health", type: "heal", value: 6, tier: 'strong' },
  
  // Very Strong
  { name: "APT Strike", effect: "Deal 9 damage", type: "damage", value: 9, tier: 'very-strong' },
  { name: "Nation State", effect: "Deal 10 damage", type: "damage", value: 10, tier: 'very-strong' },
  { name: "Quantum Shield", effect: "Block 9 damage", type: "block", value: 9, tier: 'very-strong' },
  { name: "Impenetrable", effect: "Block 8 damage", type: "block", value: 8, tier: 'very-strong' },
  { name: "Full System Heal", effect: "Restore 8 health", type: "heal", value: 8, tier: 'very-strong' },
  { name: "Quantum Restore", effect: "Restore 10 health", type: "heal", value: 10, tier: 'very-strong' },
];

// Enemy name prefixes by type
export const enemyNames: Record<EnemyType, string[]> = {
  'hacker': ['Shadow', 'Ghost', 'Phantom', 'Dark', 'Silent', 'Rogue', 'Elite', 'Master'],
  'virus': ['Crypto', 'Worm', 'Malware', 'Ransomware', 'Spyware', 'Adware', 'Rootkit', 'Botnet'],
  'trojan': ['Backdoor', 'Hidden', 'Stealth', 'Masked', 'Deceiver', 'Faker', 'Imposter', 'Mimic'],
};

// Threat abilities
export const threatAbilities: { ability: ThreatAbility; name: string; description: string }[] = [
  { ability: 'none', name: 'None', description: 'No special ability' },
  { ability: 'steal-points', name: 'Point Thief', description: 'Steals 2 points when attacking' },
  { ability: 'damage-over-time', name: 'Corrosive', description: 'Deals 1 extra damage per turn' },
  { ability: 'heal-self', name: 'Regenerate', description: 'Heals 1 HP each turn' },
];

// Get random weighted tier
export const getRandomTier = (): StrengthTier => {
  const total = Object.values(tierRarity).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  
  for (const [tier, weight] of Object.entries(tierRarity)) {
    random -= weight;
    if (random <= 0) return tier as StrengthTier;
  }
  return 'medium';
};

// Get cards from pool by tier
export const getCardsFromPool = (count: number): Omit<Card, 'id'>[] => {
  const result: Omit<Card, 'id'>[] = [];
  for (let i = 0; i < count; i++) {
    const tier = getRandomTier();
    const tierCards = allCardPool.filter(c => c.tier === tier);
    if (tierCards.length > 0) {
      result.push(tierCards[Math.floor(Math.random() * tierCards.length)]);
    }
  }
  return result;
};

// Threat attack cards (hidden from player)
export const threatAttackCards: Omit<Card, 'id'>[] = [
  { name: "Malware Inject", type: "damage", value: 2, effect: "Deal 2 damage", tier: 'weak' },
  { name: "Brute Force", type: "damage", value: 3, effect: "Deal 3 damage", tier: 'medium' },
  { name: "SQL Injection", type: "damage", value: 4, effect: "Deal 4 damage", tier: 'medium' },
  { name: "Zero-Day Exploit", type: "damage", value: 5, effect: "Deal 5 damage", tier: 'strong' },
  { name: "APT Attack", type: "damage", value: 6, effect: "Deal 6 damage", tier: 'strong' },
  { name: "Backdoor Access", type: "heal", value: 2, effect: "Heal 2 HP", tier: 'weak' },
  { name: "Mutation", type: "heal", value: 3, effect: "Heal 3 HP", tier: 'medium' },
];
