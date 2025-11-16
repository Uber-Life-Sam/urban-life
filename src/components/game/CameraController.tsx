// src/components/game/CameraController.tsx
import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Matrix4 } from "three";

interface CameraControllerProps {
  target: [number, number, number];
  offset: [number, number, number]; // desired offset in local camera space (e.g. [0, 3, -6] or from orbit)
  followRotation?: number; // optional: player Y rotation in radians (so camera can stay behind player)
  lerpSpeed?: number; // 0..1 (default 0.12)
  lookAtLerp?: number; // 0..1 (default 0.15)
}

const CameraController = forwardRef<any, CameraControllerProps>(({
  target, offset, followRotation = 0, lerpSpeed = 0.12, lookAtLerp = 0.15
}, ref) => {
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3(camera.position.x, camera.position.y, camera.position.z));
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

  // helper: rotate offset vector around Y by angle (radians)
  const rotateOffsetByY = (offsetVec: Vector3, yAngle: number) => {
    const m = new Matrix4();
    m.makeRotationY(yAngle);
    return offsetVec.clone().applyMatrix4(m);
  };

  useFrame(() => {
    // offset provided might be in world-space already (like useCameraOrbit produced),
    // or it might be local (behind player) — to support GTA-style, we interpret offset
    // as a local offset relative to player heading if followRotation is provided.
    const offsetVec = new Vector3(offset[0], offset[1], offset[2]);

    // rotate offset so camera stays behind player direction
    const rotated = rotateOffsetByY(offsetVec, followRotation);

    // target world position (player position)
    const playerPos = new Vector3(target[0], target[1], target[2]);

    // desired camera world position = playerPos + rotatedOffset
    const desiredPos = playerPos.clone().add(rotated);

    // smoothly interpolate camera position
    currentPosition.current.lerp(desiredPos, lerpSpeed);
    camera.position.copy(currentPosition.current);

    // desired lookAt point (slightly above player's head)
    const desiredLookAt = playerPos.clone().add(new Vector3(0, 1.2, 0));
    currentLookAt.current.lerp(desiredLookAt, lookAtLerp);
    camera.lookAt(currentLookAt.current);
  });

  return null;
});

CameraController.displayName = "CameraController";
export default CameraController;
