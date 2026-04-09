import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from './ui/utils';

interface ScanningKeyboardProps {
  value: string;
  onChange: (value: string) => void;
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

export function ScanningKeyboard({ value, onChange, className }: ScanningKeyboardProps) {
  const { language, t } = useLanguage();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [keyboardLang, setKeyboardLang] = useState<'en' | 'ar'>('en');

  const chars = keyboardLang === 'en' ? englishChars : arabicChars;

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setHighlightedIndex(prev => (prev + 1) % chars.length);
    }, 2000); // Changed from 3000 to 2000 (2 seconds)

    return () => clearInterval(interval);
  }, [isScanning, chars.length]);

  const handleSelect = () => {
    onChange(value + chars[highlightedIndex]);
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
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          {t('english')}
        </button>
        <button
          onClick={() => setKeyboardLang('ar')}
          className={cn(
            'px-4 py-1.5 rounded-lg text-sm transition-colors',
            keyboardLang === 'ar' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          {t('arabic')}
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

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        <button
          onClick={handleDelete}
          className="py-3 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
        >
          {t('deleteChar')}
        </button>
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="py-3 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          {isScanning ? 'Pause' : 'Resume'}
        </button>
      </div>
    </div>
  );
}