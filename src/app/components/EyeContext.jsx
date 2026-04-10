import { createContext, useContext, useMemo, useState } from "react";

const defaultValue = {
  seconds: 0,
  setSeconds: () => {},
  message: "أغلق عينيك أمام الكاميرا لبدء العد",
  setMessage: () => {},
  isTracking: false,
  setIsTracking: () => {},
  isFaceDetected: false,
  setIsFaceDetected: () => {},
};

const EyeContext = createContext(defaultValue);

export function EyeProvider({ children }) {
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState("أغلق عينيك أمام الكاميرا لبدء العد");
  const [isTracking, setIsTracking] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  const value = useMemo(
    () => ({
      seconds,
      setSeconds,
      message,
      setMessage,
      isTracking,
      setIsTracking,
      isFaceDetected,
      setIsFaceDetected,
    }),
    [seconds, message, isTracking, isFaceDetected]
  );

  return <EyeContext.Provider value={value}>{children}</EyeContext.Provider>;
}

export function useEyeContext() {
  return useContext(EyeContext);
}