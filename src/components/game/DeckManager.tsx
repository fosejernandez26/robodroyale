import { useState } from 'react';
import { Card, strengthColors, canMergeCards, tierOrder } from '@/types/game';
import { cn } from '@/lib/utils';
import { X, Layers, ArrowUp, Swords, Shield, Heart } from 'lucide-react';

interface DeckManagerProps {
  deck: Card[];
  hand: Card[];
  onMerge: (cardId1: string, cardId2: string) => void;
  onClose: () => void;
}

export const DeckManager = ({ deck, hand, onMerge, onClose }: DeckManagerProps) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const allCards = [...deck, ...hand].sort((a, b) => {
    // Sort by type, then by baseName, then by level
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    if (a.baseName !== b.baseName) return a.baseName.localeCompare(b.baseName);
    return b.level - a.level;
  });

  // Group cards by baseName and type for easy merging
  const cardGroups = allCards.reduce((acc, card) => {
    const key = `${card.baseName}-${card.type}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(card);
    return acc;
  }, {} as Record<string, Card[]>);

  const handleCardClick = (card: Card) => {
    if (!selectedCard) {
      setSelectedCard(card);
    } else if (selectedCard.id === card.id) {
      setSelectedCard(null);
    } else if (canMergeCards(selectedCard, card)) {
      onMerge(selectedCard.id, card.id);
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  const getMergeableCards = (card: Card): Card[] => {
    return allCards.filter(c => canMergeCards(card, c));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'damage': return <Swords className="w-4 h-4" />;
      case 'block': return <Shield className="w-4 h-4" />;
      case 'heal': return <Heart className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-card neon-border rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Deck Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-muted">
          <p className="text-sm text-muted-foreground">
            <strong className="text-primary">🔧 Upgrade Cards:</strong> Click a card to select it, then click another card with the <strong>same name</strong> to merge them. 
            Cards tier up every 2 levels (max level 5).
          </p>
        </div>

        {/* Selected card info */}
        {selectedCard && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/50">
            <p className="text-sm">
              <span className="text-primary font-semibold">Selected:</span>{' '}
              <span className={strengthColors[selectedCard.tier].text}>{selectedCard.name}</span>
              {' '}(Level {selectedCard.level})
              {getMergeableCards(selectedCard).length > 0 && (
                <span className="text-green-400 ml-2">
                  — {getMergeableCards(selectedCard).length} cards can merge!
                </span>
              )}
              {selectedCard.level >= 5 && (
                <span className="text-yellow-400 ml-2">— Max level reached!</span>
              )}
            </p>
          </div>
        )}

        {/* Card Grid */}
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allCards.map(card => {
              const tierStyle = strengthColors[card.tier];
              const isSelected = selectedCard?.id === card.id;
              const canMerge = selectedCard && canMergeCards(selectedCard, card);
              const isMaxLevel = card.level >= 5;
              
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all",
                    tierStyle.bg,
                    isSelected 
                      ? "border-primary ring-2 ring-primary/50 scale-105" 
                      : canMerge 
                        ? "border-green-400 ring-2 ring-green-400/50 animate-pulse" 
                        : tierStyle.border,
                    "hover:scale-102",
                    isMaxLevel && "opacity-70"
                  )}
                  style={{ boxShadow: isSelected || canMerge ? tierStyle.glow : undefined }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={tierStyle.text}>{getTypeIcon(card.type)}</span>
                    <span className={cn("font-semibold text-sm", tierStyle.text)}>
                      {card.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{card.effect}</span>
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-bold",
                        tierStyle.bg, tierStyle.text
                      )}>
                        Lv.{card.level}
                      </span>
                      {card.level < 5 && (
                        <ArrowUp className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                  {canMerge && (
                    <div className="mt-2 text-xs text-green-400 font-semibold animate-pulse">
                      ✨ Click to merge!
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-muted flex items-center justify-between text-sm text-muted-foreground">
          <span>Total cards: {allCards.length}</span>
          <span>In deck: {deck.length} | In hand: {hand.length}</span>
        </div>
      </div>
    </div>
  );
};
