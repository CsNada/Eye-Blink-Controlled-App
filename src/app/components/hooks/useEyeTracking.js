import { useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { playBeep } from "../../utils/audio";
import { handlePageRules } from "../../utils/eyeRules";
import { useEyeContext } from "../EyeContext";

const EYE_CLOSED_THRESHOLD = 0.18;

export function useEyeTracking(onEyeData) {
  const { setSeconds } = useEyeContext();

  const eyeClosedStart = useRef(null);
  const intervalRef = useRef(null);

  function calculateEAR(upper, lower, left, right) {
    const vertical = Math.abs(upper.y - lower.y);
    const horizontal = Math.abs(left.x - right.x);
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

      const landmarks = results.multiFaceLandmarks[0];

      const upper = landmarks[159];
      const lower = landmarks[145];
      const left = landmarks[33];
      const right = landmarks[133];

      const ear = calculateEAR(upper, lower, left, right);
      const isClosed = ear < EYE_CLOSED_THRESHOLD;

      if (isClosed) {
        if (!eyeClosedStart.current) {
          eyeClosedStart.current = Date.now();

          intervalRef.current = setInterval(() => {
            const seconds = Math.floor(
              (Date.now() - eyeClosedStart.current) / 1000
            );

            setSeconds(seconds);

            playBeep();
            handlePageRules(window.location.pathname, seconds);

            onEyeData(seconds, window.location.pathname);
          }, 1000);
        }
      } else {
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