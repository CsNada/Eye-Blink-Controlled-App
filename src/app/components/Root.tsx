import React from "react";
import { Outlet } from "react-router";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ErrorBoundary } from "./ErrorBoundary";

export function Root() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <Outlet />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}