// src/components/game/CameraController.tsx
import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const CameraController = forwardRef(({ target, offset, followRotation }, ref) => {
  const { camera } = useThree();
  const smoothPos = useRef(new Vector3());
  const smoothLook = useRef(new Vector3());

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(camera);
    else ref.current = camera;
  }, [camera]);

  useFrame(() => {
    const tPos = new Vector3(target[0], target[1], target[2]);

    // rotate offset according to player's Y rotation
    const rotY = followRotation[1];
    const rotatedOffset = new Vector3(
      offset[0] * Math.cos(rotY) - offset[2] * Math.sin(rotY),
      offset[1],
      offset[0] * Math.sin(rotY) + offset[2] * Math.cos(rotY)
    );

    const desiredCamPos = tPos.clone().add(rotatedOffset);
    smoothPos.current.lerp(desiredCamPos, 0.08);
    camera.position.copy(smoothPos.current);

    const desiredLook = tPos.clone().setY(tPos.y + 1);
    smoothLook.current.lerp(desiredLook, 0.12);
    camera.lookAt(smoothLook.current);
  });

  return null;
});

export default CameraController;
