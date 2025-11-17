// src/hooks/usePlayerMovementGTA.ts
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PlayerState = {
  position: [number, number, number];
  rotation: number; // Y rotation (radians)
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
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const tmpVec = useRef(new THREE.Vector3());

  // init global keys
  useEffect(() => {
    if (!window._gameKeys) window._gameKeys = { w: false, a: false, s: false, d: false };

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys!) window._gameKeys![k] = true;
      // Prevent scrolling with space/arrows, optionally
      if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in window._gameKeys!) window._gameKeys![k] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const BASE_SPEED = 0.18; // tweak: base move strength
    const FRICTION = 0.88;   // tweak: higher -> quicker stop (0..1)
    const MAX_VEL = 0.6;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      const keys = window._gameKeys || { w: false, a: false, s: false, d: false };

      // if refs not ready, do nothing but keep loop alive
      if (!playerRef?.current || !cameraRef?.current) {
        return;
      }

      const cam = cameraRef.current as THREE.Camera;
      const player = playerRef.current as any;

      // compute forward (camera facing) flattened on XZ
      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() === 0) forward.set(0, 0, -1);
      forward.normalize();

      // right vector: forward rotated +90deg
      const right = new THREE.Vector3();
      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      // desired direction from keys
      tmpVec.current.set(0, 0, 0);
      if (keys.w) tmpVec.current.add(forward);
      if (keys.s) tmpVec.current.add(forward.clone().multiplyScalar(-1));
      if (keys.a) tmpVec.current.add(right.clone().multiplyScalar(-1));
      if (keys.d) tmpVec.current.add(right);

      let moved = false;
      if (tmpVec.current.lengthSq() > 0.0001) {
        // normalize direction then scale by base speed
        tmpVec.current.normalize().multiplyScalar(BASE_SPEED);
        // apply to velocity (accumulate for smoothness)
        velocity.current.add(tmpVec.current);
        // clamp
        if (velocity.current.length() > MAX_VEL) {
          velocity.current.setLength(MAX_VEL);
        }
        moved = true;
      } else {
        // apply friction
        velocity.current.multiplyScalar(FRICTION);
        if (velocity.current.length() < 0.001) velocity.current.set(0, 0, 0);
      }

      // apply movement (world space)
      player.position.add(velocity.current);

      // update rotation to face velocity direction when moving
      let rotY = state.rotation;
      if (velocity.current.lengthSq() > 0.00001) {
        rotY = Math.atan2(velocity.current.x, velocity.current.z);
        player.rotation.y = rotY;
      }

      // update state
      setState({
        position: [player.position.x, player.position.y, player.position.z],
        rotation: rotY,
        isMoving: moved || velocity.current.length() > 0.001,
      });
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playerRef, cameraRef]); // re-run if refs change

  return state;
}
