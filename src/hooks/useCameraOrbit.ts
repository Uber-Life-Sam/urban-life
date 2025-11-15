import { useRef, useEffect, useState } from 'react';

export interface CameraOrbitState {
  distance: number;
  azimuth: number; // horizontal angle
  polar: number; // vertical angle
  offset: [number, number, number];
}

export const useCameraOrbit = (
  initialDistance: number = 8,
  initialPolar: number = Math.PI / 4,
  minPolar: number = 0.1,
  maxPolar: number = Math.PI / 2.2
) => {
  const [azimuth, setAzimuth] = useState(Math.PI / 4);
  const [polar, setPolar] = useState(initialPolar);
  const [distance, setDistance] = useState(initialDistance);
  
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) { // Right mouse button
        isDragging.current = true;
        previousMouse.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - previousMouse.current.x;
        const deltaY = e.clientY - previousMouse.current.y;
        
        // Update azimuth (horizontal rotation)
        setAzimuth((prev) => prev - deltaX * 0.005);
        
        // Update polar (vertical rotation) with limits
        setPolar((prev) => {
          const newPolar = prev + deltaY * 0.005;
          return Math.max(minPolar, Math.min(maxPolar, newPolar));
        });
        
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setDistance((prev) => {
        const newDistance = prev + e.deltaY * 0.01;
        return Math.max(3, Math.min(15, newDistance));
      });
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [minPolar, maxPolar]);

  // Calculate camera offset based on spherical coordinates
  const offset: [number, number, number] = [
    distance * Math.sin(polar) * Math.sin(azimuth),
    distance * Math.cos(polar),
    distance * Math.sin(polar) * Math.cos(azimuth),
  ];

  return {
    azimuth,
    polar,
    distance,
    offset,
  };
};
