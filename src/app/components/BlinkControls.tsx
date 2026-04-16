import React from "react";
import { useBlink } from "../contexts/BlinkContext";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Keyboard,
  LogOut,
  MousePointerClick,
} from "lucide-react";

interface BlinkControlsProps {
  showDeleteButton?: boolean;
  showSendButton?: boolean;
  className?: string;
}

export function BlinkControls({
  showDeleteButton = true,
  showSendButton = true,
  className,
}: BlinkControlsProps) {
  const blink = useBlink();
  const lastEvent = blink?.lastEvent ?? null;
  const mode = blink?.mode ?? "normal";

  const items =
    mode === "keyboard"
      ? [
          { label: "1", text: "اختيار", icon: MousePointerClick, tone: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
          { label: "2", text: "يمين", icon: ChevronRight, tone: "bg-blue-500/10 text-blue-700 border-blue-200" },
          { label: "3", text: "يسار", icon: ChevronLeft, tone: "bg-cyan-500/10 text-cyan-700 border-cyan-200" },
          { label: "4", text: "أعلى", icon: ChevronUp, tone: "bg-violet-500/10 text-violet-700 border-violet-200" },
          { label: "5", text: "أسفل", icon: ChevronDown, tone: "bg-amber-500/10 text-amber-700 border-amber-200" },
          { label: "6", text: "خروج", icon: LogOut, tone: "bg-rose-500/10 text-rose-700 border-rose-200" },
        ]
      : [
          { label: "2", text: "التالي", icon: ChevronRight, tone: "bg-blue-500/10 text-blue-700 border-blue-200" },
          { label: "3", text: "اختيار", icon: MousePointerClick, tone: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
          { label: "4", text: "رجوع", icon: ArrowLeft, tone: "bg-rose-500/10 text-rose-700 border-rose-200" },
        ];

  return (
    <div className={className}>
      <div className="fixed bottom-0 left-0 right-0 z-90 pointer-events-none bg-gradient-to-t from-background via-background/95 to-transparent pb-safe">
        <div className="container mx-auto px-4 pb-4">
          {lastEvent && (
            <div className="mb-3 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full animate-pulse bg-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  {lastEvent}
                </span>
              </div>
            </div>
          )}

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.label}-${item.text}`}
                  className={`pointer-events-auto rounded-2xl border-2 bg-card/95 p-3 shadow-md backdrop-blur-sm text-center ${item.tone}`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <div className="text-sm font-medium">{item.text}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Keyboard className="h-3.5 w-3.5" />
            <span>{mode === "keyboard" ? "وضع لوحة المفاتيح" : "الوضع العادي"}</span>
          </div>

          {/* {(showDeleteButton || showSendButton) && (
            <div className="mt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              {showDeleteButton && <span>حذف</span>}
              {showSendButton && <span>إرسال</span>}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}