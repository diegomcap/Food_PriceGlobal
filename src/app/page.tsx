'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import SpotOffersTicker from '@/components/dashboard/SpotOffersTicker';
import { MarketsSection } from '@/components/dashboard/MarketsSection';
import { Footer } from '@/components/layout/Footer';
import CommoditiesTable from '@/components/dashboard/CommoditiesTable';
import FundsSection from '@/components/dashboard/FundsSection';
import MarketAnalysis from '@/components/dashboard/MarketAnalysis';
import NewsSection from '@/components/dashboard/NewsSection';
import CommodityLinks from '@/components/dashboard/CommodityLinks';
import AboutSection from '@/components/dashboard/AboutSection';
import ContactSection from '@/components/dashboard/ContactSection';
import { DivisionsSection } from '@/components/home/DivisionsSection';
import { useTranslation } from '@/context/TranslationContext';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main>
        <Hero />
        
        <SpotOffersTicker />

        <MarketsSection />
        
        <CommoditiesTable />

        <MarketAnalysis />

        <CommodityLinks />

        <FundsSection />
        
        <DivisionsSection />
        
        <NewsSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
