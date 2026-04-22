import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBlink } from "../contexts/BlinkContext";
import { useLanguage } from "../contexts/LanguageContext";

interface ScanningKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSend?: () => void;
  onExit?: () => void;
  className?: string;
}

const englishRows: string[][] = [
  ["English", "عربي"],
  ["A", "B", "C", "D", "E", "F", "G"],
  ["H", "I", "J", "K", "L", "M", "N"],
  ["O", "P", "Q", "R", "S", "T", "U"],
  ["V", "W", "X", "Y", "Z", ".", ","],
  ["0", "1", "2", "3", "4", "5", "6"],
  ["7", "8", "9", "@", "#", "?", "!"],
];

const arabicRows: string[][] = [
  ["English", "عربي"],
  ["ا", "ب", "ت", "ث", "ج", "ح", "خ"],
  ["د", "ذ", "ر", "ز", "س", "ش", "ص"],
  ["ض", "ط", "ظ", "ع", "غ", "ف", "ق"],
  ["ك", "ل", "م", "ن", "ه", "و", "ي"],
  [",", ".", "!", "؟", "١", "٢", "٣"],
  ["٤", "٥", "٦", "٧", "٨", "٩", " "],
];

const bottomActions = [
  { label: "مسافة", value: "space" },
  { label: "حذف حرف", value: "delete" },
] as const;

