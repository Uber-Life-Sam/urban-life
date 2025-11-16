// usePlayerMovementGTA.ts
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PlayerState = {
  position: [number, number, number];
  rotation: number;
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

  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!window._gameKeys)
      window._gameKeys = { w: false, a: false, s: false, d: false };

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (window._gameKeys && k in window._gameKeys)
        window._gameKeys[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (window._gameKeys && k in window._gameKeys)
        window._gameKeys[k] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const speed = 0.12;
    const friction = 0.90;

    const velocity = new THREE.Vector3();
    const temp = new THREE.Vector3();

    const loop = () => {
      raf.current = requestAnimationFrame(loop);

      if (!playerRef.current || !cameraRef.current) return;

      const keys = window._gameKeys!;
      const cam = cameraRef.current;

      const forward = new THREE.Vector3();
      cam.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      temp.set(0, 0, 0);

      if (keys.w) temp.add(forward);
      if (keys.s) temp.sub(forward);
      if (keys.a) temp.sub(right);
      if (keys.d) temp.add(right);

      const isMoving = temp.lengthSq() > 0.001;

      if (isMoving) {
        temp.normalize().multiplyScalar(speed);
        velocity.add(temp);
      } else {
        velocity.multiplyScalar(friction);
      }

      playerRef.current.position.add(velocity);

      let rotY = state.rotation;
      if (velocity.lengthSq() > 0.0001) {
        rotY = Math.atan2(velocity.x, velocity.z);
        playerRef.current.rotation.y = rotY;
      }

      setState({
        position: [
          playerRef.current.position.x,
          playerRef.current.position.y,
          playerRef.current.position.z,
        ],
        rotation: rotY,
        isMoving,
      });
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return state;
}
