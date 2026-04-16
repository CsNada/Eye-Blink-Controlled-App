import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBlink } from "../contexts/BlinkContext";
import { useLanguage } from "../contexts/LanguageContext";

interface MessageKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onExit?: () => void;
  className?: string;
}

type KeyCell =
  | { type: "char"; value: string }
  | { type: "action"; value: "delete" | "space" | "send" | "exit"; label: string };

const englishRows: string[][] = [
  ["A", "B", "C", "D", "E", "F"],
  ["G", "H", "I", "J", "K", "L"],
  ["M", "N", "O", "P", "Q", "R"],
  ["S", "T", "U", "V", "W", "X"],
  ["Y", "Z", " ", ".", ",", "?"],
  ["0", "1", "2", "3", "4", "5"],
  ["6", "7", "8", "9", "@", "#"],
];

const arabicRows: string[][] = [
  ["ا", "ب", "ت", "ث", "ج", "ح"],
  ["خ", "د", "ذ", "ر", "ز", "س"],
  ["ش", "ص", "ض", "ط", "ظ", "ع"],
  ["غ", "ف", "ق", "ك", "ل", "م"],
  ["ن", "ه", "و", "ي", " ", "،"],
  [".", "!", "؟", "٠", "١", "٢"],
  ["٣", "٤", "٥", "٦", "٧", "٨"],
];

function buildCells(language: "en" | "ar"): KeyCell[][] {
  const rows = language === "en" ? englishRows : arabicRows;

  return [
    ...rows.map((row) => row.map((char) => ({ type: "char", value: char } as const))),
    [
      { type: "action", value: "delete", label: "حذف" },
      { type: "action", value: "space", label: "مسافة" },
      { type: "action", value: "send", label: "إرسال" },
      { type: "action", value: "exit", label: "خروج" },
    ],
  ];
}

export function MessageKeyboard({
  value,
  onChange,
  onSend,
  onExit,
  className,
}: MessageKeyboardProps) {
  const { t } = useLanguage();
  const blink = useBlink();
  const setMode = blink?.setMode ?? (() => {});
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [keyboardLang, setKeyboardLang] = useState<"en" | "ar">("ar");
  const [rowIndex, setRowIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);

  const cells = useMemo(() => buildCells(keyboardLang), [keyboardLang]);
  const currentRow = cells[rowIndex] ?? [];
  const currentCell = currentRow[colIndex];

  useEffect(() => {
    setRowIndex(0);
    setColIndex(0);
  }, [keyboardLang]);

  useEffect(() => {
    const maxRow = Math.max(0, cells.length - 1);
    const nextRow = Math.min(rowIndex, maxRow);
    const nextCol = Math.min(colIndex, (cells[nextRow]?.length ?? 1) - 1);

    if (nextRow !== rowIndex) setRowIndex(nextRow);
    if (nextCol !== colIndex) setColIndex(nextCol);
  }, [cells, rowIndex, colIndex]);

  const moveLeft = () => setColIndex((prev) => Math.max(0, prev - 1));
  const moveRight = () => setColIndex((prev) => Math.min((currentRow.length ?? 1) - 1, prev + 1));

  const moveUp = () => {
    setRowIndex((prevRow) => {
      const nextRow = Math.max(0, prevRow - 1);
      const nextLength = cells[nextRow]?.length ?? 1;
      setColIndex((prevCol) => Math.min(prevCol, nextLength - 1));
      return nextRow;
    });
  };

  const moveDown = () => {
    setRowIndex((prevRow) => {
      const nextRow = Math.min(cells.length - 1, prevRow + 1);
      const nextLength = cells[nextRow]?.length ?? 1;
      setColIndex((prevCol) => Math.min(prevCol, nextLength - 1));
      return nextRow;
    });
  };

  const handleSelect = () => {
    if (!currentCell) return;

    if (currentCell.type === "char") {
      onChange(value + currentCell.value);
      return;
    }

    if (currentCell.value === "delete") {
      onChange(value.slice(0, -1));
      return;
    }

    if (currentCell.value === "space") {
      onChange(value + " ");
      return;
    }

    if (currentCell.value === "send") {
      onSend();
      return;
    }

    if (currentCell.value === "exit") {
      setMode("normal");
      onExit?.();
    }
  };

  useEffect(() => {
    const handleBlinkAction = (event: Event) => {
      const customEvent = event as CustomEvent<{ action?: string }>;
      const action = customEvent.detail?.action;
      if (!action) return;

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

    window.addEventListener("blinkAction", handleBlinkAction as EventListener);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("blinkAction", handleBlinkAction as EventListener);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onExit, onSend, setMode, value, rowIndex, colIndex, cells]);

  return (
    <div
      ref={rootRef}
      data-keyboard-root="true"
      className={`w-full rounded-2xl border bg-card p-4 shadow-lg space-y-4 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-blink-index={1000}
            onClick={() => setKeyboardLang("en")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              keyboardLang === "en"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            English
          </button>

          <button
            type="button"
            data-blink-index={1001}
            onClick={() => setKeyboardLang("ar")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              keyboardLang === "ar"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            العربية
          </button>
        </div>

        <div className="text-sm text-muted-foreground">
          {t("keyboardMode") ?? "لوحة المفاتيح"}
        </div>
      </div>

      <div className="grid gap-2">
        {cells.map((row, rIndex) => (
          <div
            key={`${keyboardLang}-${rIndex}`}
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.max(row.length, 1)}, minmax(0, 1fr))`,
            }}
          >
            {row.map((cell, cIndex) => {
              const active = rIndex === rowIndex && cIndex === colIndex;
              const blinkIndex = 1100 + rIndex * 10 + cIndex;

              return (
                <button
                  key={`${rIndex}-${cIndex}-${cell.type}-${cell.value}`}
                  type="button"
                  data-blink-index={blinkIndex}
                  onClick={() => {
                    setRowIndex(rIndex);
                    setColIndex(cIndex);

                    if (cell.type === "char") {
                      onChange(value + cell.value);
                    } else if (cell.value === "delete") {
                      onChange(value.slice(0, -1));
                    } else if (cell.value === "space") {
                      onChange(value + " ");
                    } else if (cell.value === "send") {
                      onSend();
                    } else if (cell.value === "exit") {
                      setMode("normal");
                      onExit?.();
                    }
                  }}
                  className={`min-h-[58px] rounded-xl border text-base font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary scale-[1.02] shadow-md"
                      : "bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {cell.type === "char" ? (cell.value === " " ? "␣" : cell.value) : cell.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground leading-7">
        <div className="font-medium text-foreground mb-1">
          {t("blinkInstructions") ?? "تعليمات التحكم بالعين"}
        </div>
        <div className="grid gap-1 sm:grid-cols-2">
          {[
            "1 ثانية: اختيار الحرف",
            "2 ثوانٍ: يسار",
            "3 ثوانٍ: يمين",
            "4 ثوانٍ: أعلى",
            "5 ثوانٍ: أسفل",
            "6 ثوانٍ: خروج",
          ].map((item) => (
            <div key={item}>• {item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}