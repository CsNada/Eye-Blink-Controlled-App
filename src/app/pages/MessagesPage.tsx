import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useBlink } from "../contexts/BlinkContext";
import { useLanguage } from "../contexts/LanguageContext";
import { FocusableButton } from "../components/FocusableButton";
import { MessageKeyboard } from "../components/MessageKeyboard";
import { VoiceInput } from "../components/VoiceInput";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Keyboard, Send } from "lucide-react";

interface Message {
  id: string;
  teacher: string;
  content: string;
  timestamp: string;
}

const TEACHERS = ["Dr. Ahmed", "Dr. Sarah", "Dr. Mohammed", "Dr. Fatima"];

function teacherInitial(name: string) {
  const parts = name.split(" ");
  return (parts[parts.length - 1]?.[0] ?? name[0] ?? "?").toUpperCase();
}

export function MessagesPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const voiceLang = language === "ar" ? "ar-SA" : "en-US";

  const blink = useBlink();
  const setMode = blink?.setMode ?? (() => {});

  const [selectedTeacher, setSelectedTeacher] = useState(TEACHERS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);

  const quickMessages = useMemo(
    () => [t("hello"), t("needQuestion"), t("lectureToday"), t("thankYou"), t("goodbye")],
    [t]
  );

  const handleSendMessage = () => {
    const next = messageInput.trim();
    if (!next) return;

    setMessages((prev) => [
      {
        id: Date.now().toString(),
        teacher: selectedTeacher,
        content: next,
        timestamp: new Date().toLocaleString("ar-SA"),
      },
      ...prev,
    ]);

    setMessageInput("");
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t("messagesTitle")}</h2>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("selectTeacher")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TEACHERS.map((teacher, index) => (
                  <FocusableButton
                    key={teacher}
                    index={10 + index}
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTeacher === teacher
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                          {teacherInitial(teacher)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{teacher}</span>
                    </div>
                  </FocusableButton>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("quickMessages")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickMessages.map((message, index) => (
                  <FocusableButton
                    key={index}
                    index={20 + index}
                    onClick={() => {
                      const newMessage: Message = {
                        id: Date.now().toString(),
                        teacher: selectedTeacher,
                        content: message,
                        timestamp: new Date().toLocaleString("ar-SA"),
                      };
                      setMessages((prev) => [newMessage, ...prev]);
                    }}
                    variant="outline"
                    className="h-auto py-6 text-md"
                  >
                    {message}
                  </FocusableButton>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("sendMessage")}</CardTitle>
            </CardHeader>

            <CardContent className="p-3">
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                <div className="w-full">
                  <FocusableButton
                    index={32}
                    onClick={() => {
                      setShowKeyboard((prev) => {
                        const next = !prev;
                        setMode(next ? "keyboard" : "normal");
                        return next;
                      });
                    }}
                    variant="outline"
                    className="min-h-[56px] w-full mb-3"
                  >
                    <Keyboard className="h-4 w-4 ml-2" />
                    {showKeyboard ? "إغلاق لوحة المفاتيح" : "فتح لوحة المفاتيح"}
                  </FocusableButton>

                  <VoiceInput
                    value={messageInput}
                    onChange={setMessageInput}
                    onSubmit={handleSendMessage}
                    lang={voiceLang}
                    placeholder={t("typeMessage")}
                  />
                </div>

                <div className="w-full">
                  {showKeyboard ? (
                    <MessageKeyboard
                      className="w-full"
                      value={messageInput}
                      onChange={setMessageInput}
                      onSend={handleSendMessage}
                      onExit={() => {
                        setShowKeyboard(false);
                        setMode("normal");
                      }}
                    />
                  ) : (
                    <Card className="border border-dashed bg-muted/30 mt-0">
                      <CardContent className="p-6 text-center text-muted-foreground leading-7">
                        <Keyboard className="mx-auto mb-3 h-10 w-10 opacity-70" />
                        {language === "ar"
                          ? "ستظهر لوحة المفاتيح هنا بجانب خانة الإدخال"
                          : "Open the keyboard to show it beside the input on larger screens."}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("messageHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {t("noMessages")}
                </p>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <Card key={message.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-violet-500 text-white">
                              {teacherInitial(message.teacher)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-medium">{message.teacher}</span>
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp}
                              </span>
                            </div>
                            <p className="mt-2 text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
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