import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bell, Clock, Calendar, Plus } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  time: string;
  date: string;
  gradient: string;
}

export function RemindersPage() {
  const navigate = useNavigate();
  const { setTotalItems, setOnSelect, setOnBack, focusedIndex } = useBlink();
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: t('sundayLecture'),
      time: '9:00 AM',
      date: new Date().toLocaleDateString(),
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: '2',
      title: t('studyTime'),
      time: '2:00 PM',
      date: new Date().toLocaleDateString(),
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: '3',
      title: t('prayerTime'),
      time: '5:30 PM',
      date: new Date().toLocaleDateString(),
      gradient: 'from-amber-500 to-orange-600',
    },
  ]);

  const templates = [
    { title: t('sundayLecture'), time: '9:00 AM', gradient: 'from-blue-500 to-indigo-600', icon: '📚' },
    { title: t('thursdayLecture'), time: '9:00 AM', gradient: 'from-purple-500 to-violet-600', icon: '🎓' },
    { title: t('researchProject'), time: '10:00 AM', gradient: 'from-cyan-500 to-blue-600', icon: '🔬' },
    { title: t('anatomyHomework'), time: '3:00 PM', gradient: 'from-rose-500 to-pink-600', icon: '🩺' },
    { title: t('prayerTime'), time: '5:30 PM', gradient: 'from-amber-500 to-orange-600', icon: '🕌' },
    { title: t('studyTime'), time: '7:00 PM', gradient: 'from-emerald-500 to-teal-600', icon: '📖' },
  ];

  useEffect(() => {
    setTotalItems(templates.length);
  }, [setTotalItems, templates.length]);

  useEffect(() => {
    setOnSelect(() => {
      if (focusedIndex >= 0 && focusedIndex < templates.length) {
        const template = templates[focusedIndex];
        const newReminder: Reminder = {
          id: Date.now().toString(),
          title: template.title,
          time: template.time,
          date: new Date().toLocaleDateString(),
          gradient: template.gradient,
        };
        setReminders([...reminders, newReminder]);
      }
    });
  }, [setOnSelect, focusedIndex, templates, reminders]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold">{t('remindersTitle')}</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Add and manage your reminders
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Templates */}
          <Card className="lg:col-span-2 border-0 shadow-xl">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {t('quickTemplates')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template, index) => (
                  <FocusableButton
                    key={index}
                    index={index}
                    onClick={() => {
                      const newReminder: Reminder = {
                        id: Date.now().toString(),
                        title: template.title,
                        time: template.time,
                        date: new Date().toLocaleDateString(),
                        gradient: template.gradient,
                      };
                      setReminders([...reminders, newReminder]);
                    }}
                    className="h-auto p-0 overflow-hidden border-0 shadow-md hover:shadow-lg"
                  >
                    <div className="w-full p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-card to-muted/20">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${template.gradient} text-4xl shadow-lg`}>
                        {template.icon}
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-base mb-1">{template.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {template.time}
                        </p>
                      </div>
                    </div>
                  </FocusableButton>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reminders List */}
          <Card className="border-0 shadow-xl lg:min-h-[600px]">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {t('remindersTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-6 rounded-full bg-muted/50 mb-4">
                    <Bell className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {t('noReminders')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <Card key={reminder.id} className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className={`h-1 bg-gradient-to-r ${reminder.gradient}`} />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-base font-semibold mb-1">{reminder.title}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {reminder.date}
                            </p>
                          </div>
                          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${reminder.gradient} text-white font-bold text-lg shadow-lg`}>
                            {reminder.time}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}