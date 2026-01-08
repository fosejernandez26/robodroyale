import { Card, Threat } from '@/types/game';

export const starterCards: Omit<Card, 'id'>[] = [
  { name: "Simple Password", effect: "Block 1 damage", type: "block", value: 1 },
  { name: "Old Firewall", effect: "Block 2 damage", type: "block", value: 2 },
  { name: "Basic Antivirus", effect: "Restore 1 health", type: "heal", value: 1 },
  { name: "System Scan", effect: "Gain 1 point", type: "points", value: 1 },
  { name: "IT Intern", effect: "Gain 1 point", type: "points", value: 1 },
  { name: "Email Filter", effect: "Block 1 damage", type: "block", value: 1 },
  { name: "Backup File", effect: "Restore 1 health", type: "heal", value: 1 },
  { name: "USB Blocker", effect: "Block 1 damage", type: "block", value: 1 },
  { name: "Reboot System", effect: "Restore 2 health", type: "heal", value: 2 },
  { name: "Help Desk Ticket", effect: "Gain 1 point", type: "points", value: 1 },
];

export const upgradeCards: Omit<Card, 'id'>[] = [
  { name: "Advanced Firewall", cost: 4, effect: "Block 4 damage", type: "block", value: 4 },
  { name: "Encryption Shield", cost: 5, effect: "Block 5 damage", type: "block", value: 5 },
  { name: "AI Antivirus", cost: 4, effect: "Restore 3 health", type: "heal", value: 3 },
  { name: "Zero-Day Patch", cost: 6, effect: "Restore 5 health", type: "heal", value: 5 },
  { name: "Multi-Factor Login", cost: 3, effect: "Block 3 damage", type: "block", value: 3 },
  { name: "Security Team", cost: 4, effect: "Gain 3 points", type: "points", value: 3 },
  { name: "Network Monitor", cost: 2, effect: "Gain 2 points", type: "points", value: 2 },
  { name: "Data Vault", cost: 5, effect: "Block 4 damage", type: "block", value: 4 },
  { name: "System Upgrade", cost: 4, effect: "Gain 2 points", type: "points", value: 2 },
  { name: "Cyber Expert", cost: 6, effect: "Restore 4 health", type: "heal", value: 4 },
];

export const threatTemplates: Omit<Threat, 'id' | 'cards'>[] = [
  { name: "Phishing Scam", damage: 2, maxDamage: 2 },
  { name: "Ransomware", damage: 4, maxDamage: 4 },
  { name: "DDoS Attack", damage: 3, maxDamage: 3 },
  { name: "Data Breach", damage: 5, maxDamage: 5 },
  { name: "Trojan Virus", damage: 3, maxDamage: 3 },
];

// Threat attack cards (hidden from player)
export const threatAttackCards: Omit<Card, 'id'>[] = [
  { name: "Malware Inject", type: "block", value: 1, effect: "Deal 1 damage" },
  { name: "Brute Force", type: "block", value: 2, effect: "Deal 2 damage" },
  { name: "SQL Injection", type: "block", value: 3, effect: "Deal 3 damage" },
  { name: "Zero-Day Exploit", type: "block", value: 4, effect: "Deal 4 damage" },
  { name: "Backdoor Access", type: "heal", value: 2, effect: "Heal 2 threat HP" },
  { name: "Mutation", type: "heal", value: 1, effect: "Heal 1 threat HP" },
];
