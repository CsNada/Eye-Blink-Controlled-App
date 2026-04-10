import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
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

// Move default notes outside component to prevent recreation on every render
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

  // Safely access context functions with fallbacks
  const setTotalItems = blinkContext?.setTotalItems ?? (() => {});
  const setOnSelect = blinkContext?.setOnSelect ?? (() => {});
  const setOnBack = blinkContext?.setOnBack ?? (() => {});
  const setOnDelete = blinkContext?.setOnDelete ?? (() => {});

  useEffect(() => {
    setTotalItems(0);
  }, [setTotalItems]);

  useEffect(() => {
    setOnSelect(() => {
      // Select action handled by keyboard
    });
  }, [setOnSelect]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  useEffect(() => {
    setOnDelete(() => {
      setCurrentNote('');
    });
    
    // Cleanup: Remove delete button when leaving this page
    return () => {
      setOnDelete(null);
    };
  }, [setOnDelete]);

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

  const handleQuickDeleteCurrent = () => {
    setCurrentNote('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-4xl font-bold">الملاحظات</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            اكتب واحفظ ملاحظاتك بسهولة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Text Editor */}
          <div className="space-y-6">
            <Card className="border border-border shadow-lg">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  اكتب ملاحظتك
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="اكتب ملاحظتك هنا..."
                  className="min-h-[250px] text-base border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
                />
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSaveNote} 
                    className="min-h-[56px] flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="h-4 w-4 ml-2" />
                    حفظ
                  </Button>
                  <Button 
                    onClick={handleAna1X} 
                    className="min-h-[56px] px-6 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    أنا 1X
                  </Button>
                  <Button 
                    onClick={handleClear} 
                    variant="outline" 
                    className="min-h-[56px] hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                  >
                    مسح
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scanning Keyboard */}
            <Card className="border border-border shadow-lg">
              <CardContent className="pt-6">
                <ScanningKeyboard value={currentNote} onChange={setCurrentNote} onSend={handleSaveNote} />
              </CardContent>
            </Card>

            {/* Quick Add Note */}
            <Card className="border border-border shadow-lg bg-blue-50/50">
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
                  <Button 
                    onClick={handleQuickAddNote}
                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saved Notes */}
          <Card className="border border-border shadow-lg lg:min-h-[700px]">
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
                  <p className="text-muted-foreground text-base">
                    لا توجد ملاحظات محفوظة
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedNotes.map((note) => (
                    <Card key={note.id} className="group overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-500" />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {note.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {note.date}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0 h-8 w-8"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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