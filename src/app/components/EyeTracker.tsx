import { useEffect, useRef } from "react";
import { useEyeTracking } from "./hooks/useEyeTracking";
import { useEyeContext } from "./EyeContext";

interface EyeTrackerProps {
  onEyeData?: (seconds: number, path: string) => void;
}

export default function EyeTracker({ onEyeData }: EyeTrackerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { startTracking } = useEyeTracking(onEyeData);
  const { seconds, message, isTracking, isFaceDetected } = useEyeContext();

  useEffect(() => {
    const cleanup = startTracking(videoRef.current, canvasRef.current);
    return cleanup;
  }, [startTracking]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] w-[120px] select-none sm:w-[180px] lg:w-[120px] opacity-95">
      <div className="overflow-hidden rounded-3xl border border-white/15 bg-slate-950/25 shadow-2xl backdrop-blur-xl">
        <div className="relative aspect-[4/3] bg-black/20">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover scale-x-[-1] opacity-60"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />

          <div className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
            {isTracking ? "Tracking" : "Idle"}
          </div>

          <div className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
            {seconds}/6
          </div>
        </div>

        <div className="space-y-1 p-3 text-right">
          {/* <p className="text-sm font-semibold text-white">{message}</p> */}
          <p className="text-xs text-white/75">
            {isFaceDetected ? "تم اكتشاف الوجه" : "أظهر وجهك أمام الكاميرا"}
          </p>
        </div>
      </div>
    </div>
  );
}