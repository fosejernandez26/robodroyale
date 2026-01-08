import { Threat } from '@/types/game';
import { Bug, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreatCardProps {
  threat: Threat;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ThreatCard = ({ threat, isSelected, onClick }: ThreatCardProps) => {
  const damagePercent = (threat.damage / threat.maxDamage) * 100;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full p-4 rounded-lg transition-all duration-300",
        "bg-gradient-to-b from-destructive/20 to-destructive/5 border border-destructive/50",
        "hover:scale-105",
        isSelected && "ring-2 ring-primary threat-glow scale-105",
        "group"
      )}
      style={{
        boxShadow: isSelected 
          ? '0 0 20px hsl(0 85% 50% / 0.5)' 
          : '0 0 10px hsl(0 85% 50% / 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-destructive/20 border border-destructive/30">
          <Bug className="w-5 h-5 text-destructive animate-pulse" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-destructive text-sm leading-tight mb-1">
            {threat.name}
          </h3>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-destructive" />
            <span className="text-xs text-destructive/80">
              Damage: {threat.damage}
            </span>
          </div>
          {/* Health bar */}
          <div className="mt-2 h-1.5 bg-card rounded-full overflow-hidden">
            <div 
              className="h-full bg-destructive transition-all duration-300"
              style={{ width: `${damagePercent}%` }}
            />
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
          TARGET
        </div>
      )}
    </button>
  );
};
