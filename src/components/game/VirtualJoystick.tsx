import { useEffect, useRef, useState } from 'react';

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
}

const VirtualJoystick = ({ onMove }: VirtualJoystickProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect();
      touchStartPos.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 50;

    let x = deltaX;
    let y = deltaY;

    if (distance > maxDistance) {
      x = (deltaX / distance) * maxDistance;
      y = (deltaY / distance) * maxDistance;
    }

    setPosition({ x, y });
    
    // Normalize to -1 to 1 range
    const normalizedX = x / maxDistance;
    const normalizedY = -y / maxDistance; // Invert Y for forward/backward
    onMove(normalizedX, normalizedY);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onMove(0, 0);
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('mouseup', handleEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={joystickRef}
      className="fixed bottom-32 left-8 w-32 h-32 pointer-events-auto"
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
    >
      {/* Outer circle */}
      <div className="absolute inset-0 rounded-full bg-card/40 backdrop-blur-sm border-2 border-border" />
      
      {/* Inner stick */}
      <div
        className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-primary/80 border-2 border-primary-foreground shadow-lg transition-transform"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />

      {/* Direction indicators */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-xs text-muted-foreground/60 absolute top-2">W</div>
        <div className="text-xs text-muted-foreground/60 absolute bottom-2">S</div>
        <div className="text-xs text-muted-foreground/60 absolute left-2">A</div>
        <div className="text-xs text-muted-foreground/60 absolute right-2">D</div>
      </div>
    </div>
  );
};

export default VirtualJoystick;
