import { useEffect, useRef } from 'react';

export default function usePlayerMovementGTA(playerRef, cameraRef) {
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const speed = 0.08;
  const rotationSmooth = 0.15;

  const keys = useRef({
    w: false,
    s: false,
    a: false,
    d: false,
  });

  // Key Events
  useEffect(() => {
    const down = (e) => {
      if (keys.current[e.key] !== undefined) keys.current[e.key] = true;
    };

    const up = (e) => {
      if (keys.current[e.key] !== undefined) keys.current[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Movement Loop
  useEffect(() => {
    const update = () => {
      if (!playerRef.current || !cameraRef.current) return;

      const player = playerRef.current;
      const cam = cameraRef.current;

      const forward = cam.getWorldDirection(new THREE.Vector3());
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      let moveX = 0;
      let moveZ = 0;

      if (keys.current.w) moveZ -= 1;
      if (keys.current.s) moveZ += 1;
      if (keys.current.a) moveX -= 1;
      if (keys.current.d) moveX += 1;

      const move = new THREE.Vector3();
      move.addScaledVector(forward, moveZ);
      move.addScaledVector(right, moveX);

      if (move.length() > 0) {
        move.normalize();

        player.position.x += move.x * speed;
        player.position.z += move.z * speed;

        // Smooth Rotation
        const targetRot = Math.atan2(move.x, move.z);
        player.rotation.y += (targetRot - player.rotation.y) * rotationSmooth;
      }

      requestAnimationFrame(update);
    };

    update();
  }, []);

  return null;
}
