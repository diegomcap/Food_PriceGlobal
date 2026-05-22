'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LatamHero } from '@/components/latam/LatamHero';
import { LatamMap } from '@/components/latam/LatamMap';
import { LatamDashboard } from '@/components/latam/LatamDashboard';
import { LatamTraceability } from '@/components/latam/LatamTraceability';
import { Truck, Package, Clock, ShieldCheck } from 'lucide-react';

export default function LatamDashboardPage() {
  const features = [
    {
      title: 'Transporte Rodoviário',
      desc: 'Frota moderna conectando os principais polos produtivos do continente.',
      icon: Truck,
    },
    {
      title: 'Logística Integrada',
      desc: 'Soluções door-to-door simplificando a burocracia aduaneira.',
      icon: Package,
    },
    {
      title: 'Just-in-Time',
      desc: 'Entregas programadas para otimizar estoques e reduzir custos.',
      icon: Clock,
    },
    {
      title: 'Segurança Total',
      desc: 'Monitoramento via satélite em tempo real de todas as cargas.',
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main>
        <LatamHero />
        
        {/* Info Cards Section */}
        <section className="py-20 container mx-auto px-4 -mt-20 relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-orange-500 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <LatamMap />

        <LatamDashboard />
        <LatamTraceability />
      </main>

      <Footer />
    </div>
  );
}
