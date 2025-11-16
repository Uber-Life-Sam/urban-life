import { useEffect, useRef } from "react";

interface SyncOptions {
  serverUrl?: string;
  syncIntervalMs?: number;
}

interface Position {
  x: number;
  y: number;
  z?: number;
}

const usePlayerMovement = (syncOptions?: SyncOptions) => {
  const { serverUrl, syncIntervalMs } = syncOptions || {};
  const positionRef = useRef<Position>({ x: 0, y: 0, z: 0 });
  const syncRef = useRef<NodeJS.Timeout | null>(null);

  // Update local player position safely
  const updatePosition = (newPosition: Partial<Position>) => {
    positionRef.current = {
      ...positionRef.current,
      ...newPosition,
    };
  };

  // Sync to server (optional)
  const startSync = () => {
    if (!serverUrl || !syncIntervalMs) return;

    const sync = () => {
      fetch(`${serverUrl}/player/position`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(positionRef.current),
      }).catch(() => {});
    };

    syncRef.current = setInterval(sync, syncIntervalMs);
  };

  const stopSync = () => {
    if (syncRef.current) {
      clearInterval(syncRef.current);
      syncRef.current = null;
    }
  };

  useEffect(() => {
    startSync();
    return () => stopSync();
  }, [serverUrl, syncIntervalMs]);

  return updatePosition;
};

export default usePlayerMovement;
