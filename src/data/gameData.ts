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

// Starter deck - balanced mix of tiers (now with baseName and level)
export const starterCards: Omit<Card, 'id'>[] = [
  // Damage cards
  { name: "Basic Attack", baseName: "Basic Attack", effect: "Deal 2 damage", type: "damage", value: 2, tier: 'weak', level: 1 },
  { name: "Quick Strike", baseName: "Quick Strike", effect: "Deal 1 damage", type: "damage", value: 1, tier: 'very-weak', level: 1 },
  { name: "System Probe", baseName: "System Probe", effect: "Deal 3 damage", type: "damage", value: 3, tier: 'medium', level: 1 },
  { name: "Ping Attack", baseName: "Ping Attack", effect: "Deal 2 damage", type: "damage", value: 2, tier: 'weak', level: 1 },
  
  // Block cards
  { name: "Simple Password", baseName: "Simple Password", effect: "Block 1 damage", type: "block", value: 1, tier: 'very-weak', level: 1 },
  { name: "Old Firewall", baseName: "Old Firewall", effect: "Block 2 damage", type: "block", value: 2, tier: 'weak', level: 1 },
  { name: "Email Filter", baseName: "Email Filter", effect: "Block 2 damage", type: "block", value: 2, tier: 'weak', level: 1 },
  { name: "USB Blocker", baseName: "USB Blocker", effect: "Block 3 damage", type: "block", value: 3, tier: 'medium', level: 1 },
  
  // Heal cards
  { name: "Basic Antivirus", baseName: "Basic Antivirus", effect: "Restore 1 health", type: "heal", value: 1, tier: 'very-weak', level: 1 },
  { name: "Reboot System", baseName: "Reboot System", effect: "Restore 2 health", type: "heal", value: 2, tier: 'weak', level: 1 },
];

// All available cards by tier and type for rewards
export const allCardPool: Omit<Card, 'id'>[] = [
  // Very Weak
  { name: "Ping", baseName: "Ping", effect: "Deal 1 damage", type: "damage", value: 1, tier: 'very-weak', level: 1 },
  { name: "Weak Shield", baseName: "Weak Shield", effect: "Block 1 damage", type: "block", value: 1, tier: 'very-weak', level: 1 },
  { name: "Bandaid Fix", baseName: "Bandaid Fix", effect: "Restore 1 health", type: "heal", value: 1, tier: 'very-weak', level: 1 },
  
  // Weak
  { name: "Script Kiddie", baseName: "Script Kiddie", effect: "Deal 2 damage", type: "damage", value: 2, tier: 'weak', level: 1 },
  { name: "Port Scan", baseName: "Port Scan", effect: "Deal 2 damage", type: "damage", value: 2, tier: 'weak', level: 1 },
  { name: "Basic Firewall", baseName: "Basic Firewall", effect: "Block 2 damage", type: "block", value: 2, tier: 'weak', level: 1 },
  { name: "VPN Lite", baseName: "VPN Lite", effect: "Block 2 damage", type: "block", value: 2, tier: 'weak', level: 1 },
  { name: "Patch Update", baseName: "Patch Update", effect: "Restore 2 health", type: "heal", value: 2, tier: 'weak', level: 1 },
  { name: "Cache Clear", baseName: "Cache Clear", effect: "Restore 2 health", type: "heal", value: 2, tier: 'weak', level: 1 },
  
  // Medium
  { name: "Brute Force", baseName: "Brute Force", effect: "Deal 4 damage", type: "damage", value: 4, tier: 'medium', level: 1 },
  { name: "SQL Injection", baseName: "SQL Injection", effect: "Deal 4 damage", type: "damage", value: 4, tier: 'medium', level: 1 },
  { name: "Phishing Hook", baseName: "Phishing Hook", effect: "Deal 3 damage", type: "damage", value: 3, tier: 'medium', level: 1 },
  { name: "Encryption", baseName: "Encryption", effect: "Block 4 damage", type: "block", value: 4, tier: 'medium', level: 1 },
  { name: "2FA Shield", baseName: "2FA Shield", effect: "Block 3 damage", type: "block", value: 3, tier: 'medium', level: 1 },
  { name: "System Restore", baseName: "System Restore", effect: "Restore 3 health", type: "heal", value: 3, tier: 'medium', level: 1 },
  { name: "Anti-Malware", baseName: "Anti-Malware", effect: "Restore 4 health", type: "heal", value: 4, tier: 'medium', level: 1 },
  
  // Strong
  { name: "Rootkit Attack", baseName: "Rootkit Attack", effect: "Deal 6 damage", type: "damage", value: 6, tier: 'strong', level: 1 },
  { name: "DDoS Blast", baseName: "DDoS Blast", effect: "Deal 6 damage", type: "damage", value: 6, tier: 'strong', level: 1 },
  { name: "Zero Day", baseName: "Zero Day", effect: "Deal 7 damage", type: "damage", value: 7, tier: 'strong', level: 1 },
  { name: "Fortress Wall", baseName: "Fortress Wall", effect: "Block 6 damage", type: "block", value: 6, tier: 'strong', level: 1 },
  { name: "Military Encrypt", baseName: "Military Encrypt", effect: "Block 5 damage", type: "block", value: 5, tier: 'strong', level: 1 },
  { name: "Full Recovery", baseName: "Full Recovery", effect: "Restore 5 health", type: "heal", value: 5, tier: 'strong', level: 1 },
  { name: "AI Defense", baseName: "AI Defense", effect: "Restore 6 health", type: "heal", value: 6, tier: 'strong', level: 1 },
  
  // Very Strong
  { name: "APT Strike", baseName: "APT Strike", effect: "Deal 9 damage", type: "damage", value: 9, tier: 'very-strong', level: 1 },
  { name: "Nation State", baseName: "Nation State", effect: "Deal 10 damage", type: "damage", value: 10, tier: 'very-strong', level: 1 },
  { name: "Quantum Shield", baseName: "Quantum Shield", effect: "Block 9 damage", type: "block", value: 9, tier: 'very-strong', level: 1 },
  { name: "Impenetrable", baseName: "Impenetrable", effect: "Block 8 damage", type: "block", value: 8, tier: 'very-strong', level: 1 },
  { name: "Full System Heal", baseName: "Full System Heal", effect: "Restore 8 health", type: "heal", value: 8, tier: 'very-strong', level: 1 },
  { name: "Quantum Restore", baseName: "Quantum Restore", effect: "Restore 10 health", type: "heal", value: 10, tier: 'very-strong', level: 1 },
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
  { name: "Malware Inject", baseName: "Malware Inject", type: "damage", value: 2, effect: "Deal 2 damage", tier: 'weak', level: 1 },
  { name: "Brute Force", baseName: "Brute Force", type: "damage", value: 3, effect: "Deal 3 damage", tier: 'medium', level: 1 },
  { name: "SQL Injection", baseName: "SQL Injection", type: "damage", value: 4, effect: "Deal 4 damage", tier: 'medium', level: 1 },
  { name: "Zero-Day Exploit", baseName: "Zero-Day Exploit", type: "damage", value: 5, effect: "Deal 5 damage", tier: 'strong', level: 1 },
  { name: "APT Attack", baseName: "APT Attack", type: "damage", value: 6, effect: "Deal 6 damage", tier: 'strong', level: 1 },
  { name: "Backdoor Access", baseName: "Backdoor Access", type: "heal", value: 2, effect: "Heal 2 HP", tier: 'weak', level: 1 },
  { name: "Mutation", baseName: "Mutation", type: "heal", value: 3, effect: "Heal 3 HP", tier: 'medium', level: 1 },
];
