// src/hooks/usePlayerMovementGTA.ts
import { useEffect } from "react";
import * as THREE from "three";

export default function usePlayerMovementGTA(playerRef: any, cameraRef: any, onUpdate?: (state: any) => void) {
  useEffect(() => {
    if (!playerRef || !cameraRef) return;
    const keys = { w: false, a: false, s: false, d: false };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keys) keys[e.key as keyof typeof keys] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keys) keys[e.key as keyof typeof keys] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let mounted = true;
    const speed = 0.12;
    const rotationSmooth = 0.15;

    const loop = () => {
      if (!mounted) return;
      if (!playerRef.current || !cameraRef.current) {
        requestAnimationFrame(loop);
        return;
      }

      const player = playerRef.current;
      const cam = cameraRef.current;

      // forward & right based on camera
      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      const move = new THREE.Vector3();
      if (keys.w) move.add(forward);
      if (keys.s) move.sub(forward);
      if (keys.a) move.sub(right);
      if (keys.d) move.add(right);

      let isMoving = false;
      if (move.length() > 0) {
        move.normalize();
        player.position.x += move.x * speed;
        player.position.z += move.z * speed;

        const targetRot = Math.atan2(move.x, move.z);
        player.rotation.y += (targetRot - player.rotation.y) * rotationSmooth;

        isMoving = true;
      }

      if (onUpdate) {
        onUpdate({
          position: [player.position.x, player.position.y, player.position.z],
          rotation: [player.rotation.x, player.rotation.y, player.rotation.z],
          isMoving,
        });
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      mounted = false;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playerRef, cameraRef, onUpdate]);
}
