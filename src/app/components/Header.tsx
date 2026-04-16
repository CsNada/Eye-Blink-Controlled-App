import React from "react";
import { useNavigate, useLocation } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Globe, ArrowLeft } from "lucide-react";
import logoImage from "../../imports/PHOTO-2026-04-02-19-00-15-1.jpeg";
import { FocusableButton } from "./FocusableButton";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-100 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {!isHome && (
              <FocusableButton
                index={0}
                onClick={() => navigate("/", { replace: false })}
                variant="outline"
                className="h-10 w-10 min-h-10 rounded-xl px-0"
                aria-label="رجوع"
              >
                <ArrowLeft className="h-4 w-4" />
              </FocusableButton>
            )}

            <img
              src={logoImage}
              alt="Logo"
              className="h-10 w-10 rounded-xl object-cover shadow-sm"
            />

            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">تطبيق التحكم بالعين</h1>
              <p className="text-xs text-muted-foreground">استخدم رمش العين للتحكم</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FocusableButton
              index={1}
              onClick={toggleLanguage}
              variant="outline"
              className="h-10 min-h-10 px-3 rounded-xl"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{language === "en" ? "عربي" : "EN"}</span>
            </FocusableButton>

            <FocusableButton
              index={2}
              onClick={toggleTheme}
              variant="outline"
              className="h-10 min-h-10 px-3 rounded-xl"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </FocusableButton>
          </div>
        </div>
      </div>
    </header>
  );
}