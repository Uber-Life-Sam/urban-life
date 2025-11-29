import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CameraRotation } from './useCameraRotate';

interface PlayerState {
  position: [number, number, number];
  rotation: number;
  isMoving: boolean;
  isSprinting: boolean;
}

interface UseGTAPlayerMovementOptions {
  playerRef: React.MutableRefObject<any>;
  cameraRotation: CameraRotation;
  walkSpeed?: number;
  sprintSpeed?: number;
  rotationSpeed?: number;
}

declare global {
  interface Window {
    _gameKeys?: Record<string, boolean>;
  }
}

export const useGTAPlayerMovement = ({
  playerRef,
  cameraRotation,
  walkSpeed = 6,
  sprintSpeed = 9,
  rotationSpeed = 8,
}: UseGTAPlayerMovementOptions) => {
  const [state, setState] = useState<PlayerState>({
    position: [0, 1, 0],
    rotation: 0,
    isMoving: false,
    isSprinting: false,
  });

  const rafRef = useRef<number | null>(null);
  const velocity = useRef(new THREE.Vector3());
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  // Initialize input keys
  useEffect(() => {
    if (!window._gameKeys) {
      window._gameKeys = { w: false, a: false, s: false, d: false, e: false, shift: false };
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in window._gameKeys!) {
        window._gameKeys![key] = true;
      }
      if (e.key === 'Shift') {
        window._gameKeys!.shift = true;
      }
      
      // Prevent scrolling
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in window._gameKeys!) {
        window._gameKeys![key] = false;
      }
      if (e.key === 'Shift') {
        window._gameKeys!.shift = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Movement loop
  useEffect(() => {
    const ACCELERATION = 0.5;
    const DECELERATION = 0.85;
    const MAX_VELOCITY = 0.3;

    const updateMovement = (deltaTime: number) => {
      if (!playerRef?.current) return;

      const keys = window._gameKeys || {};
      const player = playerRef.current;

      // Check if sprinting
      const isSprinting = keys.shift && keys.w;
      const currentSpeed = isSprinting ? sprintSpeed : walkSpeed;

      // Calculate movement direction based on camera
      const forward = new THREE.Vector3(
        Math.sin(cameraRotation.horizontal),
        0,
        Math.cos(cameraRotation.horizontal)
      );
      const right = new THREE.Vector3(
        Math.sin(cameraRotation.horizontal + Math.PI / 2),
        0,
        Math.cos(cameraRotation.horizontal + Math.PI / 2)
      );

      const moveDirection = new THREE.Vector3();
      
      if (keys.w) moveDirection.add(forward);
      if (keys.s) moveDirection.sub(forward);
      if (keys.a) moveDirection.sub(right);
      if (keys.d) moveDirection.add(right);

      const isMoving = moveDirection.length() > 0;

      if (isMoving) {
        moveDirection.normalize();
        
        // Apply acceleration
        const targetVelocity = moveDirection.multiplyScalar(currentSpeed * deltaTime);
        velocity.current.lerp(targetVelocity, ACCELERATION);
        
        // Clamp velocity
        if (velocity.current.length() > MAX_VELOCITY) {
          velocity.current.setLength(MAX_VELOCITY);
        }

        // Update target rotation to face movement direction
        targetRotation.current = Math.atan2(moveDirection.x, moveDirection.z);
      } else {
        // Apply deceleration
        velocity.current.multiplyScalar(DECELERATION);
        if (velocity.current.length() < 0.001) {
          velocity.current.set(0, 0, 0);
        }
      }

      // Apply velocity to player
      player.position.add(velocity.current);

      // Smooth rotation
      if (velocity.current.length() > 0.001) {
        const rotationDiff = targetRotation.current - currentRotation.current;
        let shortestAngle = ((rotationDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
        
        currentRotation.current += shortestAngle * rotationSpeed * deltaTime;
        player.rotation.y = currentRotation.current;
      }

      // Update state
      setState({
        position: [player.position.x, player.position.y, player.position.z],
        rotation: currentRotation.current,
        isMoving,
        isSprinting,
      });
    };

    let lastTime = performance.now();
    const loop = () => {
      const currentTime = performance.now();
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      updateMovement(deltaTime);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [playerRef, cameraRotation, walkSpeed, sprintSpeed, rotationSpeed]);

  return state;
};
