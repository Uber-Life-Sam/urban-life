import { Coins, Clock, Battery, Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GameHUDProps {
  time: string;
  money: number;
  energy: number;
  job: string;
}

const GameHUD = ({ time, money, energy, job }: GameHUDProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
        <div className="flex gap-3">
          {/* Time */}
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{time}</span>
          </div>

          {/* Money */}
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">${money.toLocaleString()}</span>
          </div>
        </div>

        {/* Job */}
        <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
          <Briefcase className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">{job}</span>
        </div>
      </div>

      {/* Bottom Bar - Energy */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 pointer-events-auto">
        <div className="bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full border border-border">
          <div className="flex items-center gap-3">
            <Battery className="w-5 h-5 text-accent" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">Energy</span>
                <span className="text-xs font-bold text-foreground">{energy}%</span>
              </div>
              <Progress value={energy} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground text-center">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
