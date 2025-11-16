import { useEffect, useRef } from "react";

export default function usePlayerMovement() {
  const position = useRef({ x: 0, y: 0, z: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const speed = 0.08;

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Keyboard controls
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "w") keys.current.forward = true;
    if (e.key === "s") keys.current.backward = true;
    if (e.key === "a") keys.current.left = true;
    if (e.key === "d") keys.current.right = true;
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "w") keys.current.forward = false;
    if (e.key === "s") keys.current.backward = false;
    if (e.key === "a") keys.current.left = false;
    if (e.key === "d") keys.current.right = false;
  };

  // Update player movement
  const updateMovement = () => {
    let vx = 0;
    let vy = 0;

    if (keys.current.forward) vy -= speed;
    if (keys.current.backward) vy += speed;
    if (keys.current.left) vx -= speed;
    if (keys.current.right) vx += speed;

    velocity.current = { x: vx, y: vy };

    position.current.x += vx;
    position.current.y += vy;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const interval = setInterval(updateMovement, 16); // 60fps

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, []);

  return position;
}
