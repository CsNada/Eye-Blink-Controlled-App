import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useBlink } from "../contexts/BlinkContext";
import { useLanguage } from "../contexts/LanguageContext";
import { FocusableButton } from "../components/FocusableButton";
import { ScanningKeyboard } from "../components/ScanningKeyboard";
import { VoiceInput } from "../components/VoiceInput";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Save, Trash2, FileText, Sparkles, Plus, Keyboard } from "lucide-react";

interface Note {
  id: string;
  content: string;
  date: string;
}

const DEFAULT_NOTES: Note[] = [
  {
    id: "1",
    content: "موعد الفحص الطبي القادم يوم الأحد الساعة 10 صباحاً",
    date: new Date("2024-04-02").toLocaleString("ar-SA"),
  },
  {
    id: "2",
    content: "تذكير: تناول الدواء بعد الإفطار والعشاء",
    date: new Date("2024-04-01").toLocaleString("ar-SA"),
  },
  {
    id: "3",
    content: "جلسة العلاج الطبيعي يوم الثلاثاء الساعة 3 عصراً",
    date: new Date("2024-03-30").toLocaleString("ar-SA"),
  },
];

export function NotesPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const blink = useBlink();
  const setMode = blink?.setMode ?? (() => { });
  const voiceLang = language === "ar" ? "ar-SA" : "en-US";

  const [currentNote, setCurrentNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<Note[]>(DEFAULT_NOTES);
  const [quickNote, setQuickNote] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleSaveNote = () => {
    const next = currentNote.trim();
    if (!next) return;

    setSavedNotes((prev) => [
      {
        id: Date.now().toString(),
        content: next,
        date: new Date().toLocaleString("ar-SA"),
      },
      ...prev,
    ]);
    setCurrentNote("");
  };

  const handleQuickAddNote = () => {
    const next = quickNote.trim();
    if (!next) return;

    setSavedNotes((prev) => [
      {
        id: Date.now().toString(),
        content: next,
        date: new Date().toLocaleString("ar-SA"),
      },
      ...prev,
    ]);
    setQuickNote("");
  };

  const noteCardBase = 100;
  const quickBase = 200;

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t("notesTitle")}</h2>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_400px] md:items-start">
        <div className="space-y-6">
          <Card className="border border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t("writeNote")}
              </CardTitle>
            </CardHeader>

            <FocusableButton
              index={10}
              onClick={() => {
                setShowKeyboard((prev) => {
                  const next = !prev;
                  setMode(next ? "keyboard" : "normal");
                  return next;
                });
              }}
              variant="outline"
              className="min-h-[56px] mx-6"
            >
              <Keyboard className="h-4 w-4 ml-2" />
              {showKeyboard ? "إغلاق لوحة المفاتيح" : "فتح لوحة المفاتيح"}
            </FocusableButton>

            <CardContent className="space-y-4">
              <VoiceInput
                blinkBaseIndex={11}
                value={currentNote}
                onChange={setCurrentNote}
                onSubmit={handleSaveNote}
                lang={voiceLang}
                placeholder={t("typeYourNote")}
              />

            </CardContent>
          </Card>

          {/* <Card className="border border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {t("quickAddNote") ?? "إضافة سريعة"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                data-blink-index={30}
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder={t("quickAddNote") ?? "إضافة ملاحظة سريعة..."}
                className="text-lg min-h-[56px]"
                dir={language === "ar" ? "rtl" : "ltr"}
              />

              <FocusableButton
                index={31}
                onClick={handleQuickAddNote}
                className="min-h-[56px] w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 ml-2" />
                {t("add") ?? "إضافة"}
              </FocusableButton>
            </CardContent>
          </Card> */}

          <Card className="border border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("savedNotes") ?? "الملاحظات المحفوظة"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {savedNotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {t("noNotes") ?? "لا توجد ملاحظات بعد"}
                </p>
              ) : (
                <div className="grid gap-3">
                  {savedNotes.map((note, index) => (
                    <Card key={note.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-base whitespace-pre-wrap break-words">
                              {note.content}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {note.date}
                            </p>
                          </div>

                          <FocusableButton
                            index={noteCardBase + index}
                            onClick={() =>
                              setSavedNotes((prev) =>
                                prev.filter((item) => item.id !== note.id)
                              )
                            }
                            variant="outline"
                            className="min-h-[44px] px-4"
                          >
                            <Trash2 className="h-4 w-4 ml-1" />
                            {t("delete") ?? "حذف"}
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

        <div className="space-y-4 lg:sticky lg:top-24">
          {showKeyboard ? (
            <ScanningKeyboard
              className="w-full"
              value={currentNote}
              onChange={setCurrentNote}
              onSend={handleSaveNote}
              onExit={() => {
                setShowKeyboard(false);
                setMode("normal");
              }}
            />
          ) : (
            <Card className="border border-dashed bg-muted/30">
              <CardContent className="p-6 text-center text-muted-foreground leading-7">
                <Keyboard className="mx-auto mb-3 h-10 w-10 opacity-70" />
                {language === "ar"
                  ? "ستظهر لوحة المفاتح هنا عند فتحها"
                  : "Open the keyboard to show it beside the input on larger screens."}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}