import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const BlinkContext = createContext(null);

export function BlinkProvider({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const buttonsRef = useRef([]);

  // تسجيل الأزرار
  const registerButton = (el) => {
    if (el && !buttonsRef.current.includes(el)) {
      buttonsRef.current.push(el);
    }
  };

  // 🔁 التنقل التلقائي
  useEffect(() => {
    const interval = setInterval(() => {
      if (buttonsRef.current.length === 0) return;

      setCurrentIndex((prev) => {
        return (prev + 1) % buttonsRef.current.length;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 👁️ تنفيذ أوامر العين
  useEffect(() => {
    const handleBlink = (e) => {
      const seconds = e.detail.seconds;
      const currentButton = buttonsRef.current[currentIndex];

      const activeElement = document.activeElement;
      const isTyping =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA");

      // 👁️ اختيار
      if (seconds === 2) {
        currentButton?.click();
      }

      // 👁️ تصفح / ⌨️ مسافة
      if (seconds === 3) {
        if (isTyping) {
          activeElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: " " })
          );
        } else {
          window.scrollBy({ top: 200, behavior: "smooth" });
        }
      }

      // 👁️ رجوع
      if (seconds === 4) {
        window.history.back();
      }

      // ⌨️ حذف
      if (seconds === 1 && isTyping) {
        activeElement.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Backspace" })
        );
      }

      // ⌨️ إرسال
      if (seconds === 5 && isTyping) {
        activeElement.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter" })
        );
      }
    };

    window.addEventListener("blinkEvent", handleBlink);
    return () => window.removeEventListener("blinkEvent", handleBlink);
  }, [currentIndex]);

  return (
    <BlinkContext.Provider value={{ registerButton, currentIndex }}>
      {children}
    </BlinkContext.Provider>
  );
}

export function useBlink() {
  return useContext(BlinkContext);
}