// src/hooks/usePlayerMovementGTA.ts
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PlayerState = {
  position: [number, number, number];
  rotation: number; // Y rotation in radians (single number for simplicity)
  isMoving: boolean;
};

declare global {
  interface Window { _gameKeys?: Record<string, boolean>; }
}

export default function usePlayerMovementGTA(playerRef: any, cameraRef: any) {
  const [state, setState] = useState<PlayerState>({
    position: [0, 1, 0],
    rotation: 0,
    isMoving: false
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!window._gameKeys) window._gameKeys = { w: false, a: false, s: false, d: false };

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys) window._gameKeys[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys) window._gameKeys[k] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const speed = 0.06; // movement speed per frame step (tweakable)
    const friction = 0.92; // smoothing for camera/player velocity

    const velocity = new THREE.Vector3(0, 0, 0);
    const tmpVec = new THREE.Vector3();

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      const keys = window._gameKeys || { w: false, a: false, s: false, d: false };

      // if refs not ready, still keep loop alive (will set state when ready)
      if (!playerRef?.current || !cameraRef?.current) {
        return;
      }

      const cam = cameraRef.current as THREE.Camera;
      const player = playerRef.current as any; // Player group

      // camera forward in world XZ
      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() === 0) forward.set(0, 0, -1);
      forward.normalize();

      // right vector
      const right = new THREE.Vector3();
      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      // build desired move vector based on keys
      tmpVec.set(0, 0, 0);
      if (keys.w) tmpVec.add(forward);
      if (keys.s) tmpVec.add(forward.clone().multiplyScalar(-1));
      if (keys.a) tmpVec.add(right.clone().multiplyScalar(-1));
      if (keys.d) tmpVec.add(right);

      let moved = false;
      if (tmpVec.lengthSq() > 0.0001) {
        tmpVec.normalize().multiplyScalar(speed);
        // apply to velocity (smoother)
        velocity.add(tmpVec);
        moved = true;
      } else {
        // slow down
        velocity.multiplyScalar(friction);
        if (velocity.length() < 0.001) velocity.set(0, 0, 0);
      }

      // apply velocity to player position
      player.position.add(velocity);

      // compute facing direction from velocity (if moving)
      let rotY = state.rotation;
      if (velocity.lengthSq() > 0.00001) {
        rotY = Math.atan2(velocity.x, velocity.z);
        player.rotation.y = rotY;
      }

      // update state (single Y rotation number)
      setState({
        position: [player.position.x, player.position.y, player.position.z],
        rotation: rotY,
        isMoving: moved || velocity.length() > 0.001
      });
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playerRef, cameraRef]);

  return state;
}
