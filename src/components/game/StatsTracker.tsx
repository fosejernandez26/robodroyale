import { PlayerStats } from '@/types/game';
import { Crosshair, TrendingUp, Trophy, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsTrackerProps {
  stats: PlayerStats;
}

export const StatsTracker = ({ stats }: StatsTrackerProps) => {
  return (
    <div className="bg-card/30 neon-border rounded-xl p-4">
      <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
        <Trophy className="w-4 h-4" />
        Career Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-card/50 rounded-lg p-2 text-center">
          <Crosshair className="w-4 h-4 mx-auto text-primary mb-1" />
          <div className="text-lg font-bold text-foreground">{stats.totalEnemiesDefeated}</div>
          <div className="text-xs text-muted-foreground">Total Defeated</div>
        </div>
        <div className="bg-card/50 rounded-lg p-2 text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
          <div className="text-lg font-bold text-yellow-500">{stats.currentWinStreak}</div>
          <div className="text-xs text-muted-foreground">Win Streak</div>
        </div>
        <div className="bg-card/50 rounded-lg p-2 text-center">
          <Trophy className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
          <div className="text-lg font-bold text-emerald-500">{stats.highestPoints}</div>
          <div className="text-xs text-muted-foreground">Highest Points</div>
        </div>
        <div className="bg-card/50 rounded-lg p-2 text-center">
          <Skull className="w-4 h-4 mx-auto text-red-500 mb-1" />
          <div className="text-lg font-bold text-red-500">{stats.bossesDefeated}</div>
          <div className="text-xs text-muted-foreground">Bosses Slain</div>
        </div>
      </div>
    </div>
  );
};
