import { Card } from '@/components/ui/card';
import { Keyboard, Mouse } from 'lucide-react';

const ControlsHint = () => {
  return (
    <Card className="absolute bottom-4 left-4 z-30 p-3 bg-background/90 backdrop-blur-sm border-border/50 max-w-xs">
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-foreground font-semibold mb-2">
          <Keyboard className="w-4 h-4" />
          <span>Controls</span>
        </div>
        
        <div className="space-y-1 text-muted-foreground">
          <div className="flex justify-between">
            <span>Move:</span>
            <span className="font-mono text-foreground">W A S D</span>
          </div>
          <div className="flex justify-between">
            <span>Sprint:</span>
            <span className="font-mono text-foreground">Left Shift</span>
          </div>
          <div className="flex justify-between">
            <span>Enter Building:</span>
            <span className="font-mono text-foreground">E</span>
          </div>
        </div>

        <div className="border-t border-border pt-2 mt-2">
          <div className="flex items-center gap-2 text-foreground font-semibold mb-1">
            <Mouse className="w-4 h-4" />
            <span>Camera</span>
          </div>
          <div className="text-muted-foreground">
            <span>Right Click + Drag to rotate</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ControlsHint;
