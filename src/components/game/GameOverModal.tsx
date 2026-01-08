import { Trophy, Skull, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameOverModalProps {
  victory: boolean;
  threatsDefeated: number;
  turn: number;
  onRestart: () => void;
}

export const GameOverModal = ({ victory, threatsDefeated, turn, onRestart }: GameOverModalProps) => {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 scanline">
      <div className={cn(
        "bg-card neon-border rounded-2xl p-8 max-w-md w-full mx-4 text-center",
        "animate-in fade-in zoom-in duration-500"
      )}>
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
          victory 
            ? "bg-primary/20 text-primary" 
            : "bg-destructive/20 text-destructive"
        )}
        style={{
          boxShadow: victory 
            ? '0 0 40px hsl(120 100% 50% / 0.5)' 
            : '0 0 40px hsl(0 85% 50% / 0.5)',
        }}
        >
          {victory ? (
            <Trophy className="w-10 h-10 animate-pulse" />
          ) : (
            <Skull className="w-10 h-10 animate-pulse" />
          )}
        </div>

        <h2 className={cn(
          "font-blox text-4xl mb-4",
          victory ? "text-primary text-glow-strong" : "text-destructive"
        )}>
          {victory ? "VICTORY!" : "SYSTEM HACKED"}
        </h2>

        <p className="text-muted-foreground mb-6">
          {victory 
            ? "You successfully defended the network!" 
            : "The hackers have breached your defenses."}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">{threatsDefeated}</div>
            <div className="text-xs text-muted-foreground">Threats Defeated</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">{turn}</div>
            <div className="text-xs text-muted-foreground">Turns Survived</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className={cn(
            "w-full py-4 rounded-lg font-bold text-lg transition-all duration-300",
            "bg-primary text-primary-foreground",
            "hover:scale-105 hover:shadow-[0_0_30px_hsl(120_100%_50%/0.5)]",
            "flex items-center justify-center gap-2"
          )}
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
};
