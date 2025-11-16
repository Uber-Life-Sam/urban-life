// src/components/game/CameraController.tsx
import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

interface CameraControllerProps {
  target: [number, number, number];
  offset: [number, number, number];
}

const CameraController = forwardRef<any, CameraControllerProps>(({ target, offset }, ref) => {
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());

  // expose camera object to parent via ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(camera);
    } else {
      (ref as any).current = camera;
    }
  }, [camera, ref]);

  useFrame(() => {
    const targetPosition = new Vector3(target[0] + offset[0], target[1] + offset[1], target[2] + offset[2]);
    currentPosition.current.lerp(targetPosition, 0.15);
    camera.position.copy(currentPosition.current);

    const lookAtTarget = new Vector3(target[0], target[1] + 1, target[2]);
    currentLookAt.current.lerp(lookAtTarget, 0.15);
    camera.lookAt(currentLookAt.current);
  });

  return null;
});

CameraController.displayName = "CameraController";
export default CameraController;
