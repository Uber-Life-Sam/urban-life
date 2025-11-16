import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function usePlayerMovementGTA(playerRef, cameraRef) {
  const speed = 0.08;
  const rotationSmooth = 0.15;

  const keys = useRef({
    w: false,
    s: false,
    a: false,
    d: false,
  });

  // ---- KEY HANDLING ----
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (keys.current[e.key] !== undefined) keys.current[e.key] = true;
    };
    const up = (e: KeyboardEvent) => {
      if (keys.current[e.key] !== undefined) keys.current[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // ---- MOVEMENT LOOP ----
  useEffect(() => {
    const move = () => {
      // -----------------------------
      // FIX 1: HARD NULL CHECK (Crash Stopper)
      // -----------------------------
      if (!playerRef?.current || !cameraRef?.current) {
        requestAnimationFrame(move);
        return;
      }

      const player = playerRef.current;
      const camera = cameraRef.current;

      if (!player.position) {
        requestAnimationFrame(move);
        return;
      }

      // Camera directions
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();

      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      // Movement vector
      let moveDir = new THREE.Vector3();

      if (keys.current.w) moveDir.add(forward);
      if (keys.current.s) moveDir.sub(forward);
      if (keys.current.a) moveDir.sub(right);
      if (keys.current.d) moveDir.add(right);

      if (moveDir.length() > 0) {
        moveDir.normalize();
        player.position.x += moveDir.x * speed;
        player.position.z += moveDir.z * speed;

        const targetRotation = Math.atan2(moveDir.x, moveDir.z);
        player.rotation.y += (targetRotation - player.rotation.y) * rotationSmooth;
      }

      requestAnimationFrame(move);
    };

    move();
  }, []);

  return null;
}
