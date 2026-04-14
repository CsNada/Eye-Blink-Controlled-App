import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AutoScanButton } from '../components/AutoScanButton';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  BookOpen,
  FileText,
  Bell,
  MessageSquare,
  Sparkles,
  User,
  Monitor,
  Folder,
  Globe,
  GraduationCap,
} from 'lucide-react';

import { useEyeContext } from "../components/EyeContext";

export function HomePage() {

  // const { registerButton, currentIndex } = useBlink();
  const indexRef = React.useRef(Math.random()); // معرف فريد

  const { seconds } = useEyeContext();

  useEffect(() => {
    if (seconds >= 2) {
      console.log("⚠️ Page1 warning");
    }

    if (seconds >= 4) {
      console.log("🔥 Page1 action");
    }
  }, [seconds]);


  const navigate = useNavigate();
  const blinkContext = useBlink();
  const { language, t } = useLanguage();
  const [autoScanIndex, setAutoScanIndex] = useState(0);

  // Safely access context functions with fallbacks
  const setTotalItems = blinkContext?.setTotalItems ?? (() => { });
  const setOnSelect = blinkContext?.setOnSelect ?? (() => { });
  const setOnBack = blinkContext?.setOnBack ?? (() => { });

  // Define reminders based on language
  const REMINDERS = [
    {
      title: t('sundayLecture'),
      time: language === 'ar' ? '9:00 صباحاً' : '9:00 AM',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      title: t('studyTime'),
      time: language === 'ar' ? '2:00 مساءً' : '2:00 PM',
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      title: t('prayerTime'),
      time: language === 'ar' ? '5:30 مساءً' : '5:30 PM',
      gradient: 'from-amber-400 to-orange-500',
    },
  ];

  useEffect(() => {
    // Total items = quick actions (4 now: Notes, Messages, Reminders, Student Profile)
    setTotalItems(4);
  }, [setTotalItems]);

  // Auto-scanning for Quick Actions: cycles through items every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAutoScanIndex(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setOnSelect(() => {
      // Use auto-scan index for selection
      if (autoScanIndex === 0) {
        navigate('/notes');
      } else if (autoScanIndex === 1) {
        navigate('/messages');
      } else if (autoScanIndex === 2) {
        navigate('/reminders');
      } else if (autoScanIndex === 3) {
        navigate('/student-profile');
      }
    });
  }, [setOnSelect, autoScanIndex, navigate]);

  useEffect(() => {
    setOnBack(() => {
      // On home page, back does nothing
    });
  }, [setOnBack]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Background Enhancement - Soft Decorative Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.08]">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-300 to-sky-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="space-y-8 animate-in fade-in duration-500 relative z-10">
        {/* Welcome Section */}
        <Card className="overflow-hidden border-2 border-blue-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/50 relative backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-300/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-300/25 to-transparent rounded-full blur-2xl" />
          <div className="h-1.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-xl opacity-40 animate-pulse" />
                <Avatar className="h-16 w-16 relative border-3 border-white shadow-2xl ring-2 ring-blue-200/50">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xl font-bold">
                    {language === 'ar' ? 'م' : 'S'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">{t('welcome')}</h2>
                </div>
                <p className="text-muted-foreground text-base mb-2">
                  {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-blue-600/70 font-medium">{t('welcomeMessage')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UI Presentation Section - Dashboard */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            {t('dashboard')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Notes - Featured/Larger Card */}
            <Card role="button"
              tabIndex={4}
              className="overflow-hidden border-2 border-emerald-300/70 bg-gradient-to-br from-emerald-100/70 via-teal-50/60 to-white shadow-2xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.25)] transition-all duration-500 cursor-pointer group md:col-span-2 relative hover:scale-[1.02]"
              onClick={() => navigate('/notes')}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-300/40 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-teal-300/30 to-transparent rounded-full blur-xl" />
              <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 shadow-lg" />
              <CardContent className="p-8 relative">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-200 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ring-2 ring-emerald-300/50 group-hover:ring-emerald-400/70">
                    <FileText className="h-10 w-10 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-emerald-900">{t('educationalNotes')}</h4>
                    <p className="text-sm text-emerald-700 mt-2 font-medium">{t('educationalNotesSubtitle')}</p>
                    <p className="text-xs text-emerald-600/60 mt-2">{t('notesEncouragement')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card
              role="button"
              tabIndex={5}
              onClick={() => navigate('/messages')}
              className="overflow-hidden border-2 border-blue-300/60 shadow-xl hover:shadow-[0_15px_40px_rgba(59,130,246,0.2)] transition-all duration-500 cursor-pointer group relative hover:scale-[1.02] bg-gradient-to-br from-blue-100/60 via-cyan-50/40 to-white"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-300/30 to-transparent rounded-full blur-xl" />
              <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-md" />
              <CardContent className="p-5 relative">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ring-2 ring-blue-300/40 group-hover:ring-blue-400/60">
                    <MessageSquare className="h-8 w-8 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-900">{t('messages')}</h4>
                    <p className="text-sm text-blue-700/80 mt-1">{t('messagesSubtitle')}</p>
                    <p className="text-xs text-blue-600/60 mt-2">{t('stayConnected')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Profile */}
            <Card role="button"
              tabIndex={6}
              className="overflow-hidden border-2 border-purple-300/60 shadow-xl hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)] transition-all duration-500 cursor-pointer group relative hover:scale-[1.02] bg-gradient-to-br from-purple-100/60 via-pink-50/40 to-white"
              onClick={() => navigate('/student-profile')}
            >
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-300/30 to-transparent rounded-full blur-xl" />
              <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 shadow-md" />
              <CardContent className="p-5 relative">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ring-2 ring-purple-300/40 group-hover:ring-purple-400/60">
                    <User className="h-8 w-8 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-purple-900">{t('studentProfile')}</h4>
                    <p className="text-sm text-purple-700/80 mt-1">{t('studentProfileSubtitle')}</p>
                    <p className="text-xs text-purple-600/60 mt-2">{t('progressInspiring')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Educational Platforms Section */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {t('educationalPlatforms')}
          </h3>
          <p className="text-xs text-blue-600/60 mb-4 font-medium">{t('platformsSubtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card role="button"
              tabIndex={7}
              onClick={() => navigate('/educational-platforms')}
              className="overflow-hidden border-2 border-blue-200/70 bg-gradient-to-br from-blue-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] hover:border-blue-300 transition-all duration-500 hover:scale-105 relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-xl" />
              <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600" />
              <CardContent className="p-4 relative">
                <div className="text-center space-y-2">
                  <div className="text-3xl">📚</div>
                  <span className="text-xs font-bold text-blue-900 block">{t('baims')}</span>
                </div>
              </CardContent>
            </Card>

            <Card role="button"
              tabIndex={8}
              onClick={() => navigate('/educational-platforms')}
              className="overflow-hidden border-2 border-indigo-200/70 bg-gradient-to-br from-indigo-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)] hover:border-indigo-300 transition-all duration-500 hover:scale-105 relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-xl" />
              <div className="h-1.5 bg-gradient-to-r from-indigo-400 to-indigo-600" />
              <CardContent className="p-4 relative">
                <div className="text-center space-y-2">
                  <div className="text-3xl">🎓</div>
                  <span className="text-xs font-bold text-indigo-900 block">{t('ajdur')}</span>
                </div>
              </CardContent>
            </Card>

            <Card role="button"
              tabIndex={9}
              onClick={() => navigate('/educational-platforms')}
              className="overflow-hidden border-2 border-purple-200/70 bg-gradient-to-br from-purple-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] hover:border-purple-300 transition-all duration-500 hover:scale-105 relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-xl" />
              <div className="h-1.5 bg-gradient-to-r from-purple-400 to-purple-600" />
              <CardContent className="p-4 relative">
                <div className="text-center space-y-2">
                  <div className="text-3xl">👁️</div>
                  <span className="text-xs font-bold text-purple-900 block">{t('vision')}</span>
                </div>
              </CardContent>
            </Card>

            <Card role="button"
              tabIndex={10}
              onClick={() => navigate('/educational-platforms')}
              className="overflow-hidden border-2 border-red-200/70 bg-gradient-to-br from-red-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)] hover:border-red-300 transition-all duration-500 hover:scale-105 relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-200/20 to-transparent rounded-full blur-xl" />
              <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-600" />
              <CardContent className="p-4 relative">
                <div className="text-center space-y-2">
                  <div className="text-3xl">▶️</div>
                  <span className="text-xs font-bold text-red-900 block">{t('youtube')}</span>
                </div>
              </CardContent>
            </Card>

            <Card role="button"
              tabIndex={11}
              onClick={() => navigate('/educational-platforms')}
              className="overflow-hidden border-2 border-slate-200/70 bg-gradient-to-br from-slate-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(100,116,139,0.15)] hover:border-slate-300 transition-all duration-500 hover:scale-105 relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-200/20 to-transparent rounded-full blur-xl" />
              <div className="h-1.5 bg-gradient-to-r from-slate-400 to-slate-600" />
              <CardContent className="p-4 relative">
                <div className="text-center space-y-2">
                  <div className="text-3xl">🖥️</div>
                  <span className="text-xs font-bold text-slate-900 block">{t('blackboard')}</span>
                </div>
              </CardContent>
            </Card>

            <Card role="button"
              tabIndex={12}
              onClick={() => navigate('/educational-platforms')}
              className="overflow-hidden border-2 border-teal-200/70 bg-gradient-to-br from-teal-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(20,184,166,0.15)] hover:border-teal-300 transition-all duration-500 hover:scale-105 relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-200/20 to-transparent rounded-full blur-xl" />
              <div className="h-1.5 bg-gradient-to-r from-teal-400 to-teal-600" />
              <CardContent className="p-4 relative">
                <div className="text-center space-y-2">
                  <div className="text-3xl">🏛️</div>
                  <span className="text-xs font-bold text-teal-900 block">{t('bannerPNU')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Files Section - Single Button */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            {t('filesTitle')}
          </h3>
          <p className="text-xs text-blue-600/60 mb-4 font-medium">{t('filesSubtitle')}</p>
          <Card role="button"
              tabIndex={13}
            onClick={() => navigate('/files')}
            className="overflow-hidden border-2 border-indigo-300/70 bg-gradient-to-br from-indigo-100/70 via-purple-50/60 to-white shadow-2xl hover:shadow-[0_20px_50px_rgba(99,102,241,0.25)] transition-all duration-500 cursor-pointer group relative hover:scale-[1.02]"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-300/40 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-300/30 to-transparent rounded-full blur-xl" />
            <div className="h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 shadow-lg" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-200 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ring-2 ring-indigo-300/50 group-hover:ring-indigo-400/70">
                    <Folder className="h-10 w-10 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-indigo-900">{t('filesTitle')}</h4>
                    <p className="text-sm text-indigo-700 mt-2 font-medium">{t('filesSubtitle')}</p>
                    <p className="text-xs text-indigo-600/60 mt-2">Access 8+ subjects 📚</p>
                  </div>
                </div>
                <div className="text-4xl">📂</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Browsers Section - Single Button */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t('browsers')}
          </h3>
          <p className="text-xs text-blue-600/60 mb-4 font-medium">{t('browsersSubtitle')}</p>
          <Card role="button"
              tabIndex={14}
            onClick={() => navigate('/browsers')}
            className="overflow-hidden border-2 border-cyan-300/70 bg-gradient-to-br from-cyan-100/70 via-blue-50/60 to-white shadow-2xl hover:shadow-[0_20px_50px_rgba(6,182,212,0.25)] transition-all duration-500 cursor-pointer group relative hover:scale-[1.02]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-300/40 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tl from-blue-300/30 to-transparent rounded-full blur-xl" />
            <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 shadow-lg" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-200 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ring-2 ring-cyan-300/50 group-hover:ring-cyan-400/70">
                    <Globe className="h-10 w-10 text-cyan-700" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-cyan-900">{t('browsers')}</h4>
                    <p className="text-sm text-cyan-700 mt-2 font-medium">{t('browsersSubtitle')}</p>
                    <p className="text-xs text-cyan-600/60 mt-2">Open 6+ browsers 🌐</p>
                  </div>
                </div>
                <div className="text-4xl">🌍</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Today's Reminders */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {t('todaysReminders')}
          </h3>
          <div className="grid gap-3">
            {REMINDERS.map((reminder, index) => (
              <Card key={index} className="group overflow-hidden border border-border/60 shadow-md hover:shadow-lg transition-all duration-300 relative bg-gradient-to-r from-white to-blue-50/20">
                <div className={`h-1 bg-gradient-to-r ${reminder.gradient}`} />
                <CardContent className="p-4 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">{reminder.title}</span>
                    <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${reminder.gradient} text-white text-sm font-semibold shadow-md group-hover:shadow-lg transition-shadow`}>
                      {reminder.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            {t('quickActions')}
          </h3>
          <p className="text-xs text-blue-600/60 mb-4 font-medium">{t('quickActionsSubtitle')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Notes */}
            <AutoScanButton
              index={20}
              autoScanIndex={autoScanIndex}
              onClick={() => navigate('/notes')}
              className="group h-auto p-0 overflow-hidden border-2 border-emerald-200/70 bg-gradient-to-br from-emerald-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:border-emerald-300 transition-all duration-500 hover:scale-105 relative"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-xl" />
              <div className="w-full p-5 flex flex-col items-center gap-3 relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-200 to-emerald-100 group-hover:from-emerald-300 group-hover:to-emerald-200 group-focus:from-emerald-300 group-focus:to-emerald-200 transition-all shadow-md ring-2 ring-emerald-300/30 group-hover:ring-emerald-400/50">
                  <FileText className="h-7 w-7 text-emerald-700" strokeWidth={2} />
                </div>
                <span className="text-sm font-bold text-emerald-900">{t('notes')}</span>
              </div>
            </AutoScanButton>

            {/* Messages */}
            <AutoScanButton
              index={21}
              autoScanIndex={autoScanIndex}
              onClick={() => navigate('/messages')}
              className="group h-auto p-0 overflow-hidden border-2 border-blue-200/70 bg-gradient-to-br from-blue-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:border-blue-300 transition-all duration-500 hover:scale-105 relative"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-xl" />
              <div className="w-full p-5 flex flex-col items-center gap-3 relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-200 to-blue-100 group-hover:from-blue-300 group-hover:to-blue-200 group-focus:from-blue-300 group-focus:to-blue-200 transition-all shadow-md ring-2 ring-blue-300/30 group-hover:ring-blue-400/50">
                  <MessageSquare className="h-7 w-7 text-blue-700" strokeWidth={2} />
                </div>
                <span className="text-sm font-bold text-blue-900">{t('messages')}</span>
              </div>
            </AutoScanButton>

            {/* Reminders */}
            <AutoScanButton
              index={22}
              autoScanIndex={autoScanIndex}
              onClick={() => navigate('/reminders')}
              className="group h-auto p-0 overflow-hidden border-2 border-amber-200/70 bg-gradient-to-br from-amber-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(251,191,36,0.2)] hover:border-amber-300 transition-all duration-500 hover:scale-105 relative"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-xl" />
              <div className="w-full p-5 flex flex-col items-center gap-3 relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-100 group-hover:from-amber-300 group-hover:to-amber-200 group-focus:from-amber-300 group-focus:to-amber-200 transition-all shadow-md ring-2 ring-amber-300/30 group-hover:ring-amber-400/50">
                  <Bell className="h-7 w-7 text-amber-700" strokeWidth={2} />
                </div>
                <span className="text-sm font-bold text-amber-900">{t('reminders')}</span>
              </div>
            </AutoScanButton>

            {/* Student Profile */}
            <AutoScanButton
              index={23}
              autoScanIndex={autoScanIndex}
              onClick={() => navigate('/student-profile')}
              className="group h-auto p-0 overflow-hidden border-2 border-purple-200/70 bg-gradient-to-br from-purple-100/60 to-white shadow-lg hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)] hover:border-purple-300 transition-all duration-500 hover:scale-105 relative"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-xl" />
              <div className="w-full p-5 flex flex-col items-center gap-3 relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-200 to-purple-100 group-hover:from-purple-300 group-hover:to-purple-200 group-focus:from-purple-300 group-focus:to-purple-200 transition-all shadow-md ring-2 ring-purple-300/30 group-hover:ring-purple-400/50">
                  <User className="h-7 w-7 text-purple-700" strokeWidth={2} />
                </div>
                <span className="text-sm font-bold text-purple-900">{t('studentProfile')}</span>
              </div>
            </AutoScanButton>
          </div>
        </section>
      </div>
    </div>
  );
}