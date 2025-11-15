import { useEffect, useRef, useState } from 'react';

export interface PlayerState {
  position: [number, number, number];
  rotation: number;
  isMoving: boolean;
}

export const usePlayerMovementGTA = (
  cameraAzimuth: number,
  speed: number = 5,
  initialPosition: [number, number, number] = [0, 0, -25]
) => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    position: initialPosition,
    rotation: 0,
    isMoving: false,
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        keysPressed.current[key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        keysPressed.current[key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const updateMovement = () => {
      const now = Date.now();
      const delta = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;

      const keys = keysPressed.current;
      let moveX = 0;
      let moveZ = 0;

      // Calculate movement direction relative to camera
      if (keys['w']) moveZ -= 1;
      if (keys['s']) moveZ += 1;
      if (keys['a']) moveX -= 1;
      if (keys['d']) moveX += 1;

      const isMoving = moveX !== 0 || moveZ !== 0;

      if (isMoving) {
        // Normalize diagonal movement
        const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
        moveX /= length;
        moveZ /= length;

        // Rotate movement based on camera azimuth
        const cos = Math.cos(cameraAzimuth);
        const sin = Math.sin(cameraAzimuth);
        const rotatedX = moveX * cos - moveZ * sin;
        const rotatedZ = moveX * sin + moveZ * cos;

        // Calculate player rotation to face movement direction
        const playerRotation = Math.atan2(rotatedX, rotatedZ);

        setPlayerState((prev) => ({
          position: [
            prev.position[0] + rotatedX * speed * delta,
            prev.position[1],
            prev.position[2] + rotatedZ * speed * delta,
          ],
          rotation: playerRotation,
          isMoving: true,
        }));
      } else {
        setPlayerState((prev) => ({ ...prev, isMoving: false }));
      }

      requestAnimationFrame(updateMovement);
    };

    const animationId = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(animationId);
  }, [cameraAzimuth, speed]);

  return playerState;
};
