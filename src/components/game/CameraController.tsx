// src/components/game/CameraController.tsx
import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Matrix4 } from "three";

interface CameraControllerProps {
  target: [number, number, number];
  offset: [number, number, number];
  followRotation?: number;
  lerpSpeed?: number;
  lookAtLerp?: number;
}

const CameraController = forwardRef<any, CameraControllerProps>(
  ({ target, offset, followRotation = 0, lerpSpeed = 0.12, lookAtLerp = 0.15 }, ref) => {
    const { camera } = useThree();

    const currentPosition = useRef(new Vector3());
    const currentLookAt = useRef(new Vector3());

    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") ref(camera);
      else (ref as any).current = camera;
    }, [camera, ref]);

    const rotateOffsetByY = (offsetVec: Vector3, yAngle: number) => {
      const m = new Matrix4();
      m.makeRotationY(yAngle);
      return offsetVec.clone().applyMatrix4(m);
    };

    useFrame(() => {
      const offsetVec = new Vector3(...offset);

      // Rotate around player direction
      const rotatedOffset = rotateOffsetByY(offsetVec, followRotation);

      const playerPos = new Vector3(...target);
      const desiredPos = playerPos.clone().add(rotatedOffset);

      currentPosition.current.lerp(desiredPos, lerpSpeed);
      camera.position.copy(currentPosition.current);

      const desiredLookAt = playerPos.clone().add(new Vector3(0, 1.2, 0));
      currentLookAt.current.lerp(desiredLookAt, lookAtLerp);

      camera.lookAt(currentLookAt.current);
    });

    return null;
  }
);

CameraController.displayName = "CameraController";
export default CameraController;
