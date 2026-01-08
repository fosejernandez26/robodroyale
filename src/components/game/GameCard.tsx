import { Card } from '@/types/game';
import { Shield, Heart, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  isUpgrade?: boolean;
  canAfford?: boolean;
}

const typeIcons = {
  block: Shield,
  heal: Heart,
  points: Coins,
};

const typeColors = {
  block: 'from-primary/20 to-primary/5',
  heal: 'from-emerald-500/20 to-emerald-500/5',
  points: 'from-yellow-500/20 to-yellow-500/5',
};

export const GameCard = ({ card, onClick, disabled, isUpgrade, canAfford = true }: GameCardProps) => {
  const Icon = typeIcons[card.type];

  return (
    <button
      onClick={onClick}
      disabled={disabled || (isUpgrade && !canAfford)}
      className={cn(
        "relative w-full p-4 rounded-lg transition-all duration-300",
        "bg-gradient-to-b border neon-border",
        typeColors[card.type],
        "hover:scale-105 hover:shadow-[0_0_25px_hsl(120_100%_50%/0.4)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "group"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-card/50 neon-border">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 group-hover:text-glow">
            {card.name}
          </h3>
          <p className="text-xs text-muted-foreground">{card.effect}</p>
          {isUpgrade && card.cost && (
            <div className="mt-2 flex items-center gap-1">
              <Coins className="w-3 h-3 text-yellow-500" />
              <span className={cn(
                "text-xs font-bold",
                canAfford ? "text-yellow-500" : "text-destructive"
              )}>
                {card.cost} pts
              </span>
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 text-lg font-bold text-primary/60">
          +{card.value}
        </div>
      </div>
    </button>
  );
};
