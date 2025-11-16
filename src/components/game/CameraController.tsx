// src/hooks/usePlayerMovementGTA.ts
import { useState, useEffect } from "react";
import * as THREE from "three";

export default function usePlayerMovementGTA(playerRef, cameraRef) {
  const [playerState, setPlayerState] = useState({
    position: [0, 1, 0],
    rotation: [0, 0, 0],
    isMoving: false,
  });

  useEffect(() => {
    window.keys = { w: false, a: false, s: false, d: false };

    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() in window.keys) {
        window.keys[e.key.toLowerCase()] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key.toLowerCase() in window.keys) {
        window.keys[e.key.toLowerCase()] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current || !cameraRef.current) return;

    const speed = 0.10;

    const movePlayer = () => {
      const cam = cameraRef.current;
      const player = playerRef.current;

      // FORWARD vector
      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      // RIGHT vector (FIXED)
      const right = new THREE.Vector3();
      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      let moved = false;
      const movement = new THREE.Vector3();

      if (window.keys.w) {
        movement.add(forward.clone().multiplyScalar(speed));
        moved = true;
      }
      if (window.keys.s) {
        movement.add(forward.clone().multiplyScalar(-speed));
        moved = true;
      }
      if (window.keys.a) {
        movement.add(right.clone().multiplyScalar(-speed)); // FIXED
        moved = true;
      }
      if (window.keys.d) {
        movement.add(right.clone().multiplyScalar(speed)); // FIXED
        moved = true;
      }

      if (moved) {
        player.position.add(movement);

        // Rotation towards movement direction
        const rotY = Math.atan2(movement.x, movement.z);
        player.rotation.y = rotY;

        setPlayerState({
          position: [player.position.x, player.position.y, player.position.z],
          rotation: [0, rotY, 0],
          isMoving: true,
        });
      } else {
        setPlayerState((prev) => ({
          ...prev,
          isMoving: false,
        }));
      }

      requestAnimationFrame(movePlayer);
    };

    movePlayer();
  }, [playerRef, cameraRef]);

  return playerState;
}
