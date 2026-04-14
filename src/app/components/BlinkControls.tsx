import React from "react";
import { useBlink } from "../contexts/BlinkContext";
import { MousePointer2, Navigation, ArrowLeft, Trash2, Send } from "lucide-react";

interface BlinkControlsProps {
  showDeleteButton?: boolean;
  showSendButton?: boolean;
}

export function BlinkControls({
  showDeleteButton = true,
  showSendButton = true,
}: BlinkControlsProps) {
  const blink = useBlink();
  const lastEvent = blink?.lastEvent ?? null;

  const getGridCols = () => {
    if (showDeleteButton && showSendButton) return "grid-cols-5";
    if (showDeleteButton || showSendButton) return "grid-cols-4";
    return "grid-cols-3";
  };

  return (
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

        <div className={`grid gap-3 ${getGridCols()}`}>
          {showDeleteButton && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-100 to-red-50 shadow-md">
              <div className="flex min-h-[80px] flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-base font-bold text-red-700">1 ثانية</div>
                  <div className="text-sm font-medium text-red-600">حذف</div>
                </div>
              </div>
            </div>
          )}

          <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
            <div className="flex min-h-[80px] flex-col items-center justify-center gap-2 p-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <MousePointer2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-base font-bold text-blue-700">2 ثانيتان</div>
                <div className="text-sm font-medium text-blue-600">اختيار</div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-md">
            <div className="flex min-h-[80px] flex-col items-center justify-center gap-2 p-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Navigation className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-base font-bold text-emerald-700">3 ثوانٍ</div>
                <div className="text-sm font-medium text-emerald-600">التالي</div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-100 to-amber-50 shadow-md">
            <div className="flex min-h-[80px] flex-col items-center justify-center gap-2 p-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <ArrowLeft className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-base font-bold text-amber-700">4 ثوانٍ</div>
                <div className="text-sm font-medium text-amber-600">رجوع</div>
              </div>
            </div>
          </div>

          {showSendButton && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-100 to-violet-50 shadow-md">
              <div className="flex min-h-[80px] flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <Send className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-base font-bold text-violet-700">5 ثوانٍ</div>
                  <div className="text-sm font-medium text-violet-600">إرسال</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-border/60 bg-card/85 px-4 py-2 text-center shadow-lg backdrop-blur-sm">
          <p className="text-base font-semibold text-foreground">تعليمات التحكم بالعين</p>
          <p className="mt-1 text-sm text-muted-foreground">
            أغمض عينيك للمدة المطلوبة لتنفيذ الأمر المناسب
          </p>
        </div>
      </div>
    </div>
  );
}