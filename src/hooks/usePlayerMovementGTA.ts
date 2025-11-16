import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * GTA Style Movement + Camera Orbit
 * Works with playerRef + cameraRef
 */
export const usePlayerMovementGTA = (playerRef: any, cameraRef: any) => {
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const cameraAngle = useRef(0);

  // ===============================
  // 🎮 Keyboard Controls
  // ===============================
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "w") keys.current.w = true;
      if (e.key === "a") keys.current.a = true;
      if (e.key === "s") keys.current.s = true;
      if (e.key === "d") keys.current.d = true;
    };

    const up = (e: KeyboardEvent) => {
      if (e.key === "w") keys.current.w = false;
      if (e.key === "a") keys.current.a = false;
      if (e.key === "s") keys.current.s = false;
      if (e.key === "d") keys.current.d = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // ===============================
  // 🖱 Mouse Camera Orbit (Like GTA)
  // ===============================
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        cameraAngle.current -= e.movementX * 0.004;
      }
    };

    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  // ===============================
  // 🚶 Movement + Camera Loop
  // ===============================
  useEffect(() => {
    const speed = 0.10; // movement speed

    const update = () => {
      if (!playerRef.current || !cameraRef.current) {
        requestAnimationFrame(update);
        return;
      }

      const player = playerRef.current;
      const cam = cameraRef.current;

      // Camera follow (GTA 3rd person)
      cam.position.x = player.position.x + Math.sin(cameraAngle.current) * 4;
      cam.position.z = player.position.z + Math.cos(cameraAngle.current) * 4;
      cam.position.y = player.position.y + 2.2;
      cam.lookAt(player.position);

      // Forward & Right vectors based on camera
      const forward = new THREE.Vector3(
        Math.sin(cameraAngle.current),
        0,
        Math.cos(cameraAngle.current)
      );

      const right = new THREE.Vector3(
        Math.sin(cameraAngle.current + Math.PI / 2),
        0,
        Math.cos(cameraAngle.current + Math.PI / 2)
      );

      let move = new THREE.Vector3();

      if (keys.current.w) move.add(forward);
      if (keys.current.s) move.sub(forward);
      if (keys.current.a) move.sub(right);
      if (keys.current.d) move.add(right);

      move.normalize().multiplyScalar(speed);

      player.position.add(move);

      // Rotate player toward movement
      if (move.length() > 0) {
        player.rotation.y = Math.atan2(move.x, move.z);
      }

      requestAnimationFrame(update);
    };

    update();
  }, []);

  return null;
};
