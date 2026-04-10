import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { cn } from "./ui/utils";

interface MessageKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  className?: string;
}

const englishChars = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  " ", ".", ",", "!", "?", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
];

const arabicChars = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش",
  "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي",
  " ", ".", "،", "!", "؟", "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩",
];

type BlinkAction = "select" | "next" | "back" | "delete" | "send" | "space";

export function MessageKeyboard({
  value,
  onChange,
  onSend,
  className,
}: MessageKeyboardProps) {
  const { t } = useLanguage();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [keyboardLang, setKeyboardLang] = useState<"en" | "ar">("ar");

  const chars = useMemo(
    () => (keyboardLang === "en" ? englishChars : arabicChars),
    [keyboardLang]
  );

  const totalItems = chars.length + 3;

  useEffect(() => {
    setHighlightedIndex((prev) => Math.min(prev, totalItems - 1));
  }, [totalItems]);

  const handleSelect = () => {
    if (highlightedIndex < chars.length) {
      onChange(value + chars[highlightedIndex]);
      return;
    }

    if (highlightedIndex === chars.length) {
      onChange(value.slice(0, -1));
      return;
    }

    if (highlightedIndex === chars.length + 1) {
      onChange(value + " ");
      return;
    }

    if (highlightedIndex === chars.length + 2) {
      onSend();
    }
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  const handleSpace = () => {
    onChange(value + " ");
  };

  const handleSend = () => {
    onSend();
  };

  useEffect(() => {
    const handleBlinkAction = (event: Event) => {
      const customEvent = event as CustomEvent<{ action?: BlinkAction }>;
      const action = customEvent.detail?.action;

      if (!action) return;
      if (!rootRef.current?.contains(document.activeElement)) return;

      if (action === "next") {
        setHighlightedIndex((prev) => (prev + 1) % totalItems);
        return;
      }

      if (action === "select") {
        handleSelect();
        return;
      }

      if (action === "delete") {
        handleDelete();
        return;
      }

      if (action === "space") {
        handleSpace();
        return;
      }

      if (action === "send") {
        handleSend();
      }
    };

    window.addEventListener("blinkAction", handleBlinkAction as EventListener);
    return () => window.removeEventListener("blinkAction", handleBlinkAction as EventListener);
  }, [highlightedIndex, totalItems, value, onSend]);

  return (
    <div ref={rootRef} className={cn("space-y-3", className)}>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setKeyboardLang("en")}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm transition-colors",
            keyboardLang === "en"
              ? "bg-blue-500 text-white"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          English
        </button>

        <button
          onClick={() => setKeyboardLang("ar")}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm transition-colors",
            keyboardLang === "ar"
              ? "bg-blue-500 text-white"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          العربية
        </button>
      </div>

      <div className="grid grid-cols-9 gap-1.5 max-w-2xl mx-auto">
        {chars.map((char, index) => (
          <button
            key={`${keyboardLang}-${index}`}
            onClick={() => {
              setHighlightedIndex(index);
              onChange(value + char);
            }}
            className={cn(
              "aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300",
              highlightedIndex === index
                ? "bg-blue-500 text-white scale-105 ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/30"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {char === " " ? "␣" : char}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
        <button
          onClick={handleDelete}
          className={cn(
            "py-3 text-sm rounded-lg transition-all duration-300",
            highlightedIndex === chars.length
              ? "bg-red-500 text-white scale-105 ring-2 ring-red-400/50 shadow-lg shadow-red-500/30"
              : "bg-red-500/80 text-white hover:bg-red-500"
          )}
        >
          حذف
        </button>

        <button
          onClick={handleSpace}
          className={cn(
            "py-3 text-sm rounded-lg transition-all duration-300",
            highlightedIndex === chars.length + 1
              ? "bg-amber-500 text-white scale-105 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/30"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          مسافة
        </button>

        <button
          onClick={handleSend}
          className={cn(
            "py-3 text-sm rounded-lg font-semibold transition-all duration-300",
            highlightedIndex === chars.length + 2
              ? "bg-emerald-500 text-white scale-105 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/30"
              : "bg-emerald-500/80 text-white hover:bg-emerald-500"
          )}
        >
          إرسال
        </button>
      </div>

      <div className="text-center space-y-2 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-base font-bold text-foreground">تعليمات التحكم بالعين:</p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• أغمض عينيك لمدة ثانيتين للاختيار</p>
          <p>• أغمض عينيك لمدة 3 ثوانٍ للانتقال إلى العنصر التالي</p>
          <p>• أغمض عينيك لمدة 4 ثوانٍ للرجوع</p>
          <p>• أغمض عينيك لمدة 5 ثوانٍ للإرسال</p>
          <p>• أغمض عينيك لمدة ثانية واحدة للحذف</p>
          <p>• أغمض عينيك لمدة 6 ثوانٍ لإضافة مسافة</p>
        </div>
      </div>
    </div>
  );
}