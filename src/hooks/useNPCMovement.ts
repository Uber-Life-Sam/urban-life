import { useState, useEffect, useRef } from 'react';

export interface Waypoint {
  x: number;
  z: number;
}

export interface NPCRoutine {
  morningPath: Waypoint[];
  dayPath: Waypoint[];
  eveningPath: Waypoint[];
  nightPath: Waypoint[];
}

export const useNPCMovement = (routine: NPCRoutine, timeOfDay: number, speed: number = 1.5) => {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState(0);
  const currentWaypointIndex = useRef(0);
  const lastUpdateTime = useRef(Date.now());

  // Determine which path to follow based on time of day
  const getCurrentPath = (): Waypoint[] => {
    if (timeOfDay >= 6 && timeOfDay < 9) return routine.morningPath;
    if (timeOfDay >= 9 && timeOfDay < 18) return routine.dayPath;
    if (timeOfDay >= 18 && timeOfDay < 22) return routine.eveningPath;
    return routine.nightPath;
  };

  useEffect(() => {
    const path = getCurrentPath();
    
    const updateMovement = () => {
      const now = Date.now();
      const delta = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;

      if (path.length === 0) return;

      // Get current target waypoint
      const targetWaypoint = path[currentWaypointIndex.current];
      
      setPosition((prevPos) => {
        const [currentX, currentY, currentZ] = prevPos;
        const dx = targetWaypoint.x - currentX;
        const dz = targetWaypoint.z - currentZ;
        const distance = Math.sqrt(dx * dx + dz * dz);

        // If close enough to waypoint, move to next one
        if (distance < 0.5) {
          currentWaypointIndex.current = (currentWaypointIndex.current + 1) % path.length;
          return prevPos;
        }

        // Move towards waypoint
        const moveX = (dx / distance) * speed * delta;
        const moveZ = (dz / distance) * speed * delta;

        // Update rotation to face movement direction
        if (dx !== 0 || dz !== 0) {
          const angle = Math.atan2(dx, dz);
          setRotation(angle);
        }

        return [currentX + moveX, currentY, currentZ + moveZ];
      });

      requestAnimationFrame(updateMovement);
    };

    const animationId = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(animationId);
  }, [timeOfDay, speed]);

  return { position, rotation };
};
