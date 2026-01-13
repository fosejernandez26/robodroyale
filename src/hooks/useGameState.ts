import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Card, Threat, StrengthTier, EnemyType, ThreatAbility, calculatePlayerPower, getUpgradedCard, AchievementId, achievements } from '@/types/game';
import { starterCards, threatAttackCards, enemyNames, getRandomTier, getCardsFromPool } from '@/data/gameData';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createCard = (template: Omit<Card, 'id'>): Card => ({
  ...template,
  id: generateId(),
});

const createThreatCards = (tier: StrengthTier): Card[] => {
  const numCards = Math.floor(Math.random() * 3) + 3;
  const cards: Card[] = [];
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
  const enemyTypes: EnemyType[] = ['hacker', 'virus', 'trojan'];
  const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  
  let tier = getRandomTier();
  
  if (isMegaBoss) {
    tier = 'very-strong';
  } else if (isBoss) {
    tier = Math.random() > 0.3 ? 'very-strong' : 'strong';
  }
  
  const baseStats = getThreatStats(tier);
  const multiplier = isMegaBoss ? 2 + Math.random() * 1.5 : isBoss ? 1.5 + Math.random() * 1 : 1;
  
  const health = Math.round(baseStats.health * multiplier);
  const damage = Math.round(baseStats.damage * multiplier);
  const pointsReward = Math.round(baseStats.points * multiplier);
  
  const prefix = enemyNames[enemyType][Math.floor(Math.random() * enemyNames[enemyType].length)];
  const suffix = isMegaBoss ? 'Overlord' : isBoss ? 'Boss' : enemyType.charAt(0).toUpperCase() + enemyType.slice(1);
  
  let ability: ThreatAbility = (isBoss || isMegaBoss) ? getRandomAbility() : (Math.random() > 0.7 ? getRandomAbility() : 'none');
  if (ability === 'none' && (isBoss || isMegaBoss)) {
    ability = 'damage-over-time';
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

// Check achievements based on stats
const checkAchievements = (stats: GameState['playerStats'], currentAchievements: AchievementId[], victory: boolean): AchievementId[] => {
  const newAchievements: AchievementId[] = [...currentAchievements];
  
  for (const achievement of achievements) {
    if (newAchievements.includes(achievement.id)) continue;
    
    if (achievement.statKey === 'special') {
      if (achievement.id === 'survivor' && victory) {
        newAchievements.push(achievement.id);
      }
    } else {
      const statValue = stats[achievement.statKey];
      if (statValue >= achievement.requirement) {
        newAchievements.push(achievement.id);
      }
    }
  }
  
  return newAchievements;
};

export const useGameState = () => {
  const initializeGame = (): GameState => {
    const deck = starterCards.map(createCard);
    const shuffledDeck = shuffleArray(deck);
    const hand = shuffledDeck.slice(0, 5);
    const remainingDeck = shuffledDeck.slice(5);
    const playerPower = calculatePlayerPower(hand);
    
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
        cardsUpgraded: 0,
        totalDamageDealt: 0,
        totalHealing: 0,
      },
      showCardSelection: false,
      cardChoices: [],
      unlockedAchievements: [],
      showDeckManager: false,
    };
  };

  const [gameState, setGameState] = useState<GameState>(initializeGame);
  
  // Use ref to track gameOver to avoid stale closures
  const gameOverRef = useRef(gameState.gameOver);
  useEffect(() => {
    gameOverRef.current = gameState.gameOver;
  }, [gameState.gameOver]);

  const getPlayerPower = useCallback(() => {
    return calculatePlayerPower(gameState.hand);
  }, [gameState.hand]);

  const selectCard = useCallback((cardId: string | null) => {
    setGameState(prev => {
      if (cardId === null) {
        return { ...prev, selectedCard: null };
      }
      const card = prev.hand.find(c => c.id === cardId) || null;
      return { ...prev, selectedCard: card };
    });
  }, []);

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
        const threatIndex = newThreats.findIndex(t => t.id === threatId);
        if (threatIndex !== -1) {
          const threat = newThreats[threatIndex];
          const newThreatHealth = threat.health - card.value;
          newStats.totalDamageDealt += card.value;
          
          if (newThreatHealth <= 0) {
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
        newShield += card.value;
        result = { card, type: 'block' };
      } else if (card.type === 'heal') {
        const healAmount = Math.min(card.value, prev.maxHealth - prev.systemHealth);
        newHealth = prev.systemHealth + healAmount;
        newStats.totalHealing += healAmount;
        result = { card, type: 'heal' };
      }

      const victory = newThreatsDefeated >= prev.threatsToWin;
      const newAchievements = checkAchievements(newStats, prev.unlockedAchievements, victory);

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
        isPlayerTurn: false,
        playerStats: newStats,
        showCardSelection,
        cardChoices,
        unlockedAchievements: newAchievements,
      };
    });

    return result;
  }, []);

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

  const skipCardReward = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showCardSelection: false,
      cardChoices: [],
    }));
  }, []);

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

      for (let i = 0; i < newThreats.length; i++) {
        const threat = newThreats[i];
        let damage = threat.damage;

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

        if (newShield > 0) {
          const shieldAbsorb = Math.min(newShield, damage);
          newShield -= shieldAbsorb;
          damage -= shieldAbsorb;
        }
        
        totalDamage += damage;
        newHealth -= damage;
      }

      result = { damage: totalDamage, pointsStolen: pointsStolen > 0 ? pointsStolen : undefined };

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
            currentWinStreak: 0,
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

  const startNewTurn = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver) return prev;

      const playerPower = calculatePlayerPower(prev.hand);
      
      const isMegaBoss = (prev.threatsDefeated + 1) % 10 === 0 && prev.threatsDefeated > 0;
      const isBoss = !isMegaBoss && (prev.threatsDefeated + 1) % 5 === 0 && prev.threatsDefeated > 0;
      
      let newThreats = [...prev.threats];
      while (newThreats.length < 3) {
        const shouldBeBoss = isMegaBoss && newThreats.length === prev.threats.length;
        const shouldBeRegularBoss = isBoss && newThreats.length === prev.threats.length;
        newThreats.push(createThreat(playerPower, shouldBeRegularBoss, shouldBeBoss));
      }

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
        shield: 0,
      };
    });
  }, []);

  // Merge two cards (upgrade)
  const mergeCards = useCallback((cardId1: string, cardId2: string) => {
    setGameState(prev => {
      const allCards = [...prev.deck, ...prev.hand];
      const card1 = allCards.find(c => c.id === cardId1);
      const card2 = allCards.find(c => c.id === cardId2);
      
      if (!card1 || !card2) return prev;
      if (card1.baseName !== card2.baseName || card1.type !== card2.type) return prev;
      if (card1.level >= 5) return prev;
      
      // Upgrade the first card
      const upgradedCard = getUpgradedCard(card1);
      
      // Remove both cards and add upgraded one
      const newDeck = prev.deck.filter(c => c.id !== cardId1 && c.id !== cardId2);
      const newHand = prev.hand.filter(c => c.id !== cardId1 && c.id !== cardId2);
      
      // Add upgraded card to deck
      newDeck.push(upgradedCard);
      
      const newStats = {
        ...prev.playerStats,
        cardsUpgraded: prev.playerStats.cardsUpgraded + 1,
      };
      
      const newAchievements = checkAchievements(newStats, prev.unlockedAchievements, prev.victory);
      
      return {
        ...prev,
        deck: newDeck,
        hand: newHand,
        playerStats: newStats,
        unlockedAchievements: newAchievements,
      };
    });
  }, []);

  // Toggle deck manager
  const toggleDeckManager = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showDeckManager: !prev.showDeckManager,
    }));
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
    mergeCards,
    toggleDeckManager,
    resetGame,
    getPlayerPower,
  };
};
