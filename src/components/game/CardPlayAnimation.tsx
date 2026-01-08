import { useEffect, useState } from 'react';
import { Card } from '@/types/game';
import { cn } from '@/lib/utils';
import { Shield, Heart, Coins } from 'lucide-react';

interface CardPlayAnimationProps {
  card: Card;
  isPlayer: boolean;
  onComplete?: () => void;
}

const typeIcons = {
  block: Shield,
  heal: Heart,
  points: Coins,
};

export const CardPlayAnimation = ({ card, isPlayer, onComplete }: CardPlayAnimationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const Icon = typeIcons[card.type];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
      <div className={cn(
        "bg-card/90 neon-border rounded-xl p-6 min-w-[200px]",
        "animate-card-play",
        isPlayer ? "border-primary" : "border-destructive"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-lg",
            isPlayer ? "bg-primary/20" : "bg-destructive/20"
          )}>
            <Icon className={cn(
              "w-8 h-8",
              isPlayer ? "text-primary" : "text-destructive"
            )} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">
              {isPlayer ? "You played" : "Threat used"}
            </p>
            <h3 className={cn(
              "font-bold text-lg",
              isPlayer ? "text-primary" : "text-destructive"
            )}>
              {card.name}
            </h3>
            <p className="text-sm text-muted-foreground">+{card.value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
