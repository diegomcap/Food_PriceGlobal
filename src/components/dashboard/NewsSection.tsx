'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Clock, Search, Loader2, X } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { buildFallbackNews, buildRollingMarketEvents, type MarketArticle } from '@/lib/marketContent';
import { formatDateTime, getCurrentCropSeason, type SupportedLanguage } from '@/lib/marketTime';

export default function NewsSection() {
  const { t, language } = useTranslation();
  const currentDate = new Date();
  const activeLanguage = language as SupportedLanguage;
  const eventDefinitions = [
    { dayOfMonth: 5, title: t('event_title_1'), desc: t('event_desc_1') },
    { dayOfMonth: 10, title: t('event_usda_report'), desc: 'Global Markets' },
    { dayOfMonth: 14, title: t('event_title_3'), desc: t('event_desc_3').replace(/\d{4}\/\d{2}/, getCurrentCropSeason(currentDate)) },
    { dayOfMonth: 18, title: t('event_title_2'), desc: t('event_desc_2') },
    { dayOfMonth: 22, title: t('event_harvest_soy'), desc: 'Mato Grosso / Paraná' },
    { dayOfMonth: 26, title: t('event_harvest_corn'), desc: 'Brasil - Safrinha' },
    { dayOfMonth: 9, monthOffset: 1, title: t('event_coffee_expo'), desc: 'Minas Gerais' },
    { dayOfMonth: 16, monthOffset: 1, title: t('event_food_tech'), desc: 'São Paulo' },
  ];

  const fullEvents = buildRollingMarketEvents(currentDate, activeLanguage, eventDefinitions).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const events = fullEvents.slice(0, 3);

  const [articles, setArticles] = useState<MarketArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCalendar, setShowCalendar] = useState(false);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState<string>('');

  const getGoogleNewsParams = (lang: string) => {
    switch(lang) {
      case 'pt': return { hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419' };
      case 'es': return { hl: 'es-419', gl: 'AR', ceid: 'AR:es-419' };
      case 'ar': return { hl: 'ar', gl: 'AE', ceid: 'AE:ar' };
      case 'ru': return { hl: 'ru', gl: 'RU', ceid: 'RU:ru' };
      case 'zh': return { hl: 'zh-HK', gl: 'HK', ceid: 'HK:zh-Hant' };
      default: return { hl: 'en-US', gl: 'US', ceid: 'US:en' };
    }
  };

  const fetchNews = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/market-news?query=${encodeURIComponent(query)}&language=${language}`);
      if (!response.ok) {
        throw new Error(`Failed to load market news (${response.status})`);
      }

      const data = await response.json();
      if (!Array.isArray(data.articles) || data.articles.length === 0) {
        throw new Error('News API returned no articles');
      }

      setArticles(data.articles as MarketArticle[]);
      setNewsUpdatedAt(data.updatedAt || new Date().toISOString());
    } catch (error) {
      console.error('Failed to fetch news:', error);

      setArticles(buildFallbackNews(query, activeLanguage));
      setNewsUpdatedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: t('news_filter_all'), query: 'agricultural commodities market' },
    { id: 'grains', label: t('news_filter_grains'), query: 'grains soybean corn wheat market' },
    { id: 'oils', label: t('news_filter_oils'), query: 'vegetable oil palm oil market' },
    { id: 'meat', label: t('news_filter_meat'), query: 'meat beef chicken pork market' },
    { id: 'dairy', label: t('news_filter_dairy'), query: 'dairy milk cheese market' },
    { id: 'sugar', label: t('news_filter_sugar'), query: 'sugar ethanol market' },
  ];

  useEffect(() => {
    const currentFilter = filters.find(f => f.id === selectedCategory);
    const query = currentFilter ? currentFilter.query : 'agricultural commodities';
    fetchNews(query);
  }, [selectedCategory, language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchNews(searchTerm);
      setSelectedCategory('custom');
    }
  };

  const handleViewMoreNews = () => {
    const params = getGoogleNewsParams(language);
    let queryToUse = 'agricultural commodities market';
    
    if (searchTerm.trim() && selectedCategory === 'custom') {
      queryToUse = searchTerm;
    } else {
      const currentFilter = filters.find(f => f.id === selectedCategory);
      if (currentFilter) queryToUse = currentFilter.query;
    }
    
    const encodedQuery = encodeURIComponent(queryToUse);
    const searchUrl = `https://news.google.com/search?q=${encodedQuery}&hl=${params.hl}&gl=${params.gl}&ceid=${params.ceid}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <section id="noticias" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t('news_title')}</h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* News Feed */}
          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full">
                {filters.map((filter) => (
                  <button 
                    key={filter.id}
                    onClick={() => setSelectedCategory(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === filter.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSearch} className="relative w-full md:w-64 shrink-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder={t('news_search_placeholder')}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
            <div className="mb-6 text-xs text-slate-400">
              {t('last_update')}: {newsUpdatedAt ? formatDateTime(new Date(newsUpdatedAt), activeLanguage) : formatDateTime(new Date(), activeLanguage)}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6">
                {articles.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-pointer relative bg-white"
                  >
                    <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {item.isNew && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-sm z-10">
                          {t('news_new_badge') || 'NOVO'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.source}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
            
            <button 
              onClick={handleViewMoreNews}
              className="mt-8 w-full py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              {t('news_view_more_news')} <ArrowRight size={16} />
            </button>
          </div>

          {/* Calendar Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="text-blue-600" size={24} />
                {t('news_calendar_title')}
              </h3>
              
              <div className="space-y-6">
                {events.map((event, index) => (
                  <div key={index} className="flex gap-4 group cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors">
                      <span className="text-xs font-bold text-slate-500 uppercase">{event.month}</span>
                      <span className="text-xl font-bold text-slate-900">{event.day}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                      <p className="text-sm text-slate-500 leading-snug">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <button 
                  onClick={() => setShowCalendar(true)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
                >
                  {t('view_full_calendar')} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="text-blue-600" size={24} />
                {t('calendar_modal_title')}
              </h3>
              <button 
                onClick={() => setShowCalendar(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {fullEvents.map((event, index) => (
                  <div key={index} className="flex gap-4 group p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 hover:border-blue-200">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors">
                      <span className="text-xs font-bold text-slate-500 uppercase">{event.month}</span>
                      <span className="text-xl font-bold text-slate-900">{event.day}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                      <p className="text-sm text-slate-500 leading-snug">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setShowCalendar(false)}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
              >
                {t('calendar_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
