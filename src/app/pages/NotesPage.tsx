import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { ScanningKeyboard } from '../components/ScanningKeyboard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Save, Trash2, FileText, Sparkles, Plus } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  date: string;
}

const DEFAULT_NOTES: Note[] = [
  {
    id: '1',
    content: 'موعد الفحص الطبي القادم يوم الأحد الساعة 10 صباحاً',
    date: new Date('2024-04-02').toLocaleString('ar-SA'),
  },
  {
    id: '2',
    content: 'تذكير: تناول الدواء بعد الإفطار والعشاء',
    date: new Date('2024-04-01').toLocaleString('ar-SA'),
  },
  {
    id: '3',
    content: 'جلسة العلاج الطبيعي يوم الثلاثاء الساعة 3 عصراً',
    date: new Date('2024-03-30').toLocaleString('ar-SA'),
  },
  {
    id: '4',
    content: 'ملاحظات عن تمارين التنفس اليومية',
    date: new Date('2024-03-29').toLocaleString('ar-SA'),
  },
  {
    id: '5',
    content: 'تواصل مع الطبيب بخصوص نتائج الفحوصات',
    date: new Date('2024-03-28').toLocaleString('ar-SA'),
  },
];

export function NotesPage() {
  const navigate = useNavigate();
  const blinkContext = useBlink();
  const { t } = useLanguage();

  const [currentNote, setCurrentNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<Note[]>(DEFAULT_NOTES);
  const [quickNote, setQuickNote] = useState('');

  const focusedIndex = blinkContext?.focusedIndex ?? 0;
  const setTotalItems = blinkContext?.setTotalItems ?? (() => {});
  const setOnSelect = blinkContext?.setOnSelect ?? (() => {});
  const setOnBack = blinkContext?.setOnBack ?? (() => {});
  const setOnDelete = blinkContext?.setOnDelete ?? (() => {});

  const totalItems = useMemo(() => {
    return 4 + savedNotes.length;
  }, [savedNotes.length]);

  useEffect(() => {
    setTotalItems(totalItems);
  }, [setTotalItems, totalItems]);

  const handleSaveNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote,
        date: new Date().toLocaleString('ar-SA'),
      };
      setSavedNotes([newNote, ...savedNotes]);
      setCurrentNote('');
    }
  };

  const handleQuickAddNote = () => {
    if (quickNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: quickNote,
        date: new Date().toLocaleString('ar-SA'),
      };
      setSavedNotes([newNote, ...savedNotes]);
      setQuickNote('');
    }
  };

  const handleDeleteNote = (id: string) => {
    setSavedNotes(savedNotes.filter(note => note.id !== id));
  };

  const handleClear = () => {
    setCurrentNote('');
  };

  const handleAna1X = () => {
    const ana1xNote: Note = {
      id: Date.now().toString(),
      content: 'أنا 1X',
      date: new Date().toLocaleString('ar-SA'),
    };
    setSavedNotes([ana1xNote, ...savedNotes]);
  };

  useEffect(() => {
    setOnSelect(() => {
      if (focusedIndex === 0) {
        handleSaveNote();
        return;
      }

      if (focusedIndex === 1) {
        handleAna1X();
        return;
      }

      if (focusedIndex === 2) {
        handleClear();
        return;
      }

      if (focusedIndex === 3) {
        handleQuickAddNote();
        return;
      }

      const noteIndex = focusedIndex - 4;
      if (noteIndex >= 0 && noteIndex < savedNotes.length) {
        handleDeleteNote(savedNotes[noteIndex].id);
      }
    });
  }, [setOnSelect, focusedIndex, savedNotes, currentNote, quickNote]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  useEffect(() => {
    setOnDelete(() => {
      setCurrentNote('');
    });

    return () => {
      setOnDelete(null);
    };
  }, [setOnDelete]);

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t('notesTitle')}</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t('writeNote')}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <Textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder={t('writeNotePlaceholder')}
              className="min-h-[250px] text-base border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
            />

            <div className="flex gap-3">
              <FocusableButton
                index={0}
                onClick={handleSaveNote}
                className="min-h-[56px] flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Save className="h-4 w-4 ml-2" />
                حفظ
              </FocusableButton>

              <FocusableButton
                index={1}
                onClick={handleAna1X}
                className="min-h-[56px] px-6 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                أنا 1X
              </FocusableButton>

              <FocusableButton
                index={2}
                onClick={handleClear}
                variant="outline"
                className="min-h-[56px] hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                مسح
              </FocusableButton>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg">
          <CardContent className="pt-6">
            <ScanningKeyboard value={currentNote} onChange={setCurrentNote} onSend={handleSaveNote} />
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg bg-blue-50/50 lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Input
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="إضافة ملاحظة سريعة..."
                className="flex-1 border border-blue-200 bg-white focus-visible:ring-2 focus-visible:ring-blue-500/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleQuickAddNote();
                  }
                }}
              />

              <FocusableButton
                index={3}
                onClick={handleQuickAddNote}
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-md"
              >
                <Plus className="h-4 w-4" />
              </FocusableButton>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border shadow-lg lg:min-h-[700px] mt-6">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            الملاحظات المحفوظة
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {savedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-6 rounded-full bg-muted/50 mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-base">لا توجد ملاحظات محفوظة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedNotes.map((note, index) => (
                <Card
                  key={note.id}
                  className="group overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-500" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm whitespace-pre-wrap break-words">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {note.date}
                        </p>
                      </div>

                      <FocusableButton
                        index={4 + index}
                        variant="ghost"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0 h-8 w-8"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </FocusableButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}