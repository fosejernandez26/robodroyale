import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameCard } from './GameCard';
import { ThreatCard } from './ThreatCard';
import { StatsPanel } from './StatsPanel';
import { GameOverModal } from './GameOverModal';
import { Play, ShoppingCart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/types/game';

export const GameBoard = () => {
  const { gameState, playCard, buyUpgrade, endTurn, resetGame, upgradeCards } = useGameState();
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleCardClick = (card: Card) => {
    if (card.type === 'block') {
      if (gameState.threats.length === 0) {
        showNotification("No threats to block!");
        return;
      }
      if (!selectedThreat) {
        showNotification("Select a threat first!");
        return;
      }
      playCard(card.id, selectedThreat);
      setSelectedThreat(null);
      showNotification(`Blocked with ${card.name}!`);
    } else {
      playCard(card.id);
      showNotification(`Used ${card.name}!`);
    }
  };

  const handleBuyUpgrade = (index: number) => {
    const upgrade = upgradeCards[index];
    if (upgrade.cost && gameState.points >= upgrade.cost) {
      buyUpgrade(index);
      showNotification(`Purchased ${upgrade.name}!`);
    } else {
      showNotification("Not enough points!");
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid scanline p-4 md:p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="font-blox text-5xl md:text-7xl text-primary text-glow-strong animate-flicker tracking-wider">
          ROBO-D ROYALE
        </h1>
        <p className="text-muted-foreground mt-2 text-sm tracking-widest uppercase">
          Cooperative Deck Building Cyber Defense
        </p>
      </header>

      {/* Stats */}
      <StatsPanel 
        points={gameState.points}
        health={gameState.systemHealth}
        maxHealth={gameState.maxHealth}
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

      {/* Main Game Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Hand Panel */}
        <div className="bg-card/30 neon-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">Your Hand</h2>
            <span className="text-xs text-muted-foreground ml-auto">
              {gameState.hand.length} cards
            </span>
          </div>
          <div className="space-y-3">
            {gameState.hand.map(card => (
              <GameCard 
                key={card.id} 
                card={card} 
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
          <button
            onClick={endTurn}
            className={cn(
              "w-full mt-4 py-3 rounded-lg font-bold transition-all duration-300",
              "bg-primary/20 border border-primary text-primary",
              "hover:bg-primary hover:text-primary-foreground",
              "hover:shadow-[0_0_20px_hsl(120_100%_50%/0.5)]",
              "flex items-center justify-center gap-2"
            )}
          >
            <Play className="w-5 h-5" />
            End Turn
          </button>
        </div>

        {/* Threats Panel */}
        <div className="bg-card/30 neon-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <h2 className="font-bold text-lg text-foreground">Active Threats</h2>
            <span className="text-xs text-destructive ml-auto">
              {gameState.threats.length} threats
            </span>
          </div>
          {gameState.threats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No active threats!</p>
              <p className="text-xs mt-1">End turn to continue...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gameState.threats.map(threat => (
                <ThreatCard 
                  key={threat.id} 
                  threat={threat}
                  isSelected={selectedThreat === threat.id}
                  onClick={() => setSelectedThreat(
                    selectedThreat === threat.id ? null : threat.id
                  )}
                />
              ))}
            </div>
          )}
          {gameState.threats.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Click a threat to target it, then use a block card
            </p>
          )}
        </div>

        {/* Shop Panel */}
        <div className="bg-card/30 neon-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">Upgrade Shop</h2>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {upgradeCards.map((card, index) => (
              <GameCard 
                key={index} 
                card={{ ...card, id: `upgrade-${index}` }}
                isUpgrade
                canAfford={card.cost ? gameState.points >= card.cost : true}
                onClick={() => handleBuyUpgrade(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* How to Play */}
      <div className="mt-8 bg-card/30 neon-border rounded-xl p-4 text-center">
        <h3 className="font-bold text-primary mb-2">How to Play</h3>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Play cards from your hand to block threats, heal your system, or earn points. 
          Buy upgrades to strengthen your deck. Defeat 10 threats to win. 
          If your system health reaches 0, you lose!
        </p>
      </div>

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
