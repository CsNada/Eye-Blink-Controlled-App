import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { MessageKeyboard } from '../components/MessageKeyboard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { useEyeContext } from '../components/EyeContext';

interface Message {
  id: string;
  teacher: string;
  content: string;
  timestamp: string;
}

const TEACHERS = ['Dr. Ahmed', 'Dr. Sarah', 'Dr. Mohammed', 'Dr. Fatima'];

export function MessagesPage() {
  const { seconds } = useEyeContext();

  useEffect(() => {
    if (seconds >= 3) {
      console.log('️ Page2 trigger');
    }
  }, [seconds]);

  const navigate = useNavigate();
  const blinkContext = useBlink();
  const { t } = useLanguage();

  const [selectedTeacher, setSelectedTeacher] = useState('Dr. Ahmed');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const focusedIndex = blinkContext?.focusedIndex ?? 0;
  const setTotalItems = blinkContext?.setTotalItems ?? (() => {});
  const setOnSelect = blinkContext?.setOnSelect ?? (() => {});
  const setOnBack = blinkContext?.setOnBack ?? (() => {});
  const setOnDelete = blinkContext?.setOnDelete ?? (() => {});
  const setOnSend = blinkContext?.setOnSend ?? (() => {});

  const quickMessages = useMemo(
    () => [t('hello'), t('needQuestion'), t('lectureToday'), t('thankYou'), t('goodbye')],
    [t]
  );

  const totalItems = TEACHERS.length + quickMessages.length;

  useEffect(() => {
    setTotalItems(totalItems);
  }, [setTotalItems, totalItems]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        teacher: selectedTeacher,
        content: messageInput,
        timestamp: new Date().toLocaleString('ar-SA'),
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  useEffect(() => {
    setOnSelect(() => {
      if (focusedIndex >= 0 && focusedIndex < TEACHERS.length) {
        setSelectedTeacher(TEACHERS[focusedIndex]);
        return;
      }

      const quickIndex = focusedIndex - TEACHERS.length;
      if (quickIndex >= 0 && quickIndex < quickMessages.length) {
        const newMessage: Message = {
          id: Date.now().toString(),
          teacher: selectedTeacher,
          content: quickMessages[quickIndex],
          timestamp: new Date().toLocaleString('ar-SA'),
        };
        setMessages([...messages, newMessage]);
      }
    });
  }, [setOnSelect, focusedIndex, quickMessages, selectedTeacher, messages]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  useEffect(() => {
    setOnDelete(() => {
      setMessageInput('');
    });

    return () => {
      setOnDelete(null);
    };
  }, [setOnDelete]);

  useEffect(() => {
    setOnSend(() => {
      handleSendMessage();
    });

    return () => {
      setOnSend(null);
    };
  }, [setOnSend, messageInput, selectedTeacher, messages]);

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t('messagesTitle')}</h2>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('selectTeacher')}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TEACHERS.map((teacher, index) => (
                <FocusableButton
                  key={teacher}
                  index={index}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTeacher === teacher
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  variant="outline"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                        {teacher.split(' ')[1][0]}
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
            <CardTitle>{t('quickMessages')}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickMessages.map((message, index) => (
                <FocusableButton
                  key={index}
                  index={TEACHERS.length + index}
                  onClick={() => {
                    const newMessage: Message = {
                      id: Date.now().toString(),
                      teacher: selectedTeacher,
                      content: message,
                      timestamp: new Date().toLocaleString('ar-SA'),
                    };
                    setMessages([...messages, newMessage]);
                  }}
                  variant="outline"
                  className="h-auto py-6 text-lg"
                >
                  {message}
                </FocusableButton>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('messageHistory')}</CardTitle>
          </CardHeader>

          <CardContent>
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">{t('noMessages')}</p>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <Card key={message.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-violet-500 text-white">
                            {message.teacher.split(' ')[1][0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{message.teacher}</span>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          </div>
                          <p className="mt-2 text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('sendMessage')}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={t('typeMessage')}
              className="text-base"
            />

            <MessageKeyboard value={messageInput} onChange={setMessageInput} onSend={handleSendMessage} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}