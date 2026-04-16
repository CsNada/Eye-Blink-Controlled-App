import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type BlinkMode = "normal" | "keyboard";
type BlinkAction = "select" | "left" | "right" | "up" | "down" | "exit";

type BlinkControlApi = {
  select: () => void;
  navigate: () => void;
  back: () => void;
  keyboardMode: () => void;
  exitKeyboard: () => void;
  left: () => void;
  right: () => void;
  up: () => void;
  down: () => void;
};

type BlinkContextValue = {
  focusedIndex: number;
  totalItems: number;
  lastEvent: string | null;
  mode: BlinkMode;
  setMode: (mode: BlinkMode) => void;
  setTotalItems: (count: number) => void;
  registerButton: (el: HTMLElement | null) => void;
  unregisterButton: (el: HTMLElement | null) => void;
  focusNext: () => void;
  focusPrevious: () => void;
  triggerCurrent: () => void;
  setOnSelect: (fn: (() => void) | null) => void;
  setOnBack: (fn: (() => void) | null) => void;
  setOnDelete: (fn: (() => void) | null) => void;
  setOnSend: (fn: (() => void) | null) => void;
  setOnSpace: (fn: (() => void) | null) => void;
};

const BlinkContext = createContext<BlinkContextValue | undefined>(undefined);

const ACTION_DEBOUNCE_MS = 1000;
const ACTION_COOLDOWN_MS = 1000;

function isVisible(el: HTMLElement) {
  if (typeof window === "undefined") return false;

  const style = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    rect.width > 0 &&
    rect.height > 0 &&
    !el.hasAttribute("hidden") &&
    el.getAttribute("aria-hidden") !== "true"
  );
}

