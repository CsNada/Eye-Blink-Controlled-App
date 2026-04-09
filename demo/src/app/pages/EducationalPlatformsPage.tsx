import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBlink } from '../contexts/BlinkContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusableButton } from '../components/FocusableButton';
import { Card, CardContent } from '../components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Platform {
  name: string;
  url: string;
  gradient: string;
  logo: string;
  description: string;
}

export function EducationalPlatformsPage() {
  const navigate = useNavigate();
  const { setTotalItems, setOnSelect, setOnBack, focusedIndex } = useBlink();
  const { t } = useLanguage();

  const platforms: Platform[] = [
    {
      name: 'بلاك بورد',
      url: 'https://blackboard.com',
      gradient: 'from-slate-700 via-slate-800 to-black',
      logo: '🎓',
      description: 'نظام إدارة التعلم',
    },
    {
      name: 'مودل',
      url: 'https://moodle.org',
      gradient: 'from-orange-500 via-orange-600 to-red-600',
      logo: '📚',
      description: 'منصة تعليمية مفتوحة',
    },
    {
      name: 'جوجل كلاس روم',
      url: 'https://classroom.google.com',
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      logo: '🎯',
      description: 'التعليم من جوجل',
    },
    {
      name: 'مايكروسوفت تيمز',
      url: 'https://teams.microsoft.com',
      gradient: 'from-blue-600 via-indigo-600 to-purple-700',
      logo: '👥',
      description: 'منصة التعاون والدراسة',
    },
    {
      name: 'زووم',
      url: 'https://zoom.us',
      gradient: 'from-blue-500 via-cyan-500 to-sky-600',
      logo: '📹',
      description: 'مؤتمرات الفيديو',
    },
    {
      name: 'يوتيوب التعليمي',
      url: 'https://youtube.com/education',
      gradient: 'from-red-600 via-rose-600 to-pink-700',
      logo: '📺',
      description: 'فيديوهات تعليمية',
    },
    {
      name: 'بي سيف',
      url: 'https://besafe.com',
      gradient: 'from-emerald-500 via-green-600 to-teal-700',
      logo: '🛡️',
      description: 'السلامة والأمان',
    },
  ];

  useEffect(() => {
    setTotalItems(platforms.length);
  }, [setTotalItems, platforms.length]);

  useEffect(() => {
    setOnSelect(() => {
      if (focusedIndex >= 0 && focusedIndex < platforms.length) {
        window.open(platforms[focusedIndex].url, '_blank');
      }
    });
  }, [setOnSelect, focusedIndex, platforms]);

  useEffect(() => {
    setOnBack(() => {
      navigate('/', { replace: false });
    });
  }, [setOnBack, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-4xl font-bold mb-2">المنصات التعليمية</h2>
          <p className="text-muted-foreground text-lg">
            الوصول السريع للمنصات التعليمية
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <FocusableButton
              key={platform.name}
              index={index}
              onClick={() => window.open(platform.url, '_blank')}
              className="group h-auto p-0 overflow-hidden border-0 shadow-lg hover:shadow-2xl"
            >
              <Card className="border-0 shadow-none h-full">
                <div className={`h-2 bg-gradient-to-r ${platform.gradient}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    {/* Logo with gradient background */}
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                      <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${platform.gradient} text-4xl shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                        {platform.logo}
                      </div>
                    </div>
                    
                    {/* Platform Name */}
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {platform.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {platform.description}
                      </p>
                    </div>
                    
                    {/* External link indicator */}
                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">فتح المنصة</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FocusableButton>
          ))}
        </div>
      </div>
    </div>
  );
}