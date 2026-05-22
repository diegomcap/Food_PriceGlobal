'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Clock, Search, Loader2, X } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export default function NewsSection() {
  const { t, language } = useTranslation();

  const events = [
    { date: '20 Jun', title: t('event_title_1'), desc: t('event_desc_1') },
    { date: '25 Jun', title: t('event_title_2'), desc: t('event_desc_2') },
    { date: '2 Jul', title: t('event_title_3'), desc: t('event_desc_3') },
  ];

  const fullEvents = [
    { date: '20 Jun', title: t('event_title_1'), desc: t('event_desc_1') },
    { date: '25 Jun', title: t('event_title_2'), desc: t('event_desc_2') },
    { date: '02 Jul', title: t('event_title_3'), desc: t('event_desc_3') },
    { date: '15 Jul', title: t('event_harvest_soy'), desc: 'Mato Grosso / Paraná' },
    { date: '12 Aug', title: t('event_usda_report'), desc: 'Global Markets' },
    { date: '05 Sep', title: t('event_harvest_corn'), desc: 'Brasil - Safrinha' },
    { date: '18 Oct', title: t('event_coffee_expo'), desc: 'Minas Gerais' },
    { date: '22 Nov', title: t('event_food_tech'), desc: 'São Paulo' },
  ];

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCalendar, setShowCalendar] = useState(false);

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
      const params = getGoogleNewsParams(language);
      const encodedQuery = encodeURIComponent(query);
      const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=${params.hl}&gl=${params.gl}&ceid=${params.ceid}`;
      
      // Fallback strategy for proxies
      const proxies = [
        { url: 'https://corsproxy.io/?', type: 'raw' },
        { url: 'https://api.allorigins.win/get?url=', type: 'json' },
        { url: 'https://api.codetabs.com/v1/proxy?quest=', type: 'raw' }
      ];

      let xmlText = '';
      let fetchSuccess = false;

      for (const proxy of proxies) {
        try {
          const proxyUrl = `${proxy.url}${encodeURIComponent(rssUrl)}`;
          const response = await fetch(proxyUrl);
          
          if (!response.ok) {
            console.warn(`Proxy ${proxy.url} returned ${response.status}`);
            continue;
          }

          if (proxy.type === 'json') {
            const data = await response.json();
            if (data.contents) {
              xmlText = data.contents;
              fetchSuccess = true;
              break;
            }
          } else {
            const text = await response.text();
            if (text && (text.includes('<?xml') || text.includes('<rss'))) {
              xmlText = text;
              fetchSuccess = true;
              break;
            }
          }
        } catch (err) {
          console.warn(`Proxy ${proxy.url} failed:`, err);
        }
      }

      if (!fetchSuccess) {
        throw new Error('All proxies failed to fetch news');
      }
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const items = xmlDoc.querySelectorAll("item");
      
      if (items.length === 0) throw new Error('No items found in RSS feed');
      
      const parsedArticles = Array.from(items).slice(0, 6).map((item, index) => {
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "#";
        const pubDate = item.querySelector("pubDate")?.textContent || "";
        const source = item.querySelector("source")?.textContent || "News";
        const description = item.querySelector("description")?.textContent || "";
        
        // Extract image from description if present (often Google News puts it in HTML)
        // Or assign a random category image
        const dateObj = new Date(pubDate);
        const formattedDate = dateObj.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' });
        
        // Static images pool for fallback
        const fallbackImages = [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1593924689241-1b78c38f0071?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ];

        return {
          title: title.replace(` - ${source}`, ''), // Clean title
          link,
          time: formattedDate,
          source,
          category: query.split(' ')[0].toUpperCase(), // Approximate category
          image: fallbackImages[index % fallbackImages.length],
          description: description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...', // Clean HTML from description
          isNew: (new Date().getTime() - dateObj.getTime()) < (48 * 60 * 60 * 1000) // New if < 48h
        };
      });

      setArticles(parsedArticles);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      
      // Fallback to static news if fetch fails
      const fallbackNews = Array.from({ length: 6 }).map((_, index) => {
        const i = index + 1;
        // Use static keys 1-6 (assuming they exist in translations)
        // If keys 7,8 are better, we can use them, but 1-6 is standard sequence
        return {
          title: t(`news_title_static_${i}`) || `Market Update ${i}`,
          link: "#",
          time: t(`news_item${i}_time`) || new Date().toLocaleDateString(),
          source: "Market Intelligence",
          category: "MARKET",
          image: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1593924689241-1b78c38f0071?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ][index],
          description: t(`news_description_static_${i}`) || "Market analysis and commodities update.",
          isNew: index < 2
        };
      });
      
      setArticles(fallbackNews);
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
                      <span className="text-xs font-bold text-slate-500 uppercase">{event.date.split(' ')[1]}</span>
                      <span className="text-xl font-bold text-slate-900">{event.date.split(' ')[0]}</span>
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
                      <span className="text-xs font-bold text-slate-500 uppercase">{event.date.split(' ')[1]}</span>
                      <span className="text-xl font-bold text-slate-900">{event.date.split(' ')[0]}</span>
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
