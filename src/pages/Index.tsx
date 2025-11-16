// src/pages/Index.tsx

import { useState, useEffect, useRef } from 'react';

// Hooks
import usePlayerMovementGTA from '@/hooks/usePlayerMovementGTA';
import { useCameraOrbit } from '@/hooks/useCameraOrbit';
import { useCollisionDetection } from '@/hooks/useCollisionDetection';

// Components
import GameScene from '@/components/game/GameScene';
import GameHUD from '@/components/game/GameHUD';
import VirtualJoystick from '@/components/game/VirtualJoystick';
import InteriorScene from '@/components/game/InteriorScene';
import JobUI from '@/components/game/JobUI';
import Shop from '@/components/game/Shop';

// UI + Data
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Building } from '@/data/buildings';
import { shopItems } from '@/data/shopItems';

const Index = () => {
  // -------------------------------
  // Refs (Correct Place)
  // -------------------------------
  const playerRef = useRef(null);
  const cameraRef = useRef(null);

  // -------------------------------
  // Camera Orbit + Player Movement
  // -------------------------------
  const cameraOrbit = useCameraOrbit(8, Math.PI / 4);
  const playerState = usePlayerMovementGTA(playerRef, cameraRef);

  // -------------------------------
  // Game State
  // -------------------------------
  const [gameTime, setGameTime] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [money, setMoney] = useState(1250);
  const [energy, setEnergy] = useState(85);
  const [job, setJob] = useState('Explorer');

  // -------------------------------
  // Time System
  // -------------------------------
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setGameTime((prev) => {
        const newTime = prev + 0.01;
        return newTime >= 24 ? 0 : newTime;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isPaused]);

  // -------------------------------
  // Shop System
  // -------------------------------
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [inventory, setInventory] = useState<string[]>([]);
  const [inventorySize, setInventorySize] = useState(10);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const handleBuy = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item || money < item.price) return;

    setMoney((m) => m - item.price);

    if (item.type === 'food' && item.effect?.energy) {
      setEnergy((e) => Math.min(100, e + item.effect.energy));
    }

    if (item.type === 'upgrade') {
      if (item.effect?.inventorySizeIncrease) {
        setInventorySize((s) => s + item.effect.inventorySizeIncrease);
      }
      if (item.effect?.speedMultiplier) {
        setSpeedMultiplier((v) => v * item.effect.speedMultiplier);
      }
    }

    if (item.type === 'item') {
      if (inventory.length < inventorySize) {
        setInventory((inv) => [...inv, item.id]);
      }
    }
  };

  // -------------------------------
  // Building Click
  // -------------------------------
  const handleBuildingClick = (building: Building) => {
    setJob('Explorer');
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">

      {/* Pause Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button onClick={() => setIsPaused(!isPaused)} variant="secondary">
          {isPaused ? <Play /> : <Pause />}
        </Button>
      </div>

      {/* Shop Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button onClick={() => setIsShopOpen((s) => !s)}>
          Shop - ${money}
        </Button>
      </div>

      {/* Game Scene */}
      <GameScene
        playerRef={playerRef}
        cameraRef={cameraRef}
        timeOfDay={gameTime}
        playerPosition={playerState.position}
        playerRotation={playerState.rotation}
        isMoving={playerState.isMoving}
        cameraOffset={cameraOrbit.offset}
        onBuildingClick={handleBuildingClick}
      />

      {/* HUD */}
      <GameHUD
        time={`${String(Math.floor(gameTime)).padStart(2, '0')}:${String(
          Math.floor((gameTime % 1) * 60)
        ).padStart(2, '0')}`}
        money={money}
        energy={energy}
        job={job}
      />

      {/* Shop */}
      {isShopOpen && (
        <Shop money={money} onBuy={handleBuy} onClose={() => setIsShopOpen(false)} />
      )}
    </div>
  );
};

export default Index;
