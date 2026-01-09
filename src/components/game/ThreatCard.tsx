import { Threat, strengthColors, enemyTypeInfo } from '@/types/game';
import { threatAbilities } from '@/data/gameData';
import { Skull, Zap, AlertTriangle, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreatCardProps {
  threat: Threat;
  isSelected?: boolean;
  onClick?: () => void;
  potentialPoints?: number;
  canTarget?: boolean;
}

export const ThreatCard = ({ threat, isSelected, onClick, potentialPoints, canTarget }: ThreatCardProps) => {
  const healthPercent = (threat.health / threat.maxHealth) * 100;
  const tierStyle = strengthColors[threat.tier];
  const typeInfo = enemyTypeInfo[threat.enemyType];
  const abilityInfo = threatAbilities.find(a => a.ability === threat.ability);

  return (
    <button
      onClick={onClick}
      disabled={!canTarget}
      className={cn(
        "relative w-full p-4 rounded-lg transition-all duration-300",
        "bg-gradient-to-b border",
        tierStyle.bg,
        tierStyle.border,
        canTarget && "hover:scale-105 cursor-pointer",
        !canTarget && "opacity-70 cursor-not-allowed",
        isSelected && "ring-2 ring-primary scale-105",
        threat.isMegaBoss && "border-2 border-red-500 animate-pulse",
        threat.isBoss && "border-2 border-orange-500",
        "group"
      )}
      style={{
        boxShadow: isSelected 
          ? tierStyle.glow 
          : threat.isMegaBoss 
            ? '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)'
            : threat.isBoss 
              ? '0 0 25px rgba(249, 115, 22, 0.5)'
              : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Enemy Type Icon */}
        <div className={cn(
          "p-2 rounded-md border text-2xl",
          tierStyle.bg,
          tierStyle.border
        )}>
          {typeInfo.icon}
        </div>
        
        <div className="flex-1 text-left">
          {/* Name with boss indicators */}
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold text-sm leading-tight",
              tierStyle.text
            )}>
              {threat.name}
            </h3>
            {threat.isMegaBoss && (
              <Crown className="w-4 h-4 text-red-400 animate-pulse" />
            )}
            {threat.isBoss && !threat.isMegaBoss && (
              <Skull className="w-4 h-4 text-orange-400" />
            )}
          </div>
          
          {/* Stats row */}
          <div className="flex items-center gap-3 mt-1">
            <span className={cn("text-xs flex items-center gap-1", tierStyle.text)}>
              <Zap className="w-3 h-3" />
              {threat.damage} DMG
            </span>
            <span className={cn(
              "text-xs uppercase tracking-wider",
              tierStyle.text
            )}>
              {threat.tier.replace('-', ' ')}
            </span>
          </div>
          
          {/* Ability indicator */}
          {threat.ability !== 'none' && abilityInfo && (
            <div className="mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400">{abilityInfo.name}</span>
            </div>
          )}
          
          {/* Health bar */}
          <div className="mt-2 h-2 bg-card rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                healthPercent > 50 ? "bg-primary" : healthPercent > 25 ? "bg-yellow-500" : "bg-destructive"
              )}
              style={{ width: `${healthPercent}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            HP: {threat.health}/{threat.maxHealth}
          </div>
        </div>
      </div>
      
      {/* Points reward indicator */}
      {potentialPoints !== undefined && canTarget && (
        <div className={cn(
          "absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold",
          tierStyle.bg,
          tierStyle.text,
          tierStyle.border,
          "border"
        )}>
          +{potentialPoints} pts
        </div>
      )}
      
      {isSelected && (
        <div className="absolute -top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
          TARGET
        </div>
      )}
    </button>
  );
};
