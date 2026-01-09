import { Card, strengthColors } from '@/types/game';
import { GameCard } from './GameCard';
import { cn } from '@/lib/utils';

interface CardSelectionModalProps {
  cards: Card[];
  onSelect: (cardId: string) => void;
  onSkip: () => void;
}

export const CardSelectionModal = ({ cards, onSelect, onSkip }: CardSelectionModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card neon-border rounded-xl p-6 max-w-3xl w-full animate-scale-in">
        <h2 className="text-2xl font-bold text-center text-primary mb-2">
          🎉 Enemy Defeated!
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Choose a card to add to your deck:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {cards.map((card) => {
            const tierStyle = strengthColors[card.tier];
            return (
              <div key={card.id} className="transform transition-all hover:scale-105">
                <GameCard 
                  card={card} 
                  onClick={() => onSelect(card.id)}
                  isReward
                />
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <button
            onClick={onSkip}
            className={cn(
              "px-6 py-2 rounded-lg transition-all",
              "bg-muted/50 border border-muted text-muted-foreground",
              "hover:bg-muted hover:text-foreground"
            )}
          >
            Skip (No Card)
          </button>
        </div>
      </div>
    </div>
  );
};
