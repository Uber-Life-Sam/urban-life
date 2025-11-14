import { useState, useEffect, useRef } from 'react';

interface Waypoint {
  x: number;
  z: number;
}

export const useVehicleMovement = (
  path: Waypoint[],
  speed: number = 3,
  shouldStop: boolean = false
) => {
  const [position, setPosition] = useState<[number, number, number]>([
    path[0].x,
    0.3,
    path[0].z,
  ]);
  const [rotation, setRotation] = useState(0);
  const currentWaypointIndex = useRef(0);
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    const updateMovement = () => {
      const now = Date.now();
      const delta = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;

      if (path.length === 0 || shouldStop) {
        requestAnimationFrame(updateMovement);
        return;
      }

      const targetWaypoint = path[currentWaypointIndex.current];

      setPosition((prevPos) => {
        const [currentX, currentY, currentZ] = prevPos;
        const dx = targetWaypoint.x - currentX;
        const dz = targetWaypoint.z - currentZ;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < 0.5) {
          currentWaypointIndex.current =
            (currentWaypointIndex.current + 1) % path.length;
          return prevPos;
        }

        const moveX = (dx / distance) * speed * delta;
        const moveZ = (dz / distance) * speed * delta;

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
  }, [path, speed, shouldStop]);

  return { position, rotation };
};
