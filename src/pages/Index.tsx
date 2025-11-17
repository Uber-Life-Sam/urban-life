// src/pages/Index.tsx
import { useState, useEffect, useRef } from "react";
import usePlayerMovementGTA from "@/hooks/usePlayerMovementGTA";
import { useCameraOrbit } from "@/hooks/useCameraOrbit";

import GameScene from "@/components/game/GameScene";
import GameHUD from "@/components/game/GameHUD";
import Shop from "@/components/game/Shop";

import { Button } from "@/components/ui/button";
import { Play, Pause, Activity } from "lucide-react";
import { Building } from "@/data/buildings";
import { shopItems } from "@/data/shopItems";

const Index = () => {

  const playerRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const cameraOrbit = useCameraOrbit(8, Math.PI / 4);

  const movement = usePlayerMovementGTA(playerRef, cameraRef);

  const [playerState, setPlayerState] = useState({
    position: [0, 1, 0] as [number, number, number],
    rotation: 0,   // <-- FIXED (only Y angle)
    isMoving: false,
  });

  useEffect(() => {
    if (!movement) return;

    setPlayerState({
      position: Array.isArray(movement.position) 
        ? movement.position 
        : playerState.position,

      rotation: typeof movement.rotation === "number"
        ? movement.rotation
        : Array.isArray(movement.rotation)
          ? movement.rotation[1]   // FIXED
          : playerState.rotation,

      isMoving: movement.isMoving ?? playerState.isMoving,
    });
  }, [movement]);

  const [gameTime, setGameTime] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [money, setMoney] = useState(1250);
  const [energy, setEnergy] = useState(85);
  const [job, setJob] = useState("Explorer");

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setGameTime((prev) => (prev + 0.01 >= 24 ? 0 : prev + 0.01));
    }, 20);
    return () => clearInterval(interval);
  }, [isPaused]);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [inventory, setInventory] = useState<string[]>([]);
  const [inventorySize, setInventorySize] = useState(10);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);

  const handleBuy = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item || money < item.price) return;

    setMoney((m) => m - item.price);

    if (item.type === "food" && item.effect?.energy) {
      setEnergy((e) => Math.min(100, e + item.effect.energy));
    }
    if (item.type === "upgrade") {
      if (item.effect?.inventorySizeIncrease)
        setInventorySize((s) => s + item.effect.inventorySizeIncrease);

      if (item.effect?.speedMultiplier)
        setSpeedMultiplier((v) => v * item.effect.speedMultiplier);
    }
    if (item.type === "item" && inventory.length < inventorySize) {
      setInventory((inv) => [...inv, item.id]);
    }
  };

  const handleBuildingClick = (building: Building) => {
    setJob("Explorer");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">

      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button 
          onClick={() => setShowPerformanceStats(!showPerformanceStats)} 
          variant="secondary"
          size="icon"
          title="Toggle Performance Stats"
        >
          <Activity className={showPerformanceStats ? "text-green-500" : ""} />
        </Button>
        <Button onClick={() => setIsPaused(!isPaused)} variant="secondary" size="icon">
          {isPaused ? <Play /> : <Pause />}
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-50">
        <Button onClick={() => setIsShopOpen((s) => !s)}>
          Shop - ${money}
        </Button>
      </div>

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
        showPerformanceStats={showPerformanceStats}
      />

      <GameHUD
        time={`${String(Math.floor(gameTime)).padStart(2, "0")}:${String(
          Math.floor((gameTime % 1) * 60)
        ).padStart(2, "0")}`}
        money={money}
        energy={energy}
        job={job}
      />

      {isShopOpen && (
        <Shop
          money={money}
          onBuy={handleBuy}
          onClose={() => setIsShopOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
