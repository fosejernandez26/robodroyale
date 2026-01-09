import { useState, useCallback } from 'react';
import { GameState, Card, Threat, StrengthTier, EnemyType, ThreatAbility, calculatePlayerPower, getRelativeTier } from '@/types/game';
import { starterCards, threatAttackCards, enemyNames, getRandomTier, getCardsFromPool } from '@/data/gameData';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createCard = (template: Omit<Card, 'id'>): Card => ({
  ...template,
  id: generateId(),
});

const createThreatCards = (tier: StrengthTier): Card[] => {
  const numCards = Math.floor(Math.random() * 3) + 3;
  const cards: Card[] = [];
  // Filter threat cards by tier similarity
  const validCards = threatAttackCards.filter(c => {
    const tierOrder: StrengthTier[] = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];
    const tierIndex = tierOrder.indexOf(tier);
    const cardTierIndex = tierOrder.indexOf(c.tier);
    return Math.abs(tierIndex - cardTierIndex) <= 1;
  });
  
  for (let i = 0; i < numCards; i++) {
    const template = validCards.length > 0 
      ? validCards[Math.floor(Math.random() * validCards.length)]
      : threatAttackCards[Math.floor(Math.random() * threatAttackCards.length)];
    cards.push(createCard(template));
  }
  return cards;
};

// Calculate threat stats based on tier
const getThreatStats = (tier: StrengthTier): { health: number; damage: number; points: number } => {
  const stats: Record<StrengthTier, { health: number; damage: number; points: number }> = {
    'very-weak': { health: 3, damage: 1, points: 1 },
    'weak': { health: 5, damage: 2, points: 2 },
    'medium': { health: 8, damage: 3, points: 4 },
    'strong': { health: 12, damage: 4, points: 6 },
    'very-strong': { health: 18, damage: 5, points: 10 },
  };
  return stats[tier];
};

const getRandomAbility = (): ThreatAbility => {
  const random = Math.random();
  if (random < 0.5) return 'none';
  if (random < 0.7) return 'steal-points';
  if (random < 0.85) return 'damage-over-time';
  return 'heal-self';
};

