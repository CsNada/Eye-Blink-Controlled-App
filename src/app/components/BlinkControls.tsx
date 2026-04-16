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
          { label: "1", text: "اختيار", icon: MousePointerClick },
          { label: "2", text: "يسار", icon: ChevronLeft },
          { label: "3", text: "يمين", icon: ChevronRight },
          { label: "4", text: "أعلى", icon: ChevronUp },
          { label: "5", text: "أسفل", icon: ChevronDown },
          { label: "6", text: "خروج", icon: LogOut },
        ]
      : [
          { label: "2", text: "التالي", icon: ChevronRight },
          { label: "3", text: "اختيار", icon: MousePointerClick },
          { label: "4", text: "رجوع", icon: ArrowLeft },
        ];

  return (
    <div className={className}>
      <div className="fixed bottom-0 left-0 right-0 z-90 bg-gradient-to-t from-background via-background to-transparent pb-safe pointer-events-none">
        <div className="container mx-auto px-4 pb-4">
          {lastEvent && (
            <div className="mb-3 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/90 px-4 py-2 shadow-lg backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full animate-pulse bg-primary" />
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
                  className="pointer-events-auto rounded-2xl border bg-card/95 p-3 shadow-md backdrop-blur-sm text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.label}
                    </span>
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

          {(showDeleteButton || showSendButton) && (
            <div className="mt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              {showDeleteButton && <span>حذف</span>}
              {showSendButton && <span>إرسال</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}