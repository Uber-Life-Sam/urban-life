// src/components/game/CameraController.tsx
import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Matrix4 } from "three";

interface CameraControllerProps {
  target: [number, number, number];    // player world position
  offset: [number, number, number];    // base offset (e.g. [0, 3, -6])
  followRotation?: number;             // player's Y rotation (radians)
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
  mouseSensitivity = 0.0035,
  autoReturnMs = 900
}, ref) => {
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());

  const yawOffset = useRef(0);
  const yawTarget = useRef(0);
  const lastMouseTime = useRef<number>(0);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(camera);
    else (ref as any).current = camera;
  }, [camera, ref]);

  useEffect(() => {
    let prevX: number | null = null;

    const onMove = (e: MouseEvent) => {
      const dx = (typeof (e as any).movementX === "number") ? (e as any).movementX : (prevX === null ? 0 : e.clientX - prevX);
      prevX = e.clientX;

      yawTarget.current += -dx * mouseSensitivity;
      const clamp = Math.PI / 2.2;
      yawTarget.current = Math.max(-clamp, Math.min(clamp, yawTarget.current));
      lastMouseTime.current = performance.now();
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseSensitivity]);

  useFrame(() => {
    // smoothing yaw -> target
    yawOffset.current += (yawTarget.current - yawOffset.current) * 0.14;

    if (performance.now() - lastMouseTime.current > (autoReturnMs || 900)) {
      yawTarget.current += (0 - yawTarget.current) * 0.08;
    }

    const base = new Vector3(offset[0], offset[1], offset[2]);
    const totalYaw = (followRotation || 0) + yawOffset.current;

    const m = new Matrix4();
    m.makeRotationY(totalYaw);
    const rotated = base.clone().applyMatrix4(m);

    const desiredPos = new Vector3(target[0], target[1], target[2]).add(rotated);

    currentPosition.current.lerp(desiredPos, lerpSpeed);
    camera.position.copy(currentPosition.current);

    const desiredLookAt = new Vector3(target[0], target[1] + 1.2, target[2]);
    currentLookAt.current.lerp(desiredLookAt, lookAtLerp);

    camera.lookAt(currentLookAt.current);
  });

  return null;
});

CameraController.displayName = "CameraController";
export default CameraController;