function getBlinkIndex(el: HTMLElement) {
  const raw = el.getAttribute("data-blink-index");
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function dispatchBlinkAction(action: BlinkAction) {
  window.dispatchEvent(
    new CustomEvent("blinkAction", {
      detail: { action },
    })
  );
}

function isTextField(el: Element): el is HTMLInputElement | HTMLTextAreaElement {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}

export function BlinkProvider({ children }: { children: React.ReactNode }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [totalItems, setTotalItemsState] = useState(0);
  const [lastEvent, setLastEvent] = useState<string | null>("جاهز للتحكم بالعين");
  const [mode, setMode] = useState<BlinkMode>("normal");

  const manualButtonsRef = useRef<Set<HTMLElement>>(new Set());
  const pendingSecondsRef = useRef<number | null>(null);
  const pendingTimerRef = useRef<number | null>(null);
  const lastExecutionRef = useRef<{ seconds: number | null; time: number }>({
    seconds: null,
    time: 0,
  });

  const onSelectRef = useRef<(() => void) | null>(null);
  // const onBackRef = useRef<(() => void) | null>(null);
  const onDeleteRef = useRef<(() => void) | null>(null);
  const onSendRef = useRef<(() => void) | null>(null);
  const onSpaceRef = useRef<(() => void) | null>(null);

  const collectFocusableElements = useCallback(() => {
    if (typeof document === "undefined") return [];

    const domElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-blink-index]")
    ).filter(isVisible);

    const manualElements = Array.from(manualButtonsRef.current).filter(isVisible);
    const merged = [...domElements, ...manualElements];

    const seen = new Set<HTMLElement>();
    const unique = merged.filter((el) => {
      if (seen.has(el)) return false;
      seen.add(el);
      return true;
    });

    return unique.sort((a, b) => {
      const ai = getBlinkIndex(a);
      const bi = getBlinkIndex(b);
      if (ai !== bi) return ai - bi;

      const pos = a.compareDocumentPosition(b);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
  }, []);

  const focusElement = useCallback(
    (index: number) => {
      const elements = collectFocusableElements();
      if (!elements.length) return;

      const safeIndex = ((index % elements.length) + elements.length) % elements.length;
      const element = elements[safeIndex];
      if (!element) return;

      setFocusedIndex(safeIndex);

      try {
        element.focus({ preventScroll: true });
      } catch {
        element.focus();
      }

      try {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      } catch {
        // ignore
      }
    },
    [collectFocusableElements]
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const styleId = "blink-focus-ring-style";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .blink-focus-ring {
        outline: 4px solid rgba(59, 130, 246, 0.95) !important;
        outline-offset: 4px !important;
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.18), 0 14px 34px rgba(37, 99, 235, 0.25) !important;
        transform: scale(1.03) !important;
        transition: transform 160ms ease, box-shadow 160ms ease, outline-color 160ms ease;
        z-index: 90 !important;
        position: relative !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    const elements = collectFocusableElements();
    if (!elements.length) return;

    if (focusedIndex >= elements.length) {
      setFocusedIndex(0);
      focusElement(0);
      return;
    }

    const active = elements[focusedIndex];
    if (active) {
      elements.forEach((el) => el.classList.remove("blink-focus-ring"));
      active.classList.add("blink-focus-ring");
      focusElement(focusedIndex);
    }
  }, [collectFocusableElements, focusElement, focusedIndex]);

  const focusNext = useCallback(() => {
    const elements = collectFocusableElements();
    if (!elements.length) return;

    const nextIndex = (focusedIndex + 1) % elements.length;
    setFocusedIndex(nextIndex);

    requestAnimationFrame(() => {
      focusElement(nextIndex);
    });
  }, [collectFocusableElements, focusedIndex, focusElement]);

  const focusPrevious = useCallback(() => {
    const elements = collectFocusableElements();
    if (!elements.length) return;

    const prevIndex = (focusedIndex - 1 + elements.length) % elements.length;
    setFocusedIndex(prevIndex);

    requestAnimationFrame(() => {
      focusElement(prevIndex);
    });
  }, [collectFocusableElements, focusedIndex, focusElement]);

  const triggerCurrent = useCallback(() => {
    const elements = collectFocusableElements();
    if (!elements.length) {
      setLastEvent("لا توجد عناصر قابلة للتحديد الآن");
      return;
    }

    const current = elements[focusedIndex] ?? elements[0];
    if (!current) return;

    if (isTextField(current)) {
      try {
        current.focus({ preventScroll: true });
      } catch {
        current.focus();
      }

      try {
        current.select();
      } catch {
        // ignore
      }

      setLastEvent("تم تحديد الحقل");
      return;
    }

    try {
      current.focus({ preventScroll: true });
    } catch {
      current.focus();
    }

    current.click();
    setLastEvent("تم تنفيذ الاختيار");
  }, [collectFocusableElements, focusedIndex]);

  const executeNormalMode = useCallback(
    (seconds: number) => {
      if (seconds === 2) {
        focusNext();
        setLastEvent("تم الانتقال إلى العنصر التالي");
        return;
      }

      if (seconds === 3) {
        triggerCurrent();
        return;
      }

      if (seconds === 4) {
  if (window.history.length > 1) {
    window.history.back();
    setLastEvent("تم الرجوع إلى الصفحة السابقة");
  } else {
    setLastEvent("لا توجد صفحة سابقة للرجوع إليها");
  }
  return;
}

      setLastEvent(`تم رصد ${seconds} ثوانٍ`);
    },
    [focusNext, triggerCurrent]
  );

  const executeKeyboardMode = useCallback((seconds: number) => {
    if (seconds === 1) {
      dispatchBlinkAction("select");
      setLastEvent("اختيار داخل لوحة المفاتيح");
      return;
    }

    if (seconds === 2) {
      dispatchBlinkAction("left");
      setLastEvent("تحرك لليمين");
      return;
    }

    if (seconds === 3) {
      dispatchBlinkAction("right");
      setLastEvent("تحرك لليسار");
      return;
    }

    if (seconds === 4) {
      dispatchBlinkAction("up");
      setLastEvent("تحرك للأعلى");
      return;
    }

    if (seconds === 5) {
      dispatchBlinkAction("down");
      setLastEvent("تحرك للأسفل");
      return;
    }

    if (seconds === 6) {
      dispatchBlinkAction("exit");
      setMode("normal");
      setLastEvent("الخروج من لوحة المفاتيح");
      return;
    }

    setLastEvent(`تم رصد ${seconds} ثوانٍ داخل لوحة المفاتيح`);
  }, []);

  const executeFinalBlinkAction = useCallback(
    (seconds: number) => {
      const now = Date.now();
      const last = lastExecutionRef.current;

      if (last.seconds === seconds && now - last.time < ACTION_COOLDOWN_MS) {
        return;
      }

      lastExecutionRef.current = { seconds, time: now };

      if (mode === "keyboard") {
        executeKeyboardMode(seconds);
        return;
      }

      executeNormalMode(seconds);
    },
    [executeKeyboardMode, executeNormalMode, mode]
  );

  const scheduleFinalAction = useCallback(
    (seconds: number) => {
      pendingSecondsRef.current = seconds;

      if (pendingTimerRef.current) {
        window.clearTimeout(pendingTimerRef.current);
      }

      pendingTimerRef.current = window.setTimeout(() => {
        if (pendingSecondsRef.current === seconds) {
          executeFinalBlinkAction(seconds);
          pendingSecondsRef.current = null;
        }
      }, ACTION_DEBOUNCE_MS);
    },
    [executeFinalBlinkAction]
  );

  useEffect(() => {
    const onBlinkEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ seconds?: number }>;
      const seconds = customEvent.detail?.seconds;

      if (typeof seconds === "number") {
        scheduleFinalAction(seconds);
      }
    };

    const blinkControl = {
      select: () => scheduleFinalAction(3),
      navigate: () => scheduleFinalAction(2),
      back: () => scheduleFinalAction(4),
      keyboardMode: () => setMode("keyboard"),
      exitKeyboard: () => setMode("normal"),
      left: () => dispatchBlinkAction("left"),
      right: () => dispatchBlinkAction("right"),
      up: () => dispatchBlinkAction("up"),
      down: () => dispatchBlinkAction("down"),
    } satisfies BlinkControlApi;

    const w = window as Window & { blinkControl?: BlinkControlApi };
    w.blinkControl = blinkControl;

    window.addEventListener("blinkEvent", onBlinkEvent as EventListener);

    return () => {
      window.removeEventListener("blinkEvent", onBlinkEvent as EventListener);
      if (pendingTimerRef.current) {
        window.clearTimeout(pendingTimerRef.current);
      }
      if (w.blinkControl) delete w.blinkControl;
    };
  }, [scheduleFinalAction]);

  const registerButton = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    manualButtonsRef.current.add(el);
  }, []);

  const unregisterButton = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    manualButtonsRef.current.delete(el);
  }, []);

  const setTotalItems = useCallback((count: number) => {
    const safeCount = Math.max(0, count);
    setTotalItemsState(safeCount);
    setFocusedIndex((prev) => (safeCount > 0 ? Math.min(prev, safeCount - 1) : 0));
  }, []);

  const value = useMemo<BlinkContextValue>(
    () => ({
      focusedIndex,
      totalItems,
      lastEvent,
      mode,
      setMode,
      setTotalItems,
      registerButton,
      unregisterButton,
      focusNext,
      focusPrevious,
      triggerCurrent,
      setOnSelect: (fn) => {
        onSelectRef.current = fn;
      },
      setOnBack: (fn) => {
        onBackRef.current = fn;
      },
      setOnDelete: (fn) => {
        onDeleteRef.current = fn;
      },
      setOnSend: (fn) => {
        onSendRef.current = fn;
      },
      setOnSpace: (fn) => {
        onSpaceRef.current = fn;
      },
    }),
    [
      focusedIndex,
      totalItems,
      lastEvent,
      mode,
      setMode,
      setTotalItems,
      registerButton,
      unregisterButton,
      focusNext,
      focusPrevious,
      triggerCurrent,
    ]
  );

  return <BlinkContext.Provider value={value}>{children}</BlinkContext.Provider>;
}

export function useBlink() {
  return useContext(BlinkContext);
}