import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';
import { initializeErrorHandlers } from './utils/errorHandler';

import EyeTracker from "./components/EyeTracker";

export default function App() {
  // Initialize error handlers inside the component lifecycle
  useEffect(() => {
    initializeErrorHandlers();
    console.log('App mounted successfully');
  }, []);

function handleAction(seconds: number) {
  if (seconds === 1) window.location.href = "/page1";
  if (seconds === 2) window.location.href = "/page2";
  if (seconds === 3) window.location.href = "/page3";
}

  return (
  <>
    <EyeTracker onAction={handleAction} />
    <RouterProvider router={router} />
  </>
);
}