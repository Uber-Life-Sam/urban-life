import { useState, useEffect, useRef } from 'react';
import GameScene from '@/components/game/GameScene';
import GameHUD from '@/components/game/GameHUD';
import VirtualJoystick from '@/components/game/VirtualJoystick';
import { usePlayerMovement } from '@/hooks/usePlayerMovement';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

const Index = () => {
  const [gameTime, setGameTime] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [money, setMoney] = useState(1250);
  const [energy, setEnergy] = useState(85);
  const [job] = useState('Explorer');
  
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [playerRotation, setPlayerRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  
  const { getMovementVector, setJoystickInput } = usePlayerMovement();
  const lastUpdateTime = useRef(Date.now());

  // Movement update loop
  useEffect(() => {
    const updateMovement = () => {
      const now = Date.now();
      const delta = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;

      const movement = getMovementVector();
      const isMovingNow = movement.x !== 0 || movement.z !== 0;
      setIsMoving(isMovingNow);

      if (isMovingNow) {
        const speed = 3; // units per second
        const moveX = movement.x * speed * delta;
        const moveZ = movement.z * speed * delta;

        setPlayerPosition((prev) => {
          const newX = prev[0] + moveX;
          const newZ = prev[2] + moveZ;
          
          // Boundary limits
          const maxDistance = 20;
          const clampedX = Math.max(-maxDistance, Math.min(maxDistance, newX));
          const clampedZ = Math.max(-maxDistance, Math.min(maxDistance, newZ));
          
          return [clampedX, prev[1], clampedZ];
        });

        // Update rotation to face movement direction
        if (movement.x !== 0 || movement.z !== 0) {
          const angle = Math.atan2(movement.x, movement.z);
          setPlayerRotation(angle);
        }
      }

      requestAnimationFrame(updateMovement);
    };

    const animationId = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(animationId);
  }, [getMovementVector]);

  // Time progression
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setGameTime((prev) => {
        const newTime = prev + 0.1;
        return newTime >= 24 ? newTime - 24 : newTime;
      });
      
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

  const handleJoystickMove = (x: number, z: number) => {
    setJoystickInput(x, z);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Welcome overlay */}
      {gameTime < 8.1 && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center animate-fade-out">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">SimCraft</h1>
            <p className="text-xl text-muted-foreground">Urban Life Simulator</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Use WASD or joystick to move around the city
            </p>
          </div>
        </div>
      )}

      {/* 3D Game Scene */}
      <GameScene 
        timeOfDay={gameTime}
        playerPosition={playerPosition}
        playerRotation={playerRotation}
        isMoving={isMoving}
      />

      {/* Game HUD */}
      <GameHUD
        time={formatTime(gameTime)}
        money={money}
        energy={energy}
        job={job}
      />

      {/* Virtual Joystick (Mobile) */}
      <div className="md:hidden">
        <VirtualJoystick onMove={handleJoystickMove} />
      </div>

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

      {/* Controls Info */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div className="bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground text-center">
          <span className="hidden md:inline">WASD or Arrow Keys to move</span>
          <span className="md:hidden">Use joystick to move</span>
        </div>
      </div>

      {/* Game Title */}
      <div className="absolute bottom-6 right-6 text-right pointer-events-none">
        <h2 className="text-2xl font-bold text-primary/80">SimCraft</h2>
        <p className="text-xs text-muted-foreground">Early Prototype</p>
      </div>
    </div>
  );
};

export default Index;
