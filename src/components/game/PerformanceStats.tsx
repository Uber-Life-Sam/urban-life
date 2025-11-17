import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Card } from '@/components/ui/card';

interface PerformanceStatsProps {
  entityCount: number;
}

const PerformanceStats = ({ entityCount }: PerformanceStatsProps) => {
  const [fps, setFps] = useState(60);
  const [renderTime, setRenderTime] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderTimesRef = useRef<number[]>([]);

  useFrame((_, delta) => {
    frameCountRef.current++;
    
    // Track render time
    const currentRenderTime = delta * 1000; // Convert to ms
    renderTimesRef.current.push(currentRenderTime);
    if (renderTimesRef.current.length > 60) {
      renderTimesRef.current.shift();
    }

    const now = performance.now();
    const elapsed = now - lastTimeRef.current;

    // Update stats every 500ms
    if (elapsed >= 500) {
      const currentFps = Math.round((frameCountRef.current / elapsed) * 1000);
      const avgRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;
      
      setFps(currentFps);
      setRenderTime(avgRenderTime);
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  const getFpsColor = () => {
    if (fps >= 50) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="absolute top-20 right-4 p-3 bg-background/90 backdrop-blur-sm border-border/50 min-w-[160px]">
      <div className="space-y-1 text-xs font-mono">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">FPS:</span>
          <span className={`font-bold ${getFpsColor()}`}>{fps}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Render:</span>
          <span className="text-foreground">{renderTime.toFixed(2)}ms</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Entities:</span>
          <span className="text-foreground">{entityCount}</span>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceStats;
