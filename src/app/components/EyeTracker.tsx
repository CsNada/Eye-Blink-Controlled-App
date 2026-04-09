import { useEffect, useRef } from "react";
import { useEyeTracking } from "./hooks/useEyeTracking";

export default function EyeTracker({ onEyeData }) {
  const videoRef = useRef(null);
  const { startTracking } = useEyeTracking(onEyeData);

  useEffect(() => {
    startTracking(videoRef.current);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        width: 180,
        opacity: 0.5,
        transform: "scaleX(-1)",
      }}
    />
  );
}