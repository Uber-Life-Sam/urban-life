// src/components/game/CameraController.tsx
import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Matrix4 } from "three";

interface CameraControllerProps {
  target: [number, number, number];    // player world position
  offset: [number, number, number];    // base offset e.g. [0, 3, -6]
  followRotation?: number;             // player Y rotation (radians)
  lerpSpeed?: number;
  lookAtLerp?: number;
  mouseSensitivity?: number;
  autoReturnMs?: number;
}

const CameraController = forwardRef<any, CameraControllerProps>(({
  target,
  offset,
  followRotation = 0,
  lerpSpeed = 0.12,
  lookAtLerp = 0.15,
  mouseSensitivity = 0.004,
  autoReturnMs = 900
}, ref) => {
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());

  // yaw offset (camera rotates around Y relative to player's back)
  const yawOffset = useRef(0);
  const yawTarget = useRef(0);
  const lastMouseTime = useRef<number>(0);

  // pointer lock state
  const isLocked = useRef(false);

  // expose camera to parent ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(camera);
    else (ref as any).current = camera;
  }, [camera, ref]);

  // Right mouse button toggle & pointer lock handling
  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      // prevent context menu
      e.preventDefault();
    };
    const onMouseDown = (e: MouseEvent) => {
      // right button (2) toggles pointer lock
      if (e.button === 2) {
        e.preventDefault();
        const canvas = document.querySelector("canvas");
        if (!document.pointerLockElement) {
          // request pointer lock on canvas if available
          if (canvas && (canvas as any).requestPointerLock) {
            (canvas as any).requestPointerLock();
          } else {
            // fallback: just mark locked
            isLocked.current = true;
            lastMouseTime.current = performance.now();
          }
        } else {
          // exit pointer lock
          if (document.exitPointerLock) document.exitPointerLock();
        }
      }
    };

    const onPointerLockChange = () => {
      isLocked.current = !!document.pointerLockElement;
      lastMouseTime.current = performance.now();
    };

    window.addEventListener("contextmenu", onContext);
    window.addEventListener("mousedown", onMouseDown);
    document.addEventListener("pointerlockchange", onPointerLockChange);

    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
    };
  }, []);

  // mouse move for yaw: use movementX when pointer locked; otherwise still handle small rotate if desired
  useEffect(() => {
    let prevX: number | null = null;
    const onMove = (e: MouseEvent) => {
      // If pointer locked, use movementX for direct delta
      const dx = (typeof (e as any).movementX === "number" && document.pointerLockElement) ? (e as any).movementX : (prevX === null ? 0 : e.clientX - prevX);
      prevX = e.clientX;

      // only when mouse is used (either pointer locked or user moved)
      yawTarget.current += -dx * mouseSensitivity;
      // clamp target
      const clamp = Math.PI / 2.2;
      yawTarget.current = Math.max(-clamp, Math.min(clamp, yawTarget.current));
      lastMouseTime.current = performance.now();
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseSensitivity]);

  // smooth yaw + auto-return + camera follow
  useFrame(() => {
    // smooth yaw follow
    yawOffset.current += (yawTarget.current - yawOffset.current) * 0.14;

    // if mouse idle for autoReturnMs, gradually bring yawTarget -> 0 (recenter)
    if (performance.now() - lastMouseTime.current > (autoReturnMs || 1000)) {
      yawTarget.current += (0 - yawTarget.current) * 0.08;
    }

    // compute rotated offset (rotate base offset by player's rotation + yawOffset)
    const base = new Vector3(offset[0], offset[1], offset[2]);
    const totalYaw = (followRotation || 0) + yawOffset.current;

    const m = new Matrix4();
    m.makeRotationY(totalYaw);
    const rotated = base.clone().applyMatrix4(m);

    // desired camera world pos = player + rotated
    const desiredPos = new Vector3(target[0], target[1], target[2]).add(rotated);

    // smooth position
    currentPosition.current.lerp(desiredPos, lerpSpeed);
    camera.position.copy(currentPosition.current);

    // lookAt slightly above player
    const desiredLookAt = new Vector3(target[0], target[1] + 1.2, target[2]);
    currentLookAt.current.lerp(desiredLookAt, lookAtLerp);
    camera.lookAt(currentLookAt.current);
  });

  return null;
});

CameraController.displayName = "CameraController";
export default CameraController;
