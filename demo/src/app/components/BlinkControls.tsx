import React from 'react';
import { useBlink } from '../contexts/BlinkContext';
import { MousePointer2, Navigation, ArrowLeft, Trash2, Send } from 'lucide-react';

interface BlinkControlsProps {
  showDeleteButton?: boolean;
  showSendButton?: boolean;
}

export function BlinkControls({ showDeleteButton = false, showSendButton = false }: BlinkControlsProps) {
  const { lastEvent } = useBlink();

  // Calculate grid columns based on which buttons are shown
  const getGridCols = () => {
    if (showDeleteButton && showSendButton) return 'grid-cols-5';
    if (showDeleteButton || showSendButton) return 'grid-cols-4';
    return 'grid-cols-3';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-transparent pb-safe pointer-events-none">
      <div className="container mx-auto px-4 pb-4">
        {/* Last Event Indicator */}
        {lastEvent && (
          <div className="mb-3 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-sm px-4 py-2 shadow-lg border border-primary/20">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                {lastEvent}
              </span>
            </div>
          </div>
        )}

        {/* Control Indicators (Visual Only - Not Clickable) */}
        <div className={`grid gap-3 ${getGridCols()}`}>
          {/* 1s Delete Indicator */}
          {showDeleteButton && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-100 to-red-50 border-2 border-red-200 shadow-md">
              <div className="flex h-full min-h-[85px] flex-col items-center justify-center gap-2 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-red-700">ثانية واحدة</div>
                  <div className="text-sm font-medium text-red-600">حذف</div>
                </div>
              </div>
            </div>
          )}

          {/* 2s Select Indicator */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 shadow-md">
            <div className="flex h-full min-h-[85px] flex-col items-center justify-center gap-2 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <MousePointer2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-blue-700">ثانيتين</div>
                <div className="text-sm font-medium text-blue-600">اختيار</div>
              </div>
            </div>
          </div>

          {/* 3s Navigate Indicator */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 border-2 border-sky-200 shadow-md">
            <div className="flex h-full min-h-[85px] flex-col items-center justify-center gap-2 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
                <Navigation className="h-5 w-5 text-sky-600" />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-sky-700">3 ثوانٍ</div>
                <div className="text-sm font-medium text-sky-600">انتقال</div>
              </div>
            </div>
          </div>

          {/* 4s Back Indicator */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-slate-200 shadow-md">
            <div className="flex h-full min-h-[85px] flex-col items-center justify-center gap-2 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-slate-700">4 ثوانٍ</div>
                <div className="text-sm font-medium text-slate-600">رجوع</div>
              </div>
            </div>
          </div>

          {/* 5s Send Indicator */}
          {showSendButton && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 border-2 border-emerald-200 shadow-md">
              <div className="flex h-full min-h-[85px] flex-col items-center justify-center gap-2 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Send className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-emerald-700">5 ثوانٍ</div>
                  <div className="text-sm font-medium text-emerald-600">إرسال</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Improved Info Text - Larger and Clearer */}
        <div className="mt-4 space-y-2 text-center">
          <p className="text-base font-semibold text-foreground">
            تعليمات التحكم بالعين
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>أغمض عينيك للمدة المطلوبة للقيام بالإجراء</p>
          </div>
        </div>
      </div>
    </div>
  );
}