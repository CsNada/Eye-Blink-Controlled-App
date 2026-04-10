import { useCallback, useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { playBeep } from "../../utils/audio";
import { useEyeContext } from "../EyeContext";

const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];
const TRACKED_POINTS = new Set([
  ...LEFT_EYE,
  ...RIGHT_EYE,
  468, 469, 470, 471, 472, 473, 474, 475, 476, 477,
]);

const MAX_SECONDS = 7;
const EAR_SMOOTHING = 0.35;
const BASELINE_SMOOTHING = 0.08;
const MIN_EAR = 0.16;
const MAX_EAR = 0.3;
const DEFAULT_BASELINE_EAR = 0.31;
const FACE_MISSING_GRACE_MS = 250;
const CLOSE_HOLD_MS = 160;

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function eyeAspectRatio(landmarks, indices) {
  const p1 = landmarks[indices[0]];
  const p2 = landmarks[indices[1]];
  const p3 = landmarks[indices[2]];
  const p4 = landmarks[indices[3]];
  const p5 = landmarks[indices[4]];
  const p6 = landmarks[indices[5]];

  const vertical = distance(p2, p6) + distance(p3, p5);
  const horizontal = distance(p1, p4);

  if (!horizontal) return 0;
  return vertical / (2 * horizontal);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getCurrentRoute() {
  if (typeof window === "undefined") return "/";

  const rawHash = window.location.hash.replace(/^#/, "");
  if (!rawHash || rawHash === "/") return "/";

  return rawHash.startsWith("/") ? rawHash : `/${rawHash}`;
}

function emitBlinkEvent(seconds) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("blinkEvent", {
      detail: { seconds },
    })
  );
}

function buildMessage(seconds) {
  switch (seconds) {
    case 1:
      return "ثانية واحدة — واصل الإغلاق للحصول على العد الصحيح";
    case 2:
      return "ثانيتان — سيتم تنفيذ الاختيار";
    case 3:
      return "3 ثوانٍ — الانتقال للعنصر التالي";
    case 4:
      return "4 ثوانٍ — رجوع أو خروج";
    case 5:
      return "5 ثوانٍ — إرسال";
    case 6:
      return "6 ثوانٍ — الحد الأقصى قريب";
    case 7:
      return "7 ثوانٍ — تم الوصول إلى الحد الأقصى";
    default:
      return "أغلق عينيك لبدء العد";
  }
}

function resizeCanvas(canvas, video) {
  if (!canvas || !video) return;

  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;

  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
}

function drawLandmarks(canvas, landmarks, isClosed) {
  if (!canvas || !landmarks?.length) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width || 640;
  const height = canvas.height || 480;

  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < landmarks.length; i += 1) {
    const point = landmarks[i];
    const x = point.x * width;
    const y = point.y * height;
    const isTrackedPoint = TRACKED_POINTS.has(i);

    ctx.beginPath();
    ctx.arc(x, y, isTrackedPoint ? 2.3 : 1.0, 0, Math.PI * 2);
    ctx.fillStyle = isTrackedPoint
      ? isClosed
        ? "rgba(248, 113, 113, 0.95)"
        : "rgba(34, 211, 238, 0.95)"
      : "rgba(255, 255, 255, 0.40)";
    ctx.fill();
  }
}

function resetSession(session, { preserveBaseline = true } = {}) {
  session.closedSince = null;
  session.closingCandidateSince = null;
  session.lastAnnouncedSecond = 0;
  session.smoothedEar = null;
  session.faceMissingSince = null;
  session.ignoreUntilOpen = false;

  if (!preserveBaseline) {
    session.baselineEar = DEFAULT_BASELINE_EAR;
  }
}

