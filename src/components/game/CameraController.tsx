// CameraController.tsx
import { useThree, useFrame } from "@react-three/fiber";
import { Matrix4, Vector3 } from "three";
import React, { forwardRef, useRef, useEffect } from "react";

interface Props {
  target: [number, number, number];
  offset: [number, number, number];
  followRotation: number;
}

const CameraController = forwardRef<any, Props>(
  ({ target, offset, followRotation }, ref) => {
    const { camera } = useThree();

    const smoothPos = useRef(new Vector3());
    const smoothLook = useRef(new Vector3());

    const yawOffset = useRef(0);
    const yawTarget = useRef(0);

    const lastMouse = useRef(0);

    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") ref(camera);
      else (ref as any).current = camera;
    }, [camera]);

    useEffect(() => {
      const onMove = (e: MouseEvent) => {
        const dx =
          typeof (e as any).movementX === "number"
            ? e.movementX
            : e.movementX || 0;

        yawTarget.current += -dx * 0.0035;

        const clamp = Math.PI / 2.2;
        yawTarget.current = Math.max(-clamp, Math.min(clamp, yawTarget.current));

        lastMouse.current = performance.now();
      };

      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useFrame(() => {
      yawOffset.current += (yawTarget.current - yawOffset.current) * 0.14;

      if (performance.now() - lastMouse.current > 1000) {
        yawTarget.current += -yawTarget.current * 0.08;
      }

      const base = new Vector3(...offset);
      const totalYaw = followRotation + yawOffset.current;

      const m = new Matrix4();
      m.makeRotationY(totalYaw);
      const rotated = base.clone().applyMatrix4(m);

      const desiredPos = new Vector3(...target).add(rotated);

      smoothPos.current.lerp(desiredPos, 0.12);
      camera.position.copy(smoothPos.current);

      const desiredLook = new Vector3(target[0], target[1] + 1.2, target[2]);
      smoothLook.current.lerp(desiredLook, 0.15);

      camera.lookAt(smoothLook.current);
    });

    return null;
  }
);

export default CameraController;
