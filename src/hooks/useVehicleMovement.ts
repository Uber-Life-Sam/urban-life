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
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const currentWaypointIndex = useRef(0);
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    const updateMovement = () => {
      const now = Date.now();
      const delta = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;

      if (path.length === 0) {
        requestAnimationFrame(updateMovement);
        return;
      }

      const targetWaypoint = path[currentWaypointIndex.current];

      setPosition((prevPos) => {
        const [currentX, currentY, currentZ] = prevPos;
        const dx = targetWaypoint.x - currentX;
        const dz = targetWaypoint.z - currentZ;
        const distance = Math.sqrt(dx * dx + dz * dz);

        // Check if we're approaching the intersection (waypoints 2-3)
        const isApproachingIntersection = currentWaypointIndex.current === 2;
        const isInIntersection = currentWaypointIndex.current === 3;

        // Decelerate when approaching red light
        if (shouldStop && isApproachingIntersection && distance > 0.5) {
          setCurrentSpeed((prevSpeed) => Math.max(0, prevSpeed - 8 * delta));
        } else if (!shouldStop || !isApproachingIntersection) {
          // Accelerate back to normal speed
          setCurrentSpeed((prevSpeed) => Math.min(speed, prevSpeed + 6 * delta));
        }

        // Stop completely if at the light and it's red
        if (shouldStop && isApproachingIntersection && distance < 2 && currentSpeed < 0.5) {
          return prevPos;
        }

        if (distance < 0.5) {
          currentWaypointIndex.current =
            (currentWaypointIndex.current + 1) % path.length;
          return prevPos;
        }

        const moveX = (dx / distance) * currentSpeed * delta;
        const moveZ = (dz / distance) * currentSpeed * delta;

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
  }, [path, speed, shouldStop, currentSpeed]);

  return { position, rotation };
};
