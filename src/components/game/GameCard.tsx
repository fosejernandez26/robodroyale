import { Card, strengthColors } from '@/types/game';
import { Shield, Heart, Sword } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  isReward?: boolean;
}

const typeIcons = {
  block: Shield,
  heal: Heart,
  damage: Sword,
};

export const GameCard = ({ card, onClick, disabled, isSelected, isReward }: GameCardProps) => {
  const Icon = typeIcons[card.type];
  const tierStyle = strengthColors[card.tier];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full p-4 rounded-lg transition-all duration-300",
        "bg-gradient-to-b border",
        tierStyle.bg,
        tierStyle.border,
        "hover:scale-105",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "group",
        isSelected && "ring-2 ring-primary scale-105",
        isReward && "hover:ring-2 hover:ring-primary"
      )}
      style={{
        boxShadow: isSelected ? tierStyle.glow : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-md border",
          tierStyle.bg,
          tierStyle.border
        )}>
          <Icon className={cn("w-5 h-5", tierStyle.text)} />
        </div>
        <div className="flex-1 text-left">
          <h3 className={cn(
            "font-semibold text-sm leading-tight mb-1",
            tierStyle.text
          )}>
            {card.name}
          </h3>
          <p className="text-xs text-muted-foreground">{card.effect}</p>
          {/* Tier indicator */}
          <div className={cn(
            "mt-2 text-xs font-medium uppercase tracking-wider",
            tierStyle.text
          )}>
            {card.tier.replace('-', ' ')}
          </div>
        </div>
        <div className={cn(
          "absolute top-2 right-2 text-lg font-bold",
          tierStyle.text
        )}>
          {card.type === 'block' ? '🛡️' : card.type === 'heal' ? '❤️' : '⚔️'} {card.value}
        </div>
      </div>
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
          SELECTED
        </div>
      )}
    </button>
  );
};
