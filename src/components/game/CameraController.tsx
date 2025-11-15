import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControllerProps {
  target: [number, number, number];
  offset: [number, number, number];
}

const CameraController = ({ target, offset }: CameraControllerProps) => {
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());

  useFrame(() => {
    // Target position for camera based on offset
    const targetPosition = new Vector3(
      target[0] + offset[0],
      target[1] + offset[1],
      target[2] + offset[2]
    );

    // Smoothly interpolate camera position
    currentPosition.current.lerp(targetPosition, 0.15);
    camera.position.copy(currentPosition.current);

    // Look at player with smooth interpolation
    const lookAtTarget = new Vector3(target[0], target[1] + 1, target[2]);
    currentLookAt.current.lerp(lookAtTarget, 0.15);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

export default CameraController;
