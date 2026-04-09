import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';
import { initializeErrorHandlers } from './utils/errorHandler';

export default function App() {
  // Initialize error handlers inside the component lifecycle
  useEffect(() => {
    initializeErrorHandlers();
    console.log('App mounted successfully');
  }, []);

  return <RouterProvider router={router} />;
}