const createThreat = (
  playerPower: number, 
  isBoss: boolean = false, 
  isMegaBoss: boolean = false
): Threat => {
  // Generate enemy type
  const enemyTypes: EnemyType[] = ['hacker', 'virus', 'trojan'];
  const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  
  // Generate tier
  let tier = getRandomTier();
  
  // Bosses and mega-bosses are always strong or very-strong
  if (isMegaBoss) {
    tier = 'very-strong';
  } else if (isBoss) {
    tier = Math.random() > 0.3 ? 'very-strong' : 'strong';
  }
  
  // Get base stats
  const baseStats = getThreatStats(tier);
  
  // Apply multiplier for bosses
  const multiplier = isMegaBoss ? 2 + Math.random() * 1.5 : isBoss ? 1.5 + Math.random() * 1 : 1;
  
  const health = Math.round(baseStats.health * multiplier);
  const damage = Math.round(baseStats.damage * multiplier);
  const pointsReward = Math.round(baseStats.points * multiplier);
  
  // Generate name
  const prefix = enemyNames[enemyType][Math.floor(Math.random() * enemyNames[enemyType].length)];
  const suffix = isMegaBoss ? 'Overlord' : isBoss ? 'Boss' : enemyType.charAt(0).toUpperCase() + enemyType.slice(1);
  
  // Get ability (bosses always have abilities)
  let ability: ThreatAbility = (isBoss || isMegaBoss) ? getRandomAbility() : (Math.random() > 0.7 ? getRandomAbility() : 'none');
  if (ability === 'none' && (isBoss || isMegaBoss)) {
    ability = 'damage-over-time'; // Bosses must have an ability
  }
  
  return {
    id: generateId(),
    name: `${prefix} ${suffix}`,
    health,
    maxHealth: health,
    damage,
    isBoss,
    isMegaBoss,
    multiplier: (isBoss || isMegaBoss) ? multiplier : undefined,
    cards: createThreatCards(tier),
    tier,
    enemyType,
    ability,
    pointsReward,
  };
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useGameState = () => {
  const initializeGame = (): GameState => {
    const deck = starterCards.map(createCard);
    const shuffledDeck = shuffleArray(deck);
    const hand = shuffledDeck.slice(0, 5);
    const remainingDeck = shuffledDeck.slice(5);
    const playerPower = calculatePlayerPower(hand);
    
    // Start with 1-2 threats
    const initialThreats = [
      createThreat(playerPower),
      Math.random() > 0.5 ? createThreat(playerPower) : null,
    ].filter(Boolean) as Threat[];
    
    return {
      points: 0,
      systemHealth: 30,
      maxHealth: 30,
      shield: 0,
      deck: remainingDeck,
      hand,
      threats: initialThreats,
      turn: 1,
      gameOver: false,
      victory: false,
      threatsDefeated: 0,
      threatsToWin: 20,
      isPlayerTurn: true,
      selectedCard: null,
      playerStats: {
        totalEnemiesDefeated: 0,
        currentWinStreak: 0,
        highestPoints: 0,
        bossesDefeated: 0,
      },
      showCardSelection: false,
      cardChoices: [],
    };
  };

  const [gameState, setGameState] = useState<GameState>(initializeGame);

  // Calculate player power for relative tier display
  const getPlayerPower = useCallback(() => {
    return calculatePlayerPower(gameState.hand);
  }, [gameState.hand]);

  // Select a card from hand
  const selectCard = useCallback((cardId: string | null) => {
    setGameState(prev => {
      if (cardId === null) {
        return { ...prev, selectedCard: null };
      }
      const card = prev.hand.find(c => c.id === cardId) || null;
      return { ...prev, selectedCard: card };
    });
  }, []);

  // Play selected card on target
  const playCardOnTarget = useCallback((threatId?: string): { 
    card: Card; 
    type: 'block' | 'heal' | 'damage';
    defeatedThreat?: Threat;
    pointsEarned?: number;
  } | null => {
    let result: { 
      card: Card; 
      type: 'block' | 'heal' | 'damage';
      defeatedThreat?: Threat;
      pointsEarned?: number;
    } | null = null;

    setGameState(prev => {
      if (prev.gameOver || !prev.isPlayerTurn || !prev.selectedCard) return prev;

      const card = prev.selectedCard;
      const newHand = prev.hand.filter(c => c.id !== card.id);
      let newThreats = [...prev.threats];
      let newHealth = prev.systemHealth;
      let newPoints = prev.points;
      let newShield = prev.shield;
      let newThreatsDefeated = prev.threatsDefeated;
      let defeatedThreat: Threat | undefined;
      let pointsEarned = 0;
      let newStats = { ...prev.playerStats };
      let showCardSelection = false;
      let cardChoices: Card[] = [];

      if (card.type === 'damage' && threatId) {
        // Damage card - attack enemy
        const threatIndex = newThreats.findIndex(t => t.id === threatId);
        if (threatIndex !== -1) {
          const threat = newThreats[threatIndex];
          const newThreatHealth = threat.health - card.value;
          
          if (newThreatHealth <= 0) {
            // Enemy defeated!
            defeatedThreat = threat;
            pointsEarned = threat.pointsReward;
            newPoints += pointsEarned;
            newThreats = newThreats.filter(t => t.id !== threatId);
            newThreatsDefeated++;
            newStats.totalEnemiesDefeated++;
            newStats.currentWinStreak++;
            if (newPoints > newStats.highestPoints) {
              newStats.highestPoints = newPoints;
            }
            if (threat.isBoss || threat.isMegaBoss) {
              newStats.bossesDefeated++;
            }
            
            // Generate card choices for player
            showCardSelection = true;
            cardChoices = getCardsFromPool(3).map(createCard);
          } else {
            newThreats[threatIndex] = {
              ...threat,
              health: newThreatHealth,
            };
          }
        }
        result = { card, type: 'damage', defeatedThreat, pointsEarned };
      } else if (card.type === 'block') {
        // Block card - add shield
        newShield += card.value;
        result = { card, type: 'block' };
      } else if (card.type === 'heal') {
        // Heal card - restore health
        newHealth = Math.min(prev.maxHealth, prev.systemHealth + card.value);
        result = { card, type: 'heal' };
      }

      // Check victory
      const victory = newThreatsDefeated >= prev.threatsToWin;

      return {
        ...prev,
        hand: newHand,
        threats: newThreats,
        systemHealth: newHealth,
        shield: newShield,
        points: newPoints,
        threatsDefeated: newThreatsDefeated,
        victory,
        gameOver: victory,
        selectedCard: null,
        isPlayerTurn: false, // Turn ends after playing a card
        playerStats: newStats,
        showCardSelection,
        cardChoices,
      };
    });

    return result;
  }, []);

  // Choose a card from the reward selection
  const chooseRewardCard = useCallback((cardId: string) => {
    setGameState(prev => {
      const chosenCard = prev.cardChoices.find(c => c.id === cardId);
      if (!chosenCard) return prev;
      
      return {
        ...prev,
        deck: [...prev.deck, chosenCard],
        showCardSelection: false,
        cardChoices: [],
      };
    });
  }, []);

  // Skip card reward
  const skipCardReward = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showCardSelection: false,
      cardChoices: [],
    }));
  }, []);

  // Execute threat turn (called after player ends turn)
  const executeThreatTurn = useCallback((): { 
    threatCard?: Card; 
    damage: number;
    ability?: ThreatAbility;
    pointsStolen?: number;
  } => {
    let result: { threatCard?: Card; damage: number; ability?: ThreatAbility; pointsStolen?: number } = { damage: 0 };

    setGameState(prev => {
      if (prev.gameOver || prev.threats.length === 0) {
        return prev;
      }

      let newHealth = prev.systemHealth;
      let newShield = prev.shield;
      let newThreats = [...prev.threats];
      let newPoints = prev.points;
      let totalDamage = 0;
      let pointsStolen = 0;

      // Each threat attacks
      for (let i = 0; i < newThreats.length; i++) {
        const threat = newThreats[i];
        let damage = threat.damage;

        // Apply ability effects
        if (threat.ability === 'damage-over-time') {
          damage += 1;
        }
        if (threat.ability === 'steal-points') {
          const stolen = Math.min(2, newPoints);
          newPoints -= stolen;
          pointsStolen += stolen;
        }
        if (threat.ability === 'heal-self') {
          newThreats[i] = {
            ...threat,
            health: Math.min(threat.maxHealth, threat.health + 1),
          };
        }

        // Apply damage (shield absorbs first)
        if (newShield > 0) {
          const shieldAbsorb = Math.min(newShield, damage);
          newShield -= shieldAbsorb;
          damage -= shieldAbsorb;
        }
        
        totalDamage += damage;
        newHealth -= damage;
      }

      result = { damage: totalDamage, pointsStolen: pointsStolen > 0 ? pointsStolen : undefined };

      // Check game over
      if (newHealth <= 0) {
        return {
          ...prev,
          systemHealth: 0,
          shield: 0,
          points: newPoints,
          threats: newThreats,
          gameOver: true,
          victory: false,
          playerStats: {
            ...prev.playerStats,
            currentWinStreak: 0, // Reset streak on loss
          },
        };
      }

      return {
        ...prev,
        systemHealth: newHealth,
        shield: newShield,
        points: newPoints,
        threats: newThreats,
      };
    });

    return result;
  }, []);

  // Start new turn (spawn threats if needed, draw cards)
  const startNewTurn = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver) return prev;

      const playerPower = calculatePlayerPower(prev.hand);
      
      // Determine if boss should spawn
      const isMegaBoss = (prev.threatsDefeated + 1) % 10 === 0 && prev.threatsDefeated > 0;
      const isBoss = !isMegaBoss && (prev.threatsDefeated + 1) % 5 === 0 && prev.threatsDefeated > 0;
      
      // Spawn new threats if under 3
      let newThreats = [...prev.threats];
      while (newThreats.length < 3) {
        const shouldBeBoss = isMegaBoss && newThreats.length === prev.threats.length;
        const shouldBeRegularBoss = isBoss && newThreats.length === prev.threats.length;
        newThreats.push(createThreat(playerPower, shouldBeRegularBoss, shouldBeBoss));
      }

      // Draw new hand
      const allCards = [...prev.deck, ...prev.hand];
      const shuffled = shuffleArray(allCards);
      const newHand = shuffled.slice(0, 5);
      const newDeck = shuffled.slice(5);

      return {
        ...prev,
        deck: newDeck,
        hand: newHand,
        threats: newThreats,
        turn: prev.turn + 1,
        isPlayerTurn: true,
        selectedCard: null,
        shield: 0, // Shield resets each turn
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
  }, []);

  return {
    gameState,
    selectCard,
    playCardOnTarget,
    executeThreatTurn,
    startNewTurn,
    chooseRewardCard,
    skipCardReward,
    resetGame,
    getPlayerPower,
  };
};
