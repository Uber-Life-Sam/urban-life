import { useState, useEffect } from 'react';
import GameScene from '@/components/game/GameScene';
import GameHUD from '@/components/game/GameHUD';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

const Index = () => {
  const [gameTime, setGameTime] = useState(8); // Start at 8 AM
  const [isPaused, setIsPaused] = useState(false);
  const [money, setMoney] = useState(1250);
  const [energy, setEnergy] = useState(85);
  const [job] = useState('Explorer');

  // Time progression
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setGameTime((prev) => {
        const newTime = prev + 0.1; // 0.1 hour every second (fast time)
        return newTime >= 24 ? newTime - 24 : newTime;
      });
      
      // Slowly decrease energy
      setEnergy((prev) => Math.max(0, prev - 0.05));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Welcome overlay - only shows briefly */}
      {gameTime < 8.1 && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center animate-fade-out">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">SimCraft</h1>
            <p className="text-xl text-muted-foreground">Urban Life Simulator</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Experience city life in 3D. Explore, work, and build your future.
            </p>
          </div>
        </div>
      )}

      {/* 3D Game Scene */}
      <GameScene timeOfDay={gameTime} />

      {/* Game HUD */}
      <GameHUD
        time={formatTime(gameTime)}
        money={money}
        energy={energy}
        job={job}
      />

      {/* Pause/Play Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setIsPaused(!isPaused)}
          className="rounded-full"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </Button>
      </div>

      {/* Game Title (bottom) */}
      <div className="absolute bottom-6 right-6 text-right pointer-events-none">
        <h2 className="text-2xl font-bold text-primary/80">SimCraft</h2>
        <p className="text-xs text-muted-foreground">Early Prototype</p>
      </div>
    </div>
  );
};

export default Index;
