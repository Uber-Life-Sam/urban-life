import React from "react";
import useFps from "../hooks/useFps";

type Props = {
  enabled: boolean; // whether night mode requested by user
  intensity?: number; // 0..1 user preference fallback
};

export default function NightOverlay({ enabled, intensity = 0.8 }: Props) {
  // If device shows low perf, disable heavy effects
  const { isLowPerformance } = useFps(40, 3); // threshold 40 FPS

  // compute CSS class or style depending on perf and intensity
  const useHeavy = enabled && !isLowPerformance && intensity > 0.25;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[800] transition-colors duration-300"
      style={{
        // base night tint
        background:
          enabled ? "rgba(6,12,28, 0.55)" : "transparent",
        // Apply GPU-accelerated transform to promote layer
        transform: "translateZ(0)",
        // Toggle drop-shadow / blur only if useHeavy
        filter: useHeavy ? "drop-shadow(0 10px 30px rgba(0,0,0,0.6))" : "none",
        backdropFilter: useHeavy ? "brightness(0.7) saturate(0.85)" : "none",
        willChange: useHeavy ? "filter, backdrop-filter" : "auto",
      }}
    >
      {/* Optional soft vignette using CSS radial-gradient to avoid heavy box-shadows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: enabled
            ? "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)"
            : "none",
          mixBlendMode: "overlay",
          opacity: useHeavy ? 0.85 : 0.6,
          transition: "opacity 300ms ease",
        }}
      />
    </div>
  );
}
