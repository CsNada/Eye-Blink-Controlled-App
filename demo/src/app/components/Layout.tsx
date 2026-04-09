import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { BlinkControls } from './BlinkControls';
import { useBlink } from '../contexts/BlinkContext';

export function Layout() {
  const blinkContext = useBlink();
  const showDeleteButton = blinkContext?.showDeleteButton ?? false;
  const showSendButton = blinkContext?.showSendButton ?? false;
  
  useEffect(() => {
    console.log('Layout mounted');
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-56">
        <Outlet />
      </main>
      <BlinkControls showDeleteButton={showDeleteButton} showSendButton={showSendButton} />
    </div>
  );
}