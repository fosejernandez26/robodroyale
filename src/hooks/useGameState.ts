import { useState, useCallback } from 'react';
import { GameState, Card, Threat } from '@/types/game';
import { starterCards, upgradeCards, threatTemplates } from '@/data/gameData';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createCard = (template: Omit<Card, 'id'>): Card => ({
  ...template,
  id: generateId(),
});

const createThreat = (template: Omit<Threat, 'id'>): Threat => ({
  ...template,
  id: generateId(),
});

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
    };
  };

  const [gameState, setGameState] = useState<GameState>(initializeGame);

  const playCard = useCallback((cardId: string, threatId?: string) => {
    setGameState(prev => {
      if (prev.gameOver) return prev;

      const cardIndex = prev.hand.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prev;

      const card = prev.hand[cardIndex];
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
      };
    });
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

  const endTurn = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver) return prev;

      // Apply threat damage
      let newHealth = prev.systemHealth;
      prev.threats.forEach(threat => {
        newHealth -= threat.damage;
      });

      // Check game over
      if (newHealth <= 0) {
        return {
          ...prev,
          systemHealth: 0,
          gameOver: true,
          victory: false,
        };
      }

      // Spawn new threat
      const newThreat = createThreat(
        threatTemplates[Math.floor(Math.random() * threatTemplates.length)]
      );

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
        threats: [...prev.threats, newThreat],
        turn: prev.turn + 1,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
  }, []);

  return {
    gameState,
    playCard,
    buyUpgrade,
    endTurn,
    resetGame,
    upgradeCards,
  };
};
