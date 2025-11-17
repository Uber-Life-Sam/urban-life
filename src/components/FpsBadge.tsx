import React from "react";
import useFps from "../hooks/useFps";

export default function FpsBadge() {
  const { fps, isLowPerformance } = useFps(40, 3);
  return (
    <div style={{
      position: "fixed",
      right: 12,
      bottom: 12,
      zIndex: 9999,
      background: "rgba(0,0,0,0.6)",
      color: "white",
      padding: "6px 10px",
      borderRadius: 6,
      fontSize: 12,
      pointerEvents: "none"
    }}>
      FPS: {fps} {isLowPerformance ? " (LOW)" : ""}
    </div>
  );
}
