import { useEffect, useState } from 'react';
import { Heart, Shield, Sword, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EffectType = 'heal' | 'block' | 'attack' | 'damage';

interface EffectAnimationProps {
  type: EffectType;
  onComplete?: () => void;
}

export const EffectAnimation = ({ type, onComplete }: EffectAnimationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const icons = {
    heal: Heart,
    block: Shield,
    attack: Sword,
    damage: Skull,
  };

  const colors = {
    heal: 'text-emerald-500',
    block: 'text-primary',
    attack: 'text-yellow-500',
    damage: 'text-destructive',
  };

  const glows = {
    heal: 'drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]',
    block: 'drop-shadow-[0_0_20px_rgba(0,255,0,0.8)]',
    attack: 'drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]',
    damage: 'drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]',
  };

  const Icon = icons[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className={cn(
        "animate-effect-pop",
        colors[type],
        glows[type]
      )}>
        <Icon className="w-32 h-32" strokeWidth={1.5} />
      </div>
    </div>
  );
};
