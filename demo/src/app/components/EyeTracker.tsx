import { useEffect, useRef } from "react";

export default function EyeTracker({ onAction }: { onAction: (seconds: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  let startTime: number | null = null;
  let lastSecond = 0;

  useEffect(() => {
    // تشغيل الكاميرا
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

    // محاكاة (مؤقتًا) - نستبدلها لاحقًا بالكشف الحقيقي
    const interval = setInterval(() => {
      const eyeClosed = Math.random() > 0.7; // 👈 مؤقت فقط للتجربة

      if (eyeClosed) {
        if (!startTime) startTime = Date.now();

        const duration = Math.floor((Date.now() - startTime) / 1000);

        if (duration > lastSecond) {
          lastSecond = duration;
          playBeep();
        }
      } else {
        if (startTime) {
          const total = Math.floor((Date.now() - startTime) / 1000);
          onAction(total);
        }
        startTime = null;
        lastSecond = 0;
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  function playBeep() {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    oscillator.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => oscillator.stop(), 100);
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      style={{ width: 200, position: "fixed", bottom: 10, right: 10 }}
    />
  );
}