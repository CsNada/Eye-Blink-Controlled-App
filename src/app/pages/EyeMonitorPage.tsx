import { useEffect, useRef } from "react";
import { EyeProvider, useEyeContext } from "../components/EyeContext";
import { useEyeTracking } from "../components/hooks/useEyeTracking";

function EyeMonitorContent() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { startTracking } = useEyeTracking();
  const { seconds, message, isTracking, isFaceDetected } = useEyeContext();

  useEffect(() => {
    const cleanup = startTracking(videoRef.current, canvasRef.current);
    return cleanup;
  }, [startTracking]);

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">

      {/* 🎥 الكاميرا */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" 
      />

      {/* 🎯 الرسم (FaceMesh وغيره) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full scale-x-[-1]"
      />

      {/* 🎯 نقطة تركيز (شكل احترافي) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 border border-white/60 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>

      {/* 📊 معلومات خفيفة */}
      <div className="pointer-events-none absolute top-4 left-4 flex gap-2 text-xs">
        
        <div className={`px-3 py-1 rounded-full backdrop-blur-md 
          ${isTracking ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>
          {isTracking ? "TRACKING" : "IDLE"}
        </div>

        <div className={`px-3 py-1 rounded-full backdrop-blur-md 
          ${isFaceDetected ? "bg-blue-500/20 text-blue-300" : "bg-red-500/20 text-red-300"}`}>
          {isFaceDetected ? "FACE OK" : "NO FACE"}
        </div>

        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/80">
          {seconds}s
        </div>
      </div>

      {/* 💬 الرسائل */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl text-sm text-white/90 shadow-lg">
          {message}
        </div>
      </div>
    </div>
  );
}

export function EyeMonitorPage() {
  return (
    <EyeProvider>
      <EyeMonitorContent />
    </EyeProvider>
  );
}