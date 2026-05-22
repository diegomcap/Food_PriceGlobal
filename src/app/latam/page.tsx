'use client';

import React from 'react';
import Link from 'next/link';
import { Globe2, Ship, Coins, FileCheck, ArrowRight } from 'lucide-react';

export default function LatamWelcomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Globe2 className="text-orange-400" />
            LATAM Export
          </div>
          <div className="flex gap-4">
            <Link href="/latam/login" className="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              Login
            </Link>
            <Link href="/latam/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors">
              Registrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Conectando Mercados <br/>
            <span className="text-orange-400">Latinoamericanos</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plataforma unificada para comercio exterior, logística integrada y gestión aduanera en toda América Latina.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/latam/login" className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transform hover:-translate-y-1 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
              Comenzar Ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              Explorar Soluciones
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Soluciones Integrales de Exportación</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Simplificamos el comercio internacional con herramientas diseñadas para el mercado latinoamericano.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Ship className="w-8 h-8 text-blue-600" />}
              title="Logística Multimodal"
              description="Gestión de transporte marítimo, aéreo y terrestre con seguimiento en tiempo real."
            />
            <FeatureCard 
              icon={<Coins className="w-8 h-8 text-blue-600" />}
              title="Gestión de Divisas"
              description="Conversión y cobertura de monedas locales para transacciones internacionales seguras."
            />
            <FeatureCard 
              icon={<FileCheck className="w-8 h-8 text-blue-600" />}
              title="Trámites Aduaneros"
              description="Automatización de documentación y cumplimiento normativo para 18 países."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-400 py-8 px-4 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; {currentYear} LATAM Export. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow group hover:-translate-y-2 duration-300">
      <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-3">{title}</h3>
      <p className="text-blue-700 leading-relaxed">{description}</p>
    </div>
  );
}
