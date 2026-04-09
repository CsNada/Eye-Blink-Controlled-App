import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBlink } from '../contexts/BlinkContext';
import { cn } from './ui/utils';

interface MessageKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  className?: string;
}

const englishChars = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ' ', '.', ',', '!', '?', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

const arabicChars = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
  ' ', '.', '،', '!', '؟', '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'
];

export function MessageKeyboard({ value, onChange, onSend, className }: MessageKeyboardProps) {
  const { language, t } = useLanguage();
  const { simulateBlink } = useBlink();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [keyboardLang, setKeyboardLang] = useState<'en' | 'ar'>('ar');
  const [blinkStartTime, setBlinkStartTime] = useState<number | null>(null);
  const [blinkDuration, setBlinkDuration] = useState(0);

  const chars = keyboardLang === 'en' ? englishChars : arabicChars;
  // Add special buttons: Delete and Send
  const totalItems = chars.length + 2; // +2 for Delete and Send buttons

  // Auto-scanning every 2 seconds
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setHighlightedIndex(prev => (prev + 1) % totalItems);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [isScanning, totalItems]);

  // Listen for blink events via window.blinkControl API
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // For testing: Space = 2s blink, Enter = 5s blink
      if (e.key === ' ') {
        handleSelect();
      } else if (e.key === 'Enter') {
        handleSendBlink();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [highlightedIndex, chars, value]);

  const handleSelect = () => {
    if (highlightedIndex < chars.length) {
      // Regular character
      onChange(value + chars[highlightedIndex]);
    } else if (highlightedIndex === chars.length) {
      // Delete button
      onChange(value.slice(0, -1));
    } else if (highlightedIndex === chars.length + 1) {
      // This is the Send button, but it requires 5-second blink
      // Regular 2-second blink won't trigger send
    }
  };

  const handleSendBlink = () => {
    // Only send if Send button is highlighted
    if (highlightedIndex === chars.length + 1) {
      onSend();
    }
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Language Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setKeyboardLang('en')}
          className={cn(
            'px-4 py-1.5 rounded-lg text-sm transition-colors',
            keyboardLang === 'en' 
              ? 'bg-blue-500 text-white' 
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          English
        </button>
        <button
          onClick={() => setKeyboardLang('ar')}
          className={cn(
            'px-4 py-1.5 rounded-lg text-sm transition-colors',
            keyboardLang === 'ar' 
              ? 'bg-blue-500 text-white' 
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          العربية
        </button>
      </div>

      {/* Keyboard Grid */}
      <div className="grid grid-cols-9 gap-1.5 max-w-2xl mx-auto">
        {chars.map((char, index) => (
          <button
            key={index}
            className={cn(
              'aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300',
              highlightedIndex === index
                ? 'bg-blue-500 text-white scale-105 ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/30'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
            onClick={handleSelect}
          >
            {char === ' ' ? '␣' : char}
          </button>
        ))}
      </div>

      {/* Control Buttons: Delete, Pause/Resume, Send */}
      <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
        <button
          onClick={handleDelete}
          className={cn(
            'py-3 text-sm rounded-lg transition-all duration-300',
            highlightedIndex === chars.length
              ? 'bg-red-500 text-white scale-105 ring-2 ring-red-400/50 shadow-lg shadow-red-500/30'
              : 'bg-red-500/80 text-white hover:bg-red-500'
          )}
        >
          حذف
        </button>
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="py-3 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          {isScanning ? 'إيقاف' : 'استئناف'}
        </button>
        <button
          onClick={() => {
            if (highlightedIndex === chars.length + 1) {
              onSend();
            }
          }}
          className={cn(
            'py-3 text-sm rounded-lg font-semibold transition-all duration-300',
            highlightedIndex === chars.length + 1
              ? 'bg-emerald-500 text-white scale-105 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/30'
              : 'bg-emerald-500/80 text-white hover:bg-emerald-500'
          )}
        >
          إرسال
        </button>
      </div>

      <div className="text-center space-y-2 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-base font-bold text-foreground">
          تعليمات التحكم بالعين:
        </p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• أغمض عينيك لمدة ثانيتين للاختيار</p>
          <p>• أغمض عينيك لمدة 3 ثوانٍ للانتقال إلى العنصر التالي</p>
          <p>• أغمض عينيك لمدة 4 ثوانٍ للرجوع</p>
          <p>• أغمض عينيك لمدة 5 ثوانٍ لإرسال الرسالة</p>
          <p>• أغمض عينيك لمدة ثانية واحدة للحذف</p>
        </div>
      </div>
    </div>
  );
}