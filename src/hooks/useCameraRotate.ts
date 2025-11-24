import { useEffect, useRef } from 'react';

export interface CameraRotation {
  horizontal: number;
  vertical: number;
}

interface UseCameraRotateOptions {
  sensitivity?: number;
  verticalClamp?: { min: number; max: number };
  initialRotation?: Partial<CameraRotation>;
}

export const useCameraRotate = ({
  sensitivity = 0.002,
  verticalClamp = { min: -Math.PI / 3, max: Math.PI / 3 },
  initialRotation = {},
}: UseCameraRotateOptions = {}) => {
  const rotation = useRef<CameraRotation>({
    horizontal: initialRotation.horizontal ?? 0,
    vertical: initialRotation.vertical ?? 0.3,
  });

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) { // Right mouse button
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      // Update horizontal rotation (yaw)
      rotation.current.horizontal -= deltaX * sensitivity;

      // Update vertical rotation (pitch) with clamping
      rotation.current.vertical = Math.max(
        verticalClamp.min,
        Math.min(verticalClamp.max, rotation.current.vertical + deltaY * sensitivity)
      );

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        isDragging.current = false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [sensitivity, verticalClamp.min, verticalClamp.max]);

  return rotation.current;
};
