// src/components/game/CameraController.tsx
import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Matrix4 } from "three";

interface CameraControllerProps {
  target: [number, number, number];    // player world position
  offset: [number, number, number];    // base offset (e.g. [0, 3, -6])
  followRotation?: number;             // player's Y rotation (radians)
  lerpSpeed?: number;                  // position lerp
  lookAtLerp?: number;                 // lookAt lerp
  mouseSensitivity?: number;           // how fast mouse rotates camera
  autoReturnMs?: number;               // time after mouse stops to return behind player
}

const CameraController = forwardRef<any, CameraControllerProps>(({
  target,
  offset,
  followRotation = 0,
  lerpSpeed = 0.12,
  lookAtLerp = 0.15,
  mouseSensitivity = 0.0035,
  autoReturnMs = 1000
}, ref) => {
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());

  // yaw offset (camera rotates around Y relative to player's back). positive => rotate right
  const yawOffset = useRef(0);
  const yawTarget = useRef(0);
  const lastMouseTime = useRef<number>(0);

  // expose camera to parent ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(camera);
    else (ref as any).current = camera;
  }, [camera, ref]);

  // mousemove listener - updates yawTarget and lastMouseTime
  useEffect(() => {
    let prevX: number | null = null;

    const onMove = (e: MouseEvent) => {
      // use movementX when available for smoothness
      const dx = (typeof (e as any).movementX === "number") ? (e as any).movementX : (prevX === null ? 0 : e.clientX - prevX);
      prevX = e.clientX;

      // update yaw target based on movement
      yawTarget.current += -dx * mouseSensitivity; // invert so moving mouse right -> camera turns right

      // clamp yawTarget to reasonable limits so camera doesn't spin 360
      const clamp = Math.PI / 2.2; // ~ +/- 80 degrees
      yawTarget.current = Math.max(-clamp, Math.min(clamp, yawTarget.current));

      lastMouseTime.current = performance.now();
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [mouseSensitivity]);

  // slight smoothing for yaw: lerp yawOffset -> yawTarget
  useFrame(() => {
    // smooth yaw follow
    yawOffset.current += (yawTarget.current - yawOffset.current) * 0.14;

    // if mouse idle for autoReturnMs, gradually bring yawTarget -> 0 (so camera recenters behind player)
    if (performance.now() - lastMouseTime.current > (autoReturnMs || 1000)) {
      yawTarget.current += (0 - yawTarget.current) * 0.08;
    }

    // compute rotated offset: base offset rotated by (followRotation + yawOffset)
    const base = new Vector3(offset[0], offset[1], offset[2]);
    const totalYaw = (followRotation || 0) + yawOffset.current;

    const m = new Matrix4();
    m.makeRotationY(totalYaw);
    const rotated = base.clone().applyMatrix4(m);

    // desired camera world position = player + rotated offset
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
