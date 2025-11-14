import { useEffect, useRef } from 'react';

const usePlayerMovement = (syncOptions) => {
  const { serverUrl, syncIntervalMs } = syncOptions || {};
  const positionRef = useRef({ x: 0, y: 0 });
  const syncRef = useRef(null);

  const updatePosition = (newPosition) => {
    positionRef.current = { ...positionRef.current, ...newPosition };
    // existing local logic for handling position updates...
  };

  const startSync = () => {
    if (serverUrl && syncIntervalMs) {
      const sync = () => {
        fetch(`${serverUrl}/player/position`, {
          method: 'POST',
          body: JSON.stringify(positionRef.current),
          headers: {'Content-Type': 'application/json'},
        });
      };

      syncRef.current = setInterval(sync, syncIntervalMs);
    }
  };

  const stopSync = () => {
    if (syncRef.current) {
      clearInterval(syncRef.current);
      syncRef.current = null;
    }
  };

  useEffect(() => {
    startSync();
    return stopSync;
  }, [serverUrl, syncIntervalMs]);

  return updatePosition;
};

export default usePlayerMovement;
