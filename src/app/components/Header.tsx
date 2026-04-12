import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Globe, ArrowLeft } from 'lucide-react';
import logoImage from '../../imports/PHOTO-2026-04-02-19-00-15-1.jpeg';
import { FocusableButton } from './FocusableButton';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!isHome && (
              <FocusableButton
                index={0}
                onClick={() => navigate('/', { replace: false })}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="رجوع"
              >
                <ArrowLeft className="h-4 w-4 text-blue-600" />
              </FocusableButton>
            )}

            <div className="flex items-center justify-center">
              <img
                src={logoImage}
                alt="Logo"
                className="h-12 w-12 object-contain"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                تطبيق التحكم بالعين
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                استخدم رمش العين للتحكم
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FocusableButton
              index={1}
              role="button" 
              onClick={toggleLanguage}
              className="flex h-10 min-w-10 items-center justify-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 px-3 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="تبديل اللغة"
            >
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="hidden sm:inline text-sm font-medium text-blue-700">
                {language === 'en' ? 'عربي' : 'EN'}
              </span>
            </FocusableButton>

            <FocusableButton
              index={2}
              role="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="تبديل الوضع"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-blue-600" />
              ) : (
                <Sun className="h-4 w-4 text-blue-600" />
              )}
            </FocusableButton>
          </div>
        </div>
      </div>
    </header>
  );
}