import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { MessageKeyboard } from '../components/MessageKeyboard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';

interface Message {
  id: string;
  teacher: string;
  content: string;
  timestamp: string;
}

// Move teachers array outside component to prevent recreation on every render
const TEACHERS = ['Dr. Ahmed', 'Dr. Sarah', 'Dr. Mohammed', 'Dr. Fatima'];

export function MessagesPage() {
  const navigate = useNavigate();
  const blinkContext = useBlink();
  const { t } = useLanguage();
  const [selectedTeacher, setSelectedTeacher] = useState('Dr. Ahmed');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  // Safely access context functions with fallbacks
  const setTotalItems = blinkContext?.setTotalItems ?? (() => {});
  const setOnSelect = blinkContext?.setOnSelect ?? (() => {});
  const setOnBack = blinkContext?.setOnBack ?? (() => {});
  const setOnDelete = blinkContext?.setOnDelete ?? (() => {});
  const setOnSend = blinkContext?.setOnSend ?? (() => {});
  const focusedIndex = blinkContext?.focusedIndex ?? 0;
  
  // Use useMemo to stabilize quickMessages array reference
  const quickMessages = useMemo(() => [
    t('hello'),
    t('needQuestion'),
    t('lectureToday'),
    t('thankYou'),
    t('goodbye'),
  ], [t]);

  useEffect(() => {
    setTotalItems(quickMessages.length);
  }, [setTotalItems, quickMessages.length]);

  useEffect(() => {
    setOnSelect(() => {
      if (focusedIndex >= 0 && focusedIndex < quickMessages.length) {
        const newMessage: Message = {
          id: Date.now().toString(),
          teacher: selectedTeacher,
          content: quickMessages[focusedIndex],
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

  // Enable delete button for Messages page
  useEffect(() => {
    setOnDelete(() => {
      setMessageInput('');
    });
    
    // Cleanup: Remove delete button when leaving this page
    return () => {
      setOnDelete(null);
    };
  }, [setOnDelete]);

  // Handle 5-second blink for sending message
  useEffect(() => {
    setOnSend(() => {
      handleSendMessage();
    });

    return () => {
      setOnSend(null);
    };
  }, [setOnSend, messageInput, selectedTeacher, messages]);

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

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t('messagesTitle')}</h2>

      <div className="grid gap-6">
        {/* Teacher Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t('selectTeacher')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TEACHERS.map((teacher) => (
                <button
                  key={teacher}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTeacher === teacher
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                        {teacher.split(' ')[1][0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{teacher}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Messages */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickMessages')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickMessages.map((message, index) => (
                <FocusableButton
                  key={index}
                  index={index}
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

        {/* Message History */}
        <Card>
          <CardHeader>
            <CardTitle>{t('messageHistory')}</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t('noMessages')}
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <Card key={message.id} className="border-l-4 border-l-violet-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                            {message.teacher.split(' ')[1][0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{message.teacher}</p>
                            <p className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </p>
                          </div>
                          <p className="mt-1 text-lg">{message.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sendMessage')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={t('typeMessage')}
                className="text-base"
              />
              <MessageKeyboard
                value={messageInput}
                onChange={setMessageInput}
                onSend={handleSendMessage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}