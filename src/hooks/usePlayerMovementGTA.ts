// src/hooks/usePlayerMovementGTA.ts
import { useState, useEffect } from "react";
import * as THREE from "three";

export default function usePlayerMovementGTA(playerRef, cameraRef) {
  const [position, setPosition] = useState([0, 1, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const keys = { w: false, a: false, s: false, d: false };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keys) keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keys) keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const speed = 0.08;

    const updateMovement = () => {
      if (!playerRef.current || !cameraRef.current) return;

      const cam = cameraRef.current;
      const player = playerRef.current;

      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      let moved = false;
      const movement = new THREE.Vector3(0, 0, 0);

      if (window.keys?.w) {
        movement.add(forward.multiplyScalar(speed));
        moved = true;
      }
      if (window.keys?.s) {
        movement.add(forward.multiplyScalar(-speed));
        moved = true;
      }
      if (window.keys?.a) {
        movement.add(right.multiplyScalar(speed));
        moved = true;
      }
      if (window.keys?.d) {
        movement.add(right.multiplyScalar(-speed));
        moved = true;
      }

      if (moved) {
        player.position.add(movement);
        setPosition([player.position.x, player.position.y, player.position.z]);

        const targetRotation = Math.atan2(movement.x, movement.z);
        setRotation([0, targetRotation, 0]);

        player.rotation.y = targetRotation;
      }

      setIsMoving(moved);

      requestAnimationFrame(updateMovement);
    };

    window.keys = { w: false, a: false, s: false, d: false };
    updateMovement();
  }, [playerRef, cameraRef]);

  return { position, rotation, isMoving };
}
