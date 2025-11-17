import { useEffect, useRef, useState } from "react";

/**
 * useFps - simple FPS monitor hook
 * Returns: { fps, isLowPerformance }
 * isLowPerformance becomes true if fps < 40 for several consecutive checks.
 */
export default function useFps(threshold = 40, checks = 3) {
  const last = useRef<number | null>(null);
  const frames = useRef(0);
  const lowCount = useRef(0);
  const rafId = useRef<number | null>(null);
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      frames.current += 1;
      const delta = now - lastTime;
      if (delta >= 500) { // update twice a second
        const currentFps = Math.round((frames.current / delta) * 1000);
        setFps(currentFps);
        frames.current = 0;
        lastTime = now;

        if (currentFps < threshold) {
          lowCount.current += 1;
        } else {
          lowCount.current = 0;
        }

        if (lowCount.current >= checks) {
          setIsLowPerformance(true);
        } else {
          setIsLowPerformance(false);
        }
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [threshold, checks]);

  return { fps, isLowPerformance };
}
