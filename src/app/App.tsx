import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect } from "react";
import EyeTracker from "./components/EyeTracker";
import { initializeErrorHandlers } from "./utils/errorHandler";

export default function App() {
  useEffect(() => {
    initializeErrorHandlers();
  }, []);

  function handleEyeData(seconds, path) {
    console.log("Eye Data:", { seconds, path });
  }

  return (
    <>
      <EyeTracker onEyeData={handleEyeData} />
      <RouterProvider router={router} />
    </>
  );
}