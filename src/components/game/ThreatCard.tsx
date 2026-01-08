import { Threat } from '@/types/game';
import { Bug, AlertTriangle, Skull } from 'lucide-react';
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
        threat.isBoss && "border-yellow-500/50 from-yellow-500/20 to-destructive/10",
        "group"
      )}
      style={{
        boxShadow: threat.isBoss
          ? '0 0 25px hsl(45 100% 50% / 0.5), 0 0 10px hsl(0 85% 50% / 0.3)'
          : isSelected 
            ? '0 0 20px hsl(0 85% 50% / 0.5)' 
            : '0 0 10px hsl(0 85% 50% / 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-md border",
          threat.isBoss 
            ? "bg-yellow-500/20 border-yellow-500/30"
            : "bg-destructive/20 border-destructive/30"
        )}>
          {threat.isBoss ? (
            <Skull className="w-5 h-5 text-yellow-500 animate-pulse" />
          ) : (
            <Bug className="w-5 h-5 text-destructive animate-pulse" />
          )}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold text-sm leading-tight",
              threat.isBoss ? "text-yellow-500" : "text-destructive"
            )}>
              {threat.name}
            </h3>
            {threat.isBoss && (
              <Skull className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <AlertTriangle className={cn(
              "w-3 h-3",
              threat.isBoss ? "text-yellow-500" : "text-destructive"
            )} />
            <span className={cn(
              "text-xs",
              threat.isBoss ? "text-yellow-500/80" : "text-destructive/80"
            )}>
              Damage: {threat.damage}
              {threat.isBoss && threat.multiplier && (
                <span className="ml-1 text-yellow-400">
                  ({threat.multiplier.toFixed(1)}x)
                </span>
              )}
            </span>
          </div>
          {/* Health bar */}
          <div className="mt-2 h-1.5 bg-card rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                threat.isBoss ? "bg-yellow-500" : "bg-destructive"
              )}
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
