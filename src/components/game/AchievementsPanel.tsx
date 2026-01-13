import { achievements, AchievementId, PlayerStats } from '@/types/game';
import { cn } from '@/lib/utils';
import { Trophy, Lock } from 'lucide-react';

interface AchievementsPanelProps {
  unlockedAchievements: AchievementId[];
  stats: PlayerStats;
}

export const AchievementsPanel = ({ unlockedAchievements, stats }: AchievementsPanelProps) => {
  const getProgress = (achievement: typeof achievements[0]): { current: number; max: number; percent: number } => {
    if (achievement.statKey === 'special') {
      return { current: 0, max: 1, percent: 0 };
    }
    const current = stats[achievement.statKey];
    const max = achievement.requirement;
    const percent = Math.min(100, (current / max) * 100);
    return { current, max, percent };
  };

  return (
    <div className="bg-card/30 neon-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-bold text-lg text-foreground">Achievements</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {unlockedAchievements.length}/{achievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {achievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const progress = getProgress(achievement);
          
          return (
            <div
              key={achievement.id}
              className={cn(
                "relative p-3 rounded-lg border text-center transition-all group",
                isUnlocked 
                  ? "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]" 
                  : "bg-muted/20 border-muted/50 opacity-60"
              )}
              title={`${achievement.name}: ${achievement.description}`}
            >
              {/* Icon */}
              <div className={cn(
                "text-2xl mb-1 transition-transform",
                isUnlocked ? "grayscale-0" : "grayscale",
                "group-hover:scale-110"
              )}>
                {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 mx-auto text-muted-foreground" />}
              </div>
              
              {/* Name */}
              <div className={cn(
                "text-xs font-semibold truncate",
                isUnlocked ? "text-yellow-400" : "text-muted-foreground"
              )}>
                {achievement.name}
              </div>
              
              {/* Progress bar (for locked achievements) */}
              {!isUnlocked && achievement.statKey !== 'special' && (
                <div className="mt-1">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500/50 transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {progress.current}/{progress.max}
                  </div>
                </div>
              )}

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-muted rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {achievement.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
