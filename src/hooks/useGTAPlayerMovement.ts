import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const useGTAPlayerMovement = (playerRef: any, camera: any) => {
  const smoothRotation = useRef(new THREE.Quaternion());

  useFrame(() => {
    if (!playerRef.current || !camera) return;

    // Player sirf camera direction ko follow karega
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const targetRotation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      cameraDirection
    );

    smoothRotation.current.slerp(targetRotation, 0.15);
    playerRef.current.quaternion.copy(smoothRotation.current);
  });

  return {};
};
