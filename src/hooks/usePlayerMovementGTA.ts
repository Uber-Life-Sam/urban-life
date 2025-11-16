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

  // Initialize global key object once
  useEffect(() => {
    if (!window._gameKeys) window._gameKeys = { w: false, a: false, s: false, d: false };

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys!) {
        window._gameKeys![k] = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys!) {
        window._gameKeys![k] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      // cleanup any RAF if still running
    };
  }, []);

  useEffect(() => {
    const speed = 0.12;

    const loop = () => {
      // schedule next
      rafRef.current = requestAnimationFrame(loop);

      const keys = window._gameKeys || { w: false, a: false, s: false, d: false };

      // If refs are not ready, still keep the loop running until they become available
      if (!playerRef?.current || !cameraRef?.current) {
        // set default state (optional) and continue
        return;
      }

      const cam: THREE.Camera = cameraRef.current;
      const player: any = playerRef.current;

      // compute forward (camera facing) but flattened to XZ
      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() === 0) forward.set(0, 0, -1);
      forward.normalize();

      // right vector = forward rotated +90deg
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
        // apply movement to player's world position
        player.position.add(movement);

        // rotation to face movement direction (Y axis)
        const rotY = Math.atan2(movement.x, movement.z);
        player.rotation.y = rotY;

        setState({
          position: [player.position.x, player.position.y, player.position.z],
          rotation: [0, rotY, 0],
          isMoving: true,
        });
      } else {
        // not moving
        // keep position in-sync (in case something else moves the player)
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

    // start loop
    rafRef.current = requestAnimationFrame(loop);

    // cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playerRef, cameraRef]);

  return state;
}
