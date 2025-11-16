import { useEffect, useRef } from "react";
import * as THREE from "three";

const usePlayerMovement = (playerRef: any, cameraRef: any) => {
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const mouseDelta = useRef(0);

  // Mouse rotation (GTA-style camera orbit)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        mouseDelta.current -= e.movementX * 0.003;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Keyboard controls
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

  // Movement loop
  useEffect(() => {
    const speed = 0.08; // walk speed
    const rotationSpeed = 0.1;

    const update = () => {
      if (!playerRef.current || !cameraRef.current) {
        requestAnimationFrame(update);
        return;
      }

      const player = playerRef.current;
      const cam = cameraRef.current;
