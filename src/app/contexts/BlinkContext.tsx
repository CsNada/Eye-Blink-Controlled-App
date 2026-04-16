import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useBlink } from "../contexts/BlinkContext";
import { useLanguage } from "../contexts/LanguageContext";
import { FocusableButton } from "../components/FocusableButton";
import { VoiceInput } from "../components/VoiceInput";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, SquareArrowOutUpRight } from "lucide-react";

export function BrowserPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const blink = useBlink();

  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("https://www.wikipedia.org");

  const voiceLang = language === "ar" ? "ar-SA" : "en-US";

  const bookmarks = [
    { name: "Wikipedia", url: "https://www.wikipedia.org" },
    { name: "Google Scholar", url: "https://scholar.google.com" },
    { name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov" },
    { name: "Khan Academy", url: "https://www.khanacademy.org" },
    { name: "Coursera", url: "https://www.coursera.org" },
    { name: "edX", url: "https://www.edx.org" },
  ];

  useEffect(() => {
    const setOnBack = blink?.setOnBack ?? (() => {});
    setOnBack(() => navigate("/", { replace: false }));
    return () => setOnBack(null);
  }, [blink, navigate]);

  const handleGo = () => {
    const next = url.trim();
    if (!next) return;

    const finalUrl =
      next.startsWith("http://") || next.startsWith("https://")
        ? next
        : `https://${next}`;

    setCurrentUrl(finalUrl);
    setUrl("");
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t("browserTitle")}</h2>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("urlBar") ?? "شريط الرابط"}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <VoiceInput
              value={url}
              onChange={setUrl}
              onSubmit={handleGo}
              lang={voiceLang}
              multiline={false}
              placeholder={t("urlPlaceholder")}
            />

            <div className="flex gap-2">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGo();
                }}
                placeholder={t("urlPlaceholder")}
                className="text-lg min-h-[56px]"
              />

              <Button onClick={handleGo} className="min-h-[56px] min-w-[100px]">
                <Search className="h-5 w-5 mr-2" />
                {t("go")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("bookmarks")}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {bookmarks.map((bookmark, index) => (
                <FocusableButton
                  key={bookmark.name}
                  index={index}
                  onClick={() => setCurrentUrl(bookmark.url)}
                  variant="outline"
                  className="min-h-[84px] flex-col"
                >
                  <SquareArrowOutUpRight className="h-5 w-5 mb-2" />
                  <span className="text-sm font-medium">{bookmark.name}</span>
                </FocusableButton>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("browserPreview") ?? "المعاينة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border bg-background">
              <iframe
                key={currentUrl}
                src={currentUrl}
                title="Browser preview"
                className="w-full h-[70vh] min-h-[520px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}