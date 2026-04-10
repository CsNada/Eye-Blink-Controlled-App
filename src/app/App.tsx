import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect } from "react";
import EyeTracker from "./components/EyeTracker";
import { initializeErrorHandlers } from "./utils/errorHandler";
import { unlockAudio } from "./utils/audio";

export default function App() {
  useEffect(() => {
    initializeErrorHandlers();

    const unlock = () => {
      void unlockAudio();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <>
      <EyeTracker />
      <RouterProvider router={router} />
    </>
  );
}