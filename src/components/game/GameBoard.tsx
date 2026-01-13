import { useState, useEffect, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameCard } from './GameCard';
import { ThreatCard } from './ThreatCard';
import { StatsPanel } from './StatsPanel';
import { StatsTracker } from './StatsTracker';
import { GameOverModal } from './GameOverModal';
import { CardSelectionModal } from './CardSelectionModal';
import { EffectAnimation, EffectType } from './EffectAnimation';
import { DamageAnimation } from './DamageAnimation';
import { CardPlayAnimation } from './CardPlayAnimation';
import { TurnIndicator } from './TurnIndicator';
import { Zap, Target, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/types/game';

export const GameBoard = () => {
  const { 
    gameState, 
    selectCard,
    playCardOnTarget,
    executeThreatTurn,
    startNewTurn,
    chooseRewardCard,
    skipCardReward,
    resetGame,
    getPlayerPower,
  } = useGameState();
  
  const [notification, setNotification] = useState<string | null>(null);
  const [activeEffect, setActiveEffect] = useState<EffectType | null>(null);
  const [damageAnimation, setDamageAnimation] = useState<number | null>(null);
  const [playedCard, setPlayedCard] = useState<{ card: Card; isPlayer: boolean } | null>(null);
  const [screenShake, setScreenShake] = useState(false);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const showEffect = (type: EffectType) => {
    setActiveEffect(type);
  };

  const triggerScreenShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  // Handle card selection
  const handleCardClick = (card: Card) => {
    if (!gameState.isPlayerTurn) {
      showNotification("Wait for your turn!");
      return;
    }

    // If heal or block card, apply immediately (no target needed for heal, shield for block)
    if (card.type === 'heal') {
      selectCard(card.id);
      const result = playCardOnTarget();
      if (result) {
        setPlayedCard({ card: result.card, isPlayer: true });
        showEffect('heal');
        showNotification(`+${card.value} health!`);
        // Trigger enemy turn after a delay
        setTimeout(() => {
          handleEnemyTurn();
        }, 800);
      }
    } else if (card.type === 'block') {
      selectCard(card.id);
      const result = playCardOnTarget();
      if (result) {
        setPlayedCard({ card: result.card, isPlayer: true });
        showEffect('block');
        showNotification(`+${card.value} shield!`);
        // Trigger enemy turn after a delay
        setTimeout(() => {
          handleEnemyTurn();
        }, 800);
      }
    } else {
      // Damage card - need to select target
      if (gameState.selectedCard?.id === card.id) {
        selectCard(null); // Deselect if already selected
      } else {
        selectCard(card.id);
        showNotification("Now click an enemy to attack!");
      }
    }
  };

  // Handle target selection (for damage cards)
  const handleThreatClick = (threatId: string) => {
    if (!gameState.isPlayerTurn) return;
    
    if (!gameState.selectedCard) {
      showNotification("Select a damage card first!");
      return;
    }

    if (gameState.selectedCard.type !== 'damage') {
      showNotification("Only damage cards can target enemies!");
      return;
    }

    const result = playCardOnTarget(threatId);
    if (result) {
      setPlayedCard({ card: result.card, isPlayer: true });
      showEffect('attack');
      
      // Strong cards cause screen shake
      if (result.card.tier === 'very-strong' || result.card.tier === 'strong') {
        triggerScreenShake();
      }

      if (result.defeatedThreat) {
        showNotification(`💀 ${result.defeatedThreat.name} defeated! +${result.pointsEarned} points!`);
        // Card selection modal will show - enemy turn happens after selection
      } else {
        showNotification(`⚔️ Dealt ${result.card.value} damage!`);
        // No defeat - trigger enemy turn after animation
        setTimeout(() => {
          handleEnemyTurn();
        }, 800);
      }
    }
  };

  // Handle enemy turn
  const handleEnemyTurn = useCallback(() => {
    if (gameState.gameOver) return;

    const result = executeThreatTurn();
    
    if (result.damage > 0) {
      setDamageAnimation(result.damage);
      showEffect('damage');
      triggerScreenShake();
      showNotification(`💥 Enemies dealt ${result.damage} damage!`);
    }
    
    if (result.pointsStolen && result.pointsStolen > 0) {
      showNotification(`🔓 Enemy stole ${result.pointsStolen} points!`);
    }

    // Start new turn after delay
    setTimeout(() => {
      startNewTurn();
    }, 1200);
  }, [gameState.gameOver, executeThreatTurn, startNewTurn]);

  // After card selection, continue to enemy turn
  const handleCardRewardSelect = (cardId: string) => {
    chooseRewardCard(cardId);
    showNotification("Card added to deck!");
    // Delay to allow state to update before triggering enemy turn
    setTimeout(() => {
      const result = executeThreatTurn();
      if (result.damage > 0) {
        setDamageAnimation(result.damage);
        showEffect('damage');
        triggerScreenShake();
        showNotification(`💥 Enemies dealt ${result.damage} damage!`);
      }
      if (result.pointsStolen && result.pointsStolen > 0) {
        showNotification(`🔓 Enemy stole ${result.pointsStolen} points!`);
      }
      setTimeout(() => {
        startNewTurn();
      }, 1200);
    }, 500);
  };

  const handleSkipReward = () => {
    skipCardReward();
    // Delay to allow state to update before triggering enemy turn
    setTimeout(() => {
      const result = executeThreatTurn();
      if (result.damage > 0) {
        setDamageAnimation(result.damage);
        showEffect('damage');
        triggerScreenShake();
        showNotification(`💥 Enemies dealt ${result.damage} damage!`);
      }
      if (result.pointsStolen && result.pointsStolen > 0) {
        showNotification(`🔓 Enemy stole ${result.pointsStolen} points!`);
      }
      setTimeout(() => {
        startNewTurn();
      }, 1200);
    }, 500);
  };

  const playerPower = getPlayerPower();

  return (
    <div className={cn(
      "min-h-screen bg-background cyber-grid scanline p-4 md:p-6 pb-20 transition-all",
      screenShake && "animate-shake"
    )}>
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="font-blox text-4xl md:text-6xl text-primary text-glow-strong animate-flicker tracking-wider">
          ROBO-D ROYALE
        </h1>
        <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">
          Deck Building Cyber Combat
        </p>
      </header>

      {/* Stats */}
      <StatsPanel 
        points={gameState.points}
        health={gameState.systemHealth}
        maxHealth={gameState.maxHealth}
        shield={gameState.shield}
        turn={gameState.turn}
        threatsDefeated={gameState.threatsDefeated}
        threatsToWin={gameState.threatsToWin}
      />

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold animate-in slide-in-from-right z-40">
          {notification}
        </div>
      )}

      {/* Effect Animations */}
      {activeEffect && (
        <EffectAnimation 
          type={activeEffect} 
          onComplete={() => setActiveEffect(null)} 
        />
      )}

      {/* Damage Animation */}
      {damageAnimation !== null && (
        <DamageAnimation 
          damage={damageAnimation} 
          onComplete={() => setDamageAnimation(null)} 
        />
      )}

      {/* Card Play Animation */}
      {playedCard && (
        <CardPlayAnimation 
          card={playedCard.card}
          isPlayer={playedCard.isPlayer}
          onComplete={() => setPlayedCard(null)}
        />
      )}

      {/* Main Game Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Hand Panel */}
        <div className="bg-card/30 neon-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">Your Hand</h2>
            <span className="text-xs text-muted-foreground ml-auto">
              {gameState.hand.length} cards | Power: {playerPower.toFixed(1)}
            </span>
          </div>
          
          {/* Instructions */}
          {gameState.isPlayerTurn && (
            <div className="mb-3 text-center py-2 bg-muted/30 rounded-lg border border-muted">
              <span className="text-sm text-muted-foreground">
                {gameState.selectedCard 
                  ? "👆 Click an enemy to attack!" 
                  : "🃏 Select a card to play"}
              </span>
            </div>
          )}
          
          <div className="space-y-3">
            {gameState.hand.map(card => (
              <div 
                key={card.id}
                className={cn(
                  "transition-all duration-300",
                  !gameState.isPlayerTurn && "opacity-50 pointer-events-none"
                )}
              >
                <GameCard 
                  card={card} 
                  onClick={() => handleCardClick(card)}
                  disabled={!gameState.isPlayerTurn}
                  isSelected={gameState.selectedCard?.id === card.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Threats Panel */}
        <div className="bg-card/30 neon-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-destructive" />
            <h2 className="font-bold text-lg text-foreground">Enemies</h2>
            <span className="text-xs text-destructive ml-auto">
              {gameState.threats.length}/3 active
            </span>
          </div>
          
          {gameState.threats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No enemies remaining!</p>
              <p className="text-xs mt-1">Waiting for next wave...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gameState.threats.map(threat => (
                <ThreatCard 
                  key={threat.id} 
                  threat={threat}
                  isSelected={false}
                  onClick={() => handleThreatClick(threat.id)}
                  potentialPoints={threat.pointsReward}
                  canTarget={gameState.isPlayerTurn && gameState.selectedCard?.type === 'damage'}
                />
              ))}
            </div>
          )}
          
          {/* Threat legend */}
          <div className="mt-4 p-3 bg-card/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-semibold">Enemy Strength Colors:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-white">⚪ Much Weaker</span>
              <span className="text-blue-400">🔵 Weaker</span>
              <span className="text-yellow-400">🟡 Equal</span>
              <span className="text-orange-400">🟠 Stronger</span>
              <span className="text-red-400">🔴 Much Stronger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Tracker */}
      <div className="mt-6">
        <StatsTracker stats={gameState.playerStats} />
      </div>

      {/* How to Play */}
      <div className="mt-6 bg-card/30 neon-border rounded-xl p-4 text-center">
        <h3 className="font-bold text-primary mb-2">How to Play</h3>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          <strong>⚔️ Damage cards:</strong> Select a card, then click an enemy to attack. 
          <strong> 🛡️ Block cards:</strong> Click to gain shield (absorbs enemy damage). 
          <strong> ❤️ Heal cards:</strong> Click to restore health. 
          Defeat enemies to earn points and new cards! Every 5 enemies: Boss. Every 10: Mega-Boss!
        </p>
      </div>

      {/* Turn Indicator */}
      <TurnIndicator isPlayerTurn={gameState.isPlayerTurn} />

      {/* Card Selection Modal */}
      {gameState.showCardSelection && (
        <CardSelectionModal 
          cards={gameState.cardChoices}
          onSelect={handleCardRewardSelect}
          onSkip={handleSkipReward}
        />
      )}

      {/* Game Over Modal */}
      {gameState.gameOver && (
        <GameOverModal 
          victory={gameState.victory}
          threatsDefeated={gameState.threatsDefeated}
          turn={gameState.turn}
          onRestart={resetGame}
        />
      )}
    </div>
  );
};
