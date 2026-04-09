import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Globe } from 'lucide-react';

interface Browser {
  id: string;
  name: string;
  icon: string;
  color: string;
  url: string;
}

export function BrowsersPage() {
  const navigate = useNavigate();
  const { setTotalItems, setOnSelect, setOnBack, focusedIndex } = useBlink();
  const { t } = useLanguage();

  const browsers: Browser[] = [
    {
      id: 'chrome',
      name: t('chrome'),
      icon: '🌐',
      color: 'from-yellow-500 to-yellow-600',
      url: 'https://www.google.com',
    },
    {
      id: 'firefox',
      name: t('firefox'),
      icon: '🦊',
      color: 'from-orange-500 to-orange-600',
      url: 'https://www.mozilla.org',
    },
    {
      id: 'safari',
      name: t('safari'),
      icon: '🧭',
      color: 'from-blue-500 to-blue-600',
      url: 'https://www.apple.com',
    },
    {
      id: 'edge',
      name: t('edge'),
      icon: '🌊',
      color: 'from-cyan-500 to-cyan-600',
      url: 'https://www.microsoft.com',
    },
    {
      id: 'brave',
      name: t('brave'),
      icon: '🦁',
      color: 'from-orange-500 to-red-600',
      url: 'https://brave.com',
    },
    {
      id: 'opera',
      name: t('opera'),
      icon: '🎭',
      color: 'from-red-500 to-red-600',
      url: 'https://www.opera.com',
    },
  ];

  useEffect(() => {
    setTotalItems(browsers.length);
  }, [setTotalItems, browsers.length]);

  useEffect(() => {
    setOnSelect(() => {
      if (focusedIndex >= 0 && focusedIndex < browsers.length) {
        window.open(browsers[focusedIndex].url, '_blank');
      }
    });
  }, [setOnSelect, focusedIndex, browsers]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-6">{t('browsers')}</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('browsersSubtitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {browsers.map((browser, index) => (
              <FocusableButton
                key={browser.id}
                index={index}
                onClick={() => window.open(browser.url, '_blank')}
                className="h-auto p-0 overflow-hidden border-2 hover:scale-105 transition-all duration-300"
              >
                <div className="w-full p-6 flex flex-col items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${browser.color}`}>
                    <div className="text-4xl">{browser.icon}</div>
                  </div>
                  <span className="text-lg text-center font-medium">
                    {browser.name}
                  </span>
                </div>
              </FocusableButton>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('bookmarks')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚' },
              { name: 'Google Scholar', url: 'https://scholar.google.com', icon: '🎓' },
              { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov', icon: '🏥' },
              { name: 'Khan Academy', url: 'https://www.khanacademy.org', icon: '📖' },
              { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
              { name: 'GitHub', url: 'https://www.github.com', icon: '💻' },
            ].map((bookmark, index) => (
              <button
                key={index}
                onClick={() => window.open(bookmark.url, '_blank')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all duration-200"
              >
                <div className="text-3xl">{bookmark.icon}</div>
                <span className="text-sm text-center font-medium">{bookmark.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
