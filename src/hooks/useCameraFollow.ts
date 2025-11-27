import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const useCameraFollow = (camera: any, playerRef: any) => {
  const offset = new THREE.Vector3(0, 3, -6);
  const smoothPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!playerRef.current || !camera) return;

    const targetPos = playerRef.current.position.clone().add(offset);

    smoothPos.current.lerp(targetPos, 0.1);

    camera.position.copy(smoothPos.current);
    camera.lookAt(playerRef.current.position);
  });

  return {};
};
