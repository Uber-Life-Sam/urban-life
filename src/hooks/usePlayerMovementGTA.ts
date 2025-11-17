// src/hooks/usePlayerMovementGTA.ts
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PlayerState = {
  position: [number, number, number];
  rotationY: number; // single Y rotation (radians)
  isMoving: boolean;
  isSprinting: boolean;
  isGrounded: boolean;
};

declare global {
  interface Window { _gameKeys?: Record<string, boolean>; }
}

export default function usePlayerMovementGTA(playerRef: any, cameraRef: any) {
  const [state, setState] = useState<PlayerState>({
    position: [0, 1, 0],
    rotationY: 0,
    isMoving: false,
    isSprinting: false,
    isGrounded: true,
  });

  const velRef = useRef(new THREE.Vector3(0, 0, 0));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!window._gameKeys) window._gameKeys = { w: false, a: false, s: false, d: false, Shift: false, " ": false };

    const down = (e: KeyboardEvent) => {
      const k = e.key === " " ? " " : (e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (k in window._gameKeys) window._gameKeys[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key === " " ? " " : (e.key.length === 1 ? e.key.toLowerCase() : e.key);
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
    const GRAV = -9.8;
    const STEP = 1 / 60; // fixed-step feel
    const walkSpeed = 0.06;
    const sprintMultiplier = 1.9;
    const jumpImpulse = 4.6;
    const damping = 0.86;

    const tmp = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      const keys = window._gameKeys || {};
      if (!playerRef?.current || !cameraRef?.current) return;

      const cam: THREE.Camera = cameraRef.current;
      const player: any = playerRef.current;

      // compute forward/right based on camera orientation (XZ plane)
      cam.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() === 0) forward.set(0, 0, -1);
      forward.normalize();

      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      // desired movement direction
      tmp.set(0, 0, 0);
      if (keys.w) tmp.add(forward);
      if (keys.s) tmp.add(forward.clone().multiplyScalar(-1));
      if (keys.a) tmp.add(right.clone().multiplyScalar(-1));
      if (keys.d) tmp.add(right);

      const isMoving = tmp.lengthSq() > 0.0001;
      const isSprinting = !!keys.Shift && isMoving;

      // Normalize direction and scale by speed
      if (isMoving) {
        tmp.normalize();
        const speed = walkSpeed * (isSprinting ? sprintMultiplier : 1);
        tmp.multiplyScalar(speed);
        // blend into velocity (smoother acceleration)
        velRef.current.x += (tmp.x - velRef.current.x) * 0.25;
        velRef.current.z += (tmp.z - velRef.current.z) * 0.25;
      } else {
        // apply damping to horizontal velocity
        velRef.current.x *= damping;
        velRef.current.z *= damping;
        if (Math.abs(velRef.current.x) < 0.001) velRef.current.x = 0;
        if (Math.abs(velRef.current.z) < 0.001) velRef.current.z = 0;
      }

      // gravity + jumping
      const grounded = player.position.y <= 1.001 || velRef.current.y === 0 && player.position.y <= 1.01;

      if (keys[" "] && grounded) {
        velRef.current.y = jumpImpulse;
      } else {
        // apply gravity
        velRef.current.y += GRAV * STEP;
      }

      // apply position change
      player.position.x += velRef.current.x;
      player.position.y += velRef.current.y * STEP;
      player.position.z += velRef.current.z;

      // simple ground collision (floor at y = 1)
      if (player.position.y <= 1) {
        player.position.y = 1;
        velRef.current.y = 0;
      }

      // rotation to face movement direction (if moving)
      if (velRef.current.lengthSq() > 0.0001) {
        const rotY = Math.atan2(velRef.current.x, velRef.current.z);
        // smooth rotation
        const current = player.rotation.y || 0;
        const newY = current + ((rotY - current) * 0.18);
        player.rotation.y = newY;
        setState((prev) => ({
          position: [player.position.x, player.position.y, player.position.z],
          rotationY: newY,
          isMoving: isMoving,
          isSprinting: isSprinting,
          isGrounded: player.position.y <= 1.01
        }));
      } else {
        // only update position/grounded
        setState((prev) => ({
          position: [player.position.x, player.position.y, player.position.z],
          rotationY: prev.rotationY,
          isMoving: false,
          isSprinting: isSprinting,
          isGrounded: player.position.y <= 1.01
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
