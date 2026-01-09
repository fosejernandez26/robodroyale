import { Coins, Heart, Shield, Crosshair, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  points: number;
  health: number;
  maxHealth: number;
  shield: number;
  turn: number;
  threatsDefeated: number;
  threatsToWin: number;
}

export const StatsPanel = ({ 
  points, 
  health, 
  maxHealth, 
  shield,
  turn, 
  threatsDefeated, 
  threatsToWin 
}: StatsPanelProps) => {
  const healthPercent = (health / maxHealth) * 100;
  const progressPercent = (threatsDefeated / threatsToWin) * 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {/* Points */}
      <div className="bg-card/50 neon-border rounded-lg p-3 flex items-center gap-3">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Coins className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Points</div>
          <div className="text-lg font-bold text-yellow-500">{points}</div>
        </div>
      </div>

      {/* Health */}
      <div className="bg-card/50 neon-border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Heart className={cn(
            "w-4 h-4",
            healthPercent > 50 ? "text-primary" : healthPercent > 25 ? "text-yellow-500" : "text-destructive"
          )} />
          <span className="text-xs text-muted-foreground">Health</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500",
              healthPercent > 50 ? "bg-primary" : healthPercent > 25 ? "bg-yellow-500" : "bg-destructive"
            )}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
        <div className="text-right text-xs mt-1 text-muted-foreground">
          {health}/{maxHealth}
        </div>
      </div>

      {/* Shield */}
      <div className="bg-card/50 neon-border rounded-lg p-3 flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Shield</div>
          <div className="text-lg font-bold text-blue-400">{shield}</div>
        </div>
      </div>

      {/* Threats Defeated */}
      <div className="bg-card/50 neon-border rounded-lg p-3 flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Crosshair className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Defeated</div>
          <div className="text-lg font-bold text-foreground">{threatsDefeated}</div>
        </div>
      </div>

      {/* Victory Progress */}
      <div className="bg-card/50 neon-border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Progress</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-right text-xs mt-1 text-muted-foreground">
          {threatsDefeated}/{threatsToWin}
        </div>
      </div>
    </div>
  );
};