export function ScanningKeyboard({
  value,
  onChange,
  onSend,
  onExit,
  className,
}: ScanningKeyboardProps) {
  const { t } = useLanguage();
  const blink = useBlink();
  const setMode = blink?.setMode ?? (() => {});
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [keyboardLang, setKeyboardLang] = useState<"en" | "ar">("en");
  const [rowIndex, setRowIndex] = useState(1);
  const [colIndex, setColIndex] = useState(0);

  const cells = useMemo(
    () => (keyboardLang === "en" ? englishRows : arabicRows),
    [keyboardLang]
  );

  const bottomRowIndex = cells.length;
  const currentRow = cells[rowIndex] ?? [];
  const currentCell = currentRow[colIndex];

  useEffect(() => {
    setRowIndex(1);
    setColIndex(0);
  }, [keyboardLang]);

  const moveLeft = () => {
    if (rowIndex === 0 || rowIndex === bottomRowIndex) {
      setColIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    setColIndex((prev) => Math.max(0, prev - 1));
  };

  const moveRight = () => {
    if (rowIndex === 0 || rowIndex === bottomRowIndex) {
      setColIndex((prev) => Math.min(1, prev + 1));
      return;
    }

    setColIndex((prev) =>
      Math.min((cells[rowIndex]?.length ?? 1) - 1, prev + 1)
    );
  };

  const moveUp = () => {
    if (rowIndex === bottomRowIndex) {
      setRowIndex(bottomRowIndex - 1);
      setColIndex((prev) => Math.min(prev, (cells[bottomRowIndex - 1]?.length ?? 1) - 1));
      return;
    }

    if (rowIndex === 1) {
      setRowIndex(0);
      setColIndex((prev) => Math.min(prev, 1));
      return;
    }

    if (rowIndex > 1) {
      setRowIndex((prev) => {
        const nextRow = Math.max(1, prev - 1);
        const nextLength = cells[nextRow]?.length ?? 1;
        setColIndex((prevCol) => Math.min(prevCol, nextLength - 1));
        return nextRow;
      });
    }
  };

  const moveDown = () => {
    if (rowIndex === 0) {
      setRowIndex(1);
      setColIndex(0);
      return;
    }

    if (rowIndex === bottomRowIndex) {
      return;
    }

    if (rowIndex === bottomRowIndex - 1) {
      setRowIndex(bottomRowIndex);
      setColIndex((prev) => Math.min(prev, 1));
      return;
    }

    setRowIndex((prev) => {
      const nextRow = Math.min(bottomRowIndex - 1, prev + 1);
      const nextLength = cells[nextRow]?.length ?? 1;
      setColIndex((prevCol) => Math.min(prevCol, nextLength - 1));
      return nextRow;
    });
  };

  const handleSelect = () => {
    if (rowIndex === 0) {
      if (currentCell === "English") {
        setKeyboardLang("en");
      } else if (currentCell === "عربي") {
        setKeyboardLang("ar");
      }
      setRowIndex(1);
      setColIndex(0);
      return;
    }

    if (rowIndex === bottomRowIndex) {
      const action = bottomActions[colIndex]?.value;

      if (action === "space") {
        onChange(value + " ");
      } else if (action === "delete") {
        onChange(value.slice(0, -1));
      }
      return;
    }

    if (!currentCell) return;

    if (currentCell === " ") {
      onChange(value + " ");
      return;
    }

    onChange(value + currentCell);
  };

  useEffect(() => {
    const handleBlink = (e: Event) => {
      const action = (e as CustomEvent<{ action?: string }>).detail?.action;

      if (action === "select") handleSelect();
      if (action === "left") moveLeft();
      if (action === "right") moveRight();
      if (action === "up") moveUp();
      if (action === "down") moveDown();

      if (action === "exit") {
        setMode("normal");
        onExit?.();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && rootRef.current.contains(target)) return;
      setMode("normal");
      onExit?.();
    };

    window.addEventListener("blinkAction", handleBlink as EventListener);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("blinkAction", handleBlink as EventListener);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onExit, setMode, value, rowIndex, colIndex, cells]);

  return (
    <div
      ref={rootRef}
      className={`space-y-4 rounded-2xl border bg-card p-4 shadow-sm ${className ?? ""}`}
    >
      {/* <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setKeyboardLang("en");
            setRowIndex(1);
            setColIndex(0);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            keyboardLang === "en"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          English
        </button>

        <button
          type="button"
          onClick={() => {
            setKeyboardLang("ar");
            setRowIndex(1);
            setColIndex(0);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            keyboardLang === "ar"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          العربية
        </button>

        <div className="ms-auto text-sm font-medium text-muted-foreground">
          {t("keyboardMode") ?? "لوحة المفاتيح"}
        </div>
      </div> */}

      <div className="space-y-2">
        {cells.map((row, rIndex) => {
          if (rIndex === 0) {
            return (
              <div key={rIndex} className="grid grid-cols-2 gap-2">
                {row.map((cell, cIndex) => {
                  const active = rIndex === rowIndex && cIndex === colIndex;

                  return (
                    <button
                      key={`${rIndex}-${cIndex}`}
                      type="button"
                      data-blink-index={1000 + cIndex}
                      onClick={() => {
                        if (cell === "English") setKeyboardLang("en");
                        if (cell === "عربي") setKeyboardLang("ar");
                        setRowIndex(1);
                        setColIndex(0);
                      }}
                      className={`min-h-[58px] rounded-lg border text-sm font-semibold transition-all ${
                        active
                          ? "bg-primary text-primary-foreground border-primary scale-[1.02] shadow-md"
                          : "bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {cell}
                    </button>
                  );
                })}
              </div>
            );
          }

          return (
            <div key={rIndex} className="grid grid-cols-7 gap-2">
              {row.map((cell, cIndex) => {
                const active = rIndex === rowIndex && cIndex === colIndex;
                const blinkIndex = 1100 + rIndex * 10 + cIndex;

                return (
                  <button
                    key={`${rIndex}-${cIndex}`}
                    type="button"
                    data-blink-index={blinkIndex}
                    onClick={() => {
                      setRowIndex(rIndex);
                      setColIndex(cIndex);

                      if (cell === " ") {
                        onChange(value + " ");
                      } else {
                        onChange(value + cell);
                      }
                    }}
                    className={`min-h-[58px] rounded-lg border text-sm font-semibold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground border-primary scale-[1.02] shadow-md"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {cell === " " ? "␣" : cell}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {bottomActions.map((item, index) => {
          const active = rowIndex === bottomRowIndex && colIndex === index;

          return (
            <button
              key={item.value}
              type="button"
              data-blink-index={2000 + index}
              onClick={() => {
                setRowIndex(bottomRowIndex);
                setColIndex(index);

                if (item.value === "space") {
                  onChange(value + " ");
                } else if (item.value === "delete") {
                  onChange(value.slice(0, -1));
                }
              }}
              className={`min-h-[58px] rounded-lg border text-sm font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-foreground border-primary scale-[1.02] shadow-md"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="pt-2 text-sm text-muted-foreground">
        <div className="mb-2 font-medium">
          {t("blinkInstructions") ?? "تعليمات التحكم بالعين"}
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            "1 ثانية: اختيار",
            "2 ثوانٍ: يسار",
            "3 ثوانٍ: يمين",
            "4 ثوانٍ: أعلى",
            "5 ثوانٍ: أسفل",
            "6 ثوانٍ: خروج",
          ].map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}