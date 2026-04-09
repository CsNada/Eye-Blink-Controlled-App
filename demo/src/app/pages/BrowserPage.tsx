import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';

export function BrowserPage() {
  const navigate = useNavigate();
  const { setTotalItems, setOnSelect, setOnBack, focusedIndex } = useBlink();
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('https://www.wikipedia.org');

  const bookmarks = [
    { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { name: 'Google Scholar', url: 'https://scholar.google.com' },
    { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov' },
    { name: 'Khan Academy', url: 'https://www.khanacademy.org' },
    { name: 'Coursera', url: 'https://www.coursera.org' },
    { name: 'edX', url: 'https://www.edx.org' },
  ];

  useEffect(() => {
    setTotalItems(bookmarks.length);
  }, [setTotalItems, bookmarks.length]);

  useEffect(() => {
    setOnSelect(() => {
      if (focusedIndex >= 0 && focusedIndex < bookmarks.length) {
        setCurrentUrl(bookmarks[focusedIndex].url);
      }
    });
  }, [setOnSelect, focusedIndex, bookmarks]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  const handleGo = () => {
    if (url) {
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
      }
      setCurrentUrl(finalUrl);
      setUrl('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t('browserTitle')}</h2>

      <div className="grid gap-6">
        {/* URL Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGo()}
                placeholder={t('urlPlaceholder')}
                className="text-lg min-h-[56px]"
              />
              <Button 
                onClick={handleGo} 
                className="min-h-[56px] min-w-[100px]"
              >
                <Search className="h-5 w-5 mr-2" />
                {t('go')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks */}
        <Card>
          <CardHeader>
            <CardTitle>{t('bookmarks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {bookmarks.map((bookmark, index) => (
                <FocusableButton
                  key={index}
                  index={index}
                  onClick={() => setCurrentUrl(bookmark.url)}
                  variant="outline"
                  className="h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl">🔖</div>
                    <span className="text-sm text-center">{bookmark.name}</span>
                  </div>
                </FocusableButton>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Browser Frame */}
        <Card>
          <CardContent className="p-0">
            <iframe
              src={currentUrl}
              className="w-full h-[600px] border-0 rounded-b-lg"
              title="Browser"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}