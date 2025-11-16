// src/hooks/usePlayerMovementGTA.ts
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PlayerState = {
  position: [number, number, number];
  rotation: [number, number, number]; // [x, y, z]
  isMoving: boolean;
};

declare global {
  interface Window {
    _gameKeys?: Record<string, boolean>;
  }
}

export default function usePlayerMovementGTA(playerRef: any, cameraRef: any) {
  const [state, setState] = useState<PlayerState>({
    position: [0, 1, 0],
    rotation: [0, 0, 0],
    isMoving: false,
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!window._gameKeys) window._gameKeys = { w: false, a: false, s: false, d: false };

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys!) window._gameKeys![k] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys!) window._gameKeys![k] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const speed = 0.12;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      const keys = window._gameKeys || { w: false, a: false, s: false, d: false };

      if (!playerRef?.current || !cameraRef?.current) {
        // if ref not ready yet, do nothing but keep loop running
        return;
      }

      const cam: THREE.Camera = cameraRef.current;
      const player: any = playerRef.current;

      // ensure player has sensible initial Y (ground)
      if (typeof player.position?.y === "number" && player.position.y === 0) {
        player.position.y = 1; // default stand height
      }

      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() === 0) forward.set(0, 0, -1);
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      const movement = new THREE.Vector3(0, 0, 0);
      let moved = false;

      if (keys.w) {
        movement.add(forward.clone().multiplyScalar(speed));
        moved = true;
      }
      if (keys.s) {
        movement.add(forward.clone().multiplyScalar(-speed));
        moved = true;
      }
      if (keys.a) {
        movement.add(right.clone().multiplyScalar(-speed));
        moved = true;
      }
      if (keys.d) {
        movement.add(right.clone().multiplyScalar(speed));
        moved = true;
      }

      if (moved) {
        player.position.add(movement);

        const rotY = Math.atan2(movement.x, movement.z);
        player.rotation.y = rotY;

        setState({
          position: [player.position.x, player.position.y, player.position.z],
          rotation: [0, rotY, 0],
          isMoving: true,
        });
      } else {
        setState((prev) => ({
          ...prev,
          position: [
            player.position.x ?? prev.position[0],
            player.position.y ?? prev.position[1],
            player.position.z ?? prev.position[2],
          ],
          isMoving: false,
        }));
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playerRef, cameraRef]);

  return state;
}
