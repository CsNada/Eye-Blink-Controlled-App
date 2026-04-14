import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Trash2, Send, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "./ui/utils";

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

type VoiceInputProps = {
  value: string;
  onChange: (next: string) => void;
  onSubmit?: () => void;
  lang?: "ar-SA" | "en-US";
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  autoSubmitOnStop?: boolean;
};

export function VoiceInput({
  value,
  onChange,
  onSubmit,
  lang = "ar-SA",
  placeholder = "اضغط زر الميكروفون ثم تحدّث",
  multiline = true,
  className,
  autoSubmitOnStop = false,
}: VoiceInputProps) {
  const recognitionRef = useRef<any>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);

  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    const RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      setSupported(false);
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onend = () => {
      setListening(false);
      if (autoSubmitOnStop && onSubmitRef.current) {
        onSubmitRef.current();
      }
    };

    recognition.onerror = (event: any) => {
      setListening(false);
      const code = event?.error || "unknown";
      setError(
        code === "not-allowed"
          ? "تم منع الوصول إلى الميكروفون."
          : "تعذر تشغيل الإدخال الصوتي."
      );
    };

    recognition.onresult = (event: any) => {
      let finalChunk = "";
      let liveChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i]?.[0]?.transcript ?? "";
        if (event.results[i].isFinal) {
          finalChunk += transcript;
        } else {
          liveChunk += transcript;
        }
      }

      setInterimText(liveChunk.trim());

      const cleaned = finalChunk.replace(/\s+/g, " ").trim();
      if (!cleaned) return;

      const current = valueRef.current.trimEnd();
      onChangeRef.current(current ? `${current} ${cleaned}` : cleaned);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, [lang, autoSubmitOnStop]);

  const startListening = () => {
    if (!supported) {
      setError("المتصفح الحالي لا يدعم الإدخال الصوتي.");
      return;
    }

    setError("");
    setInterimText("");

    try {
      recognitionRef.current?.start();
    } catch {
      setError("تعذر بدء التسجيل الصوتي الآن.");
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
  };

  const clearValue = () => {
    onChange("");
    setInterimText("");
    setError("");
  };

  return (
    <Card className={cn("border border-border shadow-lg rounded-2xl", className)}>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={listening ? stopListening : startListening}
              className="min-h-[52px] px-5"
            >
              {listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {listening ? "إيقاف التسجيل" : "تسجيل صوتي"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={clearValue}
              className="min-h-[52px] px-5"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              مسح
            </Button>
          </div>

          {onSubmit && (
            <Button type="button" onClick={onSubmit} className="min-h-[52px] px-5">
              <Send className="mr-2 h-4 w-4" />
              إرسال
            </Button>
          )}
        </div>

        <div
          dir={lang.startsWith("ar") ? "rtl" : "ltr"}
          className={cn(
            "rounded-2xl border bg-background p-4 text-base leading-8 whitespace-pre-wrap min-h-[120px]",
            multiline ? "min-h-[180px]" : "min-h-[56px]",
            !value && "text-muted-foreground"
          )}
        >
          {value || placeholder}
        </div>

        {interimText && (
          <p className="text-sm text-muted-foreground">
            جارٍ التعرف: {interimText}
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}

        {!supported && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            المتصفح الحالي لا يدعم التعرف الصوتي.
          </p>
        )}
      </CardContent>
    </Card>
  );
}