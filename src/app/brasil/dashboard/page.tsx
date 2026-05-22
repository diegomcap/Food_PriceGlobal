'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BrasilHero } from '@/components/brasil/BrasilHero';
import { ProductGrid } from '@/components/brasil/ProductGrid';
import { BrasilDashboard } from '@/components/brasil/BrasilDashboard';
import { BrasilTraceability } from '@/components/brasil/BrasilTraceability';
import { BrasilRoutes } from '@/components/brasil/BrasilRoutes';

export default function BrasilDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main>
        <BrasilHero />
        
        {/* Map Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Logística e Produção Nacional</h2>
            <div className="relative w-full max-w-4xl bg-white p-4 rounded-3xl shadow-2xl border border-slate-100">
              <img 
                src="/img/brasil-map.png" 
                alt="Mapa Logístico do Brasil" 
                className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Áreas Produtivas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Portos Principais</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BrasilDashboard />
        <ProductGrid />
        <BrasilTraceability />
        <BrasilRoutes />
      </main>

      <Footer />
    </div>
  );
}
