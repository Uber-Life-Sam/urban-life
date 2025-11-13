import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControllerProps {
  target: [number, number, number];
}

const CameraController = ({ target }: CameraControllerProps) => {
  const { camera } = useThree();
  const cameraOffset = useRef(new Vector3(8, 6, 8));
  const currentPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());

  useFrame(() => {
    // Target position for camera
    const targetPosition = new Vector3(
      target[0] + cameraOffset.current.x,
      target[1] + cameraOffset.current.y,
      target[2] + cameraOffset.current.z
    );

    // Smoothly interpolate camera position
    currentPosition.current.lerp(targetPosition, 0.1);
    camera.position.copy(currentPosition.current);

    // Look at player with smooth interpolation
    const lookAtTarget = new Vector3(target[0], target[1] + 1, target[2]);
    currentLookAt.current.lerp(lookAtTarget, 0.1);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

export default CameraController;
