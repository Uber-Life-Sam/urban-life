import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const useCameraRotate = (camera: any) => {
  const rotating = useRef(false);
  const rotationSpeed = 0.002;
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        rotating.current = true;

        // Cursor hide
        document.body.style.cursor = "none";

        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        rotating.current = false;

        // Cursor show
        document.body.style.cursor = "default";
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!rotating.current) return;

      const deltaX = e.clientX - mouse.current.x;
      const deltaY = e.clientY - mouse.current.y;

      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      camera.rotation.y -= deltaX * rotationSpeed;
      camera.rotation.x -= deltaY * rotationSpeed;
    };

    // Disable scroll zoom
    const preventZoom = (e: WheelEvent) => {
      e.preventDefault();
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("wheel", preventZoom, { passive: false });

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", preventZoom);
    };
  }, []);

  useFrame(() => {
    if (!rotating.current) return;
  });

  return {};
};
