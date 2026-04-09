import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface BlinkContextType {
  focusedIndex: number;
  totalItems: number;
  setTotalItems: (count: number) => void;
  setOnSelect: (callback: () => void) => void;
  setOnBack: (callback: () => void) => void;
  setOnDelete: (callback: (() => void) | null) => void;
  setOnSend: (callback: (() => void) | null) => void;
  simulateBlink: (seconds: number) => void;
  lastEvent: string;
  showDeleteButton: boolean;
  showSendButton: boolean;
}

// Create context directly - no singleton pattern needed
const BlinkContext = createContext<BlinkContextType | undefined>(undefined);

export function BlinkProvider({ children }: { children: React.ReactNode }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lastEvent, setLastEvent] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  
  const onSelectRef = useRef<(() => void) | null>(null);
  const onBackRef = useRef<(() => void) | null>(null);
  const onDeleteRef = useRef<(() => void) | null>(null);
  const onSendRef = useRef<(() => void) | null>(null);

  const setOnSelect = useCallback((callback: () => void) => {
    onSelectRef.current = callback;
  }, []);

  const setOnBack = useCallback((callback: () => void) => {
    onBackRef.current = callback;
  }, []);

  const setOnDelete = useCallback((callback: (() => void) | null) => {
    onDeleteRef.current = callback;
    setShowDeleteButton(callback !== null);
  }, []);

  const setOnSend = useCallback((callback: (() => void) | null) => {
    onSendRef.current = callback;
    setShowSendButton(callback !== null);
  }, []);

  const processBlink = useCallback((seconds: number) => {
    setLastEvent(`${seconds}s blink detected`);
    
    if (seconds === 1) {
      // Delete action (Notes Page only)
      if (onDeleteRef.current) {
        onDeleteRef.current();
      }
    } else if (seconds === 2) {
      // Select/press the focused item
      if (onSelectRef.current) {
        onSelectRef.current();
      }
    } else if (seconds === 3) {
      // Navigate to next item
      setFocusedIndex(prev => {
        if (totalItems === 0) return 0;
        return (prev + 1) % totalItems;
      });
    } else if (seconds === 4) {
      // Go back / exit
      if (onBackRef.current) {
        onBackRef.current();
      }
      // Reset focus to first item after going back
      setFocusedIndex(0);
    } else if (seconds === 5) {
      // Send action
      if (onSendRef.current) {
        onSendRef.current();
      }
    }
  }, [totalItems]);

  const simulateBlink = useCallback((seconds: number) => {
    processBlink(seconds);
  }, [processBlink]);

  // Listen for postMessage events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.data && event.data.event === 'picked' && event.data.seconds) {
          processBlink(event.data.seconds);
        } else if (event.data && event.data.event === 'exit' && event.data.seconds) {
          processBlink(event.data.seconds);
        }
      } catch (error) {
        // Silently handle errors in message processing
        console.debug('Error processing message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [processBlink]);

  // Listen for custom DOM events
  useEffect(() => {
    const handleBlinkEvent = (event: Event) => {
      try {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && customEvent.detail.seconds) {
          processBlink(customEvent.detail.seconds);
        }
      } catch (error) {
        // Silently handle errors in event processing
        console.debug('Error processing blink event:', error);
      }
    };

    window.addEventListener('blinkEvent', handleBlinkEvent);
    return () => window.removeEventListener('blinkEvent', handleBlinkEvent);
  }, [processBlink]);

  // Expose window.blinkControl API
  useEffect(() => {
    try {
      (window as any).blinkControl = {
        delete: () => processBlink(1),
        select: () => processBlink(2),
        navigate: () => processBlink(3),
        back: () => processBlink(4),
        send: () => processBlink(5),
      };
    } catch (error) {
      console.debug('Error exposing blinkControl API:', error);
    }

    return () => {
      try {
        delete (window as any).blinkControl;
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, [processBlink]);

  return (
    <BlinkContext.Provider
      value={{
        focusedIndex,
        totalItems,
        setTotalItems,
        setOnSelect,
        setOnBack,
        setOnDelete,
        setOnSend,
        simulateBlink,
        lastEvent,
        showDeleteButton,
        showSendButton,
      }}
    >
      {children}
    </BlinkContext.Provider>
  );
}

export function useBlink() {
  const context = useContext(BlinkContext);
  if (!context) {
    // During HMR or initial load, the context might not be available yet
    // Return a safe default to prevent crashes
    if (typeof window !== 'undefined') {
      console.warn('BlinkContext not available, using defaults');
      return {
        focusedIndex: 0,
        totalItems: 0,
        setTotalItems: () => {},
        setOnSelect: () => {},
        setOnBack: () => {},
        setOnDelete: () => {},
        setOnSend: () => {},
        simulateBlink: () => {},
        lastEvent: '',
        showDeleteButton: false,
        showSendButton: false,
      } as BlinkContextType;
    }
    throw new Error('useBlink must be used within a BlinkProvider');
  }
  return context;
}