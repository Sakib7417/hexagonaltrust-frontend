'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import './news-ticker.css';

interface NewsItem {
  id: string;
  textEn: string;
  textHi: string;
  active: boolean;
  createdAt: string;
}

interface NewsTickerProps {
  language?: 'en' | 'hi';
}

export function NewsTicker({ language = 'en' }: NewsTickerProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    try {
      // In a real app, this would call an API endpoint
      const mockNews: NewsItem[] = [
        {
          id: '1',
          textEn: '🎉Welcome to Hexagonal Trust! Membership is Exclusively Limited to 2000 Members Only — Secure Your Position Early.',
          textHi: '🎉 हेक्सागोनल ट्रस्ट में आपका स्वागत है! आज ही हमारे 2,000 सदस्यों के समुदाय में शामिल हों।',
          active: true,
          createdAt: new Date().toISOString(),
        },
        // {
        //   id: '2',
        //   textEn: '💰 Earn ₹500 weekly rewards! Get started with your first contribution.',
        //   textHi: '💰 साप्ताहिक ₹500 पुरस्कार अर्जित करें! अपना पहला योगदान शुरू करें।',
        //   active: true,
        //   createdAt: new Date().toISOString(),
        // },
        {
          id: '3',
          textEn: '🏥 New Hospital Wing Opening Soon - Providing Better Healthcare Services.',
          textHi: '🏥 नया अस्पताल विंग जल्द ही खुलने वाला है - बेहतर स्वास्थ्य सेवाएं प्रदान करना।',
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          textEn: '📚 Education Scholarship Program - Help us build a brighter future.',
          textHi: '📚 शिक्षा छात्रवृत्ति कार्यक्रम - हमें एक उज्जवल भविष्य बनाने में मदद करें।',
          active: true,
          createdAt: new Date().toISOString(),
        },
      ];
      setNews(mockNews.filter(item => item.active));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setLoading(false);
    }
  };

  if (loading || news.length === 0) {
    return null;
  }

  const displayNews = news
  .map(item => `${item.textEn} • ${item.textHi}`)
  .join(' ✦ ');

  return (
    <div className="news-ticker-container bg-gradient-to-r from-yellow-50 to-orange-50 border-b-2 border-orange-200 py-2 px-2 md:py-3 md:px-4">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <Bell size={16} className="text-orange-600 animate-bounce md:w-5 md:h-5" />
          <span className="font-bold text-orange-700 text-xs md:text-sm whitespace-nowrap">
            {language === 'en' ? 'Latest News' : 'ताजा समाचार'}
          </span>
        </div>
        <div className="news-ticker-wrapper flex-1 overflow-hidden min-w-0">
          <div className="news-ticker-content inline-flex gap-4 md:gap-8 animate-scroll">
            {[...Array(3)].map((_, loopIndex) => (
              <span key={loopIndex} className="text-gray-800 text-xs md:text-sm flex-shrink-0 font-bold">
                {displayNews}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
