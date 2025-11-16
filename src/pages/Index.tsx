// src/pages/Index.tsx
import { useState, useEffect, useRef } from "react";

// Hooks
import usePlayerMovementGTA from "@/hooks/usePlayerMovementGTA";
import { useCameraOrbit } from "@/hooks/useCameraOrbit";

// Components
import GameScene from "@/components/game/GameScene";
import GameHUD from "@/components/game/GameHUD";
import Shop from "@/components/game/Shop";

// UI + Data
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Building } from "@/data/buildings";
import { shopItems } from "@/data/shopItems";

const Index = () => {
  // Refs — یہ React refs ہیں جو 3D groups / camera رکھیں گے
  const playerRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  // Camera orbit hook
  const cameraOrbit = useCameraOrbit(8, Math.PI / 4);

  // movement hook returns { position, rotation, isMoving }
  const movement = usePlayerMovementGTA(playerRef, cameraRef);

  // Local state mirror (ایسا رکھ لیا تاکہ render بہتر کنٹرول ہو)
  const [playerState, setPlayerState] = useState({
    position: [0, 1, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    isMoving: false,
  });

  // جب movement بدلے تو state update کریں
  useEffect(() => {
    if (!movement) return;
    // safety: اگر movement کوئی غیر متوقع shape دے تو console میں دیکھیں
    console.log("movement (from hook) =", movement);
    // اگر movement null یا غلط ہے تو ignore نہ کریں، fallback دیں
    const safePos = Array.isArray(movement.position) ? movement.position : playerState.position;
    const safeRot = Array.isArray(movement.rotation) ? movement.rotation : playerState.rotation;
    const safeMoving = typeof movement.isMoving === "boolean" ? movement.isMoving : playerState.isMoving;

    setPlayerState({
      position: safePos as [number, number, number],
      rotation: safeRot as [number, number, number],
      isMoving: safeMoving,
    });
  }, [movement]); // movement hook جو object return کرتا ہے

  // Game State
  const [gameTime, setGameTime] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [money, setMoney] = useState(1250);
  const [energy, setEnergy] = useState(85);
  const [job, setJob] = useState("Explorer");

  // Time loop
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setGameTime((prev) => (prev + 0.01 >= 24 ? 0 : prev + 0.01));
    }, 20);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Shop
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [inventory, setInventory] = useState<string[]>([]);
  const [inventorySize, setInventorySize] = useState(10);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const handleBuy = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item || money < item.price) return;
    setMoney((m) => m - item.price);

    if (item.type === "food" && item.effect?.energy) {
      setEnergy((e) => Math.min(100, e + item.effect.energy));
    }
    if (item.type === "upgrade") {
      if (item.effect?.inventorySizeIncrease) {
        setInventorySize((s) => s + item.effect.inventorySizeIncrease);
      }
      if (item.effect?.speedMultiplier) {
        setSpeedMultiplier((v) => v * item.effect.speedMultiplier);
      }
    }
    if (item.type === "item") {
      if (inventory.length < inventorySize) {
        setInventory((inv) => [...inv, item.id]);
      }
    }
  };

  const handleBuildingClick = (building: Building) => {
    setJob("Explorer");
  };

  // Render
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Pause */}
      <div className="absolute top-4 right-4 z-50">
        <Button onClick={() => setIsPaused(!isPaused)} variant="secondary">
          {isPaused ? <Play /> : <Pause />}
        </Button>
      </div>

      {/* Shop */}
      <div className="absolute top-4 left-4 z-50">
        <Button onClick={() => setIsShopOpen((s) => !s)}>Shop - ${money}</Button>
      </div>

      {/* Game Scene — <-- نوٹ: rotation ہم number پاس کریں گے */}
      <GameScene
        playerRef={playerRef}
        cameraRef={cameraRef}
        timeOfDay={gameTime}
        playerPosition={playerState.position}
        playerRotation={playerState.rotation[1] ?? 0}   // Y rotation (number)
        isMoving={playerState.isMoving}
        cameraOffset={cameraOrbit.offset}
        onBuildingClick={handleBuildingClick}
        onNPCPositionsUpdate={() => {}}
      />

      {/* HUD */}
      <GameHUD
        time={`${String(Math.floor(gameTime)).padStart(2, "0")}:${String(
          Math.floor((gameTime % 1) * 60)
        ).padStart(2, "0")}`}
        money={money}
        energy={energy}
        job={job}
      />

      {/* Shop modal */}
      {isShopOpen && <Shop money={money} onBuy={handleBuy} onClose={() => setIsShopOpen(false)} />}
    </div>
  );
};

export default Index;
