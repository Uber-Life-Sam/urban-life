// src/hooks/usePlayerMovementGTA.ts
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PlayerState = {
  position: [number, number, number];
  rotation: number; // Y rotation in radians (single number)
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

  useEffect(() => {
    const speed = 0.12; // tweak to change walk speed
    const friction = 0.86; // higher -> quicker stop
    const velocity = new THREE.Vector3();
    const tmp = new THREE.Vector3();

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      const keys = window._gameKeys || { w: false, a: false, s: false, d: false };

      if (!playerRef?.current || !cameraRef?.current) return;

      const cam: THREE.Camera = cameraRef.current;
      const player: any = playerRef.current;

      // forward relative to camera but flattened
      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() === 0) forward.set(0, 0, -1);
      forward.normalize();

      // right vector (camera-facing)
      const right = new THREE.Vector3();
      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      // desired input vector
      tmp.set(0, 0, 0);
      if (keys.w) tmp.add(forward);
      if (keys.s) tmp.add(forward.clone().multiplyScalar(-1));
      if (keys.a) tmp.add(right.clone().multiplyScalar(-1));
      if (keys.d) tmp.add(right);

      let moved = false;
      if (tmp.lengthSq() > 1e-4) {
        tmp.normalize().multiplyScalar(speed);
        // add to velocity (smoothing)
        velocity.add(tmp);
        moved = true;
      } else {
        // apply friction
        velocity.multiplyScalar(friction);
        if (velocity.length() < 1e-3) velocity.set(0, 0, 0);
      }

      // clamp velocity so player doesn't accelerate forever
      const maxSpeed = 0.45;
      if (velocity.length() > maxSpeed) velocity.setLength(maxSpeed);

      // apply to player world position
      player.position.add(velocity);

      // update rotation to face movement direction if moving
      let rotY = state.rotation;
      if (velocity.lengthSq() > 1e-6) {
        rotY = Math.atan2(velocity.x, velocity.z);
        player.rotation.y = rotY;
      }

      // sync state (so UI / other components can use it)
      setState({
        position: [player.position.x, player.position.y, player.position.z],
        rotation: rotY,
        isMoving: moved || velocity.length() > 1e-3
      });
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playerRef, cameraRef, state.rotation]);

  return state;
}
