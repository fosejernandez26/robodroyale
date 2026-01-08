import { useState, useCallback } from 'react';
import { GameState, Card, Threat } from '@/types/game';
import { starterCards, upgradeCards, threatTemplates, threatAttackCards } from '@/data/gameData';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createCard = (template: Omit<Card, 'id'>): Card => ({
  ...template,
  id: generateId(),
});

const createThreatCards = (): Card[] => {
  // Give each threat 3-5 random attack cards
  const numCards = Math.floor(Math.random() * 3) + 3;
  const cards: Card[] = [];
  for (let i = 0; i < numCards; i++) {
    const template = threatAttackCards[Math.floor(Math.random() * threatAttackCards.length)];
    cards.push(createCard(template));
  }
  return cards;
};

const createThreat = (template: Omit<Threat, 'id' | 'cards'>, isBoss: boolean = false): Threat => {
  const multiplier = isBoss ? 1.5 + Math.random() * 1.5 : 1; // 1.5x to 3x for bosses
  const damage = Math.round(template.damage * multiplier);
  const maxDamage = Math.round(template.maxDamage * multiplier);
  
  return {
    ...template,
    id: generateId(),
    damage,
    maxDamage,
    isBoss,
    multiplier: isBoss ? multiplier : undefined,
    cards: createThreatCards(),
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
    
    return {
      points: 5,
      systemHealth: 20,
      maxHealth: 20,
      deck: remainingDeck,
      hand,
      threats: [createThreat(threatTemplates[Math.floor(Math.random() * threatTemplates.length)])],
      turn: 1,
      gameOver: false,
      victory: false,
      threatsDefeated: 0,
      threatsToWin: 10,
      isPlayerTurn: true,
      cardPlayedThisTurn: false,
    };
  };

  const [gameState, setGameState] = useState<GameState>(initializeGame);

  const playCard = useCallback((cardId: string, threatId?: string): { card: Card; type: 'block' | 'heal' | 'points' } | null => {
    let playedCard: Card | null = null;
    let cardType: 'block' | 'heal' | 'points' = 'points';

    setGameState(prev => {
      if (prev.gameOver || !prev.isPlayerTurn || prev.cardPlayedThisTurn) return prev;

      const cardIndex = prev.hand.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prev;

      const card = prev.hand[cardIndex];
      playedCard = card;
      cardType = card.type;
      const newHand = prev.hand.filter(c => c.id !== cardId);
      let newThreats = [...prev.threats];
      let newHealth = prev.systemHealth;
      let newPoints = prev.points;
      let newThreatsDefeated = prev.threatsDefeated;

      if (card.type === 'block' && threatId) {
        const threatIndex = newThreats.findIndex(t => t.id === threatId);
        if (threatIndex !== -1) {
          newThreats[threatIndex] = {
            ...newThreats[threatIndex],
            damage: Math.max(0, newThreats[threatIndex].damage - card.value),
          };
          if (newThreats[threatIndex].damage <= 0) {
            newThreats = newThreats.filter(t => t.id !== threatId);
            newThreatsDefeated++;
          }
        }
      } else if (card.type === 'heal') {
        newHealth = Math.min(prev.maxHealth, prev.systemHealth + card.value);
      } else if (card.type === 'points') {
        newPoints += card.value;
      }

      // Check victory
      const victory = newThreatsDefeated >= prev.threatsToWin;

      return {
        ...prev,
        hand: newHand,
        threats: newThreats,
        systemHealth: newHealth,
        points: newPoints,
        threatsDefeated: newThreatsDefeated,
        victory,
        gameOver: victory,
        cardPlayedThisTurn: true,
      };
    });

    return playedCard ? { card: playedCard, type: cardType } : null;
  }, []);

  const buyUpgrade = useCallback((upgradeIndex: number) => {
    setGameState(prev => {
      if (prev.gameOver) return prev;

      const upgrade = upgradeCards[upgradeIndex];
      if (!upgrade.cost || prev.points < upgrade.cost) return prev;

      return {
        ...prev,
        points: prev.points - upgrade.cost,
        deck: [...prev.deck, createCard(upgrade)],
      };
    });
  }, []);

  const executeThreatTurn = useCallback((): { threatCard: Card; damage: number } | null => {
    let result: { threatCard: Card; damage: number } | null = null;

    setGameState(prev => {
      if (prev.gameOver || prev.threats.length === 0) {
        return prev;
      }

      // Random threat attacks with a random card
      const attackingThreat = prev.threats[Math.floor(Math.random() * prev.threats.length)];
      if (attackingThreat.cards.length === 0) {
        return prev;
      }

      const threatCard = attackingThreat.cards[Math.floor(Math.random() * attackingThreat.cards.length)];
      let newHealth = prev.systemHealth;
      let newThreats = [...prev.threats];

      if (threatCard.type === 'block') {
        // Attack card - deal damage to player
        newHealth -= threatCard.value;
        result = { threatCard, damage: threatCard.value };
      } else if (threatCard.type === 'heal') {
        // Heal card - heal the threat
        const threatIndex = newThreats.findIndex(t => t.id === attackingThreat.id);
        if (threatIndex !== -1) {
          newThreats[threatIndex] = {
            ...newThreats[threatIndex],
            damage: Math.min(
              newThreats[threatIndex].maxDamage,
              newThreats[threatIndex].damage + threatCard.value
            ),
          };
        }
        result = { threatCard, damage: 0 };
      }

      // Check game over
      if (newHealth <= 0) {
        return {
          ...prev,
          systemHealth: 0,
          threats: newThreats,
          gameOver: true,
          victory: false,
        };
      }

      return {
        ...prev,
        systemHealth: newHealth,
        threats: newThreats,
      };
    });

    return result;
  }, []);

  const endTurn = useCallback((): { threatDamage: number } => {
    let totalDamage = 0;

    setGameState(prev => {
      if (prev.gameOver) return prev;

      // Apply threat damage
      let newHealth = prev.systemHealth;
      prev.threats.forEach(threat => {
        newHealth -= threat.damage;
        totalDamage += threat.damage;
      });

      // Check game over
      if (newHealth <= 0) {
        return {
          ...prev,
          systemHealth: 0,
          gameOver: true,
          victory: false,
          isPlayerTurn: false,
        };
      }

      // Determine if boss should spawn (every 5 threats)
      const newThreatsDefeated = prev.threatsDefeated;
      const shouldSpawnBoss = (newThreatsDefeated + 1) % 5 === 0 && newThreatsDefeated > 0;

      // Only spawn new threat if under 3 threats
      let newThreats = [...prev.threats];
      if (newThreats.length < 3) {
        const newThreat = createThreat(
          threatTemplates[Math.floor(Math.random() * threatTemplates.length)],
          shouldSpawnBoss
        );
        newThreats = [...newThreats, newThreat];
      }

      // Draw new hand
      const allCards = [...prev.deck, ...prev.hand];
      const shuffled = shuffleArray(allCards);
      const newHand = shuffled.slice(0, 5);
      const newDeck = shuffled.slice(5);

      return {
        ...prev,
        systemHealth: newHealth,
        deck: newDeck,
        hand: newHand,
        threats: newThreats,
        turn: prev.turn + 1,
        isPlayerTurn: false,
        cardPlayedThisTurn: false,
      };
    });

    return { threatDamage: totalDamage };
  }, []);

  const startPlayerTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlayerTurn: true,
      cardPlayedThisTurn: false,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
  }, []);

  return {
    gameState,
    playCard,
    buyUpgrade,
    endTurn,
    executeThreatTurn,
    startPlayerTurn,
    resetGame,
    upgradeCards,
  };
};
