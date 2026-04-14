import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type BlinkAction = "select" | "next" | "back" | "delete" | "send" | "space";

type BlinkControlApi = {
  select: () => void;
  navigate: () => void;
  back: () => void;
  delete: () => void;
  send: () => void;
  space: () => void;
};

type BlinkContextValue = {
  focusedIndex: number;
  lastEvent: string | null;
  registerButton: (el: HTMLElement | null) => void;
  unregisterButton: (el: HTMLElement | null) => void;
  focusNext: () => void;
  focusPrevious: () => void;
  triggerCurrent: () => void;
};

const BlinkContext = createContext<BlinkContextValue | undefined>(undefined);

const FOCUS_SELECTOR =
  "button:not([disabled]), a[href], [role='button']:not([aria-disabled='true']), [data-blink-focusable='true']";

const CONFIRMATION_DELAY_MS = 1200;

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

function isTextTarget(
  el: Element | null
): el is HTMLInputElement | HTMLTextAreaElement {
  if (!el) return false;
  return (
    (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
    !el.disabled &&
    !el.readOnly
  );
}

function setNativeValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string
) {
  const proto =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;

  const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
  descriptor?.set?.call(element, value);
}

function emitInputEvents(element: HTMLInputElement | HTMLTextAreaElement) {
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function dispatchBlinkAction(action: BlinkAction) {
  window.dispatchEvent(
    new CustomEvent("blinkAction", {
      detail: { action },
    })
  );
}

export function BlinkProvider({ children }: { children: React.ReactNode }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [lastEvent, setLastEvent] = useState<string | null>("جاهز للتحكم بالعين");

  const manualButtonsRef = useRef<Set<HTMLElement>>(new Set());
  const pendingSecondsRef = useRef<number | null>(null);
  const pendingTimerRef = useRef<number | null>(null);

  const collectFocusableElements = useCallback(() => {
  if (typeof document === "undefined") return [];

  const domElements = Array.from(
    document.querySelectorAll<HTMLElement>(FOCUS_SELECTOR)
  ).filter(isVisible);

  const manualElements = Array.from(manualButtonsRef.current).filter(isVisible);

  const merged = [...manualElements, ...domElements];
  const seen = new Set<HTMLElement>();

  return merged.filter((el) => {
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
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
        box-shadow:
          0 0 0 6px rgba(59, 130, 246, 0.18),
          0 14px 34px rgba(37, 99, 235, 0.25) !important;
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

    setFocusedIndex((prev) => (prev + 1) % elements.length);
  }, [collectFocusableElements]);

  const focusPrevious = useCallback(() => {
    const elements = collectFocusableElements();
    if (!elements.length) return;

    setFocusedIndex((prev) => (prev - 1 + elements.length) % elements.length);
  }, [collectFocusableElements]);

const triggerCurrent = useCallback(() => {
  const elements = collectFocusableElements();
  if (!elements.length) {
    setLastEvent("لا توجد عناصر قابلة للتحديد الآن");
    return;
  }

  const current = elements[focusedIndex] ?? elements[0];
  if (!current) return;

  try {
    current.focus({ preventScroll: true });
  } catch {
    current.focus();
  }

  current.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setLastEvent("تم تنفيذ الاختيار");
}, [collectFocusableElements, focusedIndex]);

  const deleteFromActiveField = useCallback(() => {
    const active = document.activeElement;

    if (!isTextTarget(active)) return false;

    const { selectionStart, selectionEnd, value } = active;
    const start = selectionStart ?? value.length;
    const end = selectionEnd ?? value.length;

    let nextValue = value;
    let nextCaret = start;

    if (start !== end) {
      nextValue = value.slice(0, start) + value.slice(end);
      nextCaret = start;
    } else if (start > 0) {
      nextValue = value.slice(0, start - 1) + value.slice(end);
      nextCaret = start - 1;
    }

    setNativeValue(active, nextValue);
    emitInputEvents(active);

    try {
      active.setSelectionRange(nextCaret, nextCaret);
    } catch {
      // ignore
    }

    return true;
  }, []);

  const insertSpaceToActiveField = useCallback(() => {
    const active = document.activeElement;

    if (!isTextTarget(active)) return false;

    const { selectionStart, selectionEnd, value } = active;
    const start = selectionStart ?? value.length;
    const end = selectionEnd ?? value.length;

    const nextValue = value.slice(0, start) + " " + value.slice(end);
    const nextCaret = start + 1;

    setNativeValue(active, nextValue);
    emitInputEvents(active);

    try {
      active.setSelectionRange(nextCaret, nextCaret);
    } catch {
      // ignore
    }

    return true;
  }, []);

  const sendFromActiveField = useCallback(() => {
    const active = document.activeElement;

    if (isTextTarget(active)) {
      const form = active.closest("form") as HTMLFormElement | null;
      if (form?.requestSubmit) {
        form.requestSubmit();
        return true;
      }

      active.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      active.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
      return true;
    }

    return false;
  }, []);

  const executeFinalBlinkAction = useCallback(
    (seconds: number) => {
      if (seconds === 1) {
        dispatchBlinkAction("delete");
        if (deleteFromActiveField()) {
          setLastEvent("تم الحذف");
        } else {
          setLastEvent("أمر الحذف غير متاح هنا");
        }
        return;
      }

      if (seconds === 2) {
        dispatchBlinkAction("select");
        triggerCurrent();
        return;
      }

      if (seconds === 3) {
        dispatchBlinkAction("next");
        focusNext();
        setLastEvent("تم الانتقال إلى العنصر التالي");
        return;
      }

      if (seconds === 4) {
        dispatchBlinkAction("back");
        window.history.back();
        setLastEvent("تم الرجوع");
        return;
      }

      if (seconds === 5) {
        dispatchBlinkAction("send");
        if (sendFromActiveField()) {
          setLastEvent("تم الإرسال");
        } else {
          setLastEvent("أمر الإرسال غير متاح هنا");
        }
        return;
      }

      if (seconds === 6) {
        dispatchBlinkAction("space");
        if (insertSpaceToActiveField()) {
          setLastEvent("تمت إضافة مسافة");
        } else {
          setLastEvent("أمر المسافة غير متاح هنا");
        }
        return;
      }

      setLastEvent(`تم رصد ${seconds} ثوانٍ`);
    },
    [deleteFromActiveField, focusNext, insertSpaceToActiveField, sendFromActiveField, triggerCurrent]
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
      }, CONFIRMATION_DELAY_MS);
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
      select: () => scheduleFinalAction(2),
      navigate: () => scheduleFinalAction(3),
      back: () => scheduleFinalAction(4),
      delete: () => scheduleFinalAction(1),
      send: () => scheduleFinalAction(5),
      space: () => scheduleFinalAction(6),
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

  const value = useMemo<BlinkContextValue>(
    () => ({
      focusedIndex,
      lastEvent,
      registerButton,
      unregisterButton,
      focusNext,
      focusPrevious,
      triggerCurrent,
    }),
    [
      focusedIndex,
      lastEvent,
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