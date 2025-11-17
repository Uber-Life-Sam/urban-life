// src/components/game/CameraController.tsx
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, forwardRef, useImperativeHandle } from "react";

const CameraController = forwardRef(
  ({ target = [0, 0, 0], offset = [0, 5, 10], followRotation = 0 }, ref) => {
    const { camera } = useThree();
    const rotation = useRef({ x: 0, y: followRotation });

    // Mouse movement ONLY for camera
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return;

      rotation.current.y -= e.movementX * 0.002;
      rotation.current.x -= e.movementY * 0.002;

      // Limit vertical rotation
      rotation.current.x = Math.max(-1.2, Math.min(1.2, rotation.current.x));
    };

    document.addEventListener("mousemove", onMouseMove);

    useImperativeHandle(ref, () => camera);

    useFrame(() => {
      // smooth camera follow
      const targetPos = [
        target[0] - Math.sin(rotation.current.y) * offset[2],
        target[1] + offset[1],
        target[2] - Math.cos(rotation.current.y) * offset[2],
      ];

      camera.position.lerp(
        { x: targetPos[0], y: targetPos[1], z: targetPos[2] },
        0.1
      );

      camera.lookAt(target[0], target[1] + 1.5, target[2]);
    });

    return null;
  }
);

export default CameraController;
