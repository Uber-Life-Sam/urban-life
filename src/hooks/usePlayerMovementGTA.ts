// src/hooks/usePlayerMovementGTA.ts
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PlayerState = {
  position: [number, number, number];
  rotation: number; // Y rotation in radians (single number)
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
    rotation: 0,
    isMoving: false,
  });

  const rafRef = useRef<number | null>(null);

  // keyboard init
  useEffect(() => {
    if (!window._gameKeys) window._gameKeys = { w: false, a: false, s: false, d: false };

    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys!) window._gameKeys![k] = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys!) window._gameKeys![k] = false;
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // movement loop
  useEffect(() => {
    const baseSpeed = 0.12; // adjust for desired walking speed
    const friction = 0.85;

    const velocity = new THREE.Vector3(0, 0, 0);
    const tmp = new THREE.Vector3();

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const keys = window._gameKeys || { w: false, a: false, s: false, d: false };

      if (!playerRef?.current || !cameraRef?.current) {
        // keep loop alive until refs exist
        return;
      }

      const cam: THREE.Camera = cameraRef.current;
      const player: any = playerRef.current;

      // camera forward in XZ
      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() === 0) forward.set(0, 0, -1);
      forward.normalize();

      // right vector (camera local right)
      const right = new THREE.Vector3();
      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      // desired input
      tmp.set(0, 0, 0);
      if (keys.w) tmp.add(forward);
      if (keys.s) tmp.add(forward.clone().multiplyScalar(-1));
      if (keys.a) tmp.add(right.clone().multiplyScalar(-1));
      if (keys.d) tmp.add(right);

      let moved = false;

      if (tmp.lengthSq() > 0.0001) {
        tmp.normalize().multiplyScalar(baseSpeed);
        velocity.add(tmp); // accumulate velocity for smoothness
        moved = true;
      } else {
        // slow down
        velocity.multiplyScalar(friction);
        if (velocity.length() < 0.001) velocity.set(0, 0, 0);
      }

      // clamp velocity to avoid explosion
      const maxVel = 0.6;
      if (velocity.length() > maxVel) velocity.setLength(maxVel);

      // apply to player position
      player.position.add(velocity);

      // compute rotation from velocity if moving
      let rotY = state.rotation;
      if (velocity.lengthSq() > 0.00001) {
        rotY = Math.atan2(velocity.x, velocity.z);
        player.rotation.y = rotY;
      }

      // sync state
      setState({
        position: [player.position.x, player.position.y, player.position.z],
        rotation: rotY,
        isMoving: moved || velocity.length() > 0.001,
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
