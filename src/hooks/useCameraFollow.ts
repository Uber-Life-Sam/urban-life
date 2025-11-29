import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { CameraRotation } from './useCameraRotate';

interface UseCameraFollowOptions {
  target: THREE.Vector3;
  offset: THREE.Vector3;
  smoothing: number;
  cameraRotation: CameraRotation;
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
}

export const useCameraFollow = ({
  target,
  offset,
  smoothing,
  cameraRotation,
  cameraRef,
}: UseCameraFollowOptions) => {
  const currentPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;

    // Calculate camera position based on rotation
    const rotatedOffset = new THREE.Vector3();
    rotatedOffset.copy(offset);

    // Apply horizontal rotation (around Y axis)
    const horizontalQuat = new THREE.Quaternion();
    horizontalQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.horizontal);
    rotatedOffset.applyQuaternion(horizontalQuat);

    // Apply vertical rotation (pitch)
    const verticalQuat = new THREE.Quaternion();
    const rightAxis = new THREE.Vector3(1, 0, 0);
    rightAxis.applyQuaternion(horizontalQuat);
    verticalQuat.setFromAxisAngle(rightAxis, cameraRotation.vertical);
    rotatedOffset.applyQuaternion(verticalQuat);

    // Calculate desired position
    const desiredPosition = new THREE.Vector3();
    desiredPosition.copy(target).add(rotatedOffset);

    // Smooth position interpolation
    const lerpFactor = 1 / smoothing;
    currentPosition.current.lerp(desiredPosition, lerpFactor);
    camera.position.copy(currentPosition.current);

    // Smooth look-at interpolation
    const lookAtTarget = new THREE.Vector3().copy(target);
    lookAtTarget.y += 1.5; // Look at player's head height
    
    currentLookAt.current.lerp(lookAtTarget, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return currentPosition.current;
};
