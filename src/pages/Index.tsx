// src/pages/Index.tsx
const playerRef = useRef(null);
const cameraRef = useRef(null);

usePlayerMovementGTA(playerRef, cameraRef);

import { useState, useEffect } from 'react';
import GameScene from '@/components/game/GameScene';
import GameHUD from '@/components/game/GameHUD';
import VirtualJoystick from '@/components/game/VirtualJoystick';
import InteriorScene from '@/components/game/InteriorScene';
import JobUI from '@/components/game/JobUI';
import { usePlayerMovementGTA } from '@/hooks/usePlayerMovementGTA';
import { useCameraOrbit } from '@/hooks/useCameraOrbit';
import { useCollisionDetection } from '@/hooks/useCollisionDetection';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Building } from '@/data/buildings';

// Shop imports
import Shop from '@/components/game/Shop';
import { shopItems } from '@/data/shopItems';

const Index = () => {
  const [gameTime, setGameTime] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [money, setMoney] = useState(1250);
  const [energy, setEnergy] = useState(85);
  const [job, setJob] = useState('Explorer');
  const [currentJob, setCurrentJob] = useState<string | null>(null);
  const [currentJobPayRate, setCurrentJobPayRate] = useState(0);

  // Dynamic time progression - 1 game hour = 2 real minutes (30x speed)
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setGameTime((prevTime) => {
        const newTime = prevTime + 0.01; // Increment by 0.01 hours (~36 seconds in game)
        return newTime >= 24 ? 0 : newTime; // Reset at midnight
      });
    }, 20); // Update every 20ms for smooth transitions

    return () => clearInterval(interval);
  }, [isPaused]);

  // Camera orbit control
  const cameraOrbit = useCameraOrbit(8, Math.PI / 4);
  
  // Player movement with camera-relative controls - spawn at house
  const playerState = usePlayerMovementGTA(cameraOrbit.azimuth, 5);

  // Shop integration
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [inventory, setInventory] = useState<string[]>([]);
  const [inventorySize, setInventorySize] = useState(10);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const openShop = () => setIsShopOpen(true);
  const closeShop = () => setIsShopOpen(false);

  const handleBuy = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item) return;
    if (money < item.price) return;

    setMoney((m) => m - item.price);

    // Apply immediate effects for food
    if (item.type === 'food' && item.effect?.energy) {
      setEnergy((e) => Math.min(100, e + item.effect!.energy!));
    }

    // Add to inventory for items/upgrades
    if (item.type === 'item' || item.type === 'upgrade') {
      // For upgrades, apply upgrade effect immediately
      if (item.type === 'upgrade') {
        if (item.effect?.inventorySizeIncrease) {
          setInventorySize((s) => s + item.effect!.inventorySizeIncrease!);
        }
        if (item.effect?.speedMultiplier) {
          setSpeedMultiplier((v) => v * item.effect!.speedMultiplier!);
        }
      }

      // Respect inventory size when adding to inventory
      setInventory((inv) => {
        if (inv.length >= inventorySize) return inv; // don't exceed
        return [...inv, item.id];
      });
    }
  };

  const handleBuildingClick = (building: Building) => {
    // existing placeholder action
    setJob('Explorer');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Time control */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button 
          onClick={() => setIsPaused(!isPaused)}
          variant="secondary"
          size="sm"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      </div>

      {/* Shop button */}
      <div className="absolute top-4 left-4 z-50">
        <Button onClick={() => setIsShopOpen((s) => !s)}>
          Shop - ${money}
        </Button>
      </div>

      {/* 3D Game Scene */}
      <GameScene
        timeOfDay={gameTime}
        playerPosition={playerState.position}
        playerRotation={playerState.rotation}
        isMoving={playerState.isMoving}
        cameraOffset={cameraOrbit.offset}
        onBuildingClick={handleBuildingClick}
        onNPCPositionsUpdate={() => {}}
      />

      {/* HUD and overlays */}
      <GameHUD 
        time={`${String(Math.floor(gameTime)).padStart(2, '0')}:${String(Math.floor((gameTime % 1) * 60)).padStart(2, '0')}`}
        money={money} 
        energy={energy} 
        job={job}
      />

      {/* Shop modal */}
      {isShopOpen && (
        <Shop money={money} onBuy={handleBuy} onClose={closeShop} />
      )}
    </div>
  );
};

export default Index;
