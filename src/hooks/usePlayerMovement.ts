import { useEffect, useRef, useState } from 'react';

interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

interface MovementVector {
  x: number;
  z: number;
}

export const usePlayerMovement = () => {
  const [keys, setKeys] = useState<MovementState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  
  const joystickInput = useRef<MovementVector>({ x: 0, z: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w':
        case 'arrowup':
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case 's':
        case 'arrowdown':
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case 'a':
        case 'arrowleft':
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case 'd':
        case 'arrowright':
          setKeys((prev) => ({ ...prev, right: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w':
        case 'arrowup':
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case 's':
        case 'arrowdown':
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case 'a':
        case 'arrowleft':
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case 'd':
        case 'arrowright':
          setKeys((prev) => ({ ...prev, right: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getMovementVector = (): MovementVector => {
    // If joystick has input, use that (mobile)
    if (joystickInput.current.x !== 0 || joystickInput.current.z !== 0) {
      return joystickInput.current;
    }

    // Otherwise use keyboard (desktop)
    let x = 0;
    let z = 0;

    if (keys.forward) z -= 1;
    if (keys.backward) z += 1;
    if (keys.left) x -= 1;
    if (keys.right) x += 1;

    // Normalize diagonal movement
    const length = Math.sqrt(x * x + z * z);
    if (length > 0) {
      x /= length;
      z /= length;
    }

    return { x, z };
  };

  const setJoystickInput = (x: number, z: number) => {
    joystickInput.current = { x, z };
  };

  return { getMovementVector, setJoystickInput };
};
