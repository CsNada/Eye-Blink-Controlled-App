import { useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { playBeep } from "../../utils/audio";
import { handlePageRules } from "../../utils/eyeRules";
import { useEyeContext } from "../EyeContext";

const EYE_CLOSED_THRESHOLD = 0.25; // مهم: رفعناها للدقة

export function useEyeTracking(onEyeData) {
  const { setSeconds } = useEyeContext();

  const eyeClosedStart = useRef(null);
  const intervalRef = useRef(null);
  const closeCounter = useRef(0);

  function calculateEAR(u, l, le, r) {
    const vertical = Math.abs(u.y - l.y);
    const horizontal = Math.abs(le.x - r.x);
    return vertical / horizontal;
  }

  function startTracking(video) {
    if (!video) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks?.length) return;

      const lm = results.multiFaceLandmarks[0];

      const upper = lm[159];
      const lower = lm[145];
      const left = lm[33];
      const right = lm[133];

      const ear = calculateEAR(upper, lower, left, right);
      const isClosed = ear < EYE_CLOSED_THRESHOLD;

      // 👇 تثبيت الإغلاق (Debounce)
      if (isClosed) {
        closeCounter.current++;

        if (closeCounter.current > 3) {
          if (!eyeClosedStart.current) {
            eyeClosedStart.current = Date.now();

            console.log("👁️ EYE CLOSED CONFIRMED");

            intervalRef.current = setInterval(() => {
              const seconds = Math.floor(
                (Date.now() - eyeClosedStart.current) / 1000
              );

              console.log("SECONDS:", seconds);

              setSeconds(seconds);
              playBeep();
              handlePageRules(window.location.pathname, seconds);

              onEyeData(seconds, window.location.pathname);
            }, 1000);
          }
        }
      } else {
        closeCounter.current = 0;

        eyeClosedStart.current = null;
        clearInterval(intervalRef.current);
        setSeconds(0);
      }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        await faceMesh.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }

  return { startTracking };
}