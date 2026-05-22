'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { MapPin, Activity, Radio } from 'lucide-react';

const MONITORING_FEEDS = [
  { 
    id: 1,
    src: '/videos/farm-harvest.mp4', 
    labelKey: 'feed_harvest_label', 
    locationKey: 'feed_harvest_location',
    typeKey: 'feed_harvest_type'
  },
  { 
    id: 2,
    src: '/videos/port-logistics.mp4', 
    labelKey: 'feed_port_label', 
    locationKey: 'feed_port_location',
    typeKey: 'feed_port_type'
  },
  { 
    id: 3,
    src: '/videos/irrigation-system.mp4', 
    labelKey: 'feed_irrigation_label', 
    locationKey: 'feed_irrigation_location',
    typeKey: 'feed_irrigation_type'
  },
  { 
    id: 4,
    src: '/videos/truck-logistics.mp4', 
    labelKey: 'feed_truck_label', 
    locationKey: 'feed_truck_location',
    typeKey: 'feed_truck_type'
  },
  { 
    id: 5,
    src: '/videos/grain-silos.mp4', 
    labelKey: 'feed_silos_label', 
    locationKey: 'feed_silos_location',
    typeKey: 'feed_silos_type'
  },
  { 
    id: 6,
    src: '/videos/food-lab.mp4', 
    labelKey: 'feed_lab_label', 
    locationKey: 'feed_lab_location',
    typeKey: 'feed_lab_type'
  },
  /* Global Feeds (Novos vídeos únicos) - Aguardando download manual
  { 
    id: 7,
    src: '/videos/global-harvest.mp4', 
    labelKey: 'feed_harvest_label', 
    locationKey: 'feed_harvest_location_global',
    typeKey: 'feed_harvest_type'
  },
  { 
    id: 8,
    src: '/videos/global-port.mp4', 
    labelKey: 'feed_port_label', 
    locationKey: 'feed_port_location_global',
    typeKey: 'feed_port_type'
  },
  { 
    id: 9,
    src: '/videos/global-irrigation.mp4', 
    labelKey: 'feed_irrigation_label', 
    locationKey: 'feed_irrigation_location_global',
    typeKey: 'feed_irrigation_type'
  },
  { 
    id: 10,
    src: '/videos/global-truck.mp4', 
    labelKey: 'feed_truck_label', 
    locationKey: 'feed_truck_location_global',
    typeKey: 'feed_truck_type'
  },
  { 
    id: 11,
    src: '/videos/global-silos.mp4', 
    labelKey: 'feed_silos_label', 
    locationKey: 'feed_silos_location_global',
    typeKey: 'feed_silos_type'
  },
  { 
    id: 12,
    src: '/videos/global-lab.mp4', 
    labelKey: 'feed_lab_label', 
    locationKey: 'feed_lab_location_global',
    typeKey: 'feed_lab_type'
  }
  */
];

export default function AboutSection() {
  const { t } = useTranslation();
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedIndex((prev) => (prev + 1) % MONITORING_FEEDS.length);
    }, 15000); // Switch every 15 seconds (increased to allow 65MB+ videos to load without aborting)

    return () => clearInterval(interval);
  }, []);

  const currentFeed = MONITORING_FEEDS[currentFeedIndex];

  return (
    <section id="sobre" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              {t('about_title')}
            </h2>
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
              <p>
                {t('about_p1')}
              </p>
              <p>
                {t('about_p2')}
              </p>
              <p>
                {t('about_p3')}
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur-3xl opacity-20 animate-pulse group-hover:opacity-40 transition-opacity duration-1000"></div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm bg-slate-900 aspect-video">
              {/* Video Player */}
              <video 
                key={currentFeed.src} // Key change forces reload/transition
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 animate-fade-in"
                poster="/img/about-image.svg"
              >
                <source src={currentFeed.src} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

              {/* Top Bar: CAM Info */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded text-xs font-mono text-green-400 border border-green-500/30 flex items-center gap-2">
                  <Radio className="w-3 h-3 animate-pulse" />
                  LIVE FEED • CAM {currentFeed.id}
                </div>
                <div className="bg-red-500/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-red-500 border border-red-500/30 animate-pulse">
                  REC
                </div>
              </div>

              {/* Bottom Bar: Location & Type */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white font-medium text-sm">
                    <Activity className="w-4 h-4 text-blue-400" />
                    {t(currentFeed.labelKey)}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <MapPin className="w-3 h-3" />
                    {t(currentFeed.locationKey)}
                  </div>
                </div>

                {/* Feed Selectors */}
                <div className="flex gap-2">
                  {MONITORING_FEEDS.map((feed, idx) => (
                    <button
                      key={feed.id}
                      onClick={() => setCurrentFeedIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentFeedIndex ? 'w-8 bg-blue-500' : 'w-2 bg-slate-600 hover:bg-slate-500'
                      }`}
                      aria-label={`Select feed ${feed.id}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
