// Global error handler for uncaught errors in the Figma iframe environment
export function initializeErrorHandlers() {
  // Suppress "send was called before connect" errors from HMR
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args.join(' ');
    
    // Filter out known Figma/Vite iframe issues
    if (
      errorMessage.includes('send was called before connect') ||
      errorMessage.includes('WebSocket') ||
      errorMessage.includes('HMR')
    ) {
      // Log as debug instead of error
      console.debug(...args);
      return;
    }
    
    // Pass through other errors
    originalConsoleError.apply(console, args);
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason?.message || String(event.reason);
    
    // Suppress known iframe/HMR errors
    if (
      errorMessage.includes('send was called before connect') ||
      errorMessage.includes('WebSocket') ||
      errorMessage.includes('HMR')
    ) {
      event.preventDefault();
      console.debug('Suppressed unhandled rejection:', errorMessage);
      return;
    }
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || '';
    
    // Suppress known iframe/HMR errors
    if (
      errorMessage.includes('send was called before connect') ||
      errorMessage.includes('WebSocket') ||
      errorMessage.includes('HMR')
    ) {
      event.preventDefault();
      console.debug('Suppressed error:', errorMessage);
      return;
    }
  });
}
