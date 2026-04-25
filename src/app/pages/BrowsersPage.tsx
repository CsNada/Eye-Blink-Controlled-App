import React from 'react';
import { Globe, Compass, Star, BookOpen } from 'lucide-react';

interface BrowserItem {
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface BookmarkItem {
  name: string;
  icon: string;
  description: string;
}

export function BrowsersPage() {
  const browsers: BrowserItem[] = [
    {
      name: 'Google Chrome',
      icon: '🌐',
      color: 'from-yellow-500 to-yellow-600',
      description: 'متصفح سريع وشائع الاستخدام',
    },
    {
      name: 'Mozilla Firefox',
      icon: '🦊',
      color: 'from-orange-500 to-orange-600',
      description: 'يركز على الخصوصية والأمان',
    },
    {
      name: 'Microsoft Edge',
      icon: '🌊',
      color: 'from-cyan-500 to-cyan-600',
      description: 'متصفح مدمج مع ويندوز',
    },
    {
      name: 'Safari',
      icon: '🧭',
      color: 'from-blue-500 to-blue-600',
      description: 'متصفح أبل الرسمي',
    },
    {
      name: 'Brave',
      icon: '🦁',
      color: 'from-orange-500 to-red-600',
      description: 'يركز على السرعة وحجب الإعلانات',
    },
    {
      name: 'Opera',
      icon: '🎭',
      color: 'from-red-500 to-red-600',
      description: 'متصفح بخيارات مدمجة متعددة',
    },
  ];

  const bookmarks: BookmarkItem[] = [
    {
      name: 'Wikipedia',
      icon: '📚',
      description: 'موسوعة معرفية عامة',
    },
    {
      name: 'Google Scholar',
      icon: '🎓',
      description: 'للبحث الأكاديمي',
    },
    {
      name: 'YouTube',
      icon: '▶️',
      description: 'فيديوهات تعليمية',
    },
    {
      name: 'GitHub',
      icon: '💻',
      description: 'مستودعات المشاريع',
    },
    {
      name: 'Khan Academy',
      icon: '📖',
      description: 'محتوى تعليمي مجاني',
    },
    {
      name: 'PubMed',
      icon: '🏥',
      description: 'أبحاث ومراجع طبية',
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="mb-2 flex items-center gap-3 text-4xl font-bold">
            <Globe className="h-9 w-9 text-primary" />
            المتصفحات
          </h2>
          <p className="text-muted-foreground">
            واجهة عرض المتصفحات والإشارات المرجعية
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3">
                <Compass className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  المتصفحات المتاحة
                </h3>
                <p className="text-sm text-muted-foreground">
                  عرض شكلي فقط بدون فتح روابط
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {browsers.map((browser, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div
                    className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${browser.color} p-4 text-white shadow-md`}
                  >
                    <span className="text-4xl">{browser.icon}</span>
                  </div>

                  <h4 className="text-lg font-semibold text-foreground">
                    {browser.name}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {browser.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background shadow-lg">
          <div className="border-b border-border p-6">
            <h3 className="flex items-center gap-2 text-2xl font-semibold">
              <Star className="h-6 w-6 text-primary" />
              الإشارات المرجعية
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-muted/20 p-4 transition-all duration-300 hover:bg-muted/40"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-2xl">
                    {bookmark.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{bookmark.name}</h4>
                    <p className="text-sm text-muted-foreground">{bookmark.description}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-primary/10 px-3 py-1 text-center text-sm font-medium text-primary">
                  جاهز للاستخدام
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-white shadow-lg">
          {/* <div className="p-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                صفحة واجهة أمامية فقط
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              لا توجد أي أوامر أو تفاعلات داخل هذه الصفحة
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}