import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface DamageAnimationProps {
  damage: number;
  onComplete?: () => void;
}

export const DamageAnimation = ({ damage, onComplete }: DamageAnimationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Screen flash */}
      <div className="absolute inset-0 bg-destructive/30 animate-flash" />
      
      {/* Damage number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "text-8xl font-bold text-destructive animate-damage-number",
          "drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]"
        )}>
          -{damage}
        </div>
      </div>

      {/* Cracks effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-50">
        <svg viewBox="0 0 200 200" className="w-96 h-96 animate-crack">
          <path
            d="M100,10 L95,50 L80,45 L85,80 L60,90 L90,100 L70,130 L95,120 L100,190"
            fill="none"
            stroke="hsl(0 85% 50%)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M100,10 L105,60 L130,55 L120,85 L150,95 L110,105 L140,135 L105,125 L100,190"
            fill="none"
            stroke="hsl(0 85% 50%)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
