import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { BlinkProvider } from '../contexts/BlinkContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ErrorBoundary } from './ErrorBoundary';

export function Root() {
  useEffect(() => {
    console.log('Root component mounted');
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <BlinkProvider>
            <Outlet />
          </BlinkProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}