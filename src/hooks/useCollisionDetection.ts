import { useState, useEffect } from 'react';

export interface CollidableEntity {
  position: [number, number, number];
  radius: number;
}

export const useCollisionDetection = (
  playerPosition: [number, number, number],
  entities: CollidableEntity[],
  playerRadius: number = 0.5
) => {
  const [adjustedPosition, setAdjustedPosition] = useState(playerPosition);

  useEffect(() => {
    let newPosition = [...playerPosition] as [number, number, number];
    const [px, py, pz] = playerPosition;

    // Check collision with each entity
    for (const entity of entities) {
      const [ex, ey, ez] = entity.position;
      const dx = px - ex;
      const dz = pz - ez;
      const distance = Math.sqrt(dx * dx + dz * dz);
      const minDistance = playerRadius + entity.radius;

      // If colliding, push player away
      if (distance < minDistance && distance > 0) {
        const pushDistance = minDistance - distance;
        const pushX = (dx / distance) * pushDistance;
        const pushZ = (dz / distance) * pushDistance;
        
        newPosition[0] = px + pushX;
        newPosition[2] = pz + pushZ;
      }
    }

    setAdjustedPosition(newPosition);
  }, [playerPosition, entities, playerRadius]);

  return adjustedPosition;
};
