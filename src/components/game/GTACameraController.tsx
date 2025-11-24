import { forwardRef, useImperativeHandle } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraRotate } from '@/hooks/useCameraRotate';
import { useCameraFollow } from '@/hooks/useCameraFollow';

interface GTACameraControllerProps {
  target: [number, number, number];
  offset?: [number, number, number];
  smoothing?: number;
}

const GTACameraController = forwardRef<THREE.Camera, GTACameraControllerProps>(
  ({ target, offset = [0, 2, -4], smoothing = 10 }, ref) => {
    const { camera } = useThree();

    // Camera rotation from mouse drag
    const cameraRotation = useCameraRotate({
      sensitivity: 0.003,
      verticalClamp: { min: -Math.PI / 4, max: Math.PI / 3 },
      initialRotation: { horizontal: 0, vertical: 0.3 },
    });

    // Camera follow with smooth interpolation
    const targetVector = new THREE.Vector3(target[0], target[1], target[2]);
    const offsetVector = new THREE.Vector3(offset[0], offset[1], offset[2]);

    useCameraFollow({
      target: targetVector,
      offset: offsetVector,
      smoothing,
      cameraRotation,
      cameraRef: { current: camera },
    });

    useImperativeHandle(ref, () => camera);

    return null;
  }
);

GTACameraController.displayName = 'GTACameraController';

export default GTACameraController;
