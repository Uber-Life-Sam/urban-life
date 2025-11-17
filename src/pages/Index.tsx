// src/pages/Index.tsx
import { useState, useEffect, useRef } from "react";
import usePlayerMovementGTA from "@/hooks/usePlayerMovementGTA";
import { useCameraOrbit } from "@/hooks/useCameraOrbit";
import { useWeather } from "@/hooks/useWeather";
import { useWeatherAudio } from "@/hooks/useWeatherAudio";

import GameScene from "@/components/game/GameScene";
import GameHUD from "@/components/game/GameHUD";
import Shop from "@/components/game/Shop";
import DialogueUI from "@/components/game/DialogueUI";
import QuestTracker from "@/components/game/QuestTracker";
import QuestJournal from "@/components/game/QuestJournal";
import InteriorEnvironment from "@/components/game/InteriorEnvironment";

import { Button } from "@/components/ui/button";
import { Play, Pause, Activity, BookOpen } from "lucide-react";
import { Building } from "@/data/buildings";
import { shopItems } from "@/data/shopItems";
import { Quest, DialogueNode, DialogueOption } from "@/types/quest";
import { availableQuests, dialogueDatabase } from "@/data/quests";
import { Interior, interiors } from "@/types/interior";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

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

  // Weather system
  const { weather } = useWeather(gameTime);
  useWeatherAudio(weather);

  // Quest system
  const [quests, setQuests] = useState<Quest[]>(availableQuests);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isQuestJournalOpen, setIsQuestJournalOpen] = useState(false);

  // Interior system
  const [currentInterior, setCurrentInterior] = useState<Interior | null>(null);
  const [isInInterior, setIsInInterior] = useState(false);

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
    // Start dialogue based on building type
    if (building.name === "City Hall") {
      setCurrentDialogue(dialogueDatabase.mayor_greeting);
    } else {
      setCurrentDialogue(dialogueDatabase.generic_npc);
    }
  };

  const handleDialogueOption = (option: DialogueOption) => {
    if (option.action === 'accept_quest' && option.questId) {
      setQuests(prev => prev.map(q => 
        q.id === option.questId ? { ...q, status: 'active' as const } : q
      ));
      setMoney(m => m + 100); // Small bonus for accepting
      setCurrentDialogue(null);
    } else if (option.action === 'exit' || option.action === 'decline_quest') {
      setCurrentDialogue(null);
    } else if (option.nextDialogueId) {
      setCurrentDialogue(dialogueDatabase[option.nextDialogueId]);
    }
  };

  const handleEnterInterior = (interiorId: string) => {
    const interior = interiors[interiorId];
    if (interior) {
      setCurrentInterior(interior);
      setIsInInterior(true);
    }
  };

  const handleExitInterior = () => {
    if (currentInterior) {
      // Teleport player to exit position
      setPlayerState({
        ...playerState,
        position: currentInterior.exitPosition,
      });
    }
    setIsInInterior(false);
    setCurrentInterior(null);
  };

  const activeQuests = quests.filter(q => q.status === 'active');

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">

      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button 
          onClick={() => setIsQuestJournalOpen(true)} 
          variant="secondary"
          size="icon"
          title="Quest Journal"
        >
          <BookOpen />
        </Button>
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

      {isInInterior && currentInterior ? (
        <div className="w-full h-full">
          <Canvas camera={{ position: [0, 5, 10], fov: 60 }} shadows>
            <InteriorEnvironment furniture={currentInterior.furniture} />
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          </Canvas>
          <Button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50"
            onClick={handleExitInterior}
          >
            Exit Building (E)
          </Button>
        </div>
      ) : (
        <GameScene
          playerRef={playerRef}
          cameraRef={cameraRef}
          timeOfDay={gameTime}
          weather={weather}
          playerPosition={playerState.position}
          playerRotation={playerState.rotation}
          isMoving={playerState.isMoving}
          cameraOffset={cameraOrbit.offset}
          onBuildingClick={handleBuildingClick}
          onNPCPositionsUpdate={() => {}}
          showPerformanceStats={showPerformanceStats}
          onEnterInterior={handleEnterInterior}
        />
      )}

      <QuestTracker activeQuests={activeQuests} />

      <GameHUD
        time={`${String(Math.floor(gameTime)).padStart(2, "0")}:${String(
          Math.floor((gameTime % 1) * 60)
        ).padStart(2, "0")}`}
        money={money}
        energy={energy}
        job={job}
      />

      {currentDialogue && (
        <DialogueUI
          dialogue={currentDialogue}
          onSelectOption={handleDialogueOption}
          onClose={() => setCurrentDialogue(null)}
        />
      )}

      {isQuestJournalOpen && (
        <QuestJournal
          quests={quests}
          onClose={() => setIsQuestJournalOpen(false)}
        />
      )}

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
