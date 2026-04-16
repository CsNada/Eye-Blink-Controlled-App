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
  blinkBaseIndex?: number;
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
  blinkBaseIndex = 200,
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
    <Card className={cn("border border-border shadow-sm", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            data-blink-index={blinkBaseIndex}
            onClick={listening ? stopListening : startListening}
            variant={listening ? "secondary" : "default"}
            className="min-h-[44px]"
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {listening ? "إيقاف التسجيل" : "تسجيل صوتي"}
          </Button>

          <Button
            type="button"
            data-blink-index={blinkBaseIndex + 1}
            onClick={clearValue}
            variant="outline"
            className="min-h-[44px]"
          >
            <Trash2 className="h-4 w-4" />
            مسح
          </Button>

          {onSubmit && (
            <Button
              type="button"
              data-blink-index={blinkBaseIndex + 2}
              onClick={onSubmit}
              className="min-h-[44px] bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Send className="h-4 w-4" />
              إرسال
            </Button>
          )}
        </div>

        {multiline ? (
          <textarea
            
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[120px] rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/30"
          />
        ) : (
          <input
            
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[52px] rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/30"
          />
        )}

        {interimText && (
          <div className="text-sm text-muted-foreground">جارٍ التعرف: {interimText}</div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {!supported && (
          <div className="text-sm text-muted-foreground">
            المتصفح الحالي لا يدعم التعرف الصوتي.
          </div>
        )}
      </CardContent>
    </Card>
  );
}