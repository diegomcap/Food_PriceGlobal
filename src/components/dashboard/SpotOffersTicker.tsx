'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { ShoppingCart, Anchor, Calendar, Tag, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const SpotOffersTicker = () => {
  const { t } = useTranslation();

  // Initial pool of offers (including new ones)
  const [offers, setOffers] = useState([
    {
      id: 1,
      commodityKey: 'offer_soybean',
      qty: 50000,
      price: 450, // USD/MT
      incoterm: 'FOB Santos',
      statusKey: 'ticker_status_available',
      color: 'text-green-400',
      trend: 'up' as 'up' | 'down' | 'stable'
    },
    {
      id: 2,
      commodityKey: 'offer_corn',
      qty: 25000,
      price: 220,
      incoterm: 'CIF Shanghai',
      statusKey: 'ticker_status_feb_mar',
      color: 'text-yellow-400',
      trend: 'down' as 'up' | 'down' | 'stable'
    },
    {
      id: 3,
      commodityKey: 'offer_sugar',
      qty: 12500,
      price: 550,
      incoterm: 'FOB Paranaguá',
      statusKey: 'ticker_status_prompt',
      color: 'text-white',
      trend: 'up' as 'up' | 'down' | 'stable'
    },
    {
      id: 4,
      commodityKey: 'offer_chicken',
      qty: 270,
      price: 1800,
      incoterm: 'CIF Dubai',
      statusKey: 'ticker_status_available',
      color: 'text-orange-400',
      trend: 'stable' as 'up' | 'down' | 'stable'
    },
    {
      id: 5,
      commodityKey: 'offer_coffee',
      qty: 1200, 
      price: 4000,
      incoterm: 'FOB Santos',
      statusKey: 'ticker_status_prompt',
      color: 'text-amber-700',
      trend: 'up' as 'up' | 'down' | 'stable'
    },
    {
      id: 6,
      commodityKey: 'offer_wheat',
      qty: 30000,
      price: 280,
      incoterm: 'CIF Cairo',
      statusKey: 'ticker_status_feb_mar',
      color: 'text-yellow-200',
      trend: 'down' as 'up' | 'down' | 'stable'
    },
    {
      id: 7,
      commodityKey: 'offer_cotton',
      qty: 5000,
      price: 1900,
      incoterm: 'FOB Salvador',
      statusKey: 'ticker_status_available',
      color: 'text-slate-200',
      trend: 'stable' as 'up' | 'down' | 'stable'
    },
    {
      id: 8,
      commodityKey: 'offer_beef',
      qty: 150,
      price: 5500,
      incoterm: 'CIF Hong Kong',
      statusKey: 'ticker_status_prompt',
      color: 'text-red-400',
      trend: 'up' as 'up' | 'down' | 'stable'
    }
  ]);

  // Simulate Live Market Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOffers(currentOffers => {
        const newOffers = [...currentOffers];
        
        // Pick a random offer to update
        const randomIndex = Math.floor(Math.random() * newOffers.length);
        const offerToUpdate = newOffers[randomIndex];

        // Randomly decide what to update: Qty, Price, or both
        const updateType = Math.random();

        if (updateType < 0.4) {
            // Update Quantity slightly (+/- 5%)
            const change = (Math.random() - 0.5) * 0.1;
            let newQty = Math.round(offerToUpdate.qty * (1 + change));
            if (newQty < 100) newQty = 100;
            newOffers[randomIndex] = { ...offerToUpdate, qty: newQty };
        } else {
             // Update Price (+/- 2%)
             const change = (Math.random() - 0.5) * 0.04;
             const newPrice = Math.round(offerToUpdate.price * (1 + change));
             
             // Determine trend
             const newTrend = newPrice > offerToUpdate.price ? 'up' : 'down';
             
             newOffers[randomIndex] = { 
               ...offerToUpdate, 
               price: newPrice,
               trend: newTrend
             };
        }

        return newOffers;
      });
    }, 3000); // Updated to 3 seconds for more activity

    return () => clearInterval(interval);
  }, []);

  // Helper to format numbers
  const formatQty = (qty: number) => {
    return new Intl.NumberFormat('en-US').format(qty) + ' MT';
  };

  const formatPrice = (price: number) => {
    return '$' + new Intl.NumberFormat('en-US').format(price) + '/MT';
  };

  return (
    <div className="w-full bg-slate-900 border-y border-slate-800 overflow-hidden relative z-20">
      <div className="w-full flex items-center h-12">
        {/* Label */}
        <div className="flex-shrink-0 bg-blue-600 h-full px-4 flex items-center z-20 shadow-lg">
          <span className="font-bold text-white uppercase text-sm tracking-wider flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            {t('ticker_title')}
          </span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center pause-animation">
          <div className="animate-ticker flex whitespace-nowrap">
            {/* We duplicate the list to ensure infinite scroll look. 
                With 8 items, 3 copies is plenty (24 items). */}
            {[...offers, ...offers, ...offers].map((offer, index) => (
              <div key={`${offer.id}-${index}`} className="flex items-center px-8 border-r border-slate-700/50 min-w-max group cursor-pointer transition-colors hover:bg-slate-800/50">
                <span className={`font-bold ${offer.color} mr-3`}>{t(offer.commodityKey)}</span>
                
                <div className="flex items-center text-xs text-slate-400 gap-4">
                  
                  {/* Price with Trend Indicator */}
                  <span className={`flex items-center gap-1 font-mono font-medium ${
                    offer.trend === 'up' ? 'text-green-400' : 
                    offer.trend === 'down' ? 'text-red-400' : 'text-slate-300'
                  } transition-colors duration-500`}>
                    {offer.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                     offer.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                     <DollarSign className="w-3 h-3" />}
                    <span>{formatPrice(offer.price)}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span className="text-slate-300 transition-all duration-500">{formatQty(offer.qty)}</span>
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <Anchor className="w-3 h-3" />
                    <span className="text-slate-300">{offer.incoterm}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-slate-300">{t(offer.statusKey)}</span>
                  </span>
                </div>

                <button className="ml-4 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('ticker_cta_inquire')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotOffersTicker;
