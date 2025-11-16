// src/pages/Index.tsx

import { useState, useEffect, useRef } from 'react';

// Hooks
import usePlayerMovementGTA from '@/hooks/usePlayerMovementGTA';
import { useCameraOrbit } from '@/hooks/useCameraOrbit';
import { useCollisionDetection } from '@/hooks/useCollisionDetection';

// Components
import GameScene from '@/components/game/GameScene';
import GameHUD from '@/components/game/GameHUD';
import Shop from '@/components/game/Shop';

// UI
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

// Data
import { Building } from '@/data/buildings';
import { shopItems } from '@/data/shopItems';

export default function Index() {

  // ---------------------------------------
  // ✔ CORRECT REFS (inside component only)
  // ---------------------------------------
  const playerRef = useRef(null);
  const cameraRef = useRef(null);

  // ---------------------------------------
  // ✔ GTA MOVEMENT HOOK (correct usage)
  // ---------------------------------------
  const playerState = usePlayerMovementGTA(playerRef, cameraRef);

  // ---------------------------------------
  // ✔ CAMERA ORBIT (used only for camera offset)
  // ---------------------------------------
  const cameraOrbit = useCameraOrbit(8, Math.PI / 4);

  // ---------------------------------------
  // GAME STATE
  // ---------------------------------------
  const [gameTime, setGameTime] = useState(8);
  const [isPaused, setIsPaused] = useState(false);

  const [money, setMoney] = useState(1250);
  const [energy, setEnergy] = useState(85);

  const [job, setJob] = useState('Explorer');

  // Inventory + shop state
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [inventory, setInventory] = useState<string[]>([]);
  const [inventorySize, setInventorySize] = useState(10);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // ---------------------------------------
  // GAME TIME LOOP
  // ---------------------------------------
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setGameTime((prevTime) => {
        const newTime = prevTime + 0.01;
        return newTime >= 24 ? 0 : newTime;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isPaused]);

  // ---------------------------------------
  // SHOP BUY HANDLER
  // ---------------------------------------
  const handleBuy = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item) return;
    if (money < item.price) return;

    setMoney((m) => m - item.price);

    if (item.type === 'food' && item.effect?.energy) {
      setEnergy((e) => Math.min(100, e + item.effect.energy));
    }

    if (item.type === 'upgrade') {
      if (item.effect?.inventorySizeIncrease) {
        setInventorySize((s) => s + item.effect.inventorySizeIncrease);
      }
      if (item.effect?.speedMultiplier) {
        setSpeedMultiplier((v) => v * item.effect!.speedMultiplier!);
      }
    }

    if (item.type === 'item' || item.type === 'upgrade') {
      setInventory((inv) => {
        if (inv.length >= inventorySize) return inv;
        return [...inv, item.id];
      });
    }
  };

  const handleBuildingClick = (building: Building) => {
    setJob('Explorer');
  };

  // ---------------------------------------
  // RENDER
  // ---------------------------------------
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">

      {/* Game Time Pause Button */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button 
          onClick={() => setIsPaused(!isPaused)}
          variant="secondary"
          size="sm"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      </div>

      {/* Shop Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button onClick={() => setIsShopOpen((s) => !s)}>
          Shop - ${money}
        </Button>
      </div>

      {/* 3D Scene */}
      <GameScene
        playerRef={playerRef}
        cameraRef={cameraRef}
        timeOfDay={gameTime}
        playerPosition={playerState.position}
        playerRotation={playerState.rotation}
        isMoving={playerState.isMoving}
        cameraOffset={cameraOrbit.offset}
        onBuildingClick={handleBuildingClick}
        onNPCPositionsUpdate={() => {}}
      />

      {/* HUD */}
      <GameHUD 
        time={`${String(Math.floor(gameTime)).padStart(2, '0')}:${String(Math.floor((gameTime % 1) * 60)).padStart(2, '0')}`}
        money={money} 
        energy={energy} 
        job={job}
      />

      {/* SHOP MODAL */}
      {isShopOpen && (
        <Shop 
          money={money} 
          onBuy={handleBuy} 
          onClose={() => setIsShopOpen(false)} 
        />
      )}
    </div>
  );
}