export function useEyeTracking(onEyeData) {
  const {
    setSeconds,
    setMessage,
    setIsTracking,
    setIsFaceDetected,
  } = useEyeContext();

  const onEyeDataRef = useRef(onEyeData);
  const resourcesRef = useRef({
    camera: null,
    faceMesh: null,
  });

  const sessionRef = useRef({
    closedSince: null,
    closingCandidateSince: null,
    lastAnnouncedSecond: 0,
    smoothedEar: null,
    baselineEar: DEFAULT_BASELINE_EAR,
    faceMissingSince: null,
    ignoreUntilOpen: false,
  });

  useEffect(() => {
    onEyeDataRef.current = onEyeData;
  }, [onEyeData]);

  const startTracking = useCallback(
    (video, canvas) => {
      if (!video) return () => {};

      let active = true;
      const session = sessionRef.current;

      resetSession(session, { preserveBaseline: false });
      setIsTracking(true);
      setIsFaceDetected(false);
      setSeconds(0);
      setMessage("جارٍ تشغيل الكاميرا والتتبع...");

      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.8,
        selfieMode: true,
      });

      faceMesh.onResults((results) => {
        if (!active) return;

        const landmarks = results.multiFaceLandmarks?.[0];
        const now = performance.now();

        if (!landmarks) {
          if (!session.faceMissingSince) {
            session.faceMissingSince = now;
          }

          if (now - session.faceMissingSince > FACE_MISSING_GRACE_MS) {
            setIsFaceDetected(false);
            session.closedSince = null;
            session.closingCandidateSince = null;
            session.lastAnnouncedSecond = 0;
            session.smoothedEar = null;
            session.ignoreUntilOpen = false;
            setSeconds(0);
            setMessage("لم يتم اكتشاف الوجه بوضوح. اجلس أمام الكاميرا.");
          }

          if (canvas) {
            resizeCanvas(canvas, video);
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          return;
        }

        session.faceMissingSince = null;
        setIsFaceDetected(true);

        const leftEar = eyeAspectRatio(landmarks, LEFT_EYE);
        const rightEar = eyeAspectRatio(landmarks, RIGHT_EYE);
        const ear = (leftEar + rightEar) / 2;

        if (!Number.isFinite(ear) || ear <= 0) {
          return;
        }

        session.smoothedEar =
          session.smoothedEar == null
            ? ear
            : session.smoothedEar * (1 - EAR_SMOOTHING) + ear * EAR_SMOOTHING;

        const smoothedEar = session.smoothedEar;

        if (!session.closedSince) {
          session.baselineEar =
            session.baselineEar == null
              ? smoothedEar
              : session.baselineEar * (1 - BASELINE_SMOOTHING) +
                smoothedEar * BASELINE_SMOOTHING;
        }

        const threshold = clamp(
          (session.baselineEar ?? DEFAULT_BASELINE_EAR) * 0.72,
          MIN_EAR,
          MAX_EAR
        );

        const isClosed = smoothedEar < threshold;

        resizeCanvas(canvas, video);
        drawLandmarks(canvas, landmarks, isClosed);

        if (session.ignoreUntilOpen) {
          setSeconds(0);
          setMessage("تجاوزت 7 ثوانٍ. افتح عينيك لإعادة تشغيل العداد.");
          return;
        }

        if (isClosed) {
          if (!session.closingCandidateSince) {
            session.closingCandidateSince = now;
          }

          if (!session.closedSince) {
            if (now - session.closingCandidateSince < CLOSE_HOLD_MS) {
              setSeconds(0);
              setMessage("أغلق عينيك بثبات لبدء العد");
              return;
            }

            session.closedSince = session.closingCandidateSince;
            session.lastAnnouncedSecond = 0;
            setSeconds(0);
            setMessage("تم بدء العد... سيصدر صوت مع كل ثانية");
            return;
          }

          const elapsedSeconds = Math.floor((now - session.closedSince) / 1000);

          if (elapsedSeconds > MAX_SECONDS) {
            session.ignoreUntilOpen = true;
            session.closedSince = null;
            session.closingCandidateSince = null;
            session.lastAnnouncedSecond = 0;
            setSeconds(0);
            setMessage("تجاوزت 7 ثوانٍ، تمت إعادة العداد");
            return;
          }

          if (
            elapsedSeconds >= 1 &&
            elapsedSeconds !== session.lastAnnouncedSecond
          ) {
            session.lastAnnouncedSecond = elapsedSeconds;
            setSeconds(elapsedSeconds);
            setMessage(buildMessage(elapsedSeconds));

            void playBeep();
            emitBlinkEvent(elapsedSeconds);

            const route = getCurrentRoute();
            if (typeof onEyeDataRef.current === "function") {
              onEyeDataRef.current(elapsedSeconds, route);
            }
          }

          return;
        }

        session.closingCandidateSince = null;

        if (session.closedSince || session.lastAnnouncedSecond !== 0) {
          setSeconds(0);
          setMessage("أبقِ عينيك مفتوحة أو أغمضهما من جديد لبدء العد");
        }

        session.closedSince = null;
        session.lastAnnouncedSecond = 0;
        session.ignoreUntilOpen = false;
      });

      const camera = new Camera(video, {
        onFrame: async () => {
          if (!active) return;
          await faceMesh.send({ image: video });
        },
        width: 640,
        height: 480,
      });

      resourcesRef.current.camera = camera;
      resourcesRef.current.faceMesh = faceMesh;

      try {
        camera.start();
      } catch {
        setMessage("تعذر تشغيل الكاميرا. تأكد من منح الإذن للوصول إليها.");
        setIsTracking(false);
        setIsFaceDetected(false);
      }

      return () => {
        active = false;

        try {
          resourcesRef.current.camera?.stop?.();
        } catch {
          // ignore cleanup errors
        }

        try {
          resourcesRef.current.faceMesh?.close?.();
        } catch {
          // ignore cleanup errors
        }

        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        resourcesRef.current.camera = null;
        resourcesRef.current.faceMesh = null;

        resetSession(session);
        setIsTracking(false);
        setIsFaceDetected(false);
        setSeconds(0);
        setMessage("تم إيقاف التتبع");
      };
    },
    [setIsFaceDetected, setIsTracking, setMessage, setSeconds]
  );

  return { startTracking };
}