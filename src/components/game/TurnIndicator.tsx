import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface TurnIndicatorProps {
  isPlayerTurn: boolean;
}

export const TurnIndicator = ({ isPlayerTurn }: TurnIndicatorProps) => {
  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 -translate-x-1/2 z-30",
      "px-6 py-3 rounded-full font-bold text-lg",
      "border-2 transition-all duration-500",
      "animate-pulse",
      isPlayerTurn 
        ? "bg-primary/20 border-primary text-primary shadow-[0_0_30px_hsl(120_100%_50%/0.5)]"
        : "bg-destructive/20 border-destructive text-destructive shadow-[0_0_30px_hsl(0_85%_50%/0.5)]"
    )}>
      <div className="flex items-center gap-3">
        {isPlayerTurn ? (
          <>
            <User className="w-5 h-5" />
            <span>YOUR TURN</span>
          </>
        ) : (
          <>
            <Bot className="w-5 h-5" />
            <span>OPPONENT'S TURN</span>
          </>
        )}
      </div>
    </div>
  );
};